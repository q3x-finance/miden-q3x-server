# Miden server implementation 

This server implementation serves as a Q3x (The end-to-end privacy-first programmable asset management platform) that uses the following tech stack:

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)


# Requirements

Before you begin, you need to install the following tools:

- [Node (v18.18.1)](https://nodejs.org/en/download/package-manager)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

# Getting Started

1. Clone the repository:
   ```sh
    git clone https://github.com/Quantum3-Labs/server-base.git
    cd server-base
   ```
2. Make sure to install all dependencies by running `npm install`
3. Make sure to set environment variable `NODE_ENV` whenever you open a new terminal by running `export NODE_ENV=development`, three options for `NODE_ENV`(development, production, test), this will decide which .env file to use, .env.development, .env.production or .env.test
4. Copy the `.env.example`, according to the mode, you need to run `cp .env.example .env.development`, `cp .env.example .env.production` or `cp .env.example .env.test`
5. Before spinning up a local database, make sure you don't have a running container with the same port that will be used by server base, these ports are `6500`, `5050` and `3001`, if you have either one of the ports in used, you can check [this section](#how-to-use-custom-port-for-server-base)
6. Make sure you have docker installed and running, then run `npm run docker:db:up`, it will spin up a local database
7. Finally, run `npm run start:dev` to start the dev server
8. Visit `http://localhost:3001/api-v1` to view a list of available endpoints

# Env file for different environment
```bash
# production
cp .env.example .env.production

# development
cp .env.example .env.development

# test
cp .env.example .env.test
```

# Running the app

```bash
# development, make sure you have a local database running
npm run start:dev

# production mode
npm run start:prod
```

# [Development] Starting a local database

```bash
npm run docker:db:up
```

# [Development] Stopping a local database

```bash
npm run docker:db:down
```

# [Development] Migrations (Creating tables in database)

```bash
# create migration
npm run migration:create

# geneate migration from entities
npm run migration:generate

# run migrations
npm run migration:run
```

# [Testing] Running tests

```bash
# unit tests
npm run test

# test coverage
npm run test:cov

# e2e tests
# before running the test, make sure to run `npm run docker:db:down` to clear the db, because the test will use the same db as the local db
NODE_ENV=test npm run test:e2e
```

# [Production] Linter

```bash
npm run format
```
