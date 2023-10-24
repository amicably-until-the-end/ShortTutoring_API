cd /home/ubuntu/api

# 원래 node 프로세스 종료
sudo kill -9 `ps -ef | grep 'node' | awk '{print $2}'`
sudo chmod -R 777 /home/ubuntu/api
npm install
ls "-al /home/api" >> /home/ubuntu/start.log
nohup cross-env NODE_ENV=dev node /home/ubuntu/api/dist/main 1>~/log/logs 2>&1  &
echo "done start.sh"