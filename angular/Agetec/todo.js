angular.module('todoApp', ['ngRoute', 'ui.utils.masks'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'login.html',
        controller: 'Login'
      })
      .when('/cadastro', {
        templateUrl: 'cadastro.html',
        controller: 'CadastroLogin'
      })
      .when('/cadastrarGuia',{
        templateUrl: 'cadastrarGuia.html',
        controller: 'cadastrarGuia'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .controller('Login', function ($scope, $http, $location) {
    $scope.app = "Login";
    $scope.cpf = "";
    $scope.senha = "";
    $scope.login = function (cpf, senha) {
      $scope.dadosUsuario = { cpf: cpf, senha: senha };
      $http.post('http://localhost:8081/auth/login', $scope.dadosUsuario)
        .then(function(response) {
          $scope.token = response.data.token
          localStorage.setItem('token', $scope.token);
          alert('Seja bem-vindo');
          $location.path('/cadastrarGuia');
        })
        .catch(function(error) {
          alert(error.data.errors);
          console.error('Erro no login:', error);
        });
    };
  })

  .controller('CadastroLogin', function ($scope, $http, $location) {
    $scope.app = "Cadastro";
    $scope.cpf = "";
    $scope.senha = "";
    $scope.cadastro = function (cpf, senha) {
      $scope.dadosUsuario = { cpf: cpf, senha: senha };
      $http.post('http://localhost:8081/auth/cadastro', $scope.dadosUsuario)
        .then(function(response) {
          alert('Cadastro Realizado com Sucesso');
          $location.path('/');
        })
        .catch(function(error) {
          alert('Cadastro não realizado ' + error.data.errors);
          console.error('Erro no cadastro:', error);
        });
    };
  })

  .controller('cadastrarGuia', function ($scope, $http) {
    $scope.app = "Cadastrar Guia";
    $scope.nome = "";
    $scope.endereco = "";
    $scope.recebedor = "";
    $scope.cidade = "";
    $scope.valor = "";

    $scope.gerarGuia = function (nome, endereco, recebedor, cidade, valor) {
      const dadosDaGuia = {
        proprietario: nome,
        endereco: endereco,
        valor: parseFloat(valor),
        recebedor: {
            nome: recebedor,
            cidade: cidade
        }
      };
      const token = localStorage.getItem('token'); 
      $http.post('http://localhost:8081/pagamento/', dadosDaGuia,  {
        headers: {
          'Authorization': 'Bearer ' + token
        },
        responseType: 'arraybuffer'
      })
        .then(function(response) {
          var guia = new Blob([response.data], { type: 'application/pdf' });
          var guiaURL = URL.createObjectURL(guia);
          window.open(guiaURL);
        })
        .catch(function(error) {
          alert('Pdf não foi gerado ' + error.data.errors);
        });
    };
  })
