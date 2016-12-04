angular.module('myApp')
.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/projeto', {
		templateUrl: 'views/projeto.html',
		controller: 'projetoCTRL'
	})
	.when('/materiais', {
		templateUrl: 'views/produto.html',
		controller: 'produtoCtrl'
	}).otherwise({
		redirectTo: '/'
	});
	$locationProvider.html5Mode(true);
});
