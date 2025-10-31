@echo off
title 🌌 Iris Tarot - Lokaler Entwicklungsserver
echo.
echo ==========================================================
echo     🌙 Starte lokalen Server für Iris Tarot Website ...
echo ==========================================================
echo.

REM Wechsle in den Ordner, in dem sich die BAT-Datei befindet
cd /d "%~dp0"

REM Prüfe, ob Python installiert ist
python --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo ❌ Python wurde nicht gefunden.
    echo Bitte installiere Python 3.x von https://www.python.org/downloads/
    pause
    exit /b
)

REM Starte den lokalen Server im Hintergrund
start "" http://localhost:8000
echo 🔮 Server läuft auf: http://localhost:8000
echo (Zum Beenden in diesem Fenster STRG + C drücken)
echo.
python -m http.server 8000

REM Wenn der Server beendet wird, Konsole offen lassen
echo.
echo 🌙 Server gestoppt.
pause
