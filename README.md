# Jobit

[Existing README content...]

## 🗄️ Database Setup

### Prerequisites
- PostgreSQL installed and running
- Environment variables configured

### Database Configuration
1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL` with your PostgreSQL credentials
3. Run database migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Optional: Prisma Studio
To view and manage database records:
```bash
npm run prisma:studio
```

## Database Schema
- User model with authentication details
- SavedJob model for tracking favorite jobs
- Supports email verification, user roles, and profile information