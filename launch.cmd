@echo off

echo Installing packages...
echo:
call npm i
echo:
echo Packages installed.
echo Starting server...
call npm run start