@echo off
cd /d "D:\Matize\Hobby Projekte\Iris-Tarot\Iris-Tarot-Website"

echo ============================================
echo   GitHub Pull & Push wird gestartet ...
echo ============================================

REM Erst die neuesten Änderungen holen
git pull origin main

REM Dann deine Änderungen hinzufügen und committen
git add .
git commit -m "Automatischer Push am %date% %time%"

REM Und hochladen
git push origin main

echo --------------------------------------------
echo   Vorgang abgeschlossen. Fenster schließt sich.
timeout /t 5 >nul
