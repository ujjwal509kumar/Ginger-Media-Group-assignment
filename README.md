# LinkVault
Secure bookmark management. Save, organize, and access your digital world with a single click.
## How to run Locally

Clone the project

```bash
  git clone https://github.com/ujjwal509kumar/Ginger-Media-Group-assignment
  cd Ginger-Media-Group-assignment
```

Install dependencies

```bash
  npm install
```

Setup Environment Variables

```bash
  DATABASE_URL=your mongodb database url
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your clerk public publishable key
  CLERK_SECRET_KEY=your clerk secret key
  NODE_ENV=production
```

Start the  server

```bash
  npm run dev
```
## Note

IMPORTANT

- Authentication Setup: This project requires a Clerk account. If you don't have one, head over to clerk.com, create a free account, and generate your API keys. These keys must be added to your .env file for the application to function.

NOTE

- Performance: Since this project utilizes a free-tier MongoDB instance hosted online, you might experience a slight delay in initial data fetching or database operations. This is due to the cold-start and resource limitations of the free hosting environment.