'use strict'
angular.module('prestacionesApp')
  .factory('companiesService', function ($resource) {
    return $resource('api/v1/companies/:id', { id: '@_id'},
      { 'get': {method: 'GET'},
        'save': {method: 'POST'},
        'query': {method: 'GET', isArray: true},
        'remove': {method: 'DELETE'},
      'delete': {method: 'DELETE'} }
    )
  })
  .controller('companyController', function (companiesService, FileUploader, $scope, $http, $rootScope, $location) {
    if (!$rootScope.authenticated) {
      console.log('not logged in, redirect')
      $location.path('/login')
    }
    var uploader = $scope.uploader = new FileUploader({
      url: '/upload'
    })
    $scope.companies = companiesService.query()
    $scope.newCompany = {name: '', logo: '', utilityDays: '', interest: '', created_at: '', created_by: ''}

    $scope.deleteCompany = function (e, company) {
      if (confirm('Are you sure you want to delete ' + company.name + ' ?')) {
        companiesService.delete({id: company._id}, function () {
          refreshCompanies()
        })
      }
    }

    $scope.editCompany = function (e, company) {
      $scope.isEdit = true
      $scope.newCompany = company
    }

    var refreshCompanies = function () {
      $scope.companies = companiesService.query()
      $scope.newCompany = {name: '', logo: '', created_at: '', created_by: ''}
    }

    $scope.post = function () {
      $scope.uploader.uploadAll()
      $scope.newCompany.created_at = Date.now()
      $scope.newCompany.created_by = $rootScope.current_user.username
      companiesService.save($scope.newCompany, function () {
        refreshCompanies()
      })
    }

  })
