FROM cloudron/base:2.0.0@sha256:f9fea80513aa7c92fe2e7bf3978b54c8ac5222f47a9a32a7f8833edf0eb5a4f4

RUN mkdir -p /app/code
WORKDIR /app/code

# required for compiling rpaf
RUN apt-get -y update && \
    apt install -y cron apache2-dev php7.4 php7.4-{bcmath,bz2,cgi,cli,common,curl,dba,dev,enchant,fpm,gd,gmp,imap,interbase,intl,json,ldap,mbstring,mysql,odbc,opcache,pgsql,phpdbg,pspell,readline,soap,sqlite3,sybase,tidy,xml,xmlrpc,xsl,zip} libapache2-mod-php7.4 php-{apcu,date,geoip,gettext,imagick,gnupg,mailparse,pear,redis,twig,uuid,validate,zmq} ghostscript libgs-dev ffmpeg && \
    apt remove -y php7.3 libapache2-mod-php7.3
    # rm -rf /var/cache/apt /var/lib/apt/lists

## Install .NET Core for VSCode (To develop, not as a requirement)
RUN apt-get -y install apt-transport-https
RUN wget https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && dpkg -i packages-microsoft-prod.deb
RUN apt-get update && apt-get install -y dotnet-sdk-3.1 aspnetcore-runtime-3.1

## Install PowerShell for VSCode (To develop, not as a requirement)
RUN add-apt-repository universe && apt-get install -y powershell

# configure apache
# keep the prefork linking below a2enmod since it removes dangling mods-enabled (!)
RUN a2disconf other-vhosts-access-log && \
    echo "Listen 80" > /etc/apache2/ports.conf && \
    echo "Listen 81" >> /etc/apache2/ports.conf && \
    echo "Listen 8888" >> /etc/apache2/ports.conf && \
    a2enmod rewrite headers rewrite expires cache php7.4 proxy* authnz_ldap && \
    rm /etc/apache2/sites-enabled/* && \
    sed -e 's,^ErrorLog.*,ErrorLog "|/bin/cat",' -i /etc/apache2/apache2.conf && \
    ln -sf /app/data/apache/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf && \
    ln -sf /app/data/apache/app.conf /etc/apache2/sites-enabled/app.conf

COPY apache/ /app/code/apache/

# configure mod_php
RUN crudini --set /etc/php/7.4/apache2/php.ini PHP upload_max_filesize 64M && \
    crudini --set /etc/php/7.4/apache2/php.ini PHP post_max_size 64M && \
    crudini --set /etc/php/7.4/apache2/php.ini PHP memory_limit 128M && \
    crudini --set /etc/php/7.4/apache2/php.ini Session session.save_path /run/app/sessions && \
    crudini --set /etc/php/7.4/apache2/php.ini Session session.gc_probability 1 && \
    crudini --set /etc/php/7.4/apache2/php.ini Session session.gc_divisor 100

RUN cp /etc/php/7.4/apache2/php.ini /etc/php/7.4/cli/php.ini

RUN ln -s /app/data/php.ini /etc/php/7.4/apache2/conf.d/99-cloudron.ini && \
    ln -s /app/data/php.ini /etc/php/7.4/cli/conf.d/99-cloudron.ini

# install RPAF module to override HTTPS, SERVER_PORT, HTTP_HOST based on reverse proxy headers
# https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-web-server-and-reverse-proxy-for-apache-on-one-ubuntu-16-04-server
RUN mkdir /app/code/rpaf && \
    curl -L https://github.com/gnif/mod_rpaf/tarball/669c3d2ba72228134ae5832c8cf908d11ecdd770 | tar -C /app/code/rpaf -xz --strip-components 1 -f -  && \
    cd /app/code/rpaf && \
    make && \
    make install && \
    rm -rf /app/code/rpaf

# configure rpaf
RUN echo "LoadModule rpaf_module /usr/lib/apache2/modules/mod_rpaf.so" > /etc/apache2/mods-available/rpaf.load && a2enmod rpaf

# phpMyAdmin
RUN mkdir -p /app/code/phpmyadmin && \
    curl -L https://files.phpmyadmin.net/phpMyAdmin/5.0.2/phpMyAdmin-5.0.2-all-languages.tar.gz | tar zxvf - -C /app/code/phpmyadmin --strip-components=1
COPY phpmyadmin-config.inc.php /app/code/phpmyadmin/config.inc.php

# configure cron
RUN rm -rf /var/spool/cron && ln -s /run/cron /var/spool/cron
# clear out the crontab
RUN rm -f /etc/cron.d/* /etc/cron.daily/* /etc/cron.hourly/* /etc/cron.monthly/* /etc/cron.weekly/* && truncate -s0 /etc/crontab

# ioncube. the extension dir comes from php -i | grep extension_dir
# extension has to appear first, otherwise will error with "The Loader must appear as the first entry in the php.ini file"
RUN mkdir /tmp/ioncube && \
    curl http://downloads.ioncube.com/loader_downloads/ioncube_loaders_lin_x86-64.tar.gz | tar zxvf - -C /tmp/ioncube && \
    cp /tmp/ioncube/ioncube/ioncube_loader_lin_7.4.so /usr/lib/php/20170718 && \
    rm -rf /tmp/ioncube && \
    echo "zend_extension=/usr/lib/php/20170718/ioncube_loader_lin_7.4.so" > /etc/php/7.4/apache2/conf.d/00-ioncube.ini && \
    echo "zend_extension=/usr/lib/php/20170718/ioncube_loader_lin_7.4.so" > /etc/php/7.4/cli/conf.d/00-ioncube.ini

# configure supervisor
ADD supervisor/ /etc/supervisor/conf.d/
RUN sed -e 's,^logfile=.*$,logfile=/run/supervisord.log,' -i /etc/supervisor/supervisord.conf

# add code
COPY start.sh index.php crontab.template credentials.template phpmyadmin_login.template /app/code/
COPY code-server /app/code/code-server

# lock www-data but allow su - www-data to work
RUN passwd -l www-data && usermod --shell /bin/bash --home /app/data www-data

CMD [ "/app/code/start.sh" ]
