angular.module('prestacionesApp').controller('mainController', function (companiesService, $scope, $rootScope) {
  $scope.companies = companiesService.query()

  $scope.companiesClass = function () {
    return $scope.companies.length > 0 ? 'link-enabled' : 'link-disabled'
  }
})