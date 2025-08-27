const Shift = require('../models/Shift');
const mongoose = require('mongoose');

async function coverageByRole(dateStr, locationId){
  const date = new Date(dateStr);
  const match = { date: date };
  if(locationId) match.location = mongoose.Types.ObjectId(locationId);
  const pipeline = [
    { $match: match },
    { $lookup: {
      from: 'employees',
      localField: 'assignedEmployees',
      foreignField: '_id',
      as: 'employees'
    }},
    { $project: {
      requiredRole: 1, headcount:1, startMin:1, endMin:1, assignedCount: { $size: '$assignedEmployees' }
    }},
    { $addFields: {
      startHour: { $floor: { $divide: ['$startMin', 60] } },
      endHour: { $ceil:  { $divide: ['$endMin', 60] } }
    }},
    { $addFields: {
      hours: { $range: ['$startHour', '$endHour'] }
    }},
    { $unwind: '$hours' },
    { $group: {
      _id: { role: '$requiredRole', hour: '$hours' },
      required: { $sum: '$headcount' },
      assigned: { $sum: '$assignedCount' }
    }},
    { $project: {
      _id:0,
      role: '$_id.role',
      hour: '$_id.hour',
      required:1,
      assigned:1,
      gap: { $subtract: ['$required','$assigned'] }
    }},
    { $sort: { role:1, hour:1 } }
  ];
  const coverage = await Shift.aggregate(pipeline);
  const conflictPipeline = [
    { $match: match },
    { $unwind: '$assignedEmployees' },
    { $group: { _id: '$assignedEmployees', count: { $sum: 1 }, shifts: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } }
  ];
  const conflicts = await Shift.aggregate(conflictPipeline);
  return { coverage, conflicts };
}

module.exports = { coverageByRole };
