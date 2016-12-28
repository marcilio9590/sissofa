var express = require('express'); // importando a lib express
var app = express();

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


app.listen(3000, function(){
	console.log('Servidor rodando na porta 3000!');
});