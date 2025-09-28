DIFF_FILE=$(mktemp)
LOG_FILE=$(mktemp)
trap 'rm -f "$DIFF_FILE" "$LOG_FILE"' EXIT

PGSSLMODE=disable supabase db diff > "$DIFF_FILE" 2> "$LOG_FILE"
EXIT_CODE=$?

# Check if the supabase command itself failed (e.g., Docker isn't running).
if [ $EXIT_CODE -ne 0 ]; then
  cat <<EOF
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║         ⚠️ PUSH FAILED: Supabase/Docker failed or CLI error occurred ⚠️     ║
║                                                                            ║
╟────────────────────────────────────────────────────────────────────────────╢
║               CHECK THE SUPABASE LOGS BELOW TO DEBUG:                      ║
╚════════════════════════════════════════════════════════════════════════════╝
EOF
  cat "$LOG_FILE"
  exit 1
fi

# Check if the diff file is non-empty, which indicates schema changes were found.
if [ -s "$DIFF_FILE" ]; then
  cat <<EOF
╔════════════════════════════════════════════════════════════════════════════╗
║            🔴 PUSH FAILED: Database schema mismatch detected. 🔴            ║
╟────────────────────────────────────────────────────────────────────────────╢
║                         Next steps (choose one):                           ║
║  1. Run 'supabase db diff -f <migration_file_name>' to create a migration  ║
║                   file for your local changes and commit it.               ║
║                                                                            ║
║     2. Run 'supabase migration up --local' to apply pending migrations     ║
║                   if your local database is behind.                        ║
║                                                                            ║
║  3. Run 'supabase db reset --local' to fully reset your local database     ║
║    and match the latest migrations (warning: this will erase local data).  ║
╚════════════════════════════════════════════════════════════════════════════╝
EOF
  exit 1
else
  exit 0
fi