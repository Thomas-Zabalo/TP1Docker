@echo off
setlocal

pushd "%~dp0.." || (
    echo Impossible d'acceder au dossier du projet.
    exit /b 1
)

set "DOCKER="
for /f "delims=" %%D in ('where docker 2^>nul') do if not defined DOCKER set "DOCKER=%%D"

if not defined DOCKER if exist "%ProgramFiles%\Docker\Docker\resources\bin\docker.exe" (
    set "DOCKER=%ProgramFiles%\Docker\Docker\resources\bin\docker.exe"
)

if not defined DOCKER if exist "%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe" (
    set "DOCKER=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe"
)

if not defined DOCKER (
    echo Docker CLI introuvable. Verifiez que Docker Desktop est installe, puis relancez ce script.
    popd
    exit /b 1
)

echo Verification de la connexion a Docker...
"%DOCKER%" info >nul 2>&1
if errorlevel 1 (
    echo Docker CLI trouve, mais le moteur Docker ne repond pas.
    echo Demarrez Docker Desktop, attendez qu'il soit pret, puis relancez ce script.
    popd
    exit /b 1
)

set "REPORT=benchmarks\resource-report.md"
set "OUTPUT=%TEMP%\resource-benchmark-%RANDOM%.txt"
> "%REPORT%" echo # Rapport de benchmark des ressources
>> "%REPORT%" echo.
>> "%REPORT%" echo - Date : %DATE% %TIME%
>> "%REPORT%" echo - Systeme : Windows
>> "%REPORT%" echo.
>> "%REPORT%" echo ## Informations sur l'hote Docker
>> "%REPORT%" echo.
>> "%REPORT%" echo ```text
"%DOCKER%" info >> "%REPORT%" 2>&1
>> "%REPORT%" echo ```
>> "%REPORT%" echo.
>> "%REPORT%" echo ## Version Docker
>> "%REPORT%" echo.
>> "%REPORT%" echo ```text
"%DOCKER%" version >> "%REPORT%" 2>&1
>> "%REPORT%" echo ```
>> "%REPORT%" echo.
>> "%REPORT%" echo ## Resultats
>> "%REPORT%" echo.

echo Les resultats seront enregistres dans "%REPORT%".

call :run "CPU : sans limite" "run --rm severalnines/sysbench sysbench cpu --threads=4 run"
if errorlevel 1 goto :error

call :run "CPU : limite de 2 CPU" "run --rm --cpus=2 severalnines/sysbench sysbench cpu --threads=4 run"
if errorlevel 1 goto :error

call :run "CPU : limite de 0.5 CPU" "run --rm --cpus=0.5 severalnines/sysbench sysbench cpu --threads=4 run"
if errorlevel 1 goto :error

call :run "Memoire : sans limite" "run --rm severalnines/sysbench sysbench memory --threads=1 --memory-block-size=128M --memory-total-size=1G run"
if errorlevel 1 goto :error

call :run "Memoire : limite de 256 MiB, sans swap" "run --rm --memory=256m --memory-swap=256m severalnines/sysbench sysbench memory --threads=1 --memory-block-size=128M --memory-total-size=1G run"
if errorlevel 1 goto :error

call :run "Memoire : limite de 512 MiB, sans swap" "run --rm --memory=512m --memory-swap=512m severalnines/sysbench sysbench memory --threads=1 --memory-block-size=128M --memory-total-size=1G run"
if errorlevel 1 goto :error

>> "%REPORT%" echo ## Fin du benchmark
>> "%REPORT%" echo.
>> "%REPORT%" echo Tous les scenarios se sont termines avec succes le %DATE% a %TIME%.
del "%OUTPUT%" >nul 2>&1
echo.
echo Tous les benchmarks sont termines.
echo Rapport : "%REPORT%"
popd
exit /b 0

:error
echo.
echo Un scenario a echoue. Consultez le rapport : "%REPORT%"
>> "%REPORT%" echo ## Benchmark interrompu
>> "%REPORT%" echo.
>> "%REPORT%" echo Le benchmark a ete interrompu le %DATE% a %TIME% apres un scenario en erreur.
del "%OUTPUT%" >nul 2>&1
popd
exit /b 1

:run
set "SCENARIO=%~1"
set "DOCKER_ARGS=%~2"
echo.
echo === %SCENARIO% ===
>> "%REPORT%" echo ### %SCENARIO%
>> "%REPORT%" echo.
>> "%REPORT%" echo Commande : `docker %DOCKER_ARGS%`
>> "%REPORT%" echo.
>> "%REPORT%" echo ```text
"%DOCKER%" %DOCKER_ARGS% > "%OUTPUT%" 2>&1
set "RESULT=%ERRORLEVEL%"
type "%OUTPUT%"
type "%OUTPUT%" >> "%REPORT%"
>> "%REPORT%" echo ```
>> "%REPORT%" echo.
if "%RESULT%"=="0" (
    >> "%REPORT%" echo Code de sortie : 0 - succes
) else (
    >> "%REPORT%" echo Code de sortie : %RESULT% - echec
)
>> "%REPORT%" echo.
exit /b %RESULT%
