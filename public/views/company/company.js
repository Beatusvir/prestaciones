angular.module('prestacionesApp')
  .factory('companiesService', function ($resource) {
    return $resource('api/v1/companies/:id', { id: '@_id'},
      { update: { method: 'put'} }
    )
  })
  .controller('companyController', function (companiesService, FileUploader, $scope, $http, $rootScope, $location) {
    if (!$rootScope.authenticated) {
      console.log('not logged in, redirect')
      $location.path('/login')
    }
    var uploader = $scope.uploader = new FileUploader({
      url: ''
    })
    $scope.companies = companiesService.query()
    $scope.newCompany = {name: '', logo: '', utilityDays: '', interest: '', created_at: '', created_by: ''}

    $scope.post = function () {
      $scope.uploader.upload()
      $scope.newCompany.created_at = Date.now()
      $scope.newCompany.created_by = $rootScope.current_user.username
      companiesService.save($scope.newCompany, function () {
        $scope.companies = companiesService.query()
        $scope.newCompany = {name: '', logo: '', created_at: '', created_by: ''}
      })
    }

  })
