// Factory
myApp.factory('projetoFactory', function(){

	var projetoBack = function(nome, descricao, nomeCliente, telefoneCliente, enderecoCliente) {
		this.nome =  nome;
		this.descricao =  descricao;
		this.nomeCliente =  nomeCliente;
		this.telefoneCliente =  telefoneCliente;
		this.enderecoCliente = enderecoCliente;
	};

	var itemProjetoBack = function(idItem){
		this.idItem = idItem;
	}

	function convertItensProjetoBack(item){
		return new itemProjetoBack(
			item.idItem
			);
	}

	function convertProjetoToBack(obj){
		var objProjetoBack = {};
		objProjetoBack.itens = [];
		objProjetoBack.projeto = {};
		
		objProjetoBack.projeto = new projetoBack(
			obj.projeto.nomeProj,
			obj.projeto.nomeCli,
			obj.projeto.descricaoProj,
			obj.projeto.telCli,
			obj.projeto.endCli
			);

		for (var i = 0; i < obj.itens.length; i++) {
			objProjetoBack.itens.push(convertItensProjetoBack(obj.itens[i]));
		}

		return objProjetoBack;
	}

	var exports = {
		convertProjetoToBack:convertProjetoToBack
	};

	return exports;

});