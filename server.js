import express from 'express' 
import cars from './cars.js'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import cors from 'cors'

// app config
const app = express()
const port = process.env.PORT || 4000

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

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(port, () => console.log(`Server started at port ${port}`))
}).catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});