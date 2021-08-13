#!/bin/bash

set -eu

mkdir -p /app/data/public /app/data/healthcheck /run/apache2 /run/cron /run/app/sessions /app/data/apache

# generate files if neither index.* or .htaccess
if [[ -z "$(ls -A /app/data/public)" ]]; then
    echo "==> Generate files on first run" # possibly not first run if user deleted index.*
    touch /app/data/public/index.php
    echo -e "#!/bin/bash\n\n# Place custom startup commands here" > /app/data/run.sh
    touch /app/data/public/.htaccess
else
    echo "==> Do not override existing index file"
fi

# generate files if neither index.* or .htaccess
if [[ -z "$(ls -A /app/data/healthcheck)" ]]; then
    echo "==> Generate files on first run" # possibly not first run if user deleted index.*
    touch /app/data/healthcheck/index.php
    echo -e "#!/bin/bash\n\n# Place custom startup commands here" > /app/data/run.sh
    touch /app/data/healthcheck/.htaccess
else
    echo "==> Do not override existing index file"
fi

if [[ ! -f /app/data/php.ini ]]; then
    echo -e "; Add custom PHP configuration in this file\n; Settings here are merged with the package's built-in php.ini\n\n" > /app/data/php.ini
fi

[[ ! -f /app/data/apache/mpm_prefork.conf ]] && cp /app/code/apache/mpm_prefork.conf /app/data/apache/mpm_prefork.conf
[[ ! -f /app/data/apache/app.conf ]] && cp /app/code/apache/app.conf /app/data/apache/app.conf
## [[ ! -f /app/data/apache/code-server.conf ]] && cp /app/code/apache/code-server.conf /app/data/apache/code-server.conf

# source it so that env vars are persisted
echo "==> Source custom startup script"
[[ -f /app/data/run.sh ]] && source /app/data/run.sh

[[ ! -f /app/data/crontab ]] && cp /app/code/crontab.template /app/data/crontab

## configure in-container Crontab
# http://www.gsp.com/cgi-bin/man.cgi?section=5&topic=crontab
if ! (env; cat /app/data/crontab; echo -e '\nMAILTO=""') | crontab -u www-data -; then
    echo "==> Error importing crontab. Continuing anyway"
else
    echo "==> Imported crontab"
fi

# phpMyAdmin auth file
# if [[ ! -f /app/data/.phpmyadminauth ]]; then
#     echo "==> Generating phpMyAdmin authentication file"
#     PASSWORD=`pwgen -1 16`
#     htpasswd -cb /app/data/.phpmyadminauth admin "${PASSWORD}"
#     sed -e "s,PASSWORD,${PASSWORD}," /app/code/phpmyadmin_login.template > /app/data/phpmyadmin_login.txt
# fi

echo "==> Creating credentials.txt"
sed -e "s,\bMYSQL_HOST\b,${CLOUDRON_MYSQL_HOST}," \
    -e "s,\bMYSQL_PORT\b,${CLOUDRON_MYSQL_PORT}," \
    -e "s,\bMYSQL_USERNAME\b,${CLOUDRON_MYSQL_USERNAME}," \
    -e "s,\bMYSQL_PASSWORD\b,${CLOUDRON_MYSQL_PASSWORD}," \
    -e "s,\bMAIL_SMTP_SERVER\b,${CLOUDRON_MAIL_SMTP_SERVER}," \
    -e "s,\bMAIL_SMTP_PORT\b,${CLOUDRON_MAIL_SMTP_PORT}," \
    -e "s,\bMAIL_SMTPS_PORT\b,${CLOUDRON_MAIL_SMTPS_PORT}," \
    -e "s,\bMAIL_SMTP_USERNAME\b,${CLOUDRON_MAIL_SMTP_USERNAME}," \
    -e "s,\bMAIL_SMTP_PASSWORD\b,${CLOUDRON_MAIL_SMTP_PASSWORD}," \
    -e "s,\bMAIL_FROM\b,${CLOUDRON_MAIL_FROM}," \
    -e "s,\bMAIL_DOMAIN\b,${CLOUDRON_MAIL_DOMAIN}," \
    -e "s,\bREDIS_HOST\b,${CLOUDRON_REDIS_HOST}," \
    -e "s,\bREDIS_PORT\b,${CLOUDRON_REDIS_PORT}," \
    -e "s,\bREDIS_PASSWORD\b,${CLOUDRON_REDIS_PASSWORD}," \
    -e "s,\bREDIS_URL\b,${CLOUDRON_REDIS_URL}," \
    /app/code/credentials.template > /app/data/credentials.txt

# older installs did not have LDAP and the current version does not have optionalSso
if [[ -n "${CLOUDRON_LDAP_SERVER:-}" ]]; then
    sed -e "s,\bLDAP_HOST\b,${CLOUDRON_LDAP_HOST}," \
        -e "s,\bLDAP_PORT\b,${CLOUDRON_LDAP_PORT}," \
        -e "s/\bLDAP_BIND_DN\b/${CLOUDRON_LDAP_BIND_DN}/" \
        -e "s,\bLDAP_BIND_PASSWORD\b,${CLOUDRON_LDAP_BIND_PASSWORD}," \
        -e "s/\bLDAP_USERS_BASE_DN\b/${CLOUDRON_LDAP_USERS_BASE_DN}/" \
        -i /app/data/credentials.txt
else
     sed '/^LDAP Credentials/,$d' -i /app/data/credentials.txt  # $d means delete till end of file
fi

chown -R www-data:www-data /app/data /run/apache2 /run/app /tmp

[[ ! -f /app/data/run.sh ]] && touch /app/data/run.sh
chown root:root /app/data/run.sh

echo "==> Starting Lamp & Code stack"
exec /usr/bin/supervisord --configuration /etc/supervisor/supervisord.conf --nodaemon -i Lamp
