myApp.service('projetoService', function ($http) {

    function apagarItemProjeto(id) {
       return $http({
            method: 'POST',
            url: '/projeto/deletar/itens',
            data: id
        });
    }

    return {
        apagarItemProjeto: apagarItemProjeto
    };
});