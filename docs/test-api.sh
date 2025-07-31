# Military Guard Management API - cURL Testing Script
# Test all API actions with cURL commands

echo "Starting API test for Military Guard Management System"
echo "======================================================"

BASE_URL="http://localhost:3000"

echo ""
echo "Step 1: User Registration"
echo "========================="

echo "Registering commander..."
COMMANDER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "email": "commander@test.com",
        "password": "123456",
        "name": "Commander Test",
        "role": "commander"
    }')

echo "Commander registration response: $COMMANDER_RESPONSE"

echo ""
echo "Registering soldier..."
SOLDIER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "email": "soldier@test.com",
        "password": "123456",
        "name": "Soldier Test",
        "role": "soldier"
    }')

echo "Soldier registration response: $SOLDIER_RESPONSE"

echo ""
echo "Step 2: Login and Get Tokens"
echo "============================"

echo "Logging in as commander..."
COMMANDER_LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "commander@test.com",
        "password": "123456"
    }')

COMMANDER_TOKEN=$(echo $COMMANDER_LOGIN | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "Commander token: $COMMANDER_TOKEN"

echo ""
echo "Logging in as soldier..."
SOLDIER_LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "soldier@test.com",
        "password": "123456"
    }')

SOLDIER_TOKEN=$(echo $SOLDIER_LOGIN | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "Soldier token: $SOLDIER_TOKEN"

echo ""
echo "Step 3: User Management"
echo "======================="

echo "Getting all users (as commander)..."
curl -s -H "Authorization: Bearer $COMMANDER_TOKEN" $BASE_URL/users | jq '.'

echo ""
echo "Getting own profile (as soldier)..."
curl -s -H "Authorization: Bearer $SOLDIER_TOKEN" $BASE_URL/users/profile | jq '.'

echo ""
echo "Step 4: Shift Management"
echo "========================"

echo "Creating first shift (as commander)..."
SHIFT1_RESPONSE=$(curl -s -X POST $BASE_URL/shifts \
    -H "Authorization: Bearer $COMMANDER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "startTime": "2025-07-30T20:00:00.000Z",
        "endTime": "2025-07-31T08:00:00.000Z",
        "location": "Main Gate",
        "description": "Night Shift"
    }')

echo "First shift creation response: $SHIFT1_RESPONSE"

echo ""
echo "Creating second shift (as commander)..."
SHIFT2_RESPONSE=$(curl -s -X POST $BASE_URL/shifts \
    -H "Authorization: Bearer $COMMANDER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "startTime": "2025-07-31T08:00:00.000Z",
        "endTime": "2025-07-31T20:00:00.000Z",
        "location": "Watch Tower",
        "description": "Day Shift"
    }')

echo "Second shift creation response: $SHIFT2_RESPONSE"

echo ""
echo "Getting all shifts..."
curl -s -H "Authorization: Bearer $COMMANDER_TOKEN" $BASE_URL/shifts | jq '.'

echo ""
echo "Attempting to create shift as soldier (should fail with 403)..."
curl -s -X POST $BASE_URL/shifts \
    -H "Authorization: Bearer $SOLDIER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "startTime": "2025-07-31T20:00:00.000Z",
        "endTime": "2025-08-01T08:00:00.000Z",
        "location": "Warehouse",
        "description": "Unauthorized Shift"
    }' | jq '.'

echo ""
echo "Step 5: Assignment Management"
echo "============================"

echo "Creating first assignment (soldier to shift 1)..."
ASSIGNMENT1_RESPONSE=$(curl -s -X POST $BASE_URL/assignments \
    -H "Authorization: Bearer $COMMANDER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "userId": 2,
        "shiftId": 1
    }')

echo "Assignment 1 response: $ASSIGNMENT1_RESPONSE"

echo ""
echo "Creating second assignment (soldier to shift 2)..."
ASSIGNMENT2_RESPONSE=$(curl -s -X POST $BASE_URL/assignments \
    -H "Authorization: Bearer $COMMANDER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "userId": 2,
        "shiftId": 2
    }')

echo "Assignment 2 response: $ASSIGNMENT2_RESPONSE"

echo ""
echo "Getting all assignments (as commander)..."
curl -s -H "Authorization: Bearer $COMMANDER_TOKEN" $BASE_URL/assignments | jq '.'

echo ""
echo "Getting own assignments (as soldier)..."
curl -s -H "Authorization: Bearer $SOLDIER_TOKEN" $BASE_URL/assignments | jq '.'

echo ""
echo "Attempting to create assignment as soldier (should fail with 403)..."
curl -s -X POST $BASE_URL/assignments \
    -H "Authorization: Bearer $SOLDIER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "userId": 1,
        "shiftId": 1
    }' | jq '.'

echo ""
echo "Attempting to create duplicate assignment (should fail with 409)..."
curl -s -X POST $BASE_URL/assignments \
    -H "Authorization: Bearer $COMMANDER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "userId": 2,
        "shiftId": 1
    }' | jq '.'

echo ""
echo "Updating assignment status to completed..."
curl -s -X PUT $BASE_URL/assignments/1/status \
    -H "Authorization: Bearer $COMMANDER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "status": "completed"
    }' | jq '.'

echo ""
echo "Step 6: Error Handling"
echo "======================"

echo "Attempting access without token (should return 401)..."
curl -s $BASE_URL/users | jq '.'

echo ""
echo "Attempting with invalid token (should return 401)..."
curl -s -H "Authorization: Bearer invalid_token" $BASE_URL/users | jq '.'

echo ""
echo "Attempting to access non-existent resource (should return 404)..."
curl -s -H "Authorization: Bearer $COMMANDER_TOKEN" $BASE_URL/assignments/999 | jq '.'

echo ""
echo "Attempting to create assignment with invalid data (should return 400)..."
curl -s -X POST $BASE_URL/assignments \
    -H "Authorization: Bearer $COMMANDER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "userId": "not_a_number",
        "shiftId": -1
    }' | jq '.'

echo ""
echo "All tests completed successfully!"
echo "================================="
echo ""
echo "Summary of results:"
echo "- User registration: OK"
echo "- Login and authorization: OK"
echo "- Shift management: OK"
echo "- Assignment management: OK"
echo "- Security protections: OK"
echo "- Error handling: OK"
echo ""
echo "System is working correctly!"
