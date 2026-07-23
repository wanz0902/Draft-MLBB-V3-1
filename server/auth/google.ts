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
  profile_completed: boolean;
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

              // 1. Check if user already exists by google_id
              const existingByGoogle = await client.query(
                'SELECT id FROM users WHERE google_id = $1',
                [googleId]
              );

              if (existingByGoogle.rows.length > 0) {
                // User exists with this google_id — update profile info
                const updateResult = await client.query(
                  `UPDATE users SET email = $1, name = $2, avatar_url = $3, updated_at = NOW()
                   WHERE google_id = $4
                   RETURNING id, google_id, email, name, avatar_url, profile_completed`,
                  [email, name, avatarUrl, googleId]
                );
                return done(null, updateResult.rows[0] as AuthUser);
              }

              // 2. Check if user exists by email (e.g. registered via email/password)
              const existingByEmail = await client.query(
                'SELECT id, profile_completed FROM users WHERE email = $1',
                [email]
              );

              if (existingByEmail.rows.length > 0) {
                // Link Google account to existing email user
                const linkResult = await client.query(
                  `UPDATE users SET google_id = $1, avatar_url = COALESCE($2, avatar_url), updated_at = NOW()
                   WHERE email = $3
                   RETURNING id, google_id, email, name, avatar_url, profile_completed`,
                  [googleId, avatarUrl, email]
                );
                return done(null, linkResult.rows[0] as AuthUser);
              }

              // 3. New user — create with profile_completed = false
              const createResult = await client.query(
                `INSERT INTO users (google_id, email, name, avatar_url, profile_completed, updated_at)
                 VALUES ($1, $2, $3, $4, FALSE, NOW())
                 RETURNING id, google_id, email, name, avatar_url, profile_completed`,
                [googleId, email, name, avatarUrl]
              );

              const user: AuthUser = createResult.rows[0];
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
          'SELECT id, google_id, email, name, avatar_url, mlbb_uid, mlbb_sid, mlbb_nickname, profile_completed, bio, favorite_role, showcase_hero, profile_banner, membership_plan, membership_status, membership_started_at, membership_expires_at, created_at FROM users WHERE id = $1',
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
