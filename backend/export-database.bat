@echo off
echo Exporting your local database...
echo Make sure your MySQL server is running

mysqldump -u root -p161920 --host=127.0.0.1 ecommerce > ecommerce-export.sql

echo Export completed! File saved as: ecommerce-export.sql
echo.
echo Next steps:
echo 1. Create cloud database (Supabase or PlanetScale)
echo 2. Import this SQL file to your cloud database
echo 3. Update Render environment variables
echo.
pause
