import app from './app.js';
import { sequelize } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Migrations should be run manually or via CI/CD
        // await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error: any) {
        console.error('Unable to connect to the database or start server:');
        console.error(error.message || error);
        if (error.stack) console.error(error.stack);
        process.exit(1);
    }
};

startServer();
