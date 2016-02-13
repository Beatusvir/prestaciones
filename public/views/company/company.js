angular.module('prestacionesApp').controller('companyController', function (companiesService, $scope, $http, $rootScope, $location) {
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