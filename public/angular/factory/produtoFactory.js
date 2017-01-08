// Factory
myApp.factory('produtosFactory', function(){
	
	var Estoque = function(codigo, nome, preco, metro, quantidade) {
		this.codigo =  codigo;
		this.nome =  nome;
		this.preco =  preco;
		this.metro =  metro;
		this.quantidade =  quantidade;
	};

	var EstoqueBack = function(nome, preco, metro, quantidade) {
		this.nome =  nome;
		this.preco =  preco;
		this.metro =  metro;
		this.quantidade =  quantidade;
	};

	function convertEstoqueToFront(estoque){
		var listEstoque = [];
		for (var i = 0; i < estoque.length; i++) {
			listEstoque.push(
				new Estoque(
					estoque[i].id,
					estoque[i].nome,
					estoque[i].preco,
					estoque[i].metro,
					estoque[i].quantidade
					));
		}
		return listEstoque;
	}

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
		convertEstoqueToFront:convertEstoqueToFront,
		convertEstoqueToBack:convertEstoqueToBack
	};

	return exports;

});