import express from 'express' 
import cars from './cars.js'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import cors from 'cors'

// app config
const app = express()
const port = process.env.PORT || 4000

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server started at port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// middlewares
app.use(express.json())
app.use(cors())

// api routes
app.get('/', (req, res) => {
    res.send('API is Working')
})

app.get('/cars', (req, res) => {
    res.json(cars) 
})

connectDB().then(() => {
    app.listen(port,() => console.log("Server started at port " , port))
})