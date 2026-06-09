import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate';
import { authGuard } from '../../middlewares/authGuard';
import { registerSchema, loginSchema } from './auth.schemas';
import { register, login, logout, me, getAllUsers } from './auth.controller';
import { roleGuard } from '../../middlewares/roleGuard';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  message: { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
});

router.use(authLimiter);

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authGuard, me);
router.get('/users', authGuard, roleGuard('ADMIN'), getAllUsers);

export default router;
