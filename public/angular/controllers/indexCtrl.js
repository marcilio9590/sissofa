myApp.controller("indexCTRL", function ($scope, $http, loginService, $location, $window) {
	var vm = $scope;
	vm.logado = false;
	vm.erroLogin = false;
	vm.efetuarLogin = function (user) {
		loginService.login(user).then(function (response) {
			if (response.data.length > 0) {
				vm.user = response.data[0];
				vm.logado = true;
				vm.erroLogin = false;
			} else {
				vm.erroLogin = true;
				vm.loginAviso = "Dados não encontrados.";
			}
		}).catch(function (err) {
			vm.loginAviso = "Erro no serviço de login.";
		});

	}

	function consultaSessao() {
		loginService.consultarSessao().then(function (response) {
			var user = response.data;
			if (user) {
				vm.logado = true;
			} else {
				vm.logado = false;
				$location.path('/');
			}
		}).catch(function (err) {
			vm.loginAviso = "Erro no serviço de login.";
		});
	}

	vm.logout = function () {
		loginService.logout().then(function (response) {
			vm.logado = false;
			$location.path('/');
			$window.location.reload();
		}).catch(function (err) {
			vm.loginAviso = "Erro no serviço de login.";
		});
	}

	function activate() {
		consultaSessao();
	}

	activate();
});

