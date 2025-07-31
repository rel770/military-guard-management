# Military Guard Management System - Testing Guide

## Overview
This document provides comprehensive testing instructions for the Military Guard Management System API using cURL commands.

## Prerequisites
- Server running on `http://localhost:3000`
- `curl` command-line tool
- `jq` for JSON formatting (optional but recommended)

## Environment Setup

```bash
export BASE_URL="http://localhost:3000"
export COMMANDER_TOKEN=""
export SOLDIER_TOKEN=""
```

## 1. Authentication Testing

### Register Commander
```bash
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "commander@test.com",
    "password": "123456",
    "name": "Test Commander",
    "role": "commander"
  }'
```

### Register Soldier
```bash
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "soldier@test.com",
    "password": "123456",
    "name": "Test Soldier",
    "role": "soldier"
  }'
```

### Login as Commander
```bash
curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "commander@test.com",
    "password": "123456"
  }'
```
**Save the access_token from response for COMMANDER_TOKEN**

### Login as Soldier
```bash
curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "soldier@test.com",
    "password": "123456"
  }'
```
**Save the access_token from response for SOLDIER_TOKEN**

## 2. Users Management Testing

### Get All Users (Commander Only)
```bash
curl -H "Authorization: Bearer $COMMANDER_TOKEN" \
  $BASE_URL/users
```

### Get User Profile (Any authenticated user)
```bash
curl -H "Authorization: Bearer $SOLDIER_TOKEN" \
  $BASE_URL/users/profile
```

### Create New User (Commander Only)
```bash
curl -X POST $BASE_URL/users \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "123456",
    "name": "New User",
    "role": "soldier"
  }'
```

## 3. Shifts Management Testing

### Get All Shifts
```bash
curl -H "Authorization: Bearer $COMMANDER_TOKEN" \
  $BASE_URL/shifts
```

### Get Specific Shift
```bash
curl -H "Authorization: Bearer $COMMANDER_TOKEN" \
  $BASE_URL/shifts/1
```

### Create Shift (Commander Only)
```bash
curl -X POST $BASE_URL/shifts \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2025-07-30T20:00:00.000Z",
    "endTime": "2025-07-31T08:00:00.000Z",
    "location": "Main Gate",
    "description": "Night guard duty"
  }'
```

### Update Shift (Commander Only)
```bash
curl -X PUT $BASE_URL/shifts/1 \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2025-07-30T20:00:00.000Z",
    "endTime": "2025-07-31T08:00:00.000Z",
    "location": "Main Gate - Post A",
    "description": "Updated night guard duty"
  }'
```

### Delete Shift (Commander Only)
```bash
curl -X DELETE $BASE_URL/shifts/1 \
  -H "Authorization: Bearer $COMMANDER_TOKEN"
```

## 4. Assignments Management Testing

### Get All Assignments
```bash
# As Commander (sees all)
curl -H "Authorization: Bearer $COMMANDER_TOKEN" \
  $BASE_URL/assignments

# As Soldier (sees only own)
curl -H "Authorization: Bearer $SOLDIER_TOKEN" \
  $BASE_URL/assignments
```

### Get Assignments by User (Commander Only)
```bash
curl -H "Authorization: Bearer $COMMANDER_TOKEN" \
  $BASE_URL/assignments/user/2
```

### Get Assignments by Shift (Commander Only)
```bash
curl -H "Authorization: Bearer $COMMANDER_TOKEN" \
  $BASE_URL/assignments/shift/1
```

### Create Assignment (Commander Only)
```bash
curl -X POST $BASE_URL/assignments \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "shiftId": 1
  }'
```

### Update Assignment Status (Commander Only)
```bash
curl -X PUT $BASE_URL/assignments/1/status \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete Assignment (Commander Only)
```bash
curl -X DELETE $BASE_URL/assignments/1 \
  -H "Authorization: Bearer $COMMANDER_TOKEN"
```

## 5. Error Testing

### 401 Unauthorized - No Token
```bash
curl $BASE_URL/users
```

### 401 Unauthorized - Invalid Token
```bash
curl -H "Authorization: Bearer invalid_token" \
  $BASE_URL/users
```

### 403 Forbidden - Soldier trying to create shift
```bash
curl -X POST $BASE_URL/shifts \
  -H "Authorization: Bearer $SOLDIER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2025-07-30T20:00:00.000Z",
    "endTime": "2025-07-31T08:00:00.000Z",
    "location": "Unauthorized Location",
    "description": "Unauthorized shift"
  }'
```

### 404 Not Found - Non-existent resource
```bash
curl -H "Authorization: Bearer $COMMANDER_TOKEN" \
  $BASE_URL/assignments/999
```

### 409 Conflict - Duplicate assignment
```bash
# First create an assignment
curl -X POST $BASE_URL/assignments \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "shiftId": 1
  }'

# Then try to create the same assignment again
curl -X POST $BASE_URL/assignments \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "shiftId": 1
  }'
```

### 400 Bad Request - Invalid data
```bash
curl -X POST $BASE_URL/assignments \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "not_a_number",
    "shiftId": -1
  }'
```

### 400 Bad Request - Missing data
```bash
curl -X POST $BASE_URL/assignments \
  -H "Authorization: Bearer $COMMANDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 6. Full System Test Script

Run this automated test script to verify all functionality:

```bash
#!/bin/bash
chmod +x docs/test-api.sh
./docs/test-api.sh
```

## Expected Responses

### Successful Authentication
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Test Commander",
    "email": "commander@test.com",
    "role": "commander",
    "created_at": "2025-07-30T10:00:00.000Z"
  }
}
```

### Successful Resource Creation
```json
{
  "message": "Assignment created successfully",
  "data": {
    "id": 1,
    "userId": 2,
    "shiftId": 1,
    "status": "assigned",
    "assignedAt": "2025-07-30T10:00:00.000Z",
    "assignedBy": 1
  }
}
```

### Error Response Format
```json
{
  "statusCode": 400,
  "timestamp": "2025-07-30T10:00:00.000Z",
  "path": "/assignments",
  "method": "POST",
  "error": {
    "type": "BAD_REQUEST",
    "message": "Bad request - missing or invalid data",
    "originalMessage": [
      "User ID is required",
      "Shift ID is required"
    ]
  }
}
```

## Permission Matrix

| Role | Users | Shifts | Assignments | Own Profile |
|------|-------|--------|-------------|-------------|
| Commander | Full CRUD | Full CRUD | Full CRUD | Read |
| Soldier | Read own only | Read only | Read own only | Read |

## Status Codes Reference

- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists
- **500**: Internal Server Error - Server error

## Tips for Testing

1. Always save JWT tokens after login for subsequent requests
2. Use `jq` to format JSON responses for better readability
3. Test both success and error scenarios
4. Verify role-based access control
5. Check data validation on all endpoints
6. Test edge cases and boundary conditions
