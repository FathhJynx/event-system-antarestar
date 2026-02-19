import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import promoCodeRoutes from './routes/promoCodeRoutes.js';
import withdrawalRoutes from './routes/withdrawalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import organizerRoutes from './routes/organizerRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/organizer', organizerRoutes);

app.get('/', (req, res) => {
    res.send('EventFlow Platform Backend is running!');
});

export default app;
