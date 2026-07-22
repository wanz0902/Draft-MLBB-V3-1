import { Router } from 'express';
import passport from 'passport';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

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

router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  }
  return res.json({ authenticated: false, user: null });
});

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
