myApp.controller("produtoCtrl", function($scope,$http,$timeout,produtosFactory){
	var vm = $scope;
	vm.produto = {};
	vm.cad = false;
	vm.flag = false;
	vm.sortKey = 'codigo';

	vm.isSortUp = function(fieldName){
		return vm.sortKey === fieldName && !vm.reverse;
	};

	vm.isSortDown = function(fieldName){
		return vm.sortKey === fieldName && vm.reverse;
	};


	vm.ordenar = function(nomeColuna){
		vm.sortKey = nomeColuna; 
		vm.reverse = !vm.reverse;
		// if(nomeColuna === 'codigo'){
		// 	vm.reverseCod = !vm.reverseCod;
		// 	vm.reverseNome = false;
		// }else if(nomeColuna === 'nome'){
		// 	vm.reverseNome = !vm.reverseNome;
		// 	vm.reverseCod = false;
		// }
	};

	vm.listarEstoque = function(){
		$http({
			method: 'GET',
			url: '/estoque/listar'
		}).then(function successCallback(response) {
			vm.data = produtosFactory.convertEstoqueToFront(response.data);	
		}, function errorCallback(response){
			alert(response.data);
		});
	}

	vm.incluirItem = function(obj){
		$http({
			method: 'POST',
			url: '/estoque/salvarItem',
			data:obj
		}).then(function successCallback(response) {
			vm.cad = true;
			$timeout(function() {
				vm.cad = false;
			}, 3000);	
			document.getElementById("nome").focus();
		}, function errorCallback(response){
			alert(response.data);
		});
		vm.produto = {};
		vm.flag = false;
	}

	vm.salvarEdicao = function(obj){
		var objConvert = produtosFactory.convertEstoqueToBack(obj);
		$http({
			method: 'PUT',
			url: '/estoque/editarItem/'+obj.codigo,
			data:objConvert
		}).then(function successCallback(response) {
			vm.edit = true;
			vm.closeModal();
			vm.listarEstoque();
			vm.idItem = obj.codigo;
			$timeout(function() {
				vm.edit = false;
				vm.idItem = '';
			}, 3000);	
		}, function errorCallback(response){
			alert(response.data);
		});
	}

	vm.deletarItem = function(id){
		$http({
			method: 'DELETE',
			url: '/estoque/delItem/'+id
		}).then(function successCallback(response) {
			vm.idItem = id;
			vm.remove = true;
			vm.listarEstoque();
			$timeout(function() {
				vm.remove = false;
				vm.idItem = '';
			}, 3000);
		}, function errorCallback(response){
			alert(response.data);
		});
	}

	vm.troca = function(){
		if (vm.flag == true) {
			vm.flag = false; 
			vm.produto.metro = '';
		}else{
			vm.flag = true
			vm.produto.quantidade = '';
		}
	}

	function openModal(){
		angular.element('#myModal').modal('show');
	}

	vm.closeModal = function(){
		angular.element('#myModal').modal('hide');
		vm.produto = {};
		vm.flag = false;
	}

	vm.editar = function(obj){
		vm.produto.nome = obj.nome;
		vm.produto.preco = obj.preco;
		vm.produto.codigo = obj.codigo;
		if (obj.metro != 0){
			vm.flag = true;
			vm.produto.metro = obj.metro;
		}
		if (obj.quantidade != 0){
			vm.flag = false;
			vm.produto.quantidade = obj.quantidade;
		}
		openModal();

	}

	vm.excluir = function(obj){

	}

	function activate(){
		vm.listarEstoque()
	}

	activate();
	
});