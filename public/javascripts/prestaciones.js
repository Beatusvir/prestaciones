'use strict'
var app = angular.module('prestacionesApp', ['ngRoute', 'ngResource']).run(function ($rootScope, $http) {
  $rootScope.authenticated = false
  $rootScope.current_user = ''

  $rootScope.signout = function () {
    $http.get('/auth/signout')
    $rootScope.authenticated = false
    $rootScope.current_user = ''
  }
})

app.config(function ($routeProvider) {
  $routeProvider
    // the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    // the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    // the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    })
    // show companies
    .when('/companies', {
      templateUrl: 'company.html',
      controller: 'companyController'
    })
    // show employees
    .when('/employees', {
      templateUrl: 'employee.html',
      controller: 'employeeController'
    })
    // assignments
    .when('/payments', {
      templateUrl: 'payment.html',
      controller: 'paymentController'
    })
    // when logged in
    .when('/auth/success', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    // when failing to authenticate
    .when('/auth/failure', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
})

app.factory('companiesService', function ($resource) {
  return $resource('api/v1/companies/:id')
})
app.factory('employeesService', function ($resource) {
  return $resource('api/v1/employees/:id', {}, {
    update: { method: 'put'},
    delete: { method: 'delete'}
  })
})

app.controller('mainController', function (companiesService, $scope, $rootScope) {
  $scope.companies = companiesService.query()

  $scope.companiesClass = function () {
    return $scope.companies.length > 0 ? 'link-enabled' : 'link-disabled'
  }
})

app.controller('companyController', function (companiesService, $scope, $http, $rootScope, $location) {
  if (!$rootScope.authenticated) {
    console.log('not logged in, redirect')
    $location.path('/login')
  }
  $scope.companies = companiesService.query()

  $scope.newCompany = {name: '', logo: '', utilityDays: '', interest: '', created_at: '', created_by: ''}

  $scope.post = function () {
    $scope.newCompany.created_at = Date.now()
    $scope.newCompany.created_by = $rootScope.current_user.username
    companiesService.save($scope.newCompany, function () {
      $scope.companies = companiesService.query()
      $scope.newCompany = {name: '', logo: '', created_at: '', created_by: ''}
    })
  }
})

app.controller('employeeController', function (employeesService, companiesService, $scope, $rootScope, $location) {
  if (!$rootScope.authenticated) {
    console.log('not logged in, redirect')
    $location.path('/login')
  }
  $scope.employees = employeesService.query()
  $scope.companies = companiesService.query()
  $scope.isEdit = false
  $rootScope.selectedEmployee = null

  $scope.newEmployee = {firstName: null, lastName: null, jobTitle: null, identifier: null, basicSalary: null, startDate: null, endDate: null, companyId: null, aliquotVacationBonus: null, antiquityDays: null, created_at: null, created_by: null}
  $scope.selectedEmployee = null

  $scope.addPayments = function (e, employeeId) {
    $rootScope.selectedEmployee = employeeId
    $location.path('/payments')
  }

  $scope.deleteEmployee = function (e, employee) {
    if (confirm('Are you sure you want to delete ' + employee.firstName + ' ?')) {
      employeesService.delete({id: employee._id}, function () {
        refreshEmployees()
      })
    }
  }

  $scope.editEmployee = function (e, employee) {
    $scope.isEdit = true
    employee.startDate = new Date(employee.startDate)
    employee.endDate = new Date(employee.endDate)
    $scope.newEmployee = employee
  }

  $scope.post = function () {
    if ($scope.isEdit) {
      employeesService.update($scope.newEmployee, function () {
        refreshEmployees()
      })
    } else {
      $scope.newEmployee.created_at = Date.now()
      $scope.newEmployee.created_by = $rootScope.current_user.username
      employeesService.save($scope.newEmployee, function () {
        refreshEmployees()
      })
    }

  }
  var refreshEmployees = function () {
    $scope.employees = employeesService.query()
    $scope.companies = companiesService.query()
    $scope.newEmployee = {firstName: null, lastName: null, jobTitle: null, identifier: null, basicSalary: null, startDate: null, endDate: null, companyId: null, aliquotVacationBonus: null, antiquityDays: null, created_at: null, created_by: null}
  }
})

app.controller('paymentController', function (companiesService, employeesService, $scope, $rootScope, $location) {
  if ($rootScope.selectedEmployee === null) {
    $location.path('/employees')
  }
  var companies = companiesService.query()
  $scope.employee = employeesService.get({id: $rootScope.selectedEmployee})

  $scope.payments = []
  $scope.newPayment = {salary: null, startDate: null, endDate: null, deduction: null, created_at: null, created_by: null}

  $scope.post = function () {
    $scope.created_by = $rootScope.current_user._id
    $scope.newPayment = {salary: null, startDate: null, endDate: null, deduction: null, created_at: null, created_by: null}
  }
})

app.controller('assignmentController', function (companiesService, employeesService, $scope, $rootScope) {
  var userId = $rootScope.current_user._id
  var companies = companiesService.query()
  console.log(companies)
  $scope.employee = employeesService.get({id: 1})

  $scope.assignments = []
  $scope.newAssignment = { averageDailySalary: null, aliquotUtility: null, integralSalary: null, antiquityAmount: null, employeeId: null }

  $scope.post = function () {
    $scope.newAssignment.created_by = userId
    $scope.newAssignment = { averageDailySalary: null, aliquotUtility: null, integralSalary: null, antiquityAmount: null, employeeId: null }
  }

  $scope.calculate = function () {
    var endDate = $scope.payments[$scope.payments.length - 1].endDate
    var startDate = $scope.payments[0].startDate
    var totalTime = workedTime(startDate, endDate)
    var months = totalTime.days > 14 ? totalTime.months + 1 : totalTime.months
    var firstMonth = startDate.getMonths() + 1

    var result = 0
    for (var i = 0; i < months; i++) {
      var paymentPeriod = []
      var currentMonth = firstMonth === 12 ? 1 : firstMonth + 1

      for (var j = 0; j < $scope.payments.length; j++) {
        if ($scope.payments[j].startDate.getMonth() + 1 === currentMonth) {
          paymentPeriod.push($scope.payments[j])
        }

        var assignment = getAntiquityOfPeriod(paymentPeriod, $scope.testEmployee.antiquityDays / months, $scope.testCompany.interest, $scope.testCompany.utilityDays)

        assignment.forEach(function (element) {
          result += element.interestAmount
        }, this)
      }
    }
    return result.toFixed(2)
  }

  var workedTime = function (startDate, endDate) {
    var duration = {years: 0, months: 0, days: 0}
    if (startDate > endDate) {
      return duration
    }

    var endMonth = endDate.getMonth() + 1
    var startMonth = startDate.getMonth() + 1

    var startDay = startDate.getDate()
    var endDay = endDate.getDate()

    var startYear = startDate.getFullYear()
    var endYear = endDate.getFullYear()

    duration.years = endYear - startYear

    if (endMonth === startMonth) {
      if (duration.years > 0) {
        duration.years -= 1
        duration.months = 11
      }
      duration.months = 0
    }else if (endMonth < startMonth) {
      duration.months = endMonth + (12 - startMonth)
    } else {
      duration.months = endMonth - startMonth
    }

    if (endDay < startDay) {
      duration.days = endDay + (31 - startDay)
      duration.months -= 1
    }else if (endDay === startDay) {
      duration.days = 0
    } else {
      duration.days = endDay - startDay
    }

    return duration
  // 14 / 02 / 2001 08 / 02 / 2016
  }

  var getAntiquityOfPeriod = function (payments, antiquityDays, utilityDays, interest, vacationBonus) {
    var assignments = []
    payments.forEach(function (element) {
      var assignment = {averageDailySalary: null, aliquotUtility: null, integralSalary: null, antiquityAmount: null, interestAmount: null}
      assignment.averageDailySalary = (element.salary - element.deduction) / workedTime(element.startDate, element.endDate).days
      assignment.aliquotUtility = assignment.averageDailySalary * utilityDays / 360
      assignment.integralSalary = assignment.averageDailySalary + assignment.aliquotUtility + vacationBonus
      assignment.antiquityAmount = assignment.integralSalary + antiquityDays / payments.length
      assignment.interestAmount = assignment.antiquityAmount * interest

      assignments.push(assignment)
    }, this)
    return assignments
  }
})

app.controller('authController', function ($scope, $http, $rootScope, $location) {
  $scope.user = {username: '', password: ''}
  $scope.error_message = ''

  $scope.login = function () {
    $http.post('/auth/login', $scope.user).success(function (data) {
      if (data.state == 'success') {
        $rootScope.authenticated = true
        $rootScope.current_user = data.user
        $location.path('/')
      } else {
        $scope.error_message = data.message
      }
    })
  }

  $scope.register = function () {
    $http.post('/auth/signup', $scope.user).success(function (data) {
      if (data.state == 'success') {
        $rootScope.authenticated = true
        $rootScope.current_user = data.user
        $location.path('/')
      } else {
        $scope.error_message = data.message
      }
    })
  }
})
