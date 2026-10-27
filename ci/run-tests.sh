#!/bin/sh

cd /workspace/backend || exit 1

if python -m pytest tests --junitxml=/reports/backend-tests.xml \
    > /reports/backend-tests.txt 2>&1; then
    cat /reports/backend-tests.txt
else
    cat /reports/backend-tests.txt
    exit 1
fi