var express = require('express'); // importando a lib express
var app = express();
var bodyParser = require('body-parser');
var InsertQuery = require('mysql-insert-multiple');
var retornoProjeto = 0;

const pg = require('pg')
var config = {
	host: 'localhost', // server name or IP address;
	port: 5432,
	database: 'criart',
	user: 'postgres',
	password: '123456'
};

const pool = new pg.Pool(config);
app.use(express.static('public'));
app.use(bodyParser.json());  //o body parser recebe um json e transforma em objeto para o servidor

app.get('/estoque/listar', function (req, res) {
	var selectEstoque = 'SELECT * FROM estoque';
	pool.query(selectEstoque) // find the user from id;
		.then(function (data) {
			res.send(data.rows);
		})
});

app.delete('/estoque/delItem/:id', function (req, res) {
	var id = req.params.id;
	var deleteItemEstoque = 'DELETE FROM estoque WHERE id = $1';
	pool.query(deleteItemEstoque, [id]) // find the user from id;
		.then(function (data) {
			res.send(data.rows);
		}).catch(function (err) {
			console.log(err);
		});
});


app.post('/estoque/salvarItem', function (req, res) {
	var obj = req.body
	if (obj.nome != 'undefined' && obj.preco != 'undefined') {
		if (obj.metro == null) {
			obj.metro = 0;
		}
		if (obj.quantidade == "" || obj.quantidade == null) {
			obj.quantidade = 0;
		}
		var salvarItem = "INSERT INTO estoque(nome, preco, metro, quantidade) VALUES ($1, $2, $3, $4)";
		pool.query(salvarItem, [obj.nome, obj.preco, obj.metro, obj.quantidade]) // find the user from id;
			.then(function (data) {
				res.send(data.rows);
			}).catch(function (err) {
				console.log(err);
			})
	}
});

app.put('/estoque/editarItem/:id', function (req, res) {
	var obj = req.body;
	var id = req.params.id;
	if (obj.nome != 'undefined' && obj.preco != 'undefined') {
		var editarItem = "UPDATE estoque SET nome=$1, preco=$2, metro=$3, quantidade=$4 WHERE id = $5";
		for (var i = 0; i < obj.length; i++) {
			if(obj[i].metro == 'undefined' || obj[i].metro == null){
				obj[i].metro = 0;
			}
			if(obj[i].quantidade == 'undefined' || obj[i].quantidade == null){
				obj[i].quantidade = 0;
			}
			pool.query(editarItem, [obj[i].nome, obj[i].preco, obj[i].metro, obj[i].quantidade, id]) // find the user from id;
			.then(function (data) {
				res.send(data.rows);
			}).catch(function (err) {
				console.log(err);
			});
		}
	}
});


app.post('/projeto/salvar', function (req, res) {

	var obj = req.body;
	var projeto = obj.projeto;
	var itens = obj.itens;
	var itensUpdate = obj.itensUpdate;
	var count = itens.length;

	if (obj.nome != 'undefined' && obj.preco != 'undefined') {
		if (obj.metro == null) {
			obj.metro = false;
		}
		var salvarProjeto = "INSERT INTO projetos SET ?";
		pool.query(salvarProjeto, projeto, function (err, rows) {
			if (err) throw err;
			else {

				var selectIdProjetos = "SHOW TABLE STATUS LIKE 'projetos'";
				var count = itens.length;
				pool.query(selectIdProjetos, function (err, rows) {
					if (err) throw err;
					else {
						retornoProjeto = rows[0].Auto_increment - 1;
						if (itens.length > 0) {
							for (var i = 0; i < itens.length; i++) {
								itens[i].idProjeto = retornoProjeto;
							}
						}
						var Query = InsertQuery({
							table: 'itensprojetos',
							maxRow: count,
							data: itens
						})
						sql = Query.next();
						pool.query(sql, function (err, rows) {
							if (err) throw err;
							else {
								//fazer o update no estoque
								var updateMetro = 'UPDATE estoque SET metro = metro - ? WHERE id = ?';
								var updateQtd = 'UPDATE estoque SET quantidade = quantidade - ? WHERE id = ?';

								for (var i = 0; i < itensUpdate.length; i++) {
									if (itensUpdate[i].tipo == 'metro') {
										var item = {
											metro: itensUpdate[i].qtd,
											id: itensUpdate[i].id
										}
										pool.query(updateMetro, [item.metro, item.id], function (err, rows) {
											if (err) throw err;
											else {
											}
										});
									} else if (itensUpdate[i].tipo == 'quantidade') {
										var item2 = {
											quantidade: itensUpdate[i].qtd,
											id: itensUpdate[i].id
										}
										pool.query(updateQtd, [item2.quantidade, item2.id], function (err, rows) {
											if (err) throw err;
											else {
											}
										});
									}
								}
								res.send(true);
							}
						});
					}
				});

			}
		});
	}
});

app.get('/projeto/listar', function (req, res) {
	var selectProjeto = 'SELECT * FROM projetos';
	// console.log(pool);
	// pool.query(selectProjeto, function(err, rows){
	// 	if(err) throw err;
	// 	else {
	// 		res.send(rows);
	// 		console.log(rows);
	// 	}
	// });
	pool.query(selectProjeto) // find the user from id;
		.then(function (data) {
			res.send(data.rows);
		})
});

app.get('/projeto/ItensProjeto/:id', function (req, res) {
	var id = req.params.id;
	var selectItensProjeto = 'SELECT ip.*, e.nome FROM itensprojetos ip INNER JOIN estoque e ON '
		+ 'e.id = ip."idItem" WHERE ip."idProjeto" = $1';
	pool.query(selectItensProjeto, [id], function (err, result) { //Delete a record in de db
		if (err) {
			console.log(err);
		}
		else {
			res.send(result.rows);
		}
	});
	// pool.query(selectItensProjeto, id).then(function(data) {
	// 		res.send(data.rows);
	// }).catch(function (err) {
	//   return next(err);
	// });
});

app.get('/projeto/deletar/:id', function (req, res) {
	var id = req.params.id;
	var deletProjeto = 'DELETE FROM projetos WHERE id = ?';
	pool.query(deletProjeto, id, function (err, rows) {
		if (err) throw err;
		else {
			res.send(true);
		}
	});
});

app.post('/projeto/deletar/itens', function (req, res) {
	var itens = req.body;
	var query = '';
	console.log('montando query para deletar itens do projeto')
	itens.forEach(function (item) {
		query += mysql.format("DELETE FROM itensprojetos WHERE id = ?; ", item.id);
	});
	console.log(query);
	pool.query(query, function (err, rows) {
		if (err) {
			console.log('ação realizada com erro');
			res.send(err);
		} else {
			console.log('ação realizada com sucesso');
			res.send(true);
		}
	});
});

app.put('/projeto/editar/itens', function (req, res) {

});

app.put('/projeto/editar/:id', function (req, res) {
	var projeto = req.body;
	var id = req.params.id;
	var updateProjeto = "UPDATE projetos SET ? WHERE id = " + id;
	pool.query(updateProjeto, projeto, function (err, rows) {
		if (err) throw err;
		else {
			res.send(true);
		}
	});
});

app.listen(3000, function () {
	console.log('Servidor rodando na porta 3000!');
});
