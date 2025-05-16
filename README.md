# Jobit

<existing README content...>

## 🗄️ Database Setup

### Prerequisites
- PostgreSQL database
- `.env` file with `DATABASE_URL`

### Database Configuration
1. Install Prisma CLI:
```bash
npm install prisma --save-dev
```

2. Set up your database connection in `.env`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/jobit?schema=public"
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Create database migrations:
```bash
npm run prisma:migrate
```

### User Database Schema
- Users can create accounts
- Save favorite job listings
- Manage profile information
- Secure authentication with hashed passwords

<rest of the existing README content...>