@echo off
cd C:\WWW\SDC-Chat\Server\src\
pm2 start dist/main.js --name "SDC-Chat-Server"