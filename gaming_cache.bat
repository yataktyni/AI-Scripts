@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: ===========================================
:: Script Name: gaming_cache.bat
:: Description: This script cleans up and moves your GPU cache folders for NVIDIA, AMD, and Intel GPUs from system drive to a new defined location.
:: Author: yataktyni (https://x.com/yataktyni)
:: License: MIT License
:: Copyright: (c) 2025 yataktyni. All Rights Reserved.
:: ===========================================

:: Set target base folder on H (Change it to your preferred disk):
set "TARGET_ROOT=H:\GameCache"

:: Create base folder
mkdir "%TARGET_ROOT%"

:: NVIDIA GPU Cache
call :MoveAndLink "%LOCALAPPDATA%\NVIDIA\DXCache" "%TARGET_ROOT%\NVIDIA\DXCache"
call :MoveAndLink "%LOCALAPPDATA%\NVIDIA\GLCache" "%TARGET_ROOT%\NVIDIA\GLCache"
call :MoveAndLink "%LOCALAPPDATA%\D3DSCache" "%TARGET_ROOT%\NVIDIA\D3DSCache"
call :MoveAndLink "%LOCALAPPDATA%\NVIDIA\OptixCache" "%TARGET_ROOT%\NVIDIA\OptixCache"
call :MoveAndLink "%PROGRAMDATA%\NVIDIA Corporation\NVTopps" "%TARGET_ROOT%\NVIDIA\NVTopps"
call :MoveAndLink "C:\Program Files (x86)\Steam\steamapps\shadercache" "%TARGET_ROOT%\NVIDIA\SteamShaderCache"

:: AMD GPU Cache
call :MoveAndLink "%LOCALAPPDATA%\AMD\GLCache" "%TARGET_ROOT%\AMD\GLCache"
call :MoveAndLink "%LOCALAPPDATA%\AMD\D3DSCache" "%TARGET_ROOT%\AMD\D3DSCache"
call :MoveAndLink "%LOCALAPPDATA%\AMD\ComputeCache" "%TARGET_ROOT%\AMD\ComputeCache"
call :MoveAndLink "C:\Program Files (x86)\Steam\steamapps\shadercache" "%TARGET_ROOT%\AMD\SteamShaderCache"

:: Intel GPU Cache
call :MoveAndLink "%LOCALAPPDATA%\Intel\Graphics\GPUCache" "%TARGET_ROOT%\Intel\GPUCache"
call :MoveAndLink "%LOCALAPPDATA%\Intel\Graphics\ShaderCache" "%TARGET_ROOT%\Intel\ShaderCache"

goto :eof

:MoveAndLink
set "OLD_PATH=%~1"
set "NEW_PATH=%~2"

echo.
echo Processing: !OLD_PATH!
if exist "!OLD_PATH!" (
    echo Moving contents to !NEW_PATH!...
    mkdir "!NEW_PATH!" >nul 2>&1
    robocopy "!OLD_PATH!" "!NEW_PATH!" /E /MOVE >nul
    echo Deleting old folder...
    rmdir /s /q "!OLD_PATH!"
    echo Creating symlink...
    mklink /J "!OLD_PATH!" "!NEW_PATH!"
) else (
    echo [Skipped] !OLD_PATH! does not exist.
)
goto :eof
