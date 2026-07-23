import { Router } from 'express';
import passport from 'passport';
import { getNeonPool } from '../../lib/neon.js';
import { hashPassword } from './google.js';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

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
  (req, res) => {
    const user = req.user as any;
    if (user && user.profile_completed === false) {
      return res.redirect(`${FRONTEND_URL}/complete-profile`);
    }
    return res.redirect(`${FRONTEND_URL}/app`);
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

  if (!mlbb_uid || !mlbb_sid || !mlbb_nickname) {
    return res.status(400).json({ success: false, error: 'MLBB User ID, Server ID, and verified nickname are required.' });
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
        `INSERT INTO users (email, password_hash, name, mlbb_uid, mlbb_sid, mlbb_nickname, profile_completed, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW())
         RETURNING id, google_id, email, name, avatar_url, mlbb_uid, mlbb_sid, mlbb_nickname, profile_completed`,
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
    const user = req.user as any;
    return res.json({
      authenticated: true,
      user: {
        id: user.id,
        google_id: user.google_id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        mlbb_uid: user.mlbb_uid,
        mlbb_sid: user.mlbb_sid,
        mlbb_nickname: user.mlbb_nickname,
        profile_completed: user.profile_completed ?? false,
        bio: user.bio ?? '',
        favorite_role: user.favorite_role ?? '',
        showcase_hero: user.showcase_hero ?? '',
        profile_banner: user.profile_banner ?? 'default',
        membership_plan: user.membership_plan ?? 'free',
        membership_status: user.membership_status ?? 'inactive',
        membership_started_at: user.membership_started_at ?? null,
        membership_expires_at: user.membership_expires_at ?? null,
        created_at: user.created_at ?? null,
      },
    });
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

// ─── Complete Profile (Google OAuth users) ───

router.post('/complete-profile', async (req, res): Promise<any> => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, error: 'Login diperlukan.' });
  }

  const user = req.user as any;
  const { name, mlbb_uid, mlbb_sid, mlbb_nickname } = req.body;

  const trimmedName = (name || '').trim();
  const trimmedUid = (mlbb_uid || '').trim();
  const trimmedSid = (mlbb_sid || '').trim();
  const trimmedNickname = typeof mlbb_nickname === 'string' ? mlbb_nickname.trim() : '';

  if (!trimmedName) {
    return res.status(400).json({ success: false, error: 'Nama tidak boleh kosong.' });
  }
  if (!trimmedUid) {
    return res.status(400).json({ success: false, error: 'MLBB User ID tidak boleh kosong.' });
  }
  if (!trimmedSid) {
    return res.status(400).json({ success: false, error: 'MLBB Server ID tidak boleh kosong.' });
  }
  if (!/^\d{5,20}$/.test(trimmedUid)) {
    return res.status(400).json({ success: false, error: 'MLBB User ID harus berupa angka 5-20 digit.' });
  }
  if (!/^\d{1,10}$/.test(trimmedSid)) {
    return res.status(400).json({ success: false, error: 'MLBB Server ID harus berupa angka 1-10 digit.' });
  }

    try {
      const pool = getNeonPool();
      const client = await pool.connect();
      try {
        await client.query(
        `UPDATE users
         SET name = $1, mlbb_uid = $2, mlbb_sid = $3, mlbb_nickname = $4, profile_completed = TRUE, updated_at = NOW()
         WHERE id = $5`,
        [trimmedName, trimmedUid, trimmedSid, trimmedNickname || null, user.id]
      );

      // Re-fetch the full user row
      const result = await client.query(
        `SELECT id, google_id, email, name, avatar_url, mlbb_uid, mlbb_sid, mlbb_nickname, profile_completed
         FROM users WHERE id = $1`,
        [user.id]
      );

      const updatedUser = result.rows[0];

      // Update the session user data
      req.login(updatedUser, (loginErr) => {
        if (loginErr) {
          console.error('[complete-profile] Session refresh failed:', loginErr.message);
        }
        return res.json({
          success: true,
          user: {
            id: updatedUser.id,
            google_id: updatedUser.google_id,
            email: updatedUser.email,
            name: updatedUser.name,
            avatar_url: updatedUser.avatar_url,
            mlbb_uid: updatedUser.mlbb_uid,
            mlbb_sid: updatedUser.mlbb_sid,
            mlbb_nickname: updatedUser.mlbb_nickname,
            profile_completed: updatedUser.profile_completed,
          },
        });
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[complete-profile] Error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

export default router;
