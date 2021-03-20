## Visual Studio Code for Cloudron

This app package contains code-server by CDR to run Visual Studio Code in the browser. It is compatible with most extensions, and is easily modifiable by the user.
This app package is built off the LAMP7.X package by the Cloudron Team. However, most LAMP features have been heavily changed or removed.

**NOTE** Right now code-server is not isolated per logged in user. This will change in the future as I learn more about code-server and Cloudron Environments.

-----

## Features

In no particular order:

- Multiple Progamming Languages
- Access your program via port forwarding via code-server (see section below)
- Cron is still active
- Credentials for MySQL, etc, are in credentials.txt still
- Full control over code-server (install extensions, change settings, etc)
- Uses proxyAuth for authenticating users.

## Programming Environments Included

In no particular order:

- GOLANG
- PHP7.4 (PHP8.0 will be included soon!)
- Python
- PowerShell
- DotNet Core (C#, VB.NET, etc)
- R
- NodeJS


## Accessing Test Applications compiled and/or ran in code-server

This app is designed to allow you to directly connect to server ports by browsing https://$CLOUDRON-APP-DOMAIN/proxy/portNumber/ . You must be logged in to do so.

### Cron

This app supports running one or more cronjobs. The jobs are specified using the standard crontab syntax.

## ionCube

ionCube is a PHP module extension that loads encrypted PHP files and speeds up webpages. ionCube is pre-installed
and enabled by default.

### Remote Terminal

Code-server includes a built in terminal in the app, or you may:

Use the [web terminal](https://cloudron.io/documentation/apps/#web-terminal) for a remote shell connection into the
app to adjust configuration files like `php.ini`.

