angular.module('prestacionesApp').factory('companiesService', function ($resource) {
  return $resource('api/v1/companies/:id', { id: '@_id'},
    { update: { method: 'put'} }
  )
})

angular.module('prestacionesApp').factory('employeesService', function ($resource) {
  return $resource('api/v1/employees/:id', { id: '@_id'},
    { update: { method: 'put'} }
  )
})

angular.module('prestacionesApp').factory('paymentsService', function ($resource) {
  return $resource('api/v1/payments/:id', { id: '@_id'},
    { update: { method: 'put'} }
  )
})