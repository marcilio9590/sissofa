myApp.controller("projetoCTRL", function($scope,$http){
	var vm = $scope;

	vm.data = [{
		"codigo":1,
		"nomeProj":"Sofá 2 lugares",
		"descrProj":"sofa de 2 lugares revestido com (tipo do tecido)...",
		"nomeClie":"Rubens Barrichello",
		"telCli":"(81) 99999-9999"
	},{
		"codigo":2,
		"nomeProj":"Sofá 2 lugares",
		"descrProj":"sofa de 2 lugares revestido com (tipo do tecido)...",
		"nomeClie":"Maria da Silva",
		"telCli":"(81) 99999-9999"
	},{
		"codigo":3,
		"nomeProj":"Sofá 2 lugares",
		"descrProj":"sofa de 2 lugares revestido com (tipo do tecido)...",
		"nomeClie":"Maria da Silva",
		"telCli":"(81) 99999-9999"
	},{
		"codigo":4,
		"nomeProj":"Sofá 2 lugares",
		"descrProj":"sofa de 2 lugares revestido com (tipo do tecido)...",
		"nomeClie":"Marcos dos santos",
		"telCli":"(81) 99999-9999"
	},{
		"codigo":5,
		"nomeProj":"Sofá 2 lugares",
		"descrProj":"sofa de 2 lugares revestido com (tipo do tecido)...",
		"nomeClie":"Sandra Regina",
		"telCli":"(81) 99999-9999"
	},{
		"codigo":6,
		"nomeProj":"Sofá 4 lugares",
		"descrProj":"sofa de 2 lugares revestido com (tipo do tecido)...",
		"nomeClie":"Marcela Araujo",
		"telCli":"(81) 99999-9999"
	}];

	$scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	}

});