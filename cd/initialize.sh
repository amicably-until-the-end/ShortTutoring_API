if [ -d "/home/ubuntu/api" ]; then sudo find /home/ubuntu/api -type d -name "node_modules" -prune -o -exec sudo rm -rf {} \; fi
