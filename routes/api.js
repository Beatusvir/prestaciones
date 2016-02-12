var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

var Employee = mongoose.model('Employee')
var Company = mongoose.model('Company')
var Assignment = mongoose.model('Assignment')
var Payment = mongoose.model('Payment')

function isAuthenticated (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  console.log('Check if user is authenticated')
  // allow all get request methods
  if (req.method === 'GET') {
    return next()
  }
  if (req.isAuthenticated()) {
    return next()
  }

  // if the user is not authenticated then redirect him to the login page
  return res.redirect('/#login')
}

router.use('/v1/employees', isAuthenticated)

/* GET home page. */
router.route('/v1/employees')

  .get(function (req, res, next) {
    console.log('Trying to get employees')
    Employee.find(function (err, employees) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      console.log(employees)
      return res.status(200).send(employees)
    })

  })

  .post(function (req, res, next) {
    console.log('Saving new employee values in object')
    var employee = new Employee()
    employee.firstName = req.body.firstName
    employee.lastName = req.body.lastName
    employee.identifier = req.body.identifier
    employee.jobTitle = req.body.jobTitle
    employee.basicSalary = req.body.basicSalary
    employee.startDate = req.body.startDate
    employee.endDate = req.body.endDate
    employee.companyId = req.body.companyId
    employee.aliquotVacationBonus = req.body.aliquotVacationBonus
    employee.antiquityDays = req.body.antiquityDays
    employee.created_by = req.body.created_by
    console.log('Trying to save employee' + employee + ' in db')
    employee.save(function (err, employee) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      return res.status(200).send(employee)
    })
  })

router.route('/v1/employees/:id')

  .get(function (req, res, next) {
    Employee.findById(req.params.id, function (err, employee) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.status(200).send(employee)
    })
  })

  .put(function (req, res, next) {
    Employee.findById(req.params.id, function (err, employee) {
      if (err) {
        return res.status(500).send(err)
      }
      employee.identifier = req.body.identifier
      employee.firstName = req.body.firstName
      employee.lastName = req.body.lastName
      employee.jobTitle = req.body.jobTitle
      employee.basicSalary = req.body.basicSalary
      employee.startDate = req.body.startDate
      employee.endDate = req.body.endDate
      employee.companyId = req.body.companyId
      employee.aliquotVacationBonus = req.body.aliquotVacationBonus
      employee.antiquityDays = req.body.antiquityDays
      employee.created_by = req.body.created_by

      employee.save(function (err, employee) {
        if (err) {
          console.log(err)
          return res.status(500).send(err)
        }
        return res.json(employee)
      })
    })
  })

  .delete(function (req, res, next) {
    Employee.remove({
      _id: req.params.id
    }, function (err) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.json('deleted')
    })
  })

router.use('/v1/companies', isAuthenticated)

/* GET home page. */
router.route('/v1/companies')

  .get(function (req, res, next) {
    console.log('Trying to get companies')
    Company.find(function (err, companies) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      console.log(companies)
      return res.status(200).send(companies)
    })
  })

  .post(function (req, res, next) {
    console.log('Trying to add a company')
    var company = new Company()
    company.name = req.body.name
    company.logo = req.body.logo
    company.utilityDays = req.body.utilityDays
    company.interest = req.body.interest
    company.created_by = req.body.created_by
    company.save(function (err, company) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      return res.json(company)
    })
  })

router.route('/v1/companies/:id')

  .get(function (req, res, next) {
    Company.findById(req.params.id, function (err, company) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.status(500).send(company)
    })
  })

  .put(function (req, res, next) {
    Company.findById(req.params.id, function (err, company) {
      if (err) {
        return res.status(500).send(err)
      }

      company.name = req.body.name
      company.logo = req.body.logo
      company.utilityDays = req.body.utilityDays
      company.interest = req.body.interest
      company.created_at = req.body.created_at
      company.created_by = req.body.created_by
      company.save(function (err, employee) {
        if (err) {
          return res.status(500).send(err)
        }
      })
      return res.status(200).send(company)
    })
  })

  .delete(function (req, res, next) {
    Company.remove({
      _id: req.params.id
    }, function (err) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.json('deleted')
    })
  })

router.use('/v1/assignments', isAuthenticated)

/* GET home page. */
router.route('/v1/assignments')

  .get(function (req, res, next) {
    console.log('Trying to get assignments')
    Assignment.find(function (err, assignments) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      console.log(assignments)
      return res.status(200).send(assignments)
    })
  })

  .post(function (req, res, next) {
    console.log('Trying to add a assignment')
    var assignment = new Assignment()

    assignment.averageDailySalary = req.body.averageDailySalary,
    assignment.aliquotUtility = req.body.aliquotUtility,
    assignment.integralSalary = req.body.integralSalary,
    assignment.antiquityAmount = req.body.antiquityAmount,
    assignment.employeeId = req.body.employeeId,
    assignment.created_at = req.body.created_at,
    assignment.created_by = req.body.created_by
    assignment.save(function (err, assignment) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      return res.json(assignment)
    })
  })

router.route('/v1/assignments/:id')

  .get(function (req, res, next) {
    Assignment.findById(req.params.id, function (err, assignment) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.status(500).send(assignment)
    })
  })

  .put(function (req, res, next) {
    Assignment.findById(req.params.id, function (err, assignment) {
      if (err) {
        return res.status(500).send(err)
      }

      assignment.averageDailySalary = req.body.averageDailySalary,
      assignment.aliquotUtility = req.body.aliquotUtility,
      assignment.integralSalary = req.body.integralSalary,
      assignment.antiquityAmount = req.body.antiquityAmount,
      assignment.employeeId = req.body.employeeId,
      assignment.assignment.created_at = req.body.created_at,
      assignment.assignment.created_by = req.body.created_by
      assignment.save(function (err, employee) {
        if (err) {
          return res.status(500).send(err)
        }
      })
      return res.status(200).send(assignment)
    })
  })

  .delete(function (req, res, next) {
    Assignment.remove({
      _id: req.params.id
    }, function (err) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.json('deleted')
    })
  })

router.use('/v1/payments', isAuthenticated)

/* GET home page. */
router.route('/v1/payments')

  .get(function (req, res, next) {
    console.log('Trying to get payments')
    Payment.find(function (err, payments) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      console.log(payments)
      return res.status(200).send(payments)
    })
  })

  .post(function (req, res, next) {
    console.log('Trying to add a payment')
    var payment = new Payment()

    payment.averageDailySalary = req.body.averageDailySalary,
    payment.aliquotUtility = req.body.aliquotUtility,
    payment.integralSalary = req.body.integralSalary,
    payment.antiquityAmount = req.body.antiquityAmount,
    payment.employeeId = req.body.employeeId,
    payment.created_at = req.body.created_at,
    payment.created_by = req.body.created_by
    payment.save(function (err, payment) {
      if (err) {
        console.log(err)
        return res.status(500).send(err)
      }
      return res.json(payment)
    })
  })

router.route('/v1/payments/:id')

  .get(function (req, res, next) {
    Payment.findById(req.params.id, function (err, payment) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.status(500).send(payment)
    })
  })

  .put(function (req, res, next) {
    Payment.findById(req.params.id, function (err, payment) {
      if (err) {
        return res.status(500).send(err)
      }

      payment.averageDailySalary = req.body.averageDailySalary,
      payment.aliquotUtility = req.body.aliquotUtility,
      payment.integralSalary = req.body.integralSalary,
      payment.antiquityAmount = req.body.antiquityAmount,
      payment.employeeId = req.body.employeeId,
      payment.payment.created_at = req.body.created_at,
      payment.payment.created_by = req.body.created_by
      payment.save(function (err, employee) {
        if (err) {
          return res.status(500).send(err)
        }
      })
      return res.status(200).send(payment)
    })
  })

  .delete(function (req, res, next) {
    Payment.remove({
      _id: req.params.id
    }, function (err) {
      if (err) {
        return res.status(500).send(err)
      }
      return res.json('deleted')
    })
  })

module.exports = router
