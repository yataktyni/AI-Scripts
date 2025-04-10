@echo off
SETLOCAL

:: ===========================================
:: Script Name: wsl_start.bat
:: Description: This script cleans up and compacts your WSL2 Ubuntu instance.
:: Author: yataktyni (https://x.com/yataktyni)
:: License: MIT License
:: Copyright: (c) 2025 yataktyni. All Rights Reserved.
:: ===========================================

sc config LxssManager start= auto
sc start LxssManager