@echo off
REM Set PostgreSQL password for postgres user
REM This script will run psql commands without password prompt

set PG_BIN=C:\Program Files\PostgreSQL\18\bin
set DB_HOST=127.0.0.1
set DB_USER=postgres

echo Attempting to reset postgres user password...
echo.

REM Try to connect and reset password by running SQL directly
REM We'll use createdb which might succeed
echo Trying to create database mealgo_db...
"%PG_BIN%\createdb.exe" -U %DB_USER% -h %DB_HOST% -e mealgo_db 2>&1

echo.
echo If the above failed, you need to manually reset the postgres password:
echo 1. Open pgAdmin4 (comes with PostgreSQL)
echo 2. Connect to the server
echo 3. Right-click the 'postgres' user and set password to: 1234
echo 4. Then run: npm run dev
echo.
pause
