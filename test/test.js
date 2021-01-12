#!/usr/bin/env node

/* jslint node:true */
/* global it:false */
/* global describe:false */
/* global before:false */
/* global after:false */

'use strict';

require('chromedriver');

var execSync = require('child_process').execSync,
    expect = require('expect.js'),
    fs = require('fs'),
    path = require('path'),
    superagent = require('superagent'),
    util = require('util'),
    webdriver = require('selenium-webdriver');

var by = webdriver.By,
    until = webdriver.until,
    Builder = require('selenium-webdriver').Builder;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (!process.env.USERNAME || !process.env.PASSWORD) {
    console.log('USERNAME and PASSWORD env vars need to be set');
    process.exit(1);
}

describe('Application life cycle test', function () {
    this.timeout(0);

    var server, browser = new Builder().forBrowser('chrome').build();
    var LOCATION = 'test';
    var TEST_TIMEOUT = 50000;
    var app;
    var apiEndpoint;

    before(function (done) {
        var seleniumJar= require('selenium-server-standalone-jar');
        var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
        server = new SeleniumServer(seleniumJar.path, { port: 4444 });
        server.start();

        done();
    });

    after(function (done) {
        browser.quit();
        server.stop();
        done();
    });

    function waitForElement(elem) {
        return browser.wait(until.elementLocated(elem), TEST_TIMEOUT).then(function () {
            return browser.wait(until.elementIsVisible(browser.findElement(elem)), TEST_TIMEOUT);
        });
    }

    function getAppInfo(callback) {
        var inspect = JSON.parse(execSync('cloudron inspect'));
        apiEndpoint = inspect.apiEndpoint;

        app = inspect.apps.filter(function (a) { return a.location === LOCATION; })[0];
        expect(app).to.be.an('object');

        callback();
    }

    function welcomePage(callback) {
        browser.get('https://' + app.fqdn).then(function () {
            return waitForElement(by.xpath('//*[contains(text(), "Cloudron LAMP App")]'));
        }).then(function () {
            callback();
        });
    }

    function uploadedFileExists(callback) {
        browser.get('https://' + app.fqdn + '/test.php').then(function () {
            return waitForElement(by.xpath('//*[text()="this works"]'));
        }).then(function () {
            return waitForElement(by.xpath('//*[text()="' + app.fqdn + '"]'));
        }).then(function () {
            callback();
        });
    }

    function checkIonCube(callback) {
        browser.get('https://' + app.fqdn + '/test.php').then(function () {
            return waitForElement(by.xpath('//a[contains(text(), "ionCube Loader")]'));
            // return waitForElement(by.xpath('//*[contains(text(), "Intrusion&nbsp;Protection&nsbp;from&nbsp;ioncube24.com")]'));
        }).then(function () {
            callback();
        });
    }

    function checkPhpMyAdmin(callback) {
        execSync(`cloudron pull --app ${app.id} /app/data/phpmyadmin_login.txt /tmp/phpmyadmin_login.txt`);
        // know your file structure !
        const PHPMYADMIN_PASSWORD = fs.readFileSync('/tmp/phpmyadmin_login.txt', 'utf8').split('\n')[6].split(':')[1].trim();
        fs.unlinkSync('/tmp/phpmyadmin_login.txt');

        superagent.get('https://' + app.fqdn + '/phpmyadmin').end(function (error, result) {
            if (error && !error.response) return callback(error); // network error

            if (result.statusCode !== 401) return callback('Expecting 401 error');

            superagent.get('https://' + app.fqdn + '/phpmyadmin')
                .auth('admin', PHPMYADMIN_PASSWORD)
                .end(function (error, result) {
                if (error) return callback(error);

                if (result.text.indexOf(`${app.fqdn} / mysql | phpMyAdmin`) === -1) { // in the <title>
                    console.log(result.text);
                    return callback(new Error('could not detect phpmyadmin'));
                }

                callback();
            });
        });
    }

    function checkCron(callback) {
        this.timeout(60000 * 2);

        fs.writeFileSync('/tmp/crontab', '* * * * * echo -n "$CLOUDRON_MYSQL_HOST" > /app/data/public/cron\n', 'utf8');
        execSync(`cloudron push --app ${app.id} /tmp/crontab /app/data/crontab`);
        fs.unlinkSync('/tmp/crontab');

        execSync(`cloudron restart --app ${app.id}`);

        console.log('Waiting for crontab to trigger');

        setTimeout(function () {
            superagent.get('https://' + app.fqdn + '/cron').end(function (error, result) {
                if (error && !error.response) return callback(error); // network error

                if (result.statusCode !== 200) return callback('Expecting 200, got ' + result.statusCode);

                if (result.text !== 'mysql') return callback('Unexpected text: ' + result.text);

                callback();
            });
        }, 60 * 1000); // give it a minute to run the crontab
    }

    xit('build app', function () {
        execSync('cloudron build', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
    });

    describe('installation and configuration', function () {
        it('install app', function () {
            execSync(`cloudron install --location ${LOCATION}`, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
        });

        it('can get app information', getAppInfo);
        it('can view welcome page', welcomePage);
        it('can upload file with sftp', function () {
            // remove from known hosts in case this test was run on other apps with the same domain already
            // if the tests fail here you want below in ~/.ssh/config
            // Host my.cloudron.xyz
            //     StrictHostKeyChecking no
            //     HashKnownHosts no
            execSync(util.format('sed -i \'/%s/d\' -i ~/.ssh/known_hosts', app.fqdn));
            const sftpCommand = `sshpass -p${process.env.PASSWORD} sftp -P 222 -o StrictHostKeyChecking=no -oBatchMode=no -b - ${process.env.USERNAME}@${app.fqdn}@${apiEndpoint}`;
            console.log('If this test fails, see the comment above this log message. Run -- ', sftpCommand);
            execSync(sftpCommand, { input: 'cd public\nput test.php\nbye\n', encoding: 'utf8', cwd: __dirname });
        });
        it('can get uploaded file', uploadedFileExists);
        it('can access ioncube', checkIonCube);
        it('can access phpmyadmin', checkPhpMyAdmin);
        it('executes cron tasks', checkCron);

        it('backup app', function () {
            execSync(`cloudron backup create --app ${app.id}`, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
        });

        it('restore app', function () {
            const backups = JSON.parse(execSync('cloudron backup list --raw'));
            execSync('cloudron uninstall --app ' + app.id, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
            execSync('cloudron install --location ' + LOCATION, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
            var inspect = JSON.parse(execSync('cloudron inspect'));
            app = inspect.apps.filter(function (a) { return a.location === LOCATION; })[0];
            execSync(`cloudron restore --backup ${backups[0].id} --app ${app.id}`, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
        });

        it('can get uploaded file', uploadedFileExists);

        it('move to different location', function () {
            browser.manage().deleteAllCookies();
            execSync(`cloudron configure --location ${LOCATION}2 --app ${app.id}`, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
            var inspect = JSON.parse(execSync('cloudron inspect'));
            app = inspect.apps.filter(function (a) { return a.location === LOCATION + '2'; })[0];
            expect(app).to.be.an('object');
        });

        it('can get uploaded file', uploadedFileExists);
        it('can access phpmyadmin', checkPhpMyAdmin);
        it('can access ioncube', checkIonCube);

        it('uninstall app', function () {
            execSync(`cloudron uninstall --app ${app.id}`, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
        });
    });

    describe('update', function () {
        // test update
        it('can install app', function () {
            execSync(`cloudron install --appstore-id ${app.manifest.id} --location ${LOCATION}`, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
            var inspect = JSON.parse(execSync('cloudron inspect'));
            app = inspect.apps.filter(function (a) { return a.location === LOCATION; })[0];
            expect(app).to.be.an('object');
        });

        it('can get app information', getAppInfo);
        it('can view welcome page', welcomePage);
        it('can upload file with sftp', function () {
            // remove from known hosts in case this test was run on other apps with the same domain already
            // if the tests fail here you want to set "HashKnownHosts no" in ~/.ssh/config
            const sftpCommand = `sshpass -p${process.env.PASSWORD} sftp -P 222 -o StrictHostKeyChecking=no -oBatchMode=no -b - ${process.env.USERNAME}@${app.fqdn}@${apiEndpoint}`;
            console.log('If this test fails, see the comment above this log message. Run -- ', sftpCommand);
            execSync(sftpCommand, { input: 'cd public\nput test.php\nbye\n', encoding: 'utf8', cwd: __dirname });
        });

        it('can update', function () {
            execSync(`cloudron update --app ${LOCATION}`, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
        });
        it('can get uploaded file', uploadedFileExists);
        it('can access phpmyadmin', checkPhpMyAdmin);
        it('can access ioncube', checkIonCube);

        it('uninstall app', function () {
            execSync(`cloudron uninstall --app ${app.id}`, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
        });
    });
});
