angular.module('prestacionesApp').controller('mainController', function (companiesService, employeesService, $location, $scope, $rootScope) {
  $scope.companies = companiesService.query()
  $scope.employees = employeesService.query()

  $scope.companiesClass = function () {
    return $scope.companies.length > 0 ? 'link-enabled' : 'link-disabled'
  }
  $scope.employeesClass = function () {
    return $scope.employees.length > 0 ? 'link-enabled' : 'link-disabled'
  }
  $scope.redirectCompanies = function(){
    $location.path('/companies')
  }
  $scope.redirectEmployees = function(){
    $location.path('/employees')
  }
})
