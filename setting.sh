#!/bin/sh

sed -i 's/@WEB_PORT@/'$WEB_PORT'/g' /prod/server/config_template.js
sed -i 's/@JUPYTER_IP@/'$JUPYTER_IP'/g' /prod/server/config_template.js
sed -i 's/@JUPYTER_PORT@/'$JUPYTER_PORT'/g' /prod/server/config_template.js
sed -i 's/@JUPYTER_TOKEN@/'$JUPYTER_TOKEN'/g' /prod/server/config_template.js
sed -i 's/@MYSQL_UNAME@/'$MYSQL_UNAME'/g' /prod/server/config_template.js
sed -i 's/@MYSQL_PWD@/'$MYSQL_PWD'/g' /prod/server/config_template.js
sed -i 's/@MYSQL_ADDR@/'$MYSQL_ADDR'/g' /prod/server/config_template.js
sed -i 's/@MYSQL_DATABASE@/'$MYSQL_DATABASE'/g' /prod/server/config_template.js
gulp serve 