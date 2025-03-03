# TaxSeason Backup and Restore Guide

Regular backups are essential for preserving your tax and transaction data. This guide explains how to back up and restore your TaxSeason data.

## Automatic Backups

TaxSeason includes a script for easy backups:

```bash
bash scripts/backup-data.sh
```

This script:
- Creates a timestamped backup in the `data/backups` directory
- Backs up your MongoDB database
- Saves configuration files
- Compresses everything into a single archive

## Manual Backup Process

If you prefer to back up manually or need more control, follow these steps:

### 1. Backing Up MongoDB

```bash
# Replace taxseason with your database name if you changed it
mongodump --db taxseason --out ~/taxseason_mongodb_backup
```

### 2. Backing Up Configuration Files

```bash
# Copy environment files
mkdir -p ~/taxseason_config_backup
cp backend/.env frontend/.env ~/taxseason_config_backup/
```

### 3. Compressing the Backup

```bash
# Create a timestamped archive
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
tar -czf ~/taxseason_backup_${BACKUP_DATE}.tar.gz ~/taxseason_mongodb_backup ~/taxseason_config_backup
```

### 4. Secure Storage

It's recommended to:
- Store backups in multiple locations
- Consider encrypting backups containing sensitive financial data
- Keep at least three recent backups

## Scheduled Backups

For automatic backups on a schedule:

### On Linux/macOS (using cron)

1. Open your crontab:
```bash
crontab -e
```

2. Add a line to run the backup script daily at 2 AM:
```
0 2 * * * cd /path/to/taxseason && bash scripts/backup-data.sh
```

### On Windows (using Task Scheduler)

1. Create a batch file called `taxseason-backup.bat`:
```
cd C:\path\to\taxseason
bash scripts/backup-data.sh
```

2. Open Task Scheduler and create a new basic task
3. Set it to run daily and point it to your batch file

## Restoring from Backup

### Automatic Backup Restore

If you used the automated backup script, follow these steps to restore:

1. Extract the backup archive:
```bash
tar -xzf data/backups/taxseason_backup_YYYYMMDD_HHMMSS.tar.gz -C /tmp
```

2. Restore the MongoDB database:
```bash
mongorestore --db taxseason /tmp/mongodb_dump_YYYYMMDD_HHMMSS/taxseason
```

3. Restore configuration files if needed:
```bash
cp /tmp/config_YYYYMMDD_HHMMSS/.env* ./
```

### Manual Backup Restore

If you created a manual backup:

1. Extract your backup:
```bash
tar -xzf ~/taxseason_backup_YYYYMMDD_HHMMSS.tar.gz -C /tmp
```

2. Restore the MongoDB database:
```bash
mongorestore --db taxseason /tmp/taxseason_mongodb_backup/taxseason
```

3. Restore configuration files:
```bash
cp /tmp/taxseason_config_backup/.env* ./
```

## Verifying Your Restore

After restoring:

1. Start the application:
```bash
bash scripts/start-local.sh
```

2. Log in and verify:
   - Your user account works
   - Wallet connections are present
   - Transaction history is complete
   - Tax reports are accessible

## Backup Best Practices

1. **Regular Schedule**: Create backups on a consistent schedule
2. **Multiple Locations**: Store copies in different physical or cloud locations
3. **Retention Policy**: Keep several historical backups
4. **Verification**: Periodically verify that backups can be restored
5. **Encryption**: Consider encrypting backups with sensitive financial data
6. **Documentation**: Keep notes about when backups were made

## Troubleshooting Restore Issues

### MongoDB Restore Errors

**Issue**: Errors during mongorestore operation.

**Solution**:
1. Ensure MongoDB is running
2. Check if the database already exists (you may need to drop it first)
3. Verify the backup files are not corrupted

### Configuration Conflicts

**Issue**: Configuration files don't match your current setup.

**Solution**:
1. Review the restored .env files
2. Update any paths or settings that need to be changed for your current environment
3. Merge changes rather than overwriting if you've made custom modifications

### Application Won't Start After Restore

**Solution**:
1. Check server logs for errors
2. Verify MongoDB connection string still works
3. Confirm all environment variables are set correctly

---

Remember that consistent backups are your best protection against data loss. Establish a regular backup routine to ensure your tax and transaction data remains safe. 