(function (angular) {
	
	angular.module('korEntry', ['korisnik.resource', 'zadatak.resource', 'projekat.resource', 'komentar.resource'])
	.controller('korisnikCtrl', function ($scope, $state, $stateParams, $http, KorisnikEntry)
	{

		if(!angular.equals({}, $stateParams)) 
		{
			var korEntryId = $stateParams.id;
    		$scope.User = KorisnikEntry.get({_id:korEntryId});
		}

		var loadEntries = function () {
			$scope.korEntries = KorisnikEntry.query();		
			$scope.korEntry = new KorisnikEntry();
		};

		loadEntries();

		$scope.registrujSe = function(isValid) 
		{
			if (isValid) 
			{
				$scope.korEntry.$save(function() 
				{
					$state.go('login');
				}, function() {
					console.log('Došlo je do greške! Prvo proverite da li su ispravno uneti podaci.')
				});
			}
		}


		$scope.dodajZad = function (projEntry) {
			$state.go('dodajZadatak', {id2: korEntryId, id: projEntry._id });
      		//$location.path('/korisnik/' + korEntryId + '/projekat/' + projEntry._id + '/noviZadatak');
    	};

    	$scope.pregledZadataka = function (projEntry) {
    		$state.go('zadaciProjKorisnik', {id2: korEntryId, id: projEntry._id});
      		//$location.path('/korisnik/' + korEntryId + '/projekat/'+ projEntry._id + '/korisnik_zadaci');
      	};
      		
      	$scope.mojiZadaci = function(projEntry) {
      		$state.go('korZadaci', {id: korEntryId, id2: projEntry._id});
      		//$location.path('/korisnik/'+korEntryId +'/projekat/'+projEntry._id + '/zadaci');
      	};


	});
})(angular)