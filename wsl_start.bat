@echo off
SETLOCAL

:: ===========================================
:: Script Name: wsl_start.bat
:: Description: This script start up your WSL2 Ubuntu instance and add the related service to autostart.
:: Author: yataktyni (https://x.com/yataktyni)
:: License: MIT License
:: Copyright: (c) 2025 yataktyni. All Rights Reserved.
:: ===========================================

sc config LxssManager start= auto
sc start LxssManager
