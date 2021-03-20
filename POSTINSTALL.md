## VS Code Portion:

This app package contains code-server by CDR to run Visual Studio Code in the browser. It is compatible with most extensions, and is easily modifiable by the user.
This app package is built off the LAMP7.X package by the Cloudron Team. However, most LAMP features have been heavily changed or removed.

*See DESCRIPTION.md for more information on how to use this package!*


## LAMP Portion:

This app is setup to use a MySQL database, redis cache and ability to send emails.

You can upload and view files using either <a href="/#/app/$CLOUDRON-APP-ID/access">SFTP</a>
or using the <a href="/#/app/$CLOUDRON-APP-ID/console">File Manager</a>.

The database credentials are stored in `credentials.txt`. phpMyAdmin access is stored in `phpmyadmin_login.txt`.

SFTP Access:

**Host**: $CLOUDRON-API-DOMAIN<br/>
**Port**: 222<br/>
**Username**: $CLOUDRON-USERNAME@$CLOUDRON-APP-DOMAIN<br/>
**Password**: Your Cloudron Password<br/>

