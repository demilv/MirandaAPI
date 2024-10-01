const express = require('express');
import { authController } from '../controllers/auth';

const router = express.Router();

router.post('/', authController.loginUser);

export default router;
