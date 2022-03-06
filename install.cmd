@echo off

echo Installing packages...
echo:
call npm i
echo:
echo Installation complete.
TIMEOUT 2 > nul