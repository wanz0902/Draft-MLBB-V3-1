import { Router } from 'express';
import passport from 'passport';
import { getNeonPool } from '../../lib/neon.js';
import { hashPassword } from './google.js';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Google OAuth ───

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}?auth_error=1`,
    session: true,
  }),
  (_req, res) => {
    res.redirect(FRONTEND_URL);
  }
);

// ─── Local Auth: Register ───

router.post('/register', async (req, res): Promise<any> => {
  const { email, password, name, mlbb_uid, mlbb_sid, mlbb_nickname } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const pool = getNeonPool();
    const client = await pool.connect();
    try {
      const existing = await client.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
      }

      const passwordHash = await hashPassword(password);
      const result = await client.query(
        `INSERT INTO users (email, password_hash, name, mlbb_uid, mlbb_sid, mlbb_nickname, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id, google_id, email, name, avatar_url, mlbb_uid, mlbb_sid, mlbb_nickname`,
        [
          normalizedEmail,
          passwordHash,
          name?.trim() || null,
          mlbb_uid?.trim() || null,
          mlbb_sid?.trim() || null,
          mlbb_nickname?.trim() || null,
        ]
      );

      const user = result.rows[0];

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: 'Registration succeeded but login failed.' });
        }
        return res.json({ success: true, user });
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[auth] Register error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ─── Local Auth: Login ───

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
    if (!user) {
      return res.status(401).json({ success: false, error: info?.message || 'Invalid email or password.' });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ success: false, error: 'Login failed.' });
      }
      return res.json({ success: true, user });
    });
  })(req, res, next);
});

// ─── Session check ───

router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  }
  return res.json({ authenticated: false, user: null });
});

// ─── Logout ───

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

export default router;
