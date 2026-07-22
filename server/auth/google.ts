import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getNeonPool } from '../../lib/neon.js';

export interface AuthUser {
  id: number;
  google_id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

export function configurePassport(): void {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    console.warn('[auth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth disabled.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const pool = getNeonPool();
          const client = await pool.connect();
          try {
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value ?? '';
            const name = profile.displayName ?? null;
            const avatarUrl = profile.photos?.[0]?.value ?? null;

            const upsertResult = await client.query(
              `INSERT INTO users (google_id, email, name, avatar_url, updated_at)
               VALUES ($1, $2, $3, $4, NOW())
               ON CONFLICT (google_id) DO UPDATE SET
                 email = EXCLUDED.email,
                 name = EXCLUDED.name,
                 avatar_url = EXCLUDED.avatar_url,
                 updated_at = NOW()
               RETURNING id, google_id, email, name, avatar_url`,
              [googleId, email, name, avatarUrl]
            );

            const user: AuthUser = upsertResult.rows[0];
            return done(null, user);
          } finally {
            client.release();
          }
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, (user as AuthUser).id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const pool = getNeonPool();
      const client = await pool.connect();
      try {
        const result = await client.query(
          'SELECT id, google_id, email, name, avatar_url FROM users WHERE id = $1',
          [id]
        );
        done(null, result.rows[0] || null);
      } finally {
        client.release();
      }
    } catch (err) {
      done(err as Error, null);
    }
  });

  console.log('[auth] Passport Google Strategy configured.');
}
