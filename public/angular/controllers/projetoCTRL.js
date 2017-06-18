myApp.controller("projetoCTRL", function ($scope, $http, projetoFactory, produtosFactory,projetoService, $timeout) {
	var vm = $scope;
	vm.step1 = true;
	vm.step2 = false;
	vm.mostra = false;
	vm.mostraRemover = false;
	vm.select = {};
	vm.valorMaior = false;
	vm.achouIgual = false;
	vm.cadOk = false;
	vm.projDelet = false;
	vm.adicionadosProjeto = [];
	vm.mostraBotao = [];
	vm.projeto = {};
	vm.botaoRadio = 0;
	vm.botaoRadioDireita = 0;

	vm.listarEstoque = function () {
		$http({
			method: 'GET',
			url: '/estoque/listar'
		}).then(function successCallback(response) {
			vm.listEstoque = produtosFactory.convertEstoqueToFront(response.data);
		}, function errorCallback(response) {
			alert(response.data);
		});
	}

	vm.editarProjeto = function (projeto) {
		vm.projeto.nomeCli = projeto.nomeClie;
		vm.projeto.telCli = projeto.telCli;
		vm.projeto.endCli = projeto.endCli;
		vm.projeto.nomeProj = projeto.nomeProj;
		vm.projeto.descricaoProj = projeto.descrProj;
		vm.projeto.codigo = projeto.codigo;
		vm.adicionadosProjeto = projeto.itensProjeto;
		$("#myModal").modal();
	}

	vm.selecionar = function (item) {
		vm.select = item;
		vm.botaoRadio = item.codigo;
		if (item.quantidade == 0 && item.metro == 0) {
			vm.estoqueVazio = true;
			vm.mostra = false;
		} else {
			vm.estoqueVazio = false;
			vm.mostra = true;
		}

	}
	vm.selectDireitaFunction = function (item) {
		vm.selectDireita = item;
		vm.botaoRadioDireita = item.codigo;
		vm.mostraRemover = true;
		if (!angular.isUndefined(item.codigo)) {
			vm.botaoRadioDireita = item.codigo;
		} else {
			vm.botaoRadioDireita = item.idItem;
		}

	}

	vm.removerItem = function () {
		if (!angular.isUndefined(vm.selectDireita.codigo)) {

			for (var i = 0; i < vm.listEstoque.length; i++) {
				if (vm.listEstoque[i].codigo == vm.selectDireita.codigo) {
					if (vm.selectDireita.tipo == "quantidade") {
						vm.listEstoque[i].quantidade += vm.selectDireita.qtd;
						vm.estoqueVazio = false;
					} else if (vm.selectDireita.tipo == "metro") {
						vm.listEstoque[i].metro += vm.selectDireita.qtd;
						vm.estoqueVazio = false;
					}
				}
			}
			if (vm.select.codigo === vm.selectDireita.codigo) {
				vm.mostra = true;
			}
			for (var i = 0; i < vm.adicionadosProjeto.length; i++) {
				if (vm.adicionadosProjeto[i].codigo === vm.selectDireita.codigo) {
					vm.adicionadosProjeto.splice(i, 1);
					vm.mostraRemover = false;
					vm.botaoRadioDireita = 0;
				}
			}

		} else {

			for (var i = 0; i < vm.listEstoque.length; i++) {
				if (vm.listEstoque[i].codigo == vm.selectDireita.idItem) {
					if (vm.selectDireita.tipo == "quantidade") {
						vm.listEstoque[i].quantidade += vm.selectDireita.qtd;
						vm.estoqueVazio = false;
					} else if (vm.selectDireita.tipo == "metro") {
						vm.listEstoque[i].metro += vm.selectDireita.qtd;
						vm.estoqueVazio = false;
					}
				}
			}
			if (vm.select.codigo === vm.selectDireita.idItem) {
				vm.mostra = true;
			}
			for (var i = 0; i < vm.adicionadosProjeto.length; i++) {
				if (vm.adicionadosProjeto[i].idItem === vm.selectDireita.idItem) {
					vm.adicionadosProjeto.splice(i, 1);
					vm.mostraRemover = false;
					vm.botaoRadioDireita = 0;
				}
			}
		}
	}

	vm.adicionarItem = function (qtdProjeto, tipo) {
		switch (tipo) {
			case 'quantidade':
				if (qtdProjeto > vm.select.quantidade || qtdProjeto <= 0) {
					vm.valorMaior = true;
					$timeout(function () {
						vm.valorMaior = false;
					}, 3000);
				} else {
					vm.select.novaQtd = qtdProjeto;
					vm.select.quantidade = vm.select.quantidade - qtdProjeto;
					if (vm.select.quantidade == 0) {
					}
					vm.select.tipo = "quantidade";
					if (vm.adicionadosProjeto.length > 0) {
						for (var i = 0; i < vm.adicionadosProjeto.length; i++) {
							if (!angular.isUndefined(vm.adicionadosProjeto[i].codigo)) {
								if (vm.adicionadosProjeto[i].codigo === vm.select.codigo) {
									vm.adicionadosProjeto[i].novaQtd += qtdProjeto;
									vm.achouIgual = true;
								}
							} else {
								if (vm.adicionadosProjeto[i].idItem === vm.select.codigo) {
									vm.adicionadosProjeto[i].qtd += qtdProjeto;
									vm.achouIgual = true;
								}
							}
						}
					}
					if (!vm.achouIgual) {
						vm.adicionadosProjeto.push(vm.select);
					}

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
					$timeout(function () {
						vm.valorMaior = false;
					}, 3000);
				} else {
					vm.select.novoMetro = qtdProjeto;
					vm.select.metro = vm.select.metro - qtdProjeto;
					vm.select.tipo = "metro";

					if (vm.adicionadosProjeto.length > 0) {
						for (var i = 0; i < vm.adicionadosProjeto.length; i++) {
							//if usado para editar projeto
							if (!angular.isUndefined(vm.adicionadosProjeto[i].codigo)) {
								if (vm.adicionadosProjeto[i].codigo === vm.select.codigo) {
									vm.adicionadosProjeto[i].novoMetro += qtdProjeto;
									vm.achouIgual = true;
								}
							} else {
								if (vm.adicionadosProjeto[i].idItem === vm.select.codigo) {
									vm.adicionadosProjeto[i].qtd += qtdProjeto;
									vm.achouIgual = true;
								}
							}
						}
					}
					if (!vm.achouIgual) {
						vm.adicionadosProjeto.push(vm.select);
						vm.achouIgual = false;
					}

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

	vm.SalvarProjeto = function () {
		var data = {
			"projeto": vm.step1Ojbj,
			"itens": vm.adicionadosProjeto
		};
		var converterd = projetoFactory.convertProjetoToBack(data);

		$http({
			method: 'POST',
			url: '/projeto/salvar',
			data: converterd
		}).then(function successCallback(response) {
			vm.step1 = true;
			vm.projeto = {};
			vm.step2 = false;
			vm.adicionadosProjeto = [];
			vm.cadOk = true;
			$timeout(function () {
				vm.cadOk = false;
			}, 3000);
		}, function errorCallback(response) {
			alert(response);
		});
	}

	vm.listarProjetos = function () {
		return $http({
			method: 'GET',
			url: '/projeto/listar'
		}).then(function successCallback(response) {
			vm.data = projetoFactory.convertProjetoToFront(response.data);
			if (vm.data.length > 0) {
				for (var i = 0; i < vm.data.length; i++) {
					vm.buscarItens(vm.data[i].codigo, i);
				}
			}
		}, function errorCallback(response) {
			alert(response.data);
		});
	}

	vm.buscarItens = function (codigo, index) {
		$http({
			method: 'GET',
			url: '/projeto/ItensProjeto/' + codigo
		}).then(function successCallback(response) {
			vm.data[index].itensProjeto = projetoFactory.convertItensProjetoToFront(response.data);
			// vm.itensProjeto = response.data;

		}, function errorCallback(response) {
			alert(response.data);
		});
	}

	$scope.sort = function (keyname) {
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	}

	vm.deletarProjeto = function (idProjeto) {
		if (!angular.isUndefined(idProjeto)) {
			$http({
				method: 'GET',
				url: '/projeto/ItensProjeto/' + idProjeto
			}).then(function successCallback(response) {
				if (response.data.length > 0) {
					var itensDelete = projetoFactory.convertItensToBack(response.data);
					$http({
						method: 'POST',
						url: 'projeto/deletar/itens',
						data: itensDelete
					}).then(function successCallback(response) {
						if (response.data) {
							$http({
								method: 'GET',
								url: '/projeto/deletar/' + idProjeto
							}).then(function successCallback(response) {
								vm.listarProjetos();
								vm.projDelet = true;
							}, function errorCallback(response) {
								alert('Não foi possível realizar esta operação!');
							});
						} else {
							alert('Não foi possível realizar esta operação!');
						}

					}, function errorCallback(response) {
						alert(response.data);
					});
				} else if (response.data.length === 0) {
					$http({
						method: 'GET',
						url: '/projeto/deletar/' + idProjeto
					}).then(function successCallback(response) {
						vm.listarProjetos();
						vm.projDelet = true;
					}, function errorCallback(response) {
						alert('Não foi possível realizar esta operação!');
					});
				}
			}, function errorCallback(response) {
				alert(response.data);
			});
		}
	}

	vm.mostrarEsconder = function (index) {
		vm.mostraBotao[index] = !vm.mostraBotao[index];
	}
	vm.continuar = function () {
		vm.step1 = false;
		vm.step1Ojbj = vm.projeto;
		vm.step2 = true;
		vm.objTableProjeto = {};
		vm.listarEstoque();
	}

	vm.salvarEdicao = function () {

	}

	vm.voltarStep1 = function(){
		vm.step1 = true;
		vm.step2 = false;
	}

	vm.removerItemBase = function(){
		var array = [
			{
				"id":vm.selectDireita.id
			}
		];
		projetoService.apagarItemProjeto(array).then(function successCallback() {
			vm.listarProjetos().then(function successCallback(){
				for (var i = 0; i < vm.adicionadosProjeto.length; i++) {
				if (vm.adicionadosProjeto[i].id === vm.selectDireita.id) {
					vm.adicionadosProjeto.splice(i, 1);
					vm.mostraRemover = false;
					vm.botaoRadioDireita = 0;
				}
			}
			}).catch(function error(res){
				console.log("ERRO "+res)
			});
		}, function errorCallback(response) {
			alert(response.data);
		});
	}
	function activate() {
		vm.listarProjetos();
	}
	activate();

	//função que é ativada quando o modal de edição é fechado
	$('#myModal').on('hidden.bs.modal', function (e) {
		vm.step1 = true;
		vm.step2 = false;
	})

});
