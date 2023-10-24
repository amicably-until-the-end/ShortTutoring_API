cd /home/ubuntu/api

# 원래 node 프로세스 종료
sudo kill -9 `ps -ef | grep 'node' | awk '{print $2}'`
sudo chmod -R 777 /home/ubuntu/api
npm install
ls -al /home/ubuntu/api >> /home/ubuntu/start.log
cross-env NODE_ENV=dev nohup node /home/ubuntu/api/dist/main 1>~/log/logs 2>&1  &
echo "done start.sh"