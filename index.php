<html>
<head>
  <title> Cloudron LAMP app (PHP 7.4)</title>

  <style>

    body {
      width: 50%;
      min-width: 640px;
      margin: auto;
      font-family: Helvetica;
      color: #333;
    }

    pre {
      font-family: monospace;
      background: #333;
      color: white;
      border: none;
      width: 99%;
      padding: 10px;
      text-align: left;
      font-size: 13px;
      border-radius: 5px;
      margin-bottom: 15px;
      box-shadow: 0px 1px 12px rgba(0, 0, 0, 0.176);
    }

    h1 {
      text-align: center;
    }

    .center > table {
      width: 100%;
    }

    .table {
      border-style: solid;
      border-width: 1px;
    }

    .h, .e {
      background-color: white !important;
    }

  </style>

</head>
<body>

<br/>

<h1>Cloudron LAMP App (PHP 7.4)</h1>

<br/>

<h2>Overview</h2>
<p>
  <div>
    This page is a placeholder showing information on how to use the LAMP stack (PHP <?php echo PHP_VERSION ?>)
    This page will get overwritten, when an index.php or index.html is uploaded.
  </div>
</p>

<h2>Database Credentials</h2>
<p>
  <div>
    MySQL, Redis &amp; SMTP credentials are stored in <code>credentials.txt</code>. You can access this file
    via <a target="_blank" href="https://docs.cloudron.io/apps/#ftp-access">SFTP</a> or via the
    <a target="_blank" href="https://docs.cloudron.io/apps/#file-manager">File Manager</a>.
  </div>
  <br/>
  <div>Note that the credentials can only be used from within your app. They will not work from outside the Cloudron.</div>
</p>

<h2>phpMyAdmin</h2>
<p>
  phpMyAdmin is installed <a href="/phpmyadmin" target="_blank">here</a>. For login credentials, see <code>phpmyadmin_login.txt</code>
  via SFTP or the File Manager.
</p>

<h2>Cron</h2>
<p>
  Put a file called <code>crontab</code> into the directory <code>/app/data</code> and it will be picked up at next app restart.
  It has to be in the cron syntax without username and must end with a newline.
  For example, the following crontab updates feeds every hour:
</p>
<pre>
0 * * * * php /app/code/update.php --feeds
</pre>
<p>
  Commands are executed as the user www-data. Generate cron patterns via <a href="http://www.crontabgenerator.com/">crontabgenerator</a>.
</p>

</body>
</html>
