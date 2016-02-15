'use strict'
var app = angular.module('prestacionesApp', ['ngRoute', 'ngResource', 'angularFileUpload']).run(function ($rootScope, $http) {
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
      templateUrl: 'views/main/main.html',
      controller: 'mainController'
    })
    // the login display
    .when('/login', {
      templateUrl: 'views/auth/login.html',
      controller: 'authController'
    })
    // the signup display
    .when('/register', {
      templateUrl: 'views/auth/register.html',
      controller: 'authController'
    })
    // show companies
    .when('/companies', {
      templateUrl: 'views/company/company.html',
      controller: 'companyController'
    })
    // show employees
    .when('/employees', {
      templateUrl: 'views/employee/employee.html',
      controller: 'employeeController'
    })
    // assignments
    .when('/payments', {
      templateUrl: 'views/payment/payment.html',
      controller: 'paymentController'
    })
    // when logged in
    .when('/auth/success', {
      templateUrl: 'views/main/main.html',
      controller: 'mainController'
    })
    // when failing to authenticate
    .when('/auth/failure', {
      templateUrl: 'views/auth/login.html',
      controller: 'authController'
    })
    // test structure
    .when('/test', {
      templateUrl: 'views/test/test.html',
      controller: 'testController'
    })
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
})
