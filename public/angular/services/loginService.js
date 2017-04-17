myApp.service('loginService', function ($http) {
  var logado = false;

  function login(user) {
    return $http({
      method: 'POST',
      url: '/login',
      data: user
    });
  }

  function consultarSessao() {
    return $http({
      method: 'GET',
      url: '/sessaoConsultar'
    });
  }

  function logout() {
    return $http({
      method: 'GET',
      url: '/logout'
    });
  }

  var exports = {
    login: login,
    consultarSessao: consultarSessao,
    logout: logout
  }
  return exports;
});