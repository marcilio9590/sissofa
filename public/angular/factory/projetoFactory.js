// Factory
myApp.factory('projetoFactory', function(){

	var EstoqueBack = function(nome, preco, metro, quantidade) {
		this.nome =  nome;
		this.preco =  preco;
		this.metro =  metro;
		this.quantidade =  quantidade;
	};

	function convertEstoqueToBack(estoque){
		var listEstoqueBack = [];
		listEstoqueBack.push(
			new EstoqueBack(
				estoque.nome,
				estoque.preco,
				estoque.metro,
				estoque.quantidade
				));
		return listEstoqueBack;
	}



	var exports = {
		convertEstoqueToBack:convertEstoqueToBack
	};

	return exports;

});