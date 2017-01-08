var express = require('express'); // importando a lib express
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

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

app.listen(3000, function(){
	console.log('Servidor rodando na porta 3000!');
});