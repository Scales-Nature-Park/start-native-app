@echo OFF
@REM Request admin privileges and rerun if not already admin
if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)

SET scriptPath=%~dp0%
SET bundlePath=%scriptPath%..\..\android\app\build\outputs\apk\release
SET tempBundle=%scriptPath%bundle%date:~10,4%-%date:~4,2%-%date:~7,2%

@REM  Assemble and bundle android realease
cd %~dp0../../android
powershell -command ./gradlew assembleRelease

cd %~dp0../../android
powershell -command  ./gradlew bundleRelease

@REM Delete existing tempBundle folder if it exists
if exist %tempBundle% (rmdir /s /q %tempBundle%)

@REM copy bundle into a temp folder
MD %tempBundle%
XCOPY /y %bundlePath% %tempBundle%\

:7z
@REM Install 7-zip and copy executable to C:\Windows
if not exist C:\"Program Files"\7-Zip\ (
    echo Installing 7-Zip...
    powershell -command "start-bitstransfer -source https://www.7-zip.org/a/7z2107-x64.exe -destination %scriptPath%\7z2107-x64.exe"
    7z2107-x64.exe /S 
)

@REM Check if installation succeeded, if not reinstall it
if exist C:\"Program Files"\7-Zip\7z.exe (
    XCOPY /y C:\"Program Files"\7-Zip\7z.exe C:\Windows\
)else (
    goto 7z
)

@REM Now check if gdrive exists in windows folder. install it if it doesn't
:gdrive
if not exist C:\Windows\gdrive.exe (
    echo Installing gdrive...
    powershell -command "start-bitstransfer -source https://github.com/prasmussen/gdrive/releases/download/2.1.1/gdrive_2.1.1_windows_386.tar.gz -destination %scriptPath%gdrive_2.1.1_windows_386.tar.gz"

    @REM Extract gdrive files
    :unzip-gz
    cd %scriptPath%
    7z.exe e -y gdrive_2.1.1_windows_386.tar.gz
    7z.exe e -y gdrive_2.1.1_windows_386.tar 
    
    @REM Copy gdrive.exe to windows folder
    if exist %scriptPath%\gdrive.exe (
        XCOPY /y %scriptPath%\gdrive.exe C:\Windows
        DEL %scriptPath%\gdrive.exe
    ) else (
        goto gdrive
    )
)

@REM Some housekeeping
DEL %scriptPath%gdrive_2.1.1_windows_386.tar.gz
DEL %scriptPath%gdrive_2.1.1_windows_386.tar 
DEL %scriptPath%gdrive.exe
DEL %scriptPath%7z2107-x64.exe

:upload
@REM upload copies of release files to google drive
echo Uploading release to google drive...

gdrive.exe list > %scriptPath%tempFile.txt

@REM Get ID of start-data-app folder and place it in tempFile.txt
@REM All parsing is done using python script
cd %scriptPath%
lib\dist\parse.exe
FOR /F "tokens=* delims=" %%x in (%scriptPath%/tempFile.txt) DO SET folderID=%%x

@REM Upload file into the the star-data-app directory
gdrive.exe upload -r -p %folderId% %tempBundle%
gdrive.exe share %folderID%
gdrive.exe info %folderID% > %scriptPath%tempFile.txt

@REM export link to tempfile.txt
lib\dist\parse.exe url

echo Uploaded release bundle successfully on %DATE% at %TIME%.

@REM More housekeeping
rmdir /s /q %tempBundle%

timeout /t 100
