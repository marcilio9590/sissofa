angular.module('myApp')
.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'loginCtrl'
	})
	.when('/projeto', {
		templateUrl: 'views/projeto.html',
		controller: 'projetoCTRL'
	})
	.when('/listarProjetos', {
		templateUrl: 'views/listarProjetos.html',
		controller: 'projetoCTRL'
	})
	.when('/materiais', {
		templateUrl: 'views/produto.html',
		controller: 'produtoCtrl'
	})
	.when('/listarMateriais', {
		templateUrl: 'views/listarMateriais.html',
		controller: 'produtoCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
	$locationProvider.html5Mode(true);
});
