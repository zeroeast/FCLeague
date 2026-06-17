// ────────────────────────────────────────────
// auth.route.js
// ────────────────────────────────────────────

import { Router } from 'express';
import { handleRegister, handleLogin, handleLogout } from './auth.controller.js';

const router = Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);

export default router;
