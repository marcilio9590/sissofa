myApp.service('projetoService', function ($http) {

    function apagarItemProjeto(id) {
       return $http({
            method: 'POST',
            url: '/projeto/deletar/itens',
            data: id
        });
    }

    function editarProjeto(projeto){
        return $http({
            method: 'PUT',
            url: '/projeto/editar/'+projeto.id,
            data: projeto
        });
    }

    return {
        editarProjeto:editarProjeto,
        apagarItemProjeto: apagarItemProjeto
    };
});