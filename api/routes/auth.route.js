import express from 'express';
import {  signin, signout, signup, verifyEmail, forgotPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);

export default router;