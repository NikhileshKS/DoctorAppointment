// login,register,profile,profile update,Booking Appointment,cancel appointment,display appointment,payment gateway
import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// API for user registration
const registerUser =async (req, res) => {
    try {
        
        const { name, email, password } = req.body;
        // Check if user already exists
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: 'Missing Details' });
        }
        // validate email format
        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: 'Invalid Email Enter the valid email' });
        }
        // validate password strength
        if(password.length < 8){
            return res.status(400).json({success: false, message: 'Password must be at least 8 characters long' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData={
            name,
            email,
            password: hashedPassword
        }   
        
        const newUser = new userModel(userData)
        const user = await newUser.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({success: true, message: 'User registered successfully', token });

    } catch (error) {
        res.status(500).json({success: false, message: 'Registration failed' });
    }
}

export { registerUser };