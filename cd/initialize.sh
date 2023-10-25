cd /home/ubuntu/api
if [ -d "/home/ubuntu/api" ]; then rm -rf `ls -a ./api | grep -vEw 'node_modules|\.env|\.'`;
fi;