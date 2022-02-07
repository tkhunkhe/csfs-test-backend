# Chainstarts Full-stack Test App: Backend

## Setup after clone

- add `.env` file with content below:

```
DATABASE_URL=<database url>
MAPQUEST_KEY=<mapquest key obtained from https://developer.mapquest.com/>
```

## Run

### dev

- `npm run start`

### build

- `npm run build`

### serve

- `npm run serve`
- serve the built application

### Database

- use MySQL over MongoDB because the dashboard data has a fix schema (at least the analytics part)
