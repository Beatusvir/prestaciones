angular.module('prestacionesApp').controller('employeeController', function (employeesService, companiesService, $scope, $rootScope, $location) {
  if (!$rootScope.authenticated) {
    console.log('not logged in, redirect')
    $location.path('/login')
  }
  $scope.employees = employeesService.query()
  $scope.companies = companiesService.query()
  $scope.isEdit = false
  $rootScope.selectedEmployee = null

  $scope.newEmployee = {firstName: null, lastName: null, jobTitle: null, identifier: null, basicSalary: null, startDate: null, endDate: null, companyId: null, aliquotVacationBonus: null, antiquityDays: null, created_at: null, created_by: null}
  $scope.selectedEmployee = null

  $scope.addPayments = function (e, employeeId) {
    $rootScope.selectedEmployee = employeeId
    $location.path('/payments')
  }

  $scope.deleteEmployee = function (e, employee) {
    if (confirm('Are you sure you want to delete ' + employee.firstName + ' ?')) {
      employeesService.delete({id: employee._id}, function () {
        refreshEmployees()
      })
    }
  }

  $scope.editEmployee = function (e, employee) {
    $scope.isEdit = true
    employee.startDate = new Date(employee.startDate)
    employee.endDate = new Date(employee.endDate)
    $scope.newEmployee = employee
  }

  $scope.post = function () {
    if ($scope.isEdit) {
      employeesService.update($scope.newEmployee, function () {
        $scope.isEdit = false
        refreshEmployees()
      })
    } else {
      $scope.newEmployee.created_at = Date.now()
      $scope.newEmployee.created_by = $rootScope.current_user.username
      employeesService.save($scope.newEmployee, function () {
        refreshEmployees()
      })
    }

  }
  var refreshEmployees = function () {
    $scope.employees = employeesService.query()
    $scope.companies = companiesService.query()
    $scope.newEmployee = {firstName: null, lastName: null, jobTitle: null, identifier: null, basicSalary: null, startDate: null, endDate: null, companyId: null, aliquotVacationBonus: null, antiquityDays: null, created_at: null, created_by: null}
  }
})