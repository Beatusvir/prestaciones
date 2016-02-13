angular.module('prestacionesApp').controller('paymentController', function (employeesService, paymentsService, $scope, $rootScope, $location) {
  if (!$rootScope.authenticated) {
    console.log('not logged in, redirect')
    $location.path('/login')
  }
  if ($rootScope.selectedEmployee === null) {
    $location.path('/employees')
  }

  $scope.employee = employeesService.get({id: $rootScope.selectedEmployee})

  $scope.payments = paymentsService.query()
  $scope.newPayment = {salary: null, startDate: null, endDate: null, deduction: null, employeeId: null, created_at: null, created_by: null}

  $scope.validateEndDate = function () {
    if ($scope.newPayment.endDate < $scope.newPayment.startDate) {
      alert('End Date can not be before Start Date')
      $scope.newPayment.endDate = null
    }
  }

  $scope.validatePreviousPaymentDate = function () {
    var previousDate = new Date($scope.payments[$scope.payments.length - 1].endDate)
    if ($scope.newPayment.startDate < previousDate) {
      alert('Start Date overlaps previous payment date, please verify')
      $scope.newPayment.startDate = null
    }
  }

  $scope.post = function () {
    $scope.newPayment.employeeId = $scope.employee._id
    $scope.newPayment.created_by = $rootScope.current_user._id
    $scope.newPayment.startDate = new Date($scope.newPayment.startDate)
    $scope.newPayment.endDate = new Date($scope.newPayment.endDate)
    paymentsService.save($scope.newPayment, function () {
      $scope.payments = paymentsService.query()
      $scope.newPayment = {salary: null, startDate: null, endDate: null, deduction: null, employeeId: null, created_at: null, created_by: null}
    })
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