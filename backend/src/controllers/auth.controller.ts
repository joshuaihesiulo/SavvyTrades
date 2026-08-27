import type { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { generateToken, verifyToken } from "../services/token.service.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/email.service.js";


const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await generateToken(user.id, 'email_verify');
    await sendVerificationEmail(user.email, user.name, token);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email }});
    if (!user){
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret){
      return res.status(500).json({ error: 'JWT secret not found' });
    }
    const token = jwt.sign(
      {userId: user.id, email: user.email },
      jwtSecret,
      {expiresIn: '7d'}
    );
    
    res.status(200).json({ message: 'Login successful', token});
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' });
    }

    const userId = await verifyToken(token, 'email_verify');
    if (!userId) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ verified: true });

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Prevent email enumeration
      return res.status(200).json({ message: 'If that email exists, a verification link has been sent.' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'This email is already verified' });
    }

    const token = await generateToken(user.id, 'email_verify');
    await sendVerificationEmail(user.email, user.name, token);

    res.status(200).json({ message: 'If that email exists, a verification link has been sent.' });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Prevent email enumeration
      return res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
    }

    const token = await generateToken(user.id, 'password_reset');
    await sendPasswordResetEmail(user.email, user.name, token);

    res.status(200).json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;

    const userId = await verifyToken(token, 'password_reset');
    if (!userId) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as { auth?: { userId: string } }).auth?.userId
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password']}
    });

    if (!user){
      return res.status(404).json({ error: 'User not found' })
    };

    return res.status(200).json({  user });
  }catch(error){
    next(error);
  }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { name, email } = req.body
    const userId = (req as { auth?: { userId: string } }).auth?.userId
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingUser = await User.findOne({
      where: {
        email, 
        id: { [Op.ne]: userId}
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use by another account' });
    };
    
    //update fields
    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
      },
    });

  }catch (error){
    next(error);
  }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const userId = (req as { auth?: { userId: string } }).auth?.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch){
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const password = await bcrypt.hash(newPassword, 10);
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error){
    next(error);
  }
}

export { registerUser, loginUser, verifyEmail, resendVerification, forgotPassword, resetPassword, getMe, updateProfile, changePassword };
