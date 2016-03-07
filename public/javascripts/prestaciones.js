'use strict'
var app = angular.module('prestacionesApp', ['ngRoute', 'ngResource', 'angularFileUpload', 'ngCookies', 'ngMaterial'])
  .run(function($rootScope, $http, $location, $cookies) {
    $rootScope.signout = function() {
      $http.get('/auth/signout')
      $cookies.remove('user')
      $rootScope.authenticated = false
      $rootScope.current_user = ''
      $location.path('/login')
    }

    $rootScope.goHome = function() {
      $location.path('/')
    }
    $rootScope.last = {
      bottom: true,
      top: false,
      left: false,
      right: false
    };
    $rootScope.toastPosition = angular.extend({}, $rootScope.last)
    $rootScope.getToastPosition = function() {
      $rootScope.sanitizePosition()
      return Object.keys($rootScope.toastPosition)
        .filter(function(pos) {
          return $rootScope.toastPosition[pos]
        })
        .join(' ')
    }

    $rootScope.sanitizePosition = function() {
      var current = $rootScope.toastPosition
      if (current.bottom && $rootScope.last.top) current.top = false
      if (current.top && $rootScope.last.bottom) current.bottom = false
      if (current.right && $rootScope.last.left) current.left = false
      if (current.left && $rootScope.last.right) current.right = false
      $rootScope.last = angular.extend({}, current)
    }

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if ($cookies.get('user')) {
        var user = JSON.parse($cookies.get('user'))
        if (user === null) {
          if (next.templateUrl !== 'views/auth/register.html' || next.templateUrl !== 'views/auth/login.html') {
            $location.path('/login')
          }
        } else {
          $rootScope.authenticated = true
          $rootScope.current_user = user
        }
      } else {
        if (next.templateUrl === 'views/auth/register.html') {
          $location.path('/register')
        } else {
          $location.path('/login')
        }
      }
    })
  })
  .config(function($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
    $mdIconProvider
      .icon('menu', '../images/menu.svg', 512)
      .icon('companies', '../images/companies.svg', 512)
      .icon('employees', '../images/employees.svg', 512)
      .icon('signout', '../images/signout.svg', 512)
      .icon('receipt', '../images/receipt.svg', 512)
      .icon('home', '../images/home.svg', 512)
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('pink')
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
      .otherwise({
        redirectTo: '/'
      })
  })
