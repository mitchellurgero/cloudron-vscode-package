<?php
$i = 0;
$i++;
$cfg['Servers'][$i]['auth_type'] = 'config';

/* Server parameters */
$cfg['Servers'][$i]['host'] = getenv("CLOUDRON_MYSQL_HOST");
$cfg['Servers'][$i]['port'] = getenv("CLOUDRON_MYSQL_PORT");
$cfg['Servers'][$i]['user'] = getenv("CLOUDRON_MYSQL_USERNAME");
$cfg['Servers'][$i]['password'] = getenv("CLOUDRON_MYSQL_PASSWORD");
$cfg['Servers'][$i]['only_db'] = array(getenv("CLOUDRON_MYSQL_DATABASE"));

$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['AllowNoPassword'] = false;

$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';
$cfg['TempDir'] = '/tmp/';

