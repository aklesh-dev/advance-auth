import express from 'express';
import {  signin, signout, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/test', (req, res) => {res.send('Hello World, from the auth route!')});

router.get('/signup', signup);
router.get('/signin', signin);
router.get('/signout', signout);


export default router;