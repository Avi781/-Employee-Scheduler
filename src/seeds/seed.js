require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Location = require('../models/Location');
const Team = require('../models/Team');
const Shift = require('../models/Shift');
const TimeOff = require('../models/TimeOff');
const User = require('../models/User');
const bcrypt = require('bcrypt');

function timeToMin(hhmm){
  const [h,m] = hhmm.split(':').map(Number);
  return h*60 + m;
}

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log('connected');

  await Promise.all([Employee.deleteMany({}), Location.deleteMany({}), Team.deleteMany({}), Shift.deleteMany({}), TimeOff.deleteMany({}), User.deleteMany({})]);

  const dhk = await Location.create({ name:'Dhaka HQ', code:'DHK' });
  const ctg = await Location.create({ name:'Chattogram Hub', code:'CTG' });

  const opsD = await Team.create({ name:'Ops', location: dhk._id });
  const opsC = await Team.create({ name:'Backen', location: ctg._id });
  const kitchen = await Team.create({ name:'Frontend', location: dhk._id });

  const e1 = await Employee.create({ name:'Avi Afrid', email:'avi@example.com', role:'staff', skills:['barista','cashier'], teams:[opsD._id], locations:[dhk._id], availability:[{ dayOfWeek:1, start:'08:00', end:'17:00' }] });
  const e2 = await Employee.create({ name:'Rahim', email:'rahim@example.com', role:'staff', skills:['driver'], teams:[opsC._id], locations:[ctg._id], availability:[{ dayOfWeek:1, start:'20:00', end:'06:00' }], employmentType:'part-time' });
  const e3 = await Employee.create({ name:'Sumi', email:'sumi@example.com', role:'manager', skills:['supervisor'], teams:[kitchen._id], locations:[dhk._id] });

  const s1 = await Shift.create({ date: new Date('2025-08-26'), start: '08:00', end: '16:00', startMin: timeToMin('08:00'), endMin: timeToMin('16:00'), location: dhk._id, team: opsD._id, requiredRole: 'barista', requiredSkills: ['barista'], headcount:2, assignedEmployees: [e1._id] });
  const s2 = await Shift.create({ date: new Date('2025-08-26'), start: '22:00', end: '06:00', startMin: timeToMin('22:00'), endMin: timeToMin('06:00')+1440, location: dhk._id, team: opsD._id, requiredRole: 'driver', requiredSkills: ['driver'], headcount:1, assignedEmployees: [] });
  const s3 = await Shift.create({ date: new Date('2025-08-26'), start:'10:00', end:'14:00', startMin: timeToMin('10:00'), endMin: timeToMin('14:00'), location: dhk._id, team: opsD._id, requiredRole:'cashier', requiredSkills:['cashier'], headcount:1, assignedEmployees: [] });

  const to1 = await TimeOff.create({ employeeId: e1._id, startDate: new Date('2025-08-26T09:00:00Z'), endDate: new Date('2025-08-26T11:00:00Z'), status:'approved', reason:'personal' });

  const hash = await bcrypt.hash('adminpass', 10);
  await User.create({ email:'admin@example.com', passwordHash:hash, role:'admin', employeeRef: e3._id });

  console.log('seed done');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
