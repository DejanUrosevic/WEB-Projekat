(function (angular) {

	var app = angular.module('app');

	var korisnikProjekatZadaciCtrl = function ($scope, $resource, $location, $stateParams, $http, $state) 
	{
		if(!angular.equals({}, $stateParams))
		{
    		var projEntry = $resource('/api/projekat/:_id');
    		var projEntryId = $stateParams.id;
    		$scope.projZad = projEntry.get({_id:projEntryId});

    		var korEntry = $resource('/api/korisnik/:_id');
    		var korEntryId = $stateParams.id2;
    		$scope.korEntry = korEntry.get({_id:korEntryId});
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
			$state.go('zadaciIzmeneKorisnik', {id3: korEntryId, id: projEntryID, id2: zadatakID});
			//$location.path('korisnik/' + korEntryId + '/projekat/' + projekatID + '/zadatak/' + zadatakID + '/izmene');
				
		}
		
	};

	app.controller('korisnikProjekatZadaciCtrl', korisnikProjekatZadaciCtrl);
	
})(angular)