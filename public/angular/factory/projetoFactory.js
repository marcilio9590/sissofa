// Factory
myApp.factory('projetoFactory', function () {

	var itemProjetoBack = function (idItem, tipo, metroAtual) {
		this.idItem = idItem;
		this.tipo = tipo;
		this.qtd = metroAtual;
	}

	var itemProjetoUpdateBack = function (idItem, idProjeto, tipo, metroAtual) {
		this.iditem = idItem;
		this.idprojeto = idProjeto;
		this.tipo = tipo;
		this.qtd = metroAtual;
	}

	function convertItensProjetoBack(item) {
		if (item.tipo === 'metro') {
			return new itemProjetoBack(
				item.codigo,
				item.tipo,
				item.novoMetro
			);
		} else if (item.tipo === 'quantidade') {
			return new itemProjetoBack(
				item.codigo,
				item.tipo,
				item.novaQtd
			);
		}
	}

	function convertItensUpdateProjetoBack(item) {
		if (item.tipo === 'metro') {
			return new itemProjetoUpdateBack(
				item.idItem ? item.idItem : item.codigo,
				item.idProjeto,
				item.tipo,
				item.qtd ? item.qtd : item.novoMetro
			);
		} else if (item.tipo === 'quantidade') {
			return new itemProjetoUpdateBack(
				item.idItem ? item.idItem : item.codigo,
				item.idProjeto,
				item.tipo,
				item.qtd ? item.qtd : item.quantidade
			);
		}

	}

	var projetoBack = function (nome, descricao, nomeCliente, telefoneCliente, enderecoCliente) {
		this.nome = nome;
		this.descricao = descricao;
		this.nomeCliente = nomeCliente;
		this.telefoneCliente = telefoneCliente;
		this.enderecoCliente = enderecoCliente;
	};

	function convertProjetoToBack(obj) {
		var objProjetoBack = {};
		objProjetoBack.itens = [];
		objProjetoBack.projeto = {};
		objProjetoBack.itensUpdate = [];
		objProjetoBack.projeto = new projetoBack(
			obj.projeto.nomeProj,
			obj.projeto.descricaoProj,
			obj.projeto.nomeCli,
			obj.projeto.telCli,
			obj.projeto.endCli
		);

		for (var i = 0; i < obj.itens.length; i++) {
			objProjetoBack.itens.push(convertItensProjetoBack(obj.itens[i]));
		}
		for (var i = 0; i < obj.itens.length; i++) {
			objProjetoBack.itensUpdate.push(convertItensUpdateProjetoBack(obj.itens[i]));
		}

		return objProjetoBack;
	}
	function Projeto(codigo, nomeProj, descrProj, nomeClie, telCli, endCli) {
		this.codigo = codigo;
		this.nomeProj = nomeProj;
		this.descrProj = descrProj;
		this.nomeClie = nomeClie;
		this.telCli = telCli;
		this.endCli = endCli;
	}
	function convertProjetoFront(item) {
		return new Projeto(
			item.id,
			item.nome,
			item.descricao,
			item.nomecliente,
			item.telefonecliente,
			item.enderecocliente
		);
	}
	function convertProjetoToFront(itens) {
		listProjetos = [];
		for (var i = 0; i < itens.length; i++) {
			listProjetos.push(convertProjetoFront(itens[i]));
		}
		return listProjetos;
	}

	var ItemProjetoFront = function (id, idProjeto, idItem, qtd, tipo, nome) {
		this.id = id;
		this.idProjeto = idProjeto;
		this.idItem = idItem;
		this.qtd = qtd;
		this.tipo = tipo;
		this.nome = nome;
	}

	function convertItemsProjetoFront(item) {
		return new ItemProjetoFront(
			item.id,
			item.idprojeto,
			item.iditem,
			item.qtd,
			item.tipo,
			item.nome
		);
	}
	var ItemDeletBack = function (id) {
		this.id = id;
	}

	function convertDeletItensToBack(item) {
		return new ItemDeletBack(
			item.id);
	}

	function convertItensProjetoToFront(items) {
		listItems = [];
		for (var i = 0; i < items.length; i++) {
			listItems.push(convertItemsProjetoFront(items[i]));
		}
		return listItems;
	}

	function convertItensToBack(items) {
		listItems = [];
		for (var i = 0; i < items.length; i++) {
			listItems.push(convertDeletItensToBack(items[i]));
		}
		return listItems;
	}



	var exports = {
		convertProjetoToBack: convertProjetoToBack,
		convertProjetoToFront: convertProjetoToFront,
		convertItensToBack: convertItensToBack,
		convertItensProjetoToFront: convertItensProjetoToFront
	};

	return exports;

});