## Database Setup

This project uses Prisma as an ORM with PostgreSQL.

### Prerequisites
- PostgreSQL installed
- DATABASE_URL environment variable set

### Setup Steps
1. Install dependencies:
\`\`\`
npm install
\`\`\`

2. Set up your .env file with DATABASE_URL
3. Generate Prisma client:
\`\`\`
npm run prisma:generate
\`\`\`

4. Run database migrations:
\`\`\`
npm run prisma:migrate
\`\`\`