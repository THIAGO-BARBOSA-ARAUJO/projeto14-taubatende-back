import express from 'express';
import { SignUp, Login } from "../controllers/users.controllers.js";
const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', Login);

export default router;