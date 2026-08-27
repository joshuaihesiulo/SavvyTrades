import 'dotenv/config';
import './types/express.js';
import app from "./app.js"
import  sequelize  from "./database/connection.js";

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET is not set in environment variables. Auth endpoints will fail.');
}

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Day 1 Server running on http://localhost:${PORT}/api/v1/health`);
    });
}

startServer();
