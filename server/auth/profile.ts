import { Router } from 'express';
import { getNeonPool } from '../../lib/neon.js';

const router = Router();

const ALLOWED_ROLES = ['', 'Jungler', 'Roamer', 'EXP Lane', 'Gold Lane', 'Mid Lane', 'Flex'];
const ALLOWED_BANNERS = ['default', 'dark-command-center', 'cyan-arena', 'purple-esports', 'showcase-hero'];

router.patch('/api/profile', async (req, res): Promise<any> => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, error: 'Login diperlukan.' });
  }

  const user = req.user as any;
  const { name, bio, favorite_role, showcase_hero, profile_banner } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string') {
      return res.status(400).json({ success: false, error: 'Nama harus berupa string.' });
    }
  }

  if (bio !== undefined) {
    if (typeof bio !== 'string') {
      return res.status(400).json({ success: false, error: 'Bio harus berupa string.' });
    }
    if (bio.length > 300) {
      return res.status(400).json({ success: false, error: 'Bio maksimal 300 karakter.' });
    }
  }

  if (favorite_role !== undefined) {
    if (!ALLOWED_ROLES.includes(favorite_role)) {
      return res.status(400).json({ success: false, error: 'Role tidak valid.' });
    }
  }

  if (showcase_hero !== undefined) {
    if (typeof showcase_hero !== 'string') {
      return res.status(400).json({ success: false, error: 'Showcase hero harus berupa string.' });
    }
  }

  if (profile_banner !== undefined) {
    if (!ALLOWED_BANNERS.includes(profile_banner)) {
      return res.status(400).json({ success: false, error: 'Banner tidak valid.' });
    }
  }

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(name.trim() || null);
  }
  if (bio !== undefined) {
    setClauses.push(`bio = $${paramIndex++}`);
    values.push(bio.trim() || null);
  }
  if (favorite_role !== undefined) {
    setClauses.push(`favorite_role = $${paramIndex++}`);
    values.push(favorite_role || null);
  }
  if (showcase_hero !== undefined) {
    setClauses.push(`showcase_hero = $${paramIndex++}`);
    values.push(showcase_hero.trim() || null);
  }
  if (profile_banner !== undefined) {
    setClauses.push(`profile_banner = $${paramIndex++}`);
    values.push(profile_banner);
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ success: false, error: 'Tidak ada data yang diperbarui.' });
  }

  setClauses.push(`updated_at = NOW()`);
  values.push(user.id);

  const query = `
    UPDATE users
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, email, name, avatar_url, mlbb_uid, mlbb_sid, mlbb_nickname,
              profile_completed, bio, favorite_role, showcase_hero, profile_banner,
              membership_plan, membership_status, created_at
  `;

  try {
    const pool = getNeonPool();
    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'User tidak ditemukan.' });
      }
      const updatedUser = result.rows[0];

      req.login(updatedUser, (loginErr) => {
        if (loginErr) {
          console.error('[profile] Session refresh failed:', loginErr.message);
        }
        return res.json({ success: true, user: updatedUser });
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[profile] Update error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

router.post('/api/profile/mlbb/disconnect', async (req, res): Promise<any> => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, error: 'Login diperlukan.' });
  }

  const user = req.user as any;

  try {
    const pool = getNeonPool();
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE users
         SET mlbb_uid = NULL, mlbb_sid = NULL, mlbb_nickname = NULL, updated_at = NOW()
         WHERE id = $1
         RETURNING id, email, name, avatar_url, mlbb_uid, mlbb_sid, mlbb_nickname,
                   profile_completed, bio, favorite_role, showcase_hero, profile_banner,
                   membership_plan, membership_status, created_at`,
        [user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'User tidak ditemukan.' });
      }

      const updatedUser = result.rows[0];

      req.login(updatedUser, (loginErr) => {
        if (loginErr) {
          console.error('[profile] Session refresh failed:', loginErr.message);
        }
        return res.json({ success: true, user: updatedUser });
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[profile] MLBB disconnect error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

export default router;
