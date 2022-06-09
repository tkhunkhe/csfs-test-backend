# Full-stack Test App: Backend

## Setup after clone

- add `.env` file with content below:

```
DATABASE_URL=<database url>
MAPQUEST_KEY=<mapquest key obtained from https://developer.mapquest.com/>
```

- `npm install`
- start mysql server
- initialize database
  - `npm run prisma:migrate-init`
  - run [create-function-procedures.sql](sql/create-function-procedures.sql) script
- add mocked data
  - `npm run generate-mocked-data`
  - `npm run init-test-db`
  - `npm run init-function-procedure`

## Run

### dev

- `npm run start`

### test

- `npm run test`
- run specific test
  - ` npm run test -- -t '<wanted test name in describe>'`

### build

- `npm run build`

### serve

- `npm run serve`
- serve the built application

### Database

- use MySQL over MongoDB because the dashboard data has a fix schema (at least the analytics part)
