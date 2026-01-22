@echo off
echo ======================================
echo   SkillForge AI - Inicio Rapido
echo ======================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "server" (
    echo ERROR: Ejecuta este script desde la raiz del proyecto
    pause
    exit /b 1
)

echo [1/3] Verificando configuracion...
echo.

REM Verificar .env
if not exist "server\.env" (
    echo ADVERTENCIA: No se encontro server\.env
    echo Por favor, configura tus variables de entorno antes de continuar.
    pause
    exit /b 1
)

echo ✓ Archivo .env encontrado
echo.

echo [2/3] Instalando dependencias (si es necesario)...
echo.

cd server
if not exist "node_modules" (
    echo Instalando dependencias del backend...
    call npm install
)
cd ..

cd client
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    call npm install
)
cd ..

echo.
echo [3/3] Iniciando servicios...
echo.
echo IMPORTANTE: Necesitas ejecutar 2 comandos en terminales separadas:
echo.
echo Terminal 1 (Backend):
echo   cd server
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd client
echo   npm run dev
echo.
echo ======================================
echo Presiona cualquier tecla para continuar...
pause >nul
