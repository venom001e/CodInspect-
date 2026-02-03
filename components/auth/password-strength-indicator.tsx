'use client';

import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
    password: string;
}

interface Requirement {
    label: string;
    test: (password: string) => boolean;
}

const requirements: Requirement[] = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'One number', test: (p) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    const metRequirements = requirements.filter((req) => req.test(password));
    const strength = metRequirements.length;

    const getStrengthColor = () => {
        if (strength === 0) return 'bg-gray-200';
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        if (strength <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getStrengthLabel = () => {
        if (strength === 0) return '';
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Fair';
        if (strength <= 4) return 'Good';
        return 'Strong';
    };

    if (!password) return null;

    return (
        <div className="space-y-3">
            {/* Strength bar */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password strength</span>
                    <span className={`font-medium ${strength <= 2 ? 'text-red-600' :
                            strength <= 3 ? 'text-yellow-600' :
                                strength <= 4 ? 'text-blue-600' :
                                    'text-green-600'
                        }`}>
                        {getStrengthLabel()}
                    </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(strength / requirements.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Requirements checklist */}
            <div className="space-y-2">
                {requirements.map((req, index) => {
                    const isMet = req.test(password);
                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-2 text-sm transition-colors ${isMet ? 'text-green-600' : 'text-gray-500'
                                }`}
                        >
                            {isMet ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <X className="w-4 h-4" />
                            )}
                            <span>{req.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
