#!/bin/sh

status=0
report=/reports/lint-report.md

printf '# Lint and formatting report\n\n| Check | Result |\n|---|---|\n' > "$report"

run_check() {
    name=$1
    output=$2
    shift 2

    if "$@" > "$output" 2>&1; then
        printf '| %s | passed |\n' "$name" >> "$report"
        cat "$output"
    else
        printf '| %s | failed |\n' "$name" >> "$report"
        cat "$output"
        status=1
    fi
}

run_check "Backend lint (Ruff)" /reports/backend-lint.txt \
    /opt/ruff/bin/ruff check /workspace/backend
run_check "Backend formatting (Ruff)" /reports/backend-format.txt \
    /opt/ruff/bin/ruff format --check /workspace/backend
run_check "Frontend lint (ESLint)" /reports/frontend-lint.txt \
    npm run lint --prefix /workspace/frontend
run_check "Frontend production build (Vite)" /reports/frontend-build.txt \
    npm run build --prefix /workspace/frontend

exit "$status"