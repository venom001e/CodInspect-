import { NextResponse } from 'next/server';
import { signOut } from '@/lib/auth/auth-service';

export async function POST() {
    try {
        const result = await signOut();

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        // Redirect to login page after logout
        return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL!));
    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred during logout' },
            { status: 500 }
        );
    }
}
