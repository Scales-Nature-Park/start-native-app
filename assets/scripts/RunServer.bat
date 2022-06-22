@echo OFF
SET scriptPath=%~dp0%
SET serverPath=%scriptPath%..\..\server\

@REM goto server dir and run it
cd %serverPath%
if not exist %serverPath%node_modules\ (
    powershell -command npm install
)
node app.js
