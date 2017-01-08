myApp.controller("projetoCTRL", function($scope,$http,projetoFactory,produtosFactory,$timeout){
	var vm = $scope;
	vm.step1 = true;
	vm.step2 = false;
	vm.mostra = false;
	vm.select = {};
	vm.valorMaior = false;
	vm.adicionadosProjeto = [];

	vm.listarEstoque = function(){
		$http({
			method: 'GET',
			url: '/estoque/listar'
		}).then(function successCallback(response) {
			vm.listEstoque = produtosFactory.convertEstoqueToFront(response.data);	
		}, function errorCallback(response){
			alert(response.data);
		});
	}

	vm.selecionar = function(item){
		vm.select = item;
		vm.mostra = true;
	}

	vm.adicionarItem = function(qtdProjeto,tipo){
		switch (tipo) {
			case 'quantidade':
			if (qtdProjeto > vm.select.quantidade) {
				vm.valorMaior = true;
				$timeout(function() {
					vm.valorMaior = false;
				}, 3000);
			}else{

				vm.select.novaQtd = qtdProjeto;
				vm.adicionadosProjeto.push(vm.select);	
				vm.select.qtdProjeto = '';
			}
			break;
			case 'metro':
			if (qtdProjeto > vm.select.metro) {
				vm.valorMaior = true;
				$timeout(function() {
					vm.valorMaior = false;
				}, 3000);
			}else{
				vm.select.novoMetro = qtdProjeto;
				vm.adicionadosProjeto.push(vm.select);
				vm.select.qtdProjeto = '';
			}
			break;	
			default:
				// statements_def
				break;
			}

		}
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

	vm.continuar = function(){
		vm.step1 = false;
		vm.step2 = true;
		vm.objTableProjeto = {};
		vm.listarEstoque();
	}





});