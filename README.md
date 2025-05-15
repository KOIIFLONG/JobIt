# JobIt

## Database Setup

### Prerequisites
- PostgreSQL installed
- Database created for the project

### Configuration
1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL` with your PostgreSQL connection details

### Database Commands
- Generate Prisma Client: `npm run prisma:generate`
- Run Migrations: `npm run prisma:migrate`
- Open Database Studio: `npm run prisma:studio`