myApp.controller("produtoCtrl", function($scope,$http){
	var vm = $scope;
	vm.produto = {};

	vm.data = [{
		"codigo":1,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":2,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":3,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":4,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":5,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":6,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":7,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":8,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":9,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":10,
		"nome":"espuma",
		"preco":25.00
	},{
		"codigo":11,
		"nome":"espuma",
		"preco":25.00
	}];

	function openModal(){
		angular.element('#myModal').modal('show');
	}
	vm.closeModal = function(){
		angular.element('#myModal').modal('hide');
		vm.produto = {};
	}
	vm.editar = function(obj){
		vm.produto.nome = obj.nome;
		vm.produto.preco = obj.preco;
		vm.produto.codigo = obj.codigo;
		openModal();

	}

	vm.excluir = function(obj){

	}

});