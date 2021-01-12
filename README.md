# VSCode (code-server) Cloudron App

This repository contains the Cloudron app package source for a basic code-server.

## Installation

[![Install](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.wordpress.cloudronapp)

or using the [Cloudron command line tooling](https://cloudron.io/references/cli.html)

```
cloudron install --appstore-id lamp.cloudronapp
```

## Building

The app package can be built using the [Cloudron command line tooling](https://cloudron.io/references/cli.html).

```
cd lamp-app

cloudron build
cloudron install
```

## Usage

Use `cloudron push` to copy files into `/app/data/public/` and `cloudron exec` to get a remote terminal.

See https://cloudron.io/references/cli.html for how to get the `cloudron` command line tool.

If you want to run for example a custom WordPress within this app, please note that the code will run behind a nginx proxy.
Apps like WordPress require you to let the app know about that fact.
For WordPress you would need to put this code into `wp-config.php`:

```
/*
 http://cmanios.wordpress.com/2014/04/12/nginx-https-reverse-proxy-to-wordpress-with-apache-http-and-different-port/
 http://wordpress.org/support/topic/compatibility-with-wordpress-behind-a-reverse-proxy
 https://wordpress.org/support/topic/wp_home-and-wp_siteurl
 */
// If WordPress is behind reverse proxy which proxies https to http
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $_SERVER['HTTP_HOST'] = $_SERVER['HTTP_X_FORWARDED_HOST'];

    if ($_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')
        $_SERVER['HTTPS']='on';
}
```

## Tests

* Put `HashKnownHosts no` in your `~/.ssh/config`
* cd test
* npm install
* USERNAME=<> PASSWORD=<> mocha --bail test.js

