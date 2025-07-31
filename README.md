# Military Guard Shift Management System

## Project Description

A comprehensive system for managing military guard shifts, built with NestJS and a PostgreSQL (Neon Database) backend. The system enables management of soldiers, shifts, and assignments, with role-based access control for commanders and soldiers.

## Main Features

### Authentication System
- Registration and login with JWT
- Role separation: Commander vs Soldier
- API route protection with Guards

### User Management
- Register new users
- Personal profile
- Role management

### Shift Management
- Create and edit shifts
- Define times and locations
- Shift description

### Assignment Management
- Assign soldiers to shifts
- Track assignment status
- Prevent duplicate assignments

## Technologies

- **Backend**: NestJS (Node.js Framework)
- **Database**: PostgreSQL (Neon Database)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Environment**: TypeScript

## Project Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Neon Database account

### Installation

1. **Clone the project**
```bash
git clone https://github.com/rel770/military-guard-management
cd military-guard-management
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```
Edit the `.env` file with your database details:
```
DATABASE_URL=postgresql://username:password@hostname/database_name
JWT_SECRET=your-jwt-secret-key
```

4. **Initialize the database**
```bash
npx ts-node src/init-db.ts
```

5. **Start the server**
```bash
npm run start:dev
```

The server will run at: `http://localhost:3000`

## API Documentation

### Authentication Routes

#### POST /auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "commander" // or "soldier"
}
```

#### POST /auth/login
Login to the system
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**: JWT token for future requests

### User Routes

#### GET /users
Get all users (commanders only)
- **Headers**: `Authorization: Bearer <token>`

#### GET /users/profile
Get the profile of the logged-in user
- **Headers**: `Authorization: Bearer <token>`

#### POST /users
Create a new user (commanders only)
- **Headers**: `Authorization: Bearer <token>`

### Shift Routes

#### GET /shifts
Get all shifts
- **Headers**: `Authorization: Bearer <token>`

#### GET /shifts/:id
Get a specific shift
- **Headers**: `Authorization: Bearer <token>`

#### POST /shifts
Create a new shift (commanders only)
```json
{
  "startTime": "2025-07-30T20:00:00.000Z",
  "endTime": "2025-07-31T08:00:00.000Z",
  "location": "Main Gate",
  "description": "Night shift"
}
```
- **Headers**: `Authorization: Bearer <token>`

#### PUT /shifts/:id
Update a shift (commanders only)
- **Headers**: `Authorization: Bearer <token>`

#### DELETE /shifts/:id
Delete a shift (commanders only)
- **Headers**: `Authorization: Bearer <token>`

### Assignment Routes

#### GET /assignments
Get assignments (commanders see all, soldiers see their own)
- **Headers**: `Authorization: Bearer <token>`

#### GET /assignments/user/:userId
Get assignments for a specific user (commanders only)
- **Headers**: `Authorization: Bearer <token>`

#### GET /assignments/shift/:shiftId
Get assignments for a specific shift (commanders only)
- **Headers**: `Authorization: Bearer <token>`

#### POST /assignments
Create a new assignment (commanders only)
```json
{
  "userId": 1,
  "shiftId": 1
}
```
- **Headers**: `Authorization: Bearer <token>`

#### PUT /assignments/:id/status
Update assignment status (commanders only)
```json
{
  "status": "completed" // or "assigned", "cancelled"
}
```
- **Headers**: `Authorization: Bearer <token>`

#### DELETE /assignments/:id
Delete an assignment (commanders only)
- **Headers**: `Authorization: Bearer <token>`

## Testing the System with cURL

### 1. Register a commander
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "commander@example.com",
    "password": "123456",
    "name": "First Commander",
    "role": "commander"
  }'
```

### 2. Register a soldier
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "soldier@example.com",
    "password": "123456",
    "name": "First Soldier",
    "role": "soldier"
  }'
```

### 3. Login (get Token)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "commander@example.com",
    "password": "123456"
  }'
```

**Save the JWT token from the response and use `<YOUR_TOKEN>` in the following requests**

### 4. Create a shift (as commander)
```bash
curl -X POST http://localhost:3000/shifts \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2025-07-30T20:00:00.000Z",
    "endTime": "2025-07-31T08:00:00.000Z",
    "location": "Main Gate",
    "description": "Night shift"
  }'
```

### 5. View shifts
```bash
curl -H "Authorization: Bearer <YOUR_TOKEN>" \
  http://localhost:3000/shifts
```

### 6. Create an assignment (assign soldier to shift)
```bash
curl -X POST http://localhost:3000/assignments \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "shiftId": 1
  }'
```

### 7. View assignments
```bash
curl -H "Authorization: Bearer <YOUR_TOKEN>" \
  http://localhost:3000/assignments
```

### 8. Update assignment status
```bash
curl -X PUT http://localhost:3000/assignments/1/status \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### 9. Permission check - soldier tries to create a shift (should return 403 error)
```bash
# First, login as soldier and get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "soldier@example.com",
    "password": "123456"
  }'

# Try to create a shift (should fail)
curl -X POST http://localhost:3000/shifts \
  -H "Authorization: Bearer <SOLDIER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2025-07-30T20:00:00.000Z",
    "endTime": "2025-07-31T08:00:00.000Z",
    "location": "Main Gate",
    "description": "Night shift"
  }'
```

## System Permissions

### Commander
- Can view all users
- Can create, edit, and delete shifts
- Can create, edit, and delete assignments
- Can view all assignments

### Soldier
- Can view only their own profile
- Can view all shifts
- Can view only their own assignments
- Cannot create or edit shifts/assignments

## Common Errors

### 401 Unauthorized
- No JWT token provided
- Invalid or expired JWT token

### 403 Forbidden
- No permission to perform the action (e.g., soldier tries to create a shift)

### 404 Not Found
- Requested resource not found

### 409 Conflict
- Attempt to create a duplicate resource (e.g., assignment already exists)

## Postman Collection

Import the file `docs/Military-Guard-Management-API.postman_collection.json` into Postman for convenient API testing.

## Project Structure

```
src/
├── app.module.ts              # Main module
├── main.ts                    # Entry point
├── init-db.ts                 # Database initialization
├── auth/                      # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── guards/
│   └── dto/
├── users/                     # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── entities/
│   └── dto/
├── shifts/                    # Shifts module
│   ├── shifts.controller.ts
│   ├── shifts.service.ts
│   ├── shifts.module.ts
│   ├── entities/
│   └── dto/
├── assignments/               # Assignments module
│   ├── assignments.controller.ts
│   ├── assignments.service.ts
│   ├── assignments.module.ts
│   ├── entities/
│   └── dto/
├── database/                  # Database module
│   ├── database.service.ts
│   └── database.module.ts
└── common/                    # Shared components
    ├── decorators/
    ├── enums/
    └── filters/
```


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), the official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord channel](https://discord.gg/G7Qnnhy)
- [Official video courses](https://courses.nestjs.com/)
- [NestJS Mau](https://mau.nestjs.com)
- [NestJS Devtools](https://devtools.nestjs.com)
- [Enterprise support](https://enterprise.nestjs.com)
- [X (Twitter)](https://x.com/nestframework)
- [LinkedIn](https://linkedin.com/company/nestjs)
- [Jobs board](https://jobs.nestjs.com)