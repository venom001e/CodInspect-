import * as fc from 'fast-check';
import { validateEmail, validatePassword, validateSignUpForm } from '@/lib/auth/validators';

describe('Authentication Validators - Property-Based Tests', () => {
    // Feature: authentication-system, Property 3: Invalid Email Format Rejected
    // Validates: Requirements 1.3, 6.2
    describe('Property 3: Invalid Email Format Rejected', () => {
        it('should reject emails without @ symbol', () => {
            fc.assert(
                fc.property(
                    fc.string().filter((s) => !s.includes('@')),
                    (invalidEmail) => {
                        const result = validateEmail(invalidEmail);
                        expect(result.isValid).toBe(false);
                        expect(result.errors.email).toBeDefined();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject emails without domain', () => {
            fc.assert(
                fc.property(
                    fc.string().filter((s) => s.includes('@') && !s.includes('.')),
                    (invalidEmail) => {
                        const result = validateEmail(invalidEmail);
                        expect(result.isValid).toBe(false);
                        expect(result.errors.email).toBeDefined();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should accept valid email formats', () => {
            fc.assert(
                fc.property(fc.emailAddress(), (validEmail) => {
                    const result = validateEmail(validEmail);
                    expect(result.isValid).toBe(true);
                    expect(Object.keys(result.errors).length).toBe(0);
                }),
                { numRuns: 100 }
            );
        });
    });

    // Feature: authentication-system, Property 4: Weak Password Rejected
    // Validates: Requirements 1.4, 3.4, 6.3, 6.4, 6.5, 6.6, 6.7
    describe('Property 4: Weak Password Rejected', () => {
        it('should reject passwords shorter than 8 characters', () => {
            fc.assert(
                fc.property(
                    fc.string({ maxLength: 7 }),
                    (shortPassword) => {
                        const result = validatePassword(shortPassword);
                        expect(result.isValid).toBe(false);
                        expect(result.errors.password).toBeDefined();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject passwords without uppercase letters', () => {
            fc.assert(
                fc.property(
                    fc
                        .string({ minLength: 8 })
                        .filter((s) => !/[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s)),
                    (password) => {
                        const result = validatePassword(password);
                        expect(result.isValid).toBe(false);
                        expect(result.errors.password).toContain('uppercase');
                    }
                ),
                { numRuns: 50 }
            );
        });

        it('should reject passwords without lowercase letters', () => {
            fc.assert(
                fc.property(
                    fc
                        .string({ minLength: 8 })
                        .filter((s) => !/[a-z]/.test(s) && /[A-Z]/.test(s) && /[0-9]/.test(s)),
                    (password) => {
                        const result = validatePassword(password);
                        expect(result.isValid).toBe(false);
                        expect(result.errors.password).toContain('lowercase');
                    }
                ),
                { numRuns: 50 }
            );
        });

        it('should reject passwords without numbers', () => {
            fc.assert(
                fc.property(
                    fc
                        .string({ minLength: 8 })
                        .filter((s) => !/[0-9]/.test(s) && /[A-Z]/.test(s) && /[a-z]/.test(s)),
                    (password) => {
                        const result = validatePassword(password);
                        expect(result.isValid).toBe(false);
                        expect(result.errors.password).toContain('number');
                    }
                ),
                { numRuns: 50 }
            );
        });

        it('should accept strong passwords', () => {
            // Generate strong passwords that meet all requirements
            const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            const lowerChars = 'abcdefghijklmnopqrstuvwxyz'.split('');
            const digitChars = '0123456789'.split('');
            const specialChars = '!@#$%^&*()_+-=[]{}'.split('');

            const strongPasswordArbitrary = fc
                .tuple(
                    fc.array(fc.constantFrom(...upperChars), { minLength: 1, maxLength: 3 }),
                    fc.array(fc.constantFrom(...lowerChars), { minLength: 1, maxLength: 3 }),
                    fc.array(fc.constantFrom(...digitChars), { minLength: 1, maxLength: 3 }),
                    fc.array(fc.constantFrom(...specialChars), { minLength: 1, maxLength: 3 })
                )
                .map(([upper, lower, digit, special]) =>
                    [...upper, ...lower, ...digit, ...special].join('')
                );

            fc.assert(
                fc.property(strongPasswordArbitrary, (strongPassword) => {
                    const result = validatePassword(strongPassword);
                    expect(result.isValid).toBe(true);
                    expect(Object.keys(result.errors).length).toBe(0);
                }),
                { numRuns: 100 }
            );
        });
    });

    // Feature: authentication-system, Property 5: Incomplete Registration Form Rejected
    // Validates: Requirements 1.6, 6.1
    describe('Property 5: Incomplete Registration Form Rejected', () => {
        it('should reject forms with empty email', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 8 }),
                    (password) => {
                        const result = validateSignUpForm({
                            email: '',
                            password,
                            confirmPassword: password,
                        });
                        expect(result.isValid).toBe(false);
                        expect(result.errors.email).toBeDefined();
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should reject forms with empty password', () => {
            fc.assert(
                fc.property(fc.emailAddress(), (email) => {
                    const result = validateSignUpForm({
                        email,
                        password: '',
                        confirmPassword: '',
                    });
                    expect(result.isValid).toBe(false);
                    expect(result.errors.password).toBeDefined();
                }),
                { numRuns: 100 }
            );
        });

        it('should reject forms with mismatched passwords', () => {
            fc.assert(
                fc.property(
                    fc.emailAddress(),
                    fc.string({ minLength: 8 }),
                    fc.string({ minLength: 8 }),
                    (email, password1, password2) => {
                        fc.pre(password1 !== password2); // Ensure passwords are different
                        const result = validateSignUpForm({
                            email,
                            password: password1,
                            confirmPassword: password2,
                        });
                        expect(result.isValid).toBe(false);
                        expect(result.errors.confirmPassword).toBeDefined();
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
