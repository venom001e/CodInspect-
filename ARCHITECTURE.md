# Authentication System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Signup     │  │    Login     │  │   Dashboard  │          │
│  │    Page      │  │     Page     │  │     Page     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Middleware                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  • Session Validation                                      │  │
│  │  • Route Protection                                        │  │
│  │  • Token Refresh                                           │  │
│  │  • Redirect Logic                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js App Router                            │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  Client          │  │  Server          │                     │
│  │  Components      │  │  Components      │                     │
│  │  ┌────────────┐  │  │  ┌────────────┐  │                     │
│  │  │ Auth Forms │  │  │  │ Dashboard  │  │                     │
│  │  │ UI         │  │  │  │ Pages      │  │                     │
│  │  └────────────┘  │  │  └────────────┘  │                     │
│  └──────────────────┘  └──────────────────┘                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ /api/auth/   │  │ /api/auth/   │  │ /api/auth/   │          │
│  │   logout     │  │     me       │  │  callback    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         └──────────────────┴──────────────────┘                   │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Authentication Service                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  • signUp()          - User registration                   │  │
│  │  • signIn()          - User login                          │  │
│  │  • signOut()         - User logout                         │  │
│  │  • resetPassword()   - Password reset                      │  │
│  │  • getSession()      - Session retrieval                   │  │
│  │  • refreshSession()  - Token refresh                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Validation Layer                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  • Email Validation                                        │  │
│  │  • Password Strength Validation                            │  │
│  │  • Form Validation                                         │  │
│  │  • Input Sanitization                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Client Layer                         │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  Browser Client  │  │  Server Client   │                     │
│  │  (Client-side)   │  │  (Server-side)   │                     │
│  └──────────────────┘  └──────────────────┘                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Backend                              │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  Supabase Auth   │  │  PostgreSQL DB   │                     │
│  │  ┌────────────┐  │  │  ┌────────────┐  │                     │
│  │  │ JWT Tokens │  │  │  │ Users      │  │                     │
│  │  │ Sessions   │  │  │  │ Profiles   │  │                     │
│  │  │ Email      │  │  │  │ Metadata   │  │                     │
│  │  └────────────┘  │  │  └────────────┘  │                     │
│  └──────────────────┘  └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration Flow
```
User → SignUpForm → Validation → Auth Service → Supabase Auth
                                                      ↓
                                            Create User Account
                                                      ↓
                                            Send Confirmation Email
                                                      ↓
                                            Create Session (JWT)
                                                      ↓
                                            Set HTTP-only Cookie
                                                      ↓
                                            Redirect to Dashboard
```

### 2. User Login Flow
```
User → LoginForm → Validation → Auth Service → Supabase Auth
                                                     ↓
                                          Verify Credentials
                                                     ↓
                                          Create Session (JWT)
                                                     ↓
                                          Set HTTP-only Cookie
                                                     ↓
                                          Redirect to Dashboard
```

### 3. Password Reset Flow
```
User → ForgotPasswordForm → Validation → Auth Service → Supabase Auth
                                                              ↓
                                                   Send Reset Email
                                                              ↓
User Clicks Link → ResetPasswordForm → Validation → Auth Service
                                                              ↓
                                                   Update Password
                                                              ↓
                                                   Redirect to Login
```

### 4. Protected Route Access
```
User Request → Middleware → Validate Session → Supabase Auth
                                                      ↓
                                          Session Valid?
                                                      ↓
                                    Yes ←──────────────┴──────────→ No
                                     ↓                               ↓
                              Allow Access                  Redirect to Login
                                     ↓
                              Render Dashboard
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                             │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Input Validation                                       │
│  • Email format validation                                       │
│  • Password strength requirements                                │
│  • Form completeness checks                                      │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Input Sanitization                                     │
│  • Remove HTML tags                                              │
│  • Remove JavaScript protocols                                   │
│  • Remove event handlers                                         │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: Session Security                                       │
│  • HTTP-only cookies (XSS protection)                            │
│  • Secure flag (HTTPS-only)                                      │
│  • SameSite flag (CSRF protection)                               │
├─────────────────────────────────────────────────────────────────┤
│  Layer 4: Route Protection                                       │
│  • Middleware session validation                                 │
│  • Protected route enforcement                                   │
│  • Automatic redirects                                           │
├─────────────────────────────────────────────────────────────────┤
│  Layer 5: Backend Security (Supabase)                            │
│  • Password hashing (bcrypt)                                     │
│  • JWT token generation                                          │
│  • Database security (RLS)                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction

```
┌──────────────────────────────────────────────────────────────────┐
│                    Component Hierarchy                            │
│                                                                   │
│  App                                                              │
│  ├── (auth) Route Group                                          │
│  │   ├── /signup                                                 │
│  │   │   └── SignUpForm                                          │
│  │   │       └── PasswordStrengthIndicator                       │
│  │   ├── /login                                                  │
│  │   │   └── LoginForm                                           │
│  │   ├── /forgot-password                                        │
│  │   │   └── ForgotPasswordForm                                  │
│  │   └── /reset-password                                         │
│  │       └── ResetPasswordForm                                   │
│  │           └── PasswordStrengthIndicator                       │
│  │                                                                │
│  ├── /dashboard (Protected)                                      │
│  │   └── DashboardPage                                           │
│  │                                                                │
│  └── /api/auth                                                   │
│      ├── /logout                                                 │
│      ├── /me                                                     │
│      └── /callback                                               │
│                                                                   │
│  Middleware (Global)                                             │
│  └── Session Validation & Route Protection                       │
└──────────────────────────────────────────────────────────────────┘
```

## Testing Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Testing Strategy                               │
│                                                                   │
│  Property-Based Tests (fast-check)                               │
│  ├── Email Validation Properties                                 │
│  │   ├── Invalid formats rejected                                │
│  │   └── Valid formats accepted                                  │
│  ├── Password Validation Properties                              │
│  │   ├── Weak passwords rejected                                 │
│  │   └── Strong passwords accepted                               │
│  └── Form Validation Properties                                  │
│      ├── Incomplete forms rejected                               │
│      └── Complete forms accepted                                 │
│                                                                   │
│  Unit Tests (Jest + Testing Library)                             │
│  ├── Component Tests                                             │
│  │   ├── Form rendering                                          │
│  │   ├── User interactions                                       │
│  │   └── Error display                                           │
│  └── Integration Tests                                           │
│      ├── Authentication flows                                    │
│      ├── Route protection                                        │
│      └── Session management                                      │
└──────────────────────────────────────────────────────────────────┘
```

## Environment Configuration

```
┌──────────────────────────────────────────────────────────────────┐
│                  Environment Variables                            │
│                                                                   │
│  Development (.env.local)                                         │
│  ├── NEXT_PUBLIC_SUPABASE_URL                                    │
│  ├── NEXT_PUBLIC_SUPABASE_ANON_KEY                               │
│  ├── SUPABASE_SERVICE_ROLE_KEY                                   │
│  └── NEXT_PUBLIC_APP_URL=http://localhost:3000                   │
│                                                                   │
│  Production (Vercel Environment Variables)                        │
│  ├── NEXT_PUBLIC_SUPABASE_URL                                    │
│  ├── NEXT_PUBLIC_SUPABASE_ANON_KEY                               │
│  ├── SUPABASE_SERVICE_ROLE_KEY                                   │
│  └── NEXT_PUBLIC_APP_URL=https://yourdomain.com                  │
└──────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

1. **Next.js App Router** - Modern routing with Server Components
2. **Supabase Auth** - Managed authentication service
3. **HTTP-only Cookies** - Secure session storage
4. **Property-Based Testing** - Comprehensive validation testing
5. **TypeScript** - Type safety throughout
6. **Middleware Protection** - Centralized route security
7. **Client/Server Separation** - Clear boundaries for auth operations
8. **Input Sanitization** - Defense against injection attacks
9. **Generic Error Messages** - Prevent information leakage
10. **Password Strength Indicator** - Real-time user feedback
