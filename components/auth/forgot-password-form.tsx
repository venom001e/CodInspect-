'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { validateResetPasswordForm } from '@/lib/auth/validators';
import { resetPasswordRequest } from '@/lib/auth/auth-service';

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        // Validate email
        const validation = validateResetPasswordForm({ email });
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPasswordRequest(email);

            if (result.error) {
                setErrors({ general: result.error });
            } else {
                setSuccessMessage(
                    'If an account exists with this email, you will receive a password reset link shortly. Please check your inbox.'
                );
                setEmail('');
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General error message */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {errors.general}
                        </div>
                    )}

                    {/* Success message */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Email field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) {
                                    setErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.email;
                                        return newErrors;
                                    });
                                }
                            }}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                            placeholder="you@example.com"
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending reset link...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                {/* Back to login link */}
                <Link
                    href="/login"
                    className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>
            </div>
        </div>
    );
}
