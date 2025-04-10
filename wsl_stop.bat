@echo off
SETLOCAL

:: ===========================================
:: Script Name: wsl_stop.bat
:: Description: This script cleans up and compacts your WSL2 Ubuntu instance.
:: Author: yataktyni (https://x.com/yataktyni)
:: License: MIT License
:: Copyright: (c) 2025 yataktyni. All Rights Reserved.
:: ===========================================

:: Comment: I use this to shutdown WSL whenever I need to put Windows on a Sleep/Hibernate state.
:ECHO Stopping VM Services

sc stop hns
sc stop vmcompute
sc stop lxssmanager
taskkill /f /im wslservice.exe
sc config LxssManager start= disabled
:exit
