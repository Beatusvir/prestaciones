'use strict'
angular.module('prestacionesApp')
  .factory('paymentsService', function ($resource) {
    return $resource('api/v1/payments/:id', {id: '@_id'},
      { 'get': {method: 'GET'},
        'save': {method: 'POST'},
        'query': {method: 'GET', isArray: true},
        'remove': {method: 'DELETE'},
        'delete': {method: 'DELETE'} }
    )
  })
  .controller('paymentController', function (paymentsService, employeesService, companiesService, $scope, $rootScope, $location, $cookies, $routeParams) {
    if (!$rootScope.authenticated) {
      console.log('not logged in, redirect')
      $location.path('/login')
    }
    var employeeId = $routeParams.empId
    if (!employeeId) {
      $location.path('/employees')
    }

    $scope.employee = employeesService.get({id: employeeId}, function (data) {
      $scope.company = companiesService.get({id: data.companyId})
    })
    $scope.payments = paymentsService.query()

    $scope.newPayment = {
      salary: null,
      startDate: null,
      endDate: null,
      deduction: null,
      employeeId: null,
      created_at: null,
      created_by: null
    }

    $scope.validateEndDate = function () {
      if ($scope.newPayment.endDate < $scope.newPayment.startDate) {
        alert('End Date can not be before Start Date')
        $scope.newPayment.endDate = null
      }
    }

    $scope.validatePreviousPaymentDate = function () {
      if ($scope.payments.length > 0){
        var previousDate = new Date($scope.payments[$scope.payments.length - 1].endDate)
        if ($scope.newPayment.startDate < previousDate) {
          alert('Start Date overlaps previous payment date, please verify')
          $scope.newPayment.startDate = null
        }
      }
    }

    $scope.post = function () {
      $scope.newPayment.employeeId = $scope.employee._id
      $scope.newPayment.created_by = $rootScope.current_user._id
      $scope.newPayment.startDate = new Date($scope.newPayment.startDate)
      $scope.newPayment.endDate = new Date($scope.newPayment.endDate)
      paymentsService.save($scope.newPayment, function () {
        refreshPayments()
      })
    }

    $scope.removePayment = function(e, payment){
      if (confirm('Are you sure you want to delete the payment for ' + payment.salary + ' ?')) {
        paymentsService.delete({id: payment._id}, function () {
          refreshPayments()
        })
      }
    }

    var refreshPayments = function(){
      $scope.payments = paymentsService.query()
      $scope.newPayment = {
        salary: null,
        startDate: null,
        endDate: null,
        deduction: null,
        employeeId: null,
        created_at: null,
        created_by: null
      }
    }

    $scope.calculate = function () {
      var endDate = new Date($scope.payments[$scope.payments.length - 1].endDate)
      var startDate = new Date($scope.payments[0].startDate)
      var totalTime = workedTime(startDate, endDate)
      console.log(totalTime)
      var months = totalTime.days > 14 ? totalTime.months + 1 : totalTime.months
      var firstMonth = startDate.getMonth() + 1
      var antiquityDays = months * 6

      var result = 0
      for (var i = 0; i < months; i++) {
        var assignments = []
        var paymentPeriod = []
        var currentMonth = firstMonth === 12 ? 1 : firstMonth

        for (var j = 0; j < $scope.payments.length; j++) {
          var currentPayment = $scope.payments[j]
          var currentPaymentMonth = new Date(currentPayment.startDate).getMonth() + 1
          if (currentPaymentMonth === currentMonth) {
            paymentPeriod.push($scope.payments[j])
          }
          var assignment = getAntiquityOfPeriod(paymentPeriod, antiquityDays, $scope.company.utilityDays,$scope.company.interest, $scope.employee.aliquotVacationBonus)
          if (assignment) {
            assignments.push(assignment)
          }
        }
      }

      var currentRow = 0
      var totalAntiquity = 0
      var totalInterest = 0
      assignments.forEach(function (element) {
        var averageDailySalary = document.createElement('td')
        averageDailySalary.innerHTML = element.averageDailySalary.toFixed(2)
        document.getElementById('table-payments').children[1].children[currentRow].appendChild(averageDailySalary)
        var aliquotAmount = document.createElement('td')
        aliquotAmount.innerHTML = element.aliquotUtility.toFixed(2)
        document.getElementById('table-payments').children[1].children[currentRow].appendChild(aliquotAmount)
        var integralSalary = document.createElement('td')
        integralSalary.innerHTML = element.integralSalary.toFixed(2)
        document.getElementById('table-payments').children[1].children[currentRow].appendChild(integralSalary)
        var antiquityAmount = document.createElement('td')
        antiquityAmount.innerHTML = element.antiquityAmount.toFixed(2)
        totalAntiquity += element.antiquityAmount
        document.getElementById('table-payments').children[1].children[currentRow].appendChild(antiquityAmount)
        var interestAmount = document.createElement('td')
        interestAmount.innerHTML = element.interestAmount.toFixed(2)
        totalInterest += element.interestAmount
        document.getElementById('table-payments').children[1].children[currentRow].appendChild(interestAmount)
        result += element.interestAmount.toFixed(2)
        currentRow++
      }, this)

      var headerAverageDailySalary = document.createElement('th')
      headerAverageDailySalary.innerHTML = 'Average Daily Salary'
      document.getElementById('table-payments').children[0].children[0].appendChild(headerAverageDailySalary)
      var headerAliquotUtility = document.createElement('th')
      headerAliquotUtility.innerHTML = 'Aliquot Utility'
      document.getElementById('table-payments').children[0].children[0].appendChild(headerAliquotUtility)
      var headerIntegralSalary = document.createElement('th')
      headerIntegralSalary.innerHTML = 'Integral Salary'
      document.getElementById('table-payments').children[0].children[0].appendChild(headerIntegralSalary)
      var headerAntiquityAmount = document.createElement('th')
      headerAntiquityAmount.innerHTML = 'Antiquity Amount'
      document.getElementById('table-payments').children[0].children[0].appendChild(headerAntiquityAmount)
      var headerInterestAmount = document.createElement('th')
      headerInterestAmount.innerHTML = 'Interest Amount'
      document.getElementById('table-payments').children[0].children[0].appendChild(headerInterestAmount)

      var footer = document.createElement('tfoot').appendChild(document.createElement('tr'))
      var footerEmptyCell = document.createElement('td')
      footerEmptyCell.setAttribute('colspan','9')
      footer.appendChild(footerEmptyCell)
      var footerTotalAntiquity = document.createElement('td')
      footerTotalAntiquity.innerHTML = totalAntiquity.toFixed(2)
      footer.appendChild(footerTotalAntiquity)

      var footerTotalInterest = document.createElement('td')
      footerTotalInterest.innerHTML = totalInterest.toFixed(2)
      footer.appendChild(footerTotalInterest)
      document.getElementById('table-payments').appendChild(footer)
    }

    var workedTime = function (startDate, endDate) {
      var duration = {years: 0, months: 0, days: 0}
      if (startDate > endDate) {
        return duration
      }

      var endMonth = new Date(endDate).getMonth() + 1
      var startMonth = new Date(startDate).getMonth() + 1

      var startDay = new Date(startDate).getDate()
      var endDay = new Date(endDate).getDate()

      var startYear = new Date(startDate).getFullYear()
      var endYear = new Date(endDate).getFullYear()

      duration.years = endYear - startYear

      if (endMonth === startMonth) {
        if (duration.years > 0) {
          duration.years -= 1
          duration.months = 11
        }
        duration.months = 0
      } else if (endMonth < startMonth) {
        duration.months = endMonth + (12 - startMonth)
      } else {
        duration.months = endMonth - startMonth
      }

      if (endDay < startDay) {
        duration.days = endDay + (31 - startDay)
        duration.months -= 1
      } else if (endDay === startDay) {
        duration.days = 0
      } else {
        duration.days = endDay - startDay
      }

      return duration
      // 14 / 02 / 2001 08 / 02 / 2016
    }

    var getAntiquityOfPeriod = function (payments, antiquityDays, utilityDays, interest, vacationBonus) {
      var assignment = {
        averageDailySalary: null,
        aliquotUtility: null,
        integralSalary: null,
        antiquityAmount: null,
        interestAmount: null
      }
      payments.forEach(function (element) {
        assignment.averageDailySalary = (element.salary - element.deduction) / 7
        //assignment.averageDailySalary = (element.salary - element.deduction) / workedTime(element.startDate, element.endDate).days
        assignment.aliquotUtility = assignment.averageDailySalary * utilityDays / 360
        assignment.integralSalary = assignment.averageDailySalary + assignment.aliquotUtility + vacationBonus
        assignment.antiquityAmount = assignment.integralSalary * antiquityDays / $scope.payments.length
        assignment.interestAmount = assignment.antiquityAmount * interest / 100

      }, this)
      return assignment
    }
  })
