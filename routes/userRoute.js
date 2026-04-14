import express from 'express';
import { registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,createPaymentIntent,confirmPayment,forgotPassword,resetPassword} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authUser, getProfile);
userRouter.post('/update', authUser, upload.single('image'), updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/create-payment-intent', authUser, createPaymentIntent);
userRouter.post('/confirm-payment', authUser, confirmPayment);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

export default userRouter;