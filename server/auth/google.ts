import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { getNeonPool } from '../../lib/neon.js';

export interface AuthUser {
  id: number;
  google_id: string | null;
  email: string;
  name: string | null;
  avatar_url: string | null;
  password_hash?: string | null;
  mlbb_uid?: string | null;
  mlbb_sid?: string | null;
  mlbb_nickname?: string | null;
}

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function configurePassport(): void {
  // ─── Local Strategy (email + password) ───
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const pool = getNeonPool();
          const client = await pool.connect();
          try {
            const result = await client.query(
              'SELECT id, google_id, email, name, avatar_url, password_hash FROM users WHERE email = $1',
              [email.toLowerCase().trim()]
            );

            if (result.rows.length === 0) {
              return done(null, false, { message: 'No account found with this email.' });
            }

            const user = result.rows[0] as AuthUser;

            if (!user.password_hash) {
              return done(null, false, {
                message: 'This account uses Google Sign-In. Please log in with Google.',
              });
            }

            const valid = await comparePassword(password, user.password_hash);
            if (!valid) {
              return done(null, false, { message: 'Incorrect password.' });
            }

            const { password_hash, ...safeUser } = user;
            return done(null, safeUser as AuthUser);
          } finally {
            client.release();
          }
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );

  // ─── Google Strategy ───
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    console.warn('[auth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth disabled.');
  } else {
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
  }

  // ─── Serialize / Deserialize ───
  passport.serializeUser((user, done) => {
    done(null, (user as AuthUser).id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const pool = getNeonPool();
      const client = await pool.connect();
      try {
        const result = await client.query(
          'SELECT id, google_id, email, name, avatar_url, mlbb_uid, mlbb_sid, mlbb_nickname FROM users WHERE id = $1',
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

  console.log('[auth] Passport strategies configured (Local + Google).');
}
