@echo off
SETLOCAL

:: ===========================================
:: Script Name: wsl_clean.bat
:: Description: This script cleans up and compacts your WSL2 Ubuntu instance.
:: Author: yataktyni (https://x.com/yataktyni)
:: License: MIT License
:: Copyright: (c) 2025 yataktyni. All Rights Reserved.
:: ===========================================

:: ---- CONFIGURATION ----
SET DISTRO_NAME=Ubuntu
SET VHDX_PATH=C:\Users\USER\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu_79rhkp1fndgsc\LocalState\ext4.vhdx

:: Change USER to your actual username, adjust the whole VHDX_PATH or DISTRO_NAME (if needed).

echo Cleaning up inside WSL: %DISTRO_NAME%

:: Step 1: Clean up WSL from within
wsl -d %DISTRO_NAME% -- bash -c "sudo apt autoremove -y && sudo apt clean && rm -rf ~/.cache/* /tmp/* && echo 'WSL cleaned'"

:: Step 2: Shut down WSL
echo Shutting down WSL...
wsl --shutdown

:: Step 3: Compact VHDX
echo Compacting the WSL2 virtual disk...
powershell -NoProfile -Command "Optimize-VHD -Path '%VHDX_PATH%' -Mode Full"

echo.
echo Done! Your WSL2 distro has been cleaned and compacted.

:: Prompt user if they want to schedule the task
set /p SCHEDULE_TASK="Do you want to schedule this task to run once per month? (y/n): "

if /i "%SCHEDULE_TASK%"=="y" (
    echo Scheduling task to run once per month...

    :: Get current directory to use as the script path
    set SCRIPT_PATH=%~dp0wsl_clean.bat

    :: Create a scheduled task
    schtasks /create /tn "WSL2 Cleanup" /tr "\"%SCRIPT_PATH%\"" /sc monthly /mo 1 /st 00:00 /f

    echo Task has been scheduled to run once per month.
) else (
    echo No task scheduled.
)

pause
