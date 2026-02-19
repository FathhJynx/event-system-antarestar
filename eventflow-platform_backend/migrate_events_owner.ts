import { sequelize } from './src/config/database.js';

async function migrate() {
    try {
        console.log('Starting migration: Adding user_id to events...');

        // Add column
        await sequelize.query('ALTER TABLE events ADD COLUMN user_id BIGINT NULL AFTER category_id');
        console.log('Column added.');

        // Add foreign key
        await sequelize.query('ALTER TABLE events ADD CONSTRAINT fk_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL');
        console.log('Foreign key constraint added.');

        // Migrate existing data (Optional: Assign existing events to a default user, e.g., ID 1)
        // For fathan's data, we can see GBK venue events are currently disconnected.
        // Let's assign all existing events to user ID 1 (fathan) for now as a starting point.
        await sequelize.query('UPDATE events SET user_id = 1 WHERE user_id IS NULL');
        console.log('Existing events updated to user_id = 1.');

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
