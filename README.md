# Employee Daily Scheduler Backend

## 1️⃣ Project Overview
This backend service manages employee schedules, shifts, and coverage. It supports:
- Employee management (roles, skills, availability)
- Shift creation & assignment
- Time-off/leave requests
- Coverage computation & conflict detection
- Aggregation pipelines for rollups

---

## 2️⃣ Setup & Run

### 2.1 Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/employee-daily-scheduler.git
cd employee-daily-scheduler

2.2 Install Dependencies
npm install

2.3 Environment Variables

Create a .env file in project root:

PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES=

2.4 Seed Sample Data
node src/seeds/seed.js

2.5 Run Server
npm run dev

3️⃣ Sample Requests
3.1 Assign Employee to Shift
POST /api/v1/shifts/assign
Body:
{
  "shiftId": "SHIFT_ID_HERE",
  "employeeId": ["EMPLOYEE_ID_1", "EMPLOYEE_ID_2"]
}

3.2 Create Shift
POST /api/v1/shifts
Body:
{
  "date": "2025-08-27",
  "start": "09:00",
  "end": "17:00",
  "requiredSkills": ["cashier"],
  "headcount": 1,
  "location": "LOCATION_ID"
}

3.3 Approve Time-Off
POST /api/v1/timeoff/approve
Body:
{
  "requestId": "TIMEOFF_ID",
  "status": "approved"
}

3.4 Coverage Analytics
GET /api/v1/shifts/coverage?date=2025-08-27&location=LOCATION_ID

4️⃣ Data Model & Index Strategy
Model	Fields	Indexes
Employee	_id, name, email, role, skills, teams, locations, availability, employmentType	email (unique), locations, teams
Shift	_id, date, start, end, startMin, endMin, requiredSkills, headcount, assignedEmployees, location	date, location, assignedEmployees
TimeOff	_id, employeeId, startDate, endDate, status, reason	employeeId, startDate, endDate, status
5️⃣ Conflict Rules

Time-off Clash: Employee cannot be assigned to shift during approved time-off.

Double Booking: Employee cannot have overlapping shifts.

Skill Mismatch: Employee must have required skills for shift.

Already Assigned: Cannot assign same employee multiple times to same shift.

6️⃣ Coverage Logic

Computed per role/skill per hour block:

required = sum of headcount per hour
assigned = number of employees assigned
gap = required - assigned


Conflicts and gaps are returned in aggregation endpoint /shifts/coverage.

Example response:

{
  "ok": true,
  "date": "2025-08-27",
  "coverage": [
    { "hour": 9, "required": 1, "assigned": 1, "gap": 0 },
    { "hour": 10, "required": 2, "assigned": 1, "gap": 1 }
  ],
  "conflicts": [
    { "employeeId": "EMP_ID", "type": "DOUBLE_BOOKING", "shifts": ["SHIFT_ID1","SHIFT_ID2"] }
  ]
}
