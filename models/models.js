var mongoose = require('mongoose')
var Schema = mongoose.Schema
var jwt = require('jsonwebtoken')

var userSchema = new mongoose.Schema({
  username: String,
  password: String, // hash created from password
  created_at: {type: Date, default: Date.now}
})

var employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  identifier: Number,
  jobTitle: String,
  basicSalary: Number,
  startDate: Date,
  endDate: Date,
  companyId: { type: Schema.ObjectId, ref: 'Company'},
  aliquotVacationBonus: Number,
  created_at: { type: Date, default: Date.now },
  created_by: String
// created_by: { type: Schema.ObjectId, ref: 'User'}
})

var companySchema = new mongoose.Schema({
  name: String,
  logo: String,
  utilityDays: Number,
  interest: Number,
  created_at: { type: Date, default: Date.now() },
  created_by: String
// created_by: { type: Schema.ObjectId, ref: 'User'}
})

var assignmentSchema = new mongoose.Schema({
  averageDailySalary: String,
  aliquotUtility: Number,
  integralSalary: Number,
  antiquityAmount: Number,
  interestAmount: Number,
  employeeId: { type: Schema.ObjectId, ref: 'User'},
  created_at: { type: Date, default: Date.now() },
  created_by: String
})

var paymentSchema = new mongoose.Schema({
  salary: Number,
  startDate: Date,
  endDate: Date,
  deduction: Number,
  employeeId: { type: Schema.ObjectId, ref: 'Employee' },
  created_at: { type: Date, default: Date.now() },
  created_by: { type: Schema.ObjectId, ref: 'User' }
})

// declare model called user using schema userSchema
mongoose.model('User', userSchema)
mongoose.model('Employee', employeeSchema)
mongoose.model('Company', companySchema)
mongoose.model('Assignment', assignmentSchema)
mongoose.model('Payment', paymentSchema)
