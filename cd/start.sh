cd /home/ubuntu/api

# 원래 node 프로세스 종료
sudo kill -9 `ps -ef | grep 'node' | awk '{print $2}'`
sudo npm install
nohup npm run start:dev >/home/ubuntu/log/logs 2>&1 </home/ubuntu/log/errors &
sudo rm -rf "install"