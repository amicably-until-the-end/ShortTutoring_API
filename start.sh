cd /home/ubuntu/api

# 원래 node 프로세스 종료
sudo kill -9 `ps -ef | grep 'node' | awk '{print $2}'`
nohup npm start >/home/ubuntu/logs 2>&1 </home/ubuntu/errors &