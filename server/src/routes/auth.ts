import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'بيانات ناقصة' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminHash || !jwtSecret) {
      return res.status(500).json({ success: false, message: 'خطأ في إعدادات السيرفر' });
    }

    // Check email
    if (email.toLowerCase().trim() !== adminEmail.toLowerCase()) {
      return res.status(401).json({ success: false, message: 'بيانات خاطئة' });
    }

    // Check password with bcrypt
    const validPassword = await bcrypt.compare(password, adminHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'بيانات خاطئة' });
    }

    // Generate JWT
    const token = jwt.sign(
      { role: 'admin', email: adminEmail },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Set secure cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('admin_token');
  return res.json({ success: true });
});

router.get('/verify', (req: Request, res: Response) => {
  try {
    const token = req.cookies?.admin_token;
    const jwtSecret = process.env.JWT_SECRET;

    if (!token || !jwtSecret) {
      return res.status(401).json({ authenticated: false });
    }

    jwt.verify(token, jwtSecret);
    return res.json({ authenticated: true });

  } catch {
    return res.status(401).json({ authenticated: false });
  }
});

export default router;
