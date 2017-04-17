var express = require('express'); // importando a lib express
var app = express();
var bodyParser = require('body-parser');
var InsertQuery = require('mysql-insert-multiple');
var mysql = require('mysql');
var md5 = require('md5');
var session = require('express-session');

var retornoProjeto = 0;

app.set('port', (process.env.PORT || 5000));


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());  //o body parser recebe um json e transforma em objeto para o servidor

app.use(session({
	secret: "6a54sd65a4sd651as65d",
	resave: false,
	saveUninitialized: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


const pg = require('pg')

/**
 * Localhost DEV
 */
// var config = {
// 	host: 'localhost', // server name or IP address;
// 	port: 5432,
// 	database: 'criart',
// 	user: 'postgres',
// 	password: '123456'
// };

/**
 * Heroku Base
 */
var config = {
	host: 'ec2-107-20-195-181.compute-1.amazonaws.com', // server name or IP address;
	port: 5432,
	database: 'd8emb3s8qqvb61',
	user: 'lzsjaoysjdcmdk',
	password: 'a07b7e3000e365934f5006accd93e5d8d30d7e39eee6b6b7475a44cda93a8dd1'
};

const pool = new pg.Pool(config);

app.post('/login', function (req, res) {
	var user = req.body;
	user.senha = md5(user.senha);
	var selectUser = 'SELECT * FROM usuarios WHERE login = $1 and senha = $2';
	pool.query(selectUser, [user.login, user.senha]) // find the user from id;
		.then(function (data) {
			if (data.rows.length > 0) {
				req.session.user = data.rows[0];
			}
			res.send(data.rows);
		}).catch(function (err) {
			console.log(err);
		});
});

app.get('/sessaoConsultar', function (req, res) {
	res.send(req.session.user);
});

app.get('/logout', function (req, res) {
	req.session.user = null;
	res.send(req.session.user);
});

app.get('/estoque/listar', function (req, res) {
	var selectEstoque = 'SELECT * FROM estoque';
	pool.query(selectEstoque) // find the user from id;
		.then(function (data) {
			res.send(data.rows);
		}).catch(function (err) {
			console.log(err);
		});
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
			// obj.metro = 0;
		}
		if (obj.quantidade == "" || obj.quantidade == null) {
			// obj.quantidade = 0;
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
			if (obj[i].metro == 'undefined' || obj[i].metro == null) {
				obj[i].metro = 0;
			}
			if (obj[i].quantidade == 'undefined' || obj[i].quantidade == null) {
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
		// var salvarProjeto = "INSERT INTO projetos SET ?";
		var salvarProjeto = "INSERT INTO public.projetos(nome, descricao, nomeCliente, telefoneCliente, enderecoCliente)VALUES ($1, $2, $3, $4, $5) RETURNING id";
		// pool.query(salvarProjeto, projeto, function (err, rows) {
		pool.query(salvarProjeto, [projeto.nome, projeto.descricao, projeto.nomeCliente, projeto.telefoneCliente, projeto.enderecoCliente]).then(function (data) {
			console.log('executou salvar projeto');
			var count = itens.length;
			retornoProjeto = data.rows[0].id;
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
			console.log(itens);
			sql = replaceAll(sql, '`', '');
			sql = replaceAll(sql, '´', '');
			pool.query(sql).then(function (data) {
				console.log('executou salvar itens projetos');
				var updateMetro = 'UPDATE estoque SET metro = metro - $1 WHERE id = $2';
				var updateQtd = 'UPDATE estoque SET quantidade = quantidade - $1 WHERE id = $2';
				for (var i = 0; i < itensUpdate.length; i++) {
					if (itensUpdate[i].tipo == 'metro') {
						var item = {
							metro: itensUpdate[i].qtd,
							id: itensUpdate[i].id
						}
						pool.query(updateMetro, [item.metro, item.id]).then(function (data) {
							console.log('executou update no estoque');
						})
							.catch(function (err) {
								console.log(err);
							});
					} else if (itensUpdate[i].tipo == 'quantidade') {
						var item2 = {
							quantidade: itensUpdate[i].qtd,
							id: itensUpdate[i].id
						}
						pool.query(updateQtd, [item2.quantidade, item2.id]).then(function (data) {
							console.log('executou update no estoque');
						})
							.catch(function (err) {
								console.log(err);
							});
					}
				}
				res.send(true);
			})
				.catch(function (err) {
					console.log(err);
				});
		})
			.catch(function (err) {
				console.log(err);
			});
	}
});

app.get('/projeto/listar', function (req, res) {
	var selectProjeto = 'SELECT * FROM projetos';
	pool.query(selectProjeto) // find the user from id;
		.then(function (data) {
			res.send(data.rows);
		}).catch(function (err) {
			console.log(err);
		});
});

app.get('/projeto/ItensProjeto/:id', function (req, res) {
	var id = req.params.id;
	var selectItensProjeto = 'SELECT ip.*, e.nome FROM itensprojetos ip INNER JOIN estoque e ON '
		+ 'e.id = ip.idItem WHERE ip.idProjeto = $1';
	pool.query(selectItensProjeto, [id]) // find the user from id;
		.then(function (data) {
			res.send(data.rows);
		}).catch(function (err) {
			console.log(err);
		});
});

app.get('/projeto/deletar/:id', function (req, res) {
	var id = req.params.id;
	var deletProjeto = 'DELETE FROM projetos WHERE id = $1';
	pool.query(deletProjeto, [id]) // find the user from id;
		.then(function (data) {
			res.send(true);
		}).catch(function (err) {
			console.log(err);
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
	pool.query(query) // find the user from id;
		.then(function (data) {
			res.send(true);
		}).catch(function (err) {
			console.log(err);
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

function replaceAll(string, token, newtoken) {
	while (string.indexOf(token) != -1) {
		string = string.replace(token, newtoken);
	}
	return string;
}

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});
