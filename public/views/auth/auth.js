angular.module('prestacionesApp')
  .controller('authController', function($scope, $http, $rootScope, $location, $cookies, $mdToast) {
    $scope.user = {
      username: null,
      password: null
    }
    $scope.error_message = null
    $scope.confirmPassword = null

    $scope.validatePassword = function() {
      if ($scope.confirmPassword !== $scope.user.password) {
        $scope.error_message = "Password doesn't match"
        return false
      }
      $rootScope.loggedInUser = $scope.user
      return true
    }

    $scope.login = function() {
      $http.post('/auth/login', $scope.user).success(function(data) {
        if (data.state == 'success') {
          $cookies.put('user', JSON.stringify(data.user))
          $rootScope.authenticated = true
          $rootScope.current_user = data.user
          $location.path('/')
        } else {
          $mdToast.show(
            $mdToast.simple()
            .textContent(data.message)
            .position($rootScope.getToastPosition())
            .hideDelay(3000)
          )
        }
      })
    }

    $scope.signout = function() {
      $rootScope.signout()
    }

    $scope.register = function() {
      if ($scope.validatePassword()) {
        $scope.error_message = null
        $http.post('/auth/signup', $scope.user).success(function(data) {
          if (data.state == 'success') {
            $rootScope.authenticated = true
            $rootScope.current_user = data.user
            $location.path('/')
          } else {
            $mdToast.show(
              $mdToast.simple()
              .textContent(data.message)
              .position($rootScope.getToastPosition())
              .hideDelay(3000)
            )
          }
        })
      }
    }
  })
