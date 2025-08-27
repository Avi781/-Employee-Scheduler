const Shift = require('../models/Shift');
const TimeOff = require('../models/TimeOff');
const Employee = require('../models/Employee');
const MESSAGES = require('../util/message');
const timeToMinutes = require('../helper/timeToMinutesConverter')

async function createShift(data) {
  const startMin = timeToMinutes(data.start);
  let endMin = timeToMinutes(data.end);
  if (endMin <= startMin) endMin += 24 * 60;
  const shift = await Shift.create(Object.assign({}, data, { startMin, endMin }));
  return shift;
}

async function assignEmployees(shiftId, employeeIds) {
  const shift = await Shift.findById(shiftId).lean();
  if (!shift) {
    const err = new Error(MESSAGES.ERRORS.SHIFT_NOT_FOUND.message);
    err.code = MESSAGES.ERRORS.SHIFT_NOT_FOUND.code;
    throw err;
  }

  const employees = await Employee.find({ _id: { $in: employeeIds } }).lean();
  if (employees.length !== employeeIds.length) {
    const err = new Error(MESSAGES.ERRORS.EMPLOYEE_NOT_FOUND.message);
    err.code = MESSAGES.ERRORS.EMPLOYEE_NOT_FOUND.code;
    throw err;
  }

  if (shift.requiredSkills?.length) {
    const notQualified = employees.filter(
      e => !e.skills.some(skill => shift.requiredSkills.includes(skill))
    );

    if (notQualified.length > 0) {
      const err = new Error(MESSAGES.ERRORS.SKILL_MISMATCH.message);
      err.code = MESSAGES.ERRORS.SKILL_MISMATCH.code;
      err.items = notQualified;
      throw err;
    }
  }

  const shiftStart = new Date(shift.date);
  shiftStart.setMinutes(shiftStart.getMinutes() + shift.startMin);

  const shiftEnd = new Date(shift.date);
  shiftEnd.setMinutes(shiftEnd.getMinutes() + shift.endMin);

  if (shiftEnd <= shiftStart) {
    shiftEnd.setDate(shiftEnd.getDate() + 1); // overnight shift
  }
  console.log('shift', shift)

  const tofs = await TimeOff.find({
    employeeId: { $in: employeeIds },
    status: 'approved',
    $or: [
      { startDate: { $lt: shiftEnd, $gte: shiftStart } },
      { endDate: { $gt: shiftStart, $lte: shiftEnd } },
      { startDate: { $lte: shiftStart }, endDate: { $gte: shiftEnd } }
    ]
  }).lean();

  console.log('tofs', tofs)
  if (tofs.length) {
    const err = new Error(MESSAGES.ERRORS.TIMEOFF_CLASH.message);
    err.code = MESSAGES.ERRORS.TIMEOFF_CLASH.code;
    err.items = tofs;
    throw err;
  }

  const others = await Shift.find({
    _id: { $ne: shiftId },
    date: shift.date,
    assignedEmployees: { $in: employeeIds }
  }).lean();

  for (const o of others) {
    if (!(o.endMin <= shift.startMin || o.startMin >= shift.endMin)) {
      const err = new Error(MESSAGES.ERRORS.DOUBLE_BOOKING.message);
      err.code = MESSAGES.ERRORS.DOUBLE_BOOKING.code;
      err.items = [o];
      throw err;
    }
  }

  const newEmployees = employeeIds.filter(
    id => !shift.assignedEmployees?.map(e => String(e)).includes(String(id))
  );

  if (newEmployees.length === 0) {
    const err = new Error(MESSAGES.ERRORS.ALREADY_ASSIGNED.message);
    err.code = MESSAGES.ERRORS.ALREADY_ASSIGNED.code;
    throw err;
  }

  const updatedShift = await Shift.findByIdAndUpdate(
    shiftId,
    { $addToSet: { assignedEmployees: { $each: newEmployees } } },
    { new: true }
  ).populate('assignedEmployees', 'name email skills');

  return {
    success: true,
    code: MESSAGES.SUCCESS.SHIFT_ASSIGNED.code,
    message: MESSAGES.SUCCESS.SHIFT_ASSIGNED.message,
    data: updatedShift
  };
}

module.exports = { assignEmployees, createShift };
