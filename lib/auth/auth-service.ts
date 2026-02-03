import { createClient } from './supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error?: string;
}

export interface AuthError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

/**
 * Maps Supabase errors to user-friendly messages
 */
function mapAuthError(error: any): string {
    const errorMessage = error?.message || '';

    // Email already exists
    if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        return 'An account with this email already exists';
    }

    // Invalid credentials
    if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('invalid_credentials')) {
        return 'Invalid email or password';
    }

    // Weak password
    if (errorMessage.includes('Password') && errorMessage.includes('weak')) {
        return 'Password does not meet requirements';
    }

    // Invalid email
    if (errorMessage.includes('email')) {
        return 'Please enter a valid email address';
    }

    // Session expired
    if (errorMessage.includes('expired') || errorMessage.includes('session')) {
        return 'Your session has expired. Please log in again.';
    }

    // Invalid reset token
    if (errorMessage.includes('token') && (errorMessage.includes('invalid') || errorMessage.includes('expired'))) {
        return 'This password reset link is invalid or has expired';
    }

    // Rate limited
    if (errorMessage.includes('rate') || errorMessage.includes('too many')) {
        return 'Too many attempts. Please try again later.';
    }

    // Generic server error
    return 'An error occurred. Please try again later.';
}

/**
 * User registration
 * Creates a new user account with email and password
 * @param email - User email
 * @param password - User password
 * @returns AuthResponse with user and session
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
    try {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            },
        });

        if (error) {
            return {
                user: null,
                session: null,
                error: mapAuthError(error),
            };
        }

        return {
            user: data.user,
            session: data.session,
        };
    } catch (error) {
        return {
            user: null,
            session: null,
            error: mapAuthError(error),
        };
    }
}

/**
 * User login
 * Authenticates user with email and password
 * @param email - User email
 * @param password - User password
 * @returns AuthResponse with user and session
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
    try {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return {
                user: null,
                session: null,
                error: mapAuthError(error),
            };
        }

        return {
            user: data.user,
            session: data.session,
        };
    } catch (error) {
        return {
            user: null,
            session: null,
            error: mapAuthError(error),
        };
    }
}

/**
 * Google login
 * Authenticates user with Google OAuth
 * @returns AuthResponse with error if any (redirects on success)
 */
export async function signInWithGoogle(): Promise<{ error?: string }> {
    try {
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
            },
        });

        if (error) {
            return { error: mapAuthError(error) };
        }

        return {};
    } catch (error) {
        return { error: mapAuthError(error) };
    }
}

/**
 * User logout
 * Signs out the current user and destroys the session
 */
export async function signOut(): Promise<{ error?: string }> {
    try {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            return { error: mapAuthError(error) };
        }

        return {};
    } catch (error) {
        return { error: mapAuthError(error) };
    }
}

/**
 * Password reset request
 * Sends a password reset email to the user
 * @param email - User email
 * @returns Generic success message (doesn't reveal if email exists)
 */
export async function resetPasswordRequest(email: string): Promise<{ error?: string }> {
    try {
        const supabase = createClient();

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        });

        // Always return success to prevent email enumeration
        // Even if the email doesn't exist, we don't want to reveal that
        if (error && !error.message.includes('not found')) {
            return { error: mapAuthError(error) };
        }

        return {};
    } catch (error) {
        // Return generic success to prevent email enumeration
        return {};
    }
}

/**
 * Password reset confirmation
 * Updates the user's password using a reset token
 * @param newPassword - New password
 * @returns Success or error
 */
export async function resetPassword(newPassword: string): Promise<{ error?: string }> {
    try {
        const supabase = createClient();

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return { error: mapAuthError(error) };
        }

        return {};
    } catch (error) {
        return { error: mapAuthError(error) };
    }
}

/**
 * Get current session
 * Retrieves the current authenticated session
 * @returns Session or null
 */
export async function getSession(): Promise<Session | null> {
    try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        return data.session;
    } catch (error) {
        return null;
    }
}

/**
 * Get current user
 * Retrieves the current authenticated user
 * @returns User or null
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        return data.user;
    } catch (error) {
        return null;
    }
}

/**
 * Refresh session
 * Refreshes the current session token
 * @returns Updated session or null
 */
export async function refreshSession(): Promise<Session | null> {
    try {
        const supabase = createClient();
        const { data } = await supabase.auth.refreshSession();
        return data.session;
    } catch (error) {
        return null;
    }
}
