import { Router } from 'express';
import { getNeonPool } from '../../lib/neon.js';

const router = Router();

router.delete('/auth/account', async (req, res): Promise<any> => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, error: 'Login diperlukan.' });
  }

  const user = req.user as any;
  const { confirmation } = req.body;

  if (confirmation !== 'DELETE') {
    return res.status(400).json({ success: false, error: 'Konfirmasi tidak valid.' });
  }

  try {
    const pool = getNeonPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM users WHERE id = $1', [user.id]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    req.logout((logoutErr) => {
      if (logoutErr) {
        console.error('[account] Logout error:', logoutErr.message);
      }
      req.session?.destroy(() => {
        res.clearCookie('connect.sid');
        return res.json({ success: true });
      });
    });
  } catch (err: any) {
    console.error('[account] Delete error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to delete account.' });
  }
});

export default router;
