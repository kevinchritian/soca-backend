@echo off
setlocal

SET "package=Kateru Riyu Docker Compose Runner Manager."
SET "environment="
SET "docker_file="

goto :main

:display_help
    echo %package%
    echo.
    echo Usage:
    echo   ./riyu [environment]
    echo.
    echo Environment:
    echo   local   : local server. use this if you running on local.
    echo   staging : staging server. use this if you running on staging.
    echo.
    echo Example:
    echo   ./riyu local
    echo   ./riyu staging

    EXIT /B 0

:get_docker_file
    if "%~1" == "local" (
        SET "docker_file=.\.docker\compose\local\docker-compose.yml"
    ) else if "%~1" == "staging" (
        SET "docker_file=.\.docker\compose\staging\docker-compose.yml"
    ) else (
        echo Invalid environment
        EXIT /B 1
    )
    EXIT /B 0

:docker_compose_handler
    echo Building docker compose with environment: %environment%
    echo Using docker file: %docker_file%

    docker compose --env-file=.env --file=%docker_file% up -d --build

    EXIT /B 0

:main
    if "%~1" == "local" (
        SET "environment=local"
    ) else if "%~1" == "staging" (
        SET "environment=staging"
    ) else (
        echo Invalid environment argument
        EXIT /B 1
    )

    call :get_docker_file %environment%
    call :docker_compose_handler

EXIT /B 0
