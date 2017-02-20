var express = require('express'); // importando a lib express
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var InsertQuery = require('mysql-insert-multiple');
var retornoProjeto = 0;
var sql = '';

var connOptions =  {
	host : 'localhost',
	user : 'root',
	password: '',
	database: 'criArt'
};

app.use(express.static('public'));
app.use(bodyParser.json());  //o body parser recebe um json e transforma em objeto para o servidor

app.get('/', function(req, res){
	res.redirect('/');

});

app.get('/projeto', function(req, res){
	res.redirect('/#/projeto');
});

app.get('/materiais', function(req, res){
	res.redirect('/#/materiais');
});

app.get('/listarProjetos', function(req, res){
	res.redirect('/#/listarProjetos');
});

app.get('/listarMateriais', function(req, res){
	res.redirect('/#/listarMateriais');
});

var pool =  mysql.createPool({
	host : 'localhost',
	user : 'root',
	password: '',
	multipleStatements: true,
	database: 'criArt'
});

app.get('/estoque/listar', function(req, res){
	var selectEstoque = 'SELECT * FROM estoque';
	pool.query(selectEstoque, function(err, rows){
		if(err) throw err;
		else {
			res.send(rows);
		}
	});
});

app.delete('/estoque/delItem/:id', function(req, res){
	var id = req.params.id;
	var deleteItemEstoque = 'DELETE FROM estoque WHERE id = ?';
	pool.query(deleteItemEstoque,id, function(err, rows){
		if(err) throw err;
		else {
			res.send(rows);
		}
	});
});


app.post('/estoque/salvarItem', function(req, res){
	var obj = req.body
	if (obj.nome != 'undefined' && obj.preco != 'undefined') {
		if(obj.metro == null){
			obj.metro = false;
		}
		var salvarItem = "INSERT INTO estoque SET ?";
		pool.query(salvarItem, obj, function(err, rows){
			if(err) throw err;
			else {
				res.send(true);
			}
		});
	}
});

app.put('/estoque/editarItem/:id', function(req, res){
	var obj = req.body
	var id = req.params.id;
	if (obj.nome != 'undefined' && obj.preco != 'undefined') {
		var editarItem = "UPDATE estoque SET ? WHERE id = "+id;
		pool.query(editarItem, obj, function(err, rows){
			if(err) throw err;
			else {
				res.send(true);
			}
		});
	}
});


app.post('/projeto/salvar', function(req, res){

	var obj = req.body;
	var projeto = obj.projeto;
	var itens = obj.itens;
	var itensUpdate = obj.itensUpdate;
	var count = itens.length;

	if (obj.nome != 'undefined' && obj.preco != 'undefined') {
		if(obj.metro == null){
			obj.metro = false;
		}
		var salvarProjeto = "INSERT INTO projetos SET ?";
		pool.query(salvarProjeto, projeto, function(err, rows){
			if(err) throw err;
			else {

				var selectIdProjetos = "SHOW TABLE STATUS LIKE 'projetos'";
				var count = itens.length;
				pool.query(selectIdProjetos, function(err, rows){
					if(err) throw err;
					else {
						retornoProjeto = rows[0].Auto_increment -1;
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
						pool.query(sql,function(err, rows){
							if(err) throw err;
							else {
								//fazer o update no estoque
								var updateMetro = 'UPDATE estoque SET metro = metro - ? WHERE id = ?';
								var updateQtd = 'UPDATE estoque SET quantidade = quantidade - ? WHERE id = ?';

								for (var i = 0; i < itensUpdate.length; i++) {
									if (itensUpdate[i].tipo == 'metro') {
										var item = {
											metro:itensUpdate[i].qtd,
											id:itensUpdate[i].id
										}
										pool.query(updateMetro, [item.metro, item.id], function(err, rows){
											if(err) throw err;
											else {
											}
										});
									}else if (itensUpdate[i].tipo == 'quantidade') {
										var item2 = {
											quantidade:itensUpdate[i].qtd,
											id:itensUpdate[i].id
										}
										pool.query(updateQtd,[item2.quantidade, item2.id],function(err, rows){
											if(err) throw err;
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

app.get('/projeto/listar', function(req, res){
	var selectProjeto = 'SELECT * FROM projetos';
	pool.query(selectProjeto, function(err, rows){
		if(err) throw err;
		else {
			res.send(rows);
		}
	});
});

app.get('/projeto/ItensProjeto/:id', function(req, res){
	var id = req.params.id;
	var selectItensProjeto = 'SELECT ip.*, e.nome FROM itensprojetos ip INNER JOIN estoque e ON '
	+'e.id = ip.idItem WHERE ip.idProjeto = ?';
	pool.query(selectItensProjeto, id, function(err, rows){
		if(err) throw err;
		else {
			res.send(rows);
		}
	});
});

app.get('/projeto/deletar/:id',function(req, res){
	var id = req.params.id;
	var deletProjeto = 'DELETE FROM projetos WHERE id = ?';
	pool.query(deletProjeto, id, function(err, rows){
		if(err) throw err;
		else {
			res.send(true);
		}
	});
});

app.post('/projeto/deletar/itens',function(req, res){
	var itens = req.body;
	var query = '';
	itens.forEach(function (item) {
		query += mysql.format("DELETE FROM itensprojetos WHERE id = ?; ", item.id);
	});
	pool.query(query, function(err, rows){
		if(err){
			res.send(err);
		}else {
			res.send(true);
		}
	});
});

app.put('/projeto/editar/itens',function(req,res){

});

app.put('/projeto/editar/:id',function(req,res){
	var projeto = req.body;
	var id = req.params.id;
	var updateProjeto = "UPDATE projetos SET ? WHERE id = "+id;
	 pool.query(updateProjeto,projeto, function(err, rows){
		 if(err) throw err;
		 else {
			 res.send(true);
		 }
	 });
});

app.listen(3000, function(){
	console.log('Servidor rodando na porta 3000!');
});
