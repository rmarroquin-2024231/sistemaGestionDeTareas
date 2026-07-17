import express from 'express';
import cors from 'cors';
import { corsOptions } from './cors.configuration.js';
import { connectDB } from './db.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import authRoutes from '../src/auth/auth.routes.js';

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;

    await connectDB();

    app.use(express.json());
    app.use(cors(corsOptions));

    app.use('/auth', authRoutes);

    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'Auth Service'
        });
    });

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Auth Service corriendo en el puerto: ${PORT}`);
        console.log(`End Point de salud: http://localhost:${PORT}/health`);
    });
};