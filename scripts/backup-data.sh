#!/bin/bash

# TaxSeason Data Backup Script
# This script backs up the MongoDB database and configuration files

# Get the current date for the backup filename
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./data/backups"
BACKUP_FILENAME="taxseason_backup_${BACKUP_DATE}.tar.gz"

echo "==============================================="
echo "TaxSeason - Data Backup"
echo "==============================================="

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Check if MongoDB is installed
if ! command -v mongodump &> /dev/null; then
    echo "MongoDB tools are not installed. Please install them to use this backup script."
    exit 1
fi

# Backup MongoDB database
echo "Backing up MongoDB database..."
mongodump --db taxseason --out "${BACKUP_DIR}/mongodb_dump_${BACKUP_DATE}"

# Backup configuration files
echo "Backing up configuration files..."
mkdir -p "${BACKUP_DIR}/config_${BACKUP_DATE}"
cp backend/.env "${BACKUP_DIR}/config_${BACKUP_DATE}/" 2>/dev/null || echo "No backend .env file found to backup."
cp frontend/.env "${BACKUP_DIR}/config_${BACKUP_DATE}/" 2>/dev/null || echo "No frontend .env file found to backup."

# Create a compressed archive
echo "Creating compressed backup archive..."
tar -czf "${BACKUP_DIR}/${BACKUP_FILENAME}" \
    "${BACKUP_DIR}/mongodb_dump_${BACKUP_DATE}" \
    "${BACKUP_DIR}/config_${BACKUP_DATE}"

# Cleanup temporary files
echo "Cleaning up temporary files..."
rm -rf "${BACKUP_DIR}/mongodb_dump_${BACKUP_DATE}"
rm -rf "${BACKUP_DIR}/config_${BACKUP_DATE}"

echo "==============================================="
echo "Backup completed successfully!"
echo "Backup saved to: ${BACKUP_DIR}/${BACKUP_FILENAME}"
echo "==============================================="
echo ""
echo "To restore this backup, run:"
echo "1. Extract the archive: tar -xzf ${BACKUP_FILENAME}"
echo "2. Restore the database: mongorestore mongodb_dump_${BACKUP_DATE}/taxseason"
echo "3. Copy the configuration files back to their locations"
echo "===============================================" 