## VS Code Portion:
This app has VSCode installed. With the way VSCode is setup right now, it cannot be in a subdirectory.
This mean that when you visit $CLOUDRON-APP-DOMAIN you will be prompted to login to VS Code.

To see the public LAMP directory - you will need to visit $CLOUDRON-APP-DOMAIN/proxy/8888/.


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

