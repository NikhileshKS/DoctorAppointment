import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Remove any existing listeners to prevent duplicates
        mongoose.connection.removeAllListeners();
        
        // Set up connection event listeners
        mongoose.connection.once('connecting', () => {
            console.log('Attempting to connect to MongoDB...');
        });
        
        mongoose.connection.once('connected', () => {
            console.log('✅MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectDB;