#!/bin/bash
# =============================================================================
# Backup Script for Tutoring System
# =============================================================================
#
# This script creates daily backups of the database and uploaded files.
#
# Usage:
#   ./backup.sh                    # Run backup with default settings
#   ./backup.sh --restore db       # Restore database from latest backup
#   ./backup.sh --restore files    # Restore files from latest backup
#
# Configuration:
#   Edit the variables below to match your environment.
# =============================================================================

set -e

# =============================================================================
# Configuration
# =============================================================================

BACKUP_DIR="${BACKUP_DIR:-/var/backups/tutoring-system}"
APP_DIR="${APP_DIR:-/var/www/tutoring-system}"
DB_NAME="${DB_NAME:-tutoring_system}"
DB_USER="${DB_USER:-tutoring}"
DB_PASS="${DB_PASS:-}"
DB_HOST="${DB_HOST:-localhost}"

# Retention policies
DAILY_RETENTION=7      # Keep daily backups for 7 days
WEEKLY_RETENTION=4     # Keep weekly backups for 4 weeks
MONTHLY_RETENTION=3    # Keep monthly backups for 3 months

# Date variables
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M-%S)
WEEKDAY=$(date +%u)
DAY=$(date +%d)

# =============================================================================
# Functions
# =============================================================================

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    log "ERROR: $1" >&2
    exit 1
}

check_requirements() {
    command -v mysqldump >/dev/null 2>&1 || error "mysqldump is required but not installed"
    command -v tar >/dev/null 2>&1 || error "tar is required but not installed"
    command -v gzip >/dev/null 2>&1 || error "gzip is required but not installed"
}

create_directories() {
    mkdir -p "$BACKUP_DIR/daily"
    mkdir -p "$BACKUP_DIR/weekly"
    mkdir -p "$BACKUP_DIR/monthly"
}

backup_database() {
    log "Backing up database..."

    local backup_file="$BACKUP_DIR/daily/db-$DATE.sql.gz"

    if [ -z "$DB_PASS" ]; then
        mysqldump -h"$DB_HOST" -u"$DB_USER" "$DB_NAME" | gzip > "$backup_file"
    else
        mysqldump -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$backup_file"
    fi

    log "Database backup created: $backup_file"
    echo "$backup_file"
}

backup_files() {
    log "Backing up uploaded files..."

    local backup_file="$BACKUP_DIR/daily/storage-$DATE.tar.gz"
    local storage_dir="$APP_DIR/backend/storage/app/public"

    if [ -d "$storage_dir" ]; then
        tar -czf "$backup_file" -C "$APP_DIR/backend" "storage/app/public"
        log "Files backup created: $backup_file"
        echo "$backup_file"
    else
        log "Warning: Storage directory not found, skipping files backup"
    fi
}

rotate_backups() {
    log "Rotating backups..."

    # Weekly backup (on Sundays)
    if [ "$WEEKDAY" -eq 7 ]; then
        log "Creating weekly backup..."
        cp "$BACKUP_DIR/daily/db-$DATE.sql.gz" "$BACKUP_DIR/weekly/" 2>/dev/null || true
        cp "$BACKUP_DIR/daily/storage-$DATE.tar.gz" "$BACKUP_DIR/weekly/" 2>/dev/null || true
    fi

    # Monthly backup (on the 1st)
    if [ "$DAY" -eq 1 ]; then
        log "Creating monthly backup..."
        cp "$BACKUP_DIR/daily/db-$DATE.sql.gz" "$BACKUP_DIR/monthly/" 2>/dev/null || true
        cp "$BACKUP_DIR/daily/storage-$DATE.tar.gz" "$BACKUP_DIR/monthly/" 2>/dev/null || true
    fi

    # Cleanup old backups
    log "Cleaning up old backups..."
    find "$BACKUP_DIR/daily" -type f -mtime +$DAILY_RETENTION -delete 2>/dev/null || true
    find "$BACKUP_DIR/weekly" -type f -mtime +$((WEEKLY_RETENTION * 7)) -delete 2>/dev/null || true
    find "$BACKUP_DIR/monthly" -type f -mtime +$((MONTHLY_RETENTION * 30)) -delete 2>/dev/null || true
}

restore_database() {
    local backup_file="${1:-$(ls -t $BACKUP_DIR/daily/db-*.sql.gz 2>/dev/null | head -1)}"

    if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
        error "No database backup file found"
    fi

    log "Restoring database from: $backup_file"

    if [ -z "$DB_PASS" ]; then
        gunzip < "$backup_file" | mysql -h"$DB_HOST" -u"$DB_USER" "$DB_NAME"
    else
        gunzip < "$backup_file" | mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME"
    fi

    log "Database restored successfully"
}

restore_files() {
    local backup_file="${1:-$(ls -t $BACKUP_DIR/daily/storage-*.tar.gz 2>/dev/null | head -1)}"

    if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
        error "No files backup found"
    fi

    log "Restoring files from: $backup_file"
    tar -xzf "$backup_file" -C "$APP_DIR/backend/"
    log "Files restored successfully"
}

list_backups() {
    echo ""
    echo "=== Daily Backups ==="
    ls -lh "$BACKUP_DIR/daily/" 2>/dev/null || echo "No daily backups"

    echo ""
    echo "=== Weekly Backups ==="
    ls -lh "$BACKUP_DIR/weekly/" 2>/dev/null || echo "No weekly backups"

    echo ""
    echo "=== Monthly Backups ==="
    ls -lh "$BACKUP_DIR/monthly/" 2>/dev/null || echo "No monthly backups"
}

show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  (none)           Run backup"
    echo "  --restore db     Restore database from latest backup"
    echo "  --restore files  Restore files from latest backup"
    echo "  --list           List all backups"
    echo "  --help           Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  BACKUP_DIR       Backup directory (default: /var/backups/tutoring-system)"
    echo "  APP_DIR          Application directory (default: /var/www/tutoring-system)"
    echo "  DB_NAME          Database name (default: tutoring_system)"
    echo "  DB_USER          Database user (default: tutoring)"
    echo "  DB_PASS          Database password"
    echo "  DB_HOST          Database host (default: localhost)"
}

# =============================================================================
# Main
# =============================================================================

main() {
    case "${1:-}" in
        --restore)
            case "${2:-}" in
                db)
                    restore_database "${3:-}"
                    ;;
                files)
                    restore_files "${3:-}"
                    ;;
                *)
                    error "Usage: $0 --restore [db|files] [backup_file]"
                    ;;
            esac
            ;;
        --list)
            list_backups
            ;;
        --help)
            show_help
            ;;
        *)
            log "Starting backup..."
            check_requirements
            create_directories
            backup_database
            backup_files
            rotate_backups
            log "Backup completed successfully!"
            ;;
    esac
}

main "$@"
