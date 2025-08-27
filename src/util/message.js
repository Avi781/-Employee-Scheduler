module.exports = {
  ERRORS: {
    LOGIN: {
      EMAIL_OR_PASS_REQ: 'Email/Password required',
      USER_NOT_FOUND: 'User not Found, please enter valid Email',
      WRONG_PASS: 'Wrong password,please enter valid Password',
      USER_ALREADY_EXITED: 'User Already exist'
    },
    DATA_NOT_FOUND: 'Data not Found',
    SHIFT_NOT_FOUND: {
      message: 'Shift not found',
      code: 'SHIFT_NOT_FOUND'
    },
    EMPLOYEE_NOT_FOUND: {
      message: 'Some employees not found',
      code: 'EMPLOYEE_NOT_FOUND'
    },
    SKILL_MISMATCH: {
      message: 'Employee missing required skills',
      code: 'SKILL_MISMATCH'
    },
    TIMEOFF_CLASH: {
      message: 'Time-off clash',
      code: 'TIMEOFF_CLASH'
    },
    DOUBLE_BOOKING: {
      message: 'Double booking',
      code: 'DOUBLE_BOOKING'
    },
    ALREADY_ASSIGNED: {
      message: 'Employees already assigned',
      code: 'ALREADY_ASSIGNED'
    },
    TIMEOFF: {
      message: 'requestId and status are required',
    },
     COVERAGE: {
      message: 'date required',
    }
  },

  SUCCESS: {
    LOGIN: {
      LOGIN_SUCCESSFULLY: 'Login Successfully',
       USER_CREATE_SUCCESSFULLY: 'User Create Successfully',
    },
    EMPLOYEE: {
      EMPLOYEE_DATA_FOUND: {
        message: 'Employees data found',
      },
      EMPLOYEE_CREATED: {
        message: 'Employee created successfully',
      },
    },
    SHIFT_ASSIGNED: {
      message: 'Employees successfully assigned to shift',
      code: 'SHIFT_ASSIGNED'
    },
    SHIFT_CREATED: {
      message: 'Shift created successfully',
      code: 'SHIFT_CREATED'
    },
    SCHEDULE_DATA_FOUND: {
      message: 'Schedule data Found successfully',
      code: 'SHIFT_CREATED'
    },
    TIMEOFF_CREATED: {
      message: 'Time-off created successfully',
    },
    TIMEOFF_APPROVED: {
      message: 'Time-off request approved',
      code: 'TIMEOFF_APPROVED'
    },
    TIMEOFF_REJECTED: {
      message: 'Time-off request rejected',
      code: 'TIMEOFF_REJECTED'
    }
  }
};
