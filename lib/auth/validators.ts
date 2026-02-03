export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

/**
 * Validates email format using RFC 5322 compliant pattern
 * @param email - Email address to validate
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateEmail(email: string): ValidationResult {
    const errors: Record<string, string> = {};

    if (!email || email.trim() === '') {
        errors.email = 'Email is required';
        return { isValid: false, errors };
    }

    // RFC 5322 compliant email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address';
        return { isValid: false, errors };
    }

    return { isValid: true, errors: {} };
}

/**
 * Validates password strength requirements
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param password - Password to validate
 * @returns ValidationResult with isValid flag and specific requirement messages
 */
export function validatePassword(password: string): ValidationResult {
    const errors: Record<string, string> = {};
    const requirements: string[] = [];

    if (!password || password.trim() === '') {
        errors.password = 'Password is required';
        return { isValid: false, errors };
    }

    if (password.length < 8) {
        requirements.push('at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
        requirements.push('one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        requirements.push('one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        requirements.push('one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        requirements.push('one special character');
    }

    if (requirements.length > 0) {
        errors.password = `Password must contain ${requirements.join(', ')}`;
        return { isValid: false, errors };
    }

    return { isValid: true, errors: {} };
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 * @param input - User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

export interface SignUpFormData {
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface ResetPasswordFormData {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

/**
 * Validates signup form data
 * @param data - Signup form data
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateSignUpForm(data: SignUpFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Sanitize inputs
    const email = sanitizeInput(data.email);
    const password = data.password; // Don't sanitize password

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        Object.assign(errors, emailValidation.errors);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        Object.assign(errors, passwordValidation.errors);
    }

    // Validate password confirmation
    if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Validates login form data
 * @param data - Login form data
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateLoginForm(data: LoginFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // Sanitize email
    const email = sanitizeInput(data.email);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        Object.assign(errors, emailValidation.errors);
    }

    // Check password is not empty
    if (!data.password || data.password.trim() === '') {
        errors.password = 'Password is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Validates password reset form data
 * @param data - Reset password form data
 * @returns ValidationResult with isValid flag and error messages
 */
export function validateResetPasswordForm(data: ResetPasswordFormData): ValidationResult {
    const errors: Record<string, string> = {};

    // If email is provided (reset request), validate it
    if (data.email !== undefined) {
        const email = sanitizeInput(data.email);
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            Object.assign(errors, emailValidation.errors);
        }
    }

    // If password is provided (reset confirmation), validate it
    if (data.password !== undefined) {
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.isValid) {
            Object.assign(errors, passwordValidation.errors);
        }

        // Validate password confirmation
        if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
