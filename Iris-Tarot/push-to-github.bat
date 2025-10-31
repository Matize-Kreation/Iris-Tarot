@echo off
cd /d "D:\Matize\Hobby Projekte\Iris-Tarot\Iris-Tarot-Website"

echo ============================================
echo   GitHub Push wird gestartet ...
echo ============================================

REM Änderungen hinzufügen und committen
git add .
git commit -m "Automatischer Push am %date% %time%"

REM Push zur Hauptbranch
git push origin main

echo --------------------------------------------
echo   Vorgang abgeschlossen. Fenster schließt sich.
timeout /t 5 >nul
