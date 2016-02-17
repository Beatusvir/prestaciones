'use strict'
var app = angular.module('prestacionesApp', ['ngRoute', 'ngResource', 'angularFileUpload', 'ngCookies'])
  .run(function ($rootScope, $http, $location, $cookies) {
    $rootScope.signout = function () {
      $http.get('/auth/signout')
      $rootScope.authenticated = false
      $rootScope.current_user = ''
    }

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      var user = JSON.parse($cookies.get('user'))
      if (user === null) {
        if (next.templateUrl === 'views/auth/login.html') {
        } else {
          $location.path('/login')
        }
      } else {
        $rootScope.authenticated = true
        $rootScope.current_user = user
      }
    })
  })

  .config(function ($routeProvider, $locationProvider) {
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
      .when('/payments/:empId', {
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
      .otherwise({redirectTo: '/'})
  })
