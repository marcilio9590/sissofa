myApp.controller("projetoCTRL", function($scope,$http,projetoFactory,produtosFactory,$timeout){
	var vm = $scope;
	vm.step1 = true;
	vm.step2 = false;
	vm.mostra = false;
	vm.mostraRemover = false;
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
		if (item.quantidade == 0 && item.metro == 0) {
			vm.estoqueVazio = true;
			vm.mostra = false;
		}else{
			vm.estoqueVazio = false;
			vm.mostra = true;
		}

	}
	vm.selectDireia = function(item){
		vm.selectDireita = item;
		vm.mostraRemover = true;
	}

	vm.removerItem = function(){
		for (var i = 0; i < vm.listEstoque.length; i++) {
			if(vm.listEstoque[i].codigo == vm.selectDireita.codigo){
				if (vm.selectDireita.tipo == "quantidade") {
					vm.listEstoque[i].quantidade += vm.selectDireita.novaQtd; 
					vm.estoqueVazio = false;
				}else if(vm.selectDireita.tipo == "metro"){
					vm.listEstoque[i].metro += vm.selectDireita.novoMetro;
					vm.estoqueVazio = false;
				}
			}
		}
		if(vm.select.codigo === vm.selectDireita.codigo){
			vm.mostra = true;
		}
		for (var i = 0; i < vm.adicionadosProjeto.length; i++) {
			if(vm.adicionadosProjeto[i].codigo === vm.selectDireita.codigo){
				vm.adicionadosProjeto.splice(i,1);
				vm.mostraRemover = false;
			}
		}	
	}

	vm.adicionarItem = function(qtdProjeto,tipo){
		switch (tipo) {
			case 'quantidade':
			if (qtdProjeto > vm.select.quantidade || qtdProjeto <= 0) {
				vm.valorMaior = true;
				$timeout(function() {
					vm.valorMaior = false;
				}, 3000);
			}else{
				vm.select.novaQtd = qtdProjeto;
				vm.select.quantidade = vm.select.quantidade - qtdProjeto;
				vm.select.tipo = "quantidade";
				vm.adicionadosProjeto.push(vm.select);	
				vm.select.qtdProjeto = '';
				vm.estoqueVazio = false;
				if (vm.select.quantidade == 0) {
					vm.estoqueVazio = true;
					vm.mostra = false;
				}
				
			}
			break;
			case 'metro':
			if (qtdProjeto > vm.select.metro || qtdProjeto <= 0) {
				vm.valorMaior = true;
				$timeout(function() {
					vm.valorMaior = false;
				}, 3000);
			}else{
				vm.select.novoMetro = qtdProjeto;
				vm.select.metro = vm.select.metro - qtdProjeto;
				vm.select.tipo = "metro";
				vm.adicionadosProjeto.push(vm.select);
				vm.select.qtdProjeto = '';
				vm.estoqueVazio = false;
				if (vm.select.metro == 0) {
					vm.estoqueVazio = true;
					vm.mostra = false;
				}
				
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