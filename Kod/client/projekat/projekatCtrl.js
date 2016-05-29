(function(angular){

	angular.module('projEntry', ['projekat.resource', 'korisnik.resource'])
	.controller('projekatCtrl', function ($scope, ProjekatEntry, $location, $stateParams, $state)
	{
		var loadEntries = function () 
		{
			$scope.projEntries = ProjekatEntry.query();		
			$scope.projEntry = new ProjekatEntry();
		}
		loadEntries();



		if(!angular.equals({}, $stateParams)) {
			var korEntryId = $stateParams.id2;
		}

		$scope.saveProjekat = function () 
		{
			if(!$scope.projEntry._id)
			{
				$scope.projEntry.$save(function()
				{
					$state.go('main', {id2: korEntryId});
				});
			}
		}

		$scope.kreirajProj = function(isValid) {
			if (isValid) {
				$scope.saveProjekat();
			}
		};



		$scope.dodajZad = function (projEntry) {
			$state.go('addZad', {id2: korEntryId, id: projEntry._id});
      		//$location.path('/admin/' + korEntryId + '/projekat/'+projEntry._id + '/zadatak');
    	}

    	$scope.dodajUser = function (projEntry) {
    		$state.go('spisakUserProjekat', {id2: korEntryId, id: projEntry._id});
      		//$location.path('/admin/' + korEntryId + '/projekat/'+ projEntry._id + '/korisnik');	
    	}

    	$scope.pregledZadataka = function (projEntry) {
    		$state.go('zadaciProj', {id2: korEntryId, id: projEntry._id});
      		//$location.path('/admin/' + korEntryId + '/projekat/'+ projEntry._id + '/zadaci');
      	}

      	$scope.izvestaji = function (projEntry) {
      		$state.go('izvestaji', {id2: korEntryId, id: projEntry._id});
      		//$location.path('/admin/' + korEntryId + '/projekat/'+ projEntry._id + '/izvestaji');
      	}

      	$scope.dodajProjekat = function(){
      		$state.go('addProjekat', {id2: korEntryId});
      	}
	})
	.controller('korisnikProjekatZadaciCtrl', function ($scope,  $stateParams, $state, ProjekatEntry, KorisnikEntry)
	{
		if(!angular.equals({}, $stateParams))
		{
    		var projEntryId = $stateParams.id;
    		$scope.projZad = ProjekatEntry.get({_id:projEntryId});

    		var korEntryId = $stateParams.id2;
    		$scope.korEntry = KorisnikEntry.get({_id:korEntryId});
		}

		$scope.komentari = function(zadatakId, projekatId){
			///projekat/:id/zadatak/:id2/komentari
			$state.go('zadKomKor', {id3: korEntryId, id: projEntryId, id2: zadatakId});
			//$location.path('/korisnik/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar_korisnik');
		}

		//slanje na odredjeni URL za edit zadatka
		$scope.editZadatak = function (zadatakId, projekatId) {
			$state.go('zadaciKorisnikEdit',{id3: korEntryId, id: projekatId, id2: zadatakId});
			//$location.path('/korisnik/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/edit_korisnik');
			 
		}

		$scope.nazadNaProjekte = function () 
		{
			$state.go('korDash', {id: korEntryId});
			//$location.path('/korisnik/' + korEntryId);	
		}

		$scope.izmeneZadatka = function (zadatakID, projekatID) 
		{
			$state.go('zadaciIzmeneKorisnik', {id3: korEntryId, id: projekatID, id2: zadatakID});
			//$location.path('korisnik/' + korEntryId + '/projekat/' + projekatID + '/zadatak/' + zadatakID + '/izmene');
				
		}
	});
	
})(angular)