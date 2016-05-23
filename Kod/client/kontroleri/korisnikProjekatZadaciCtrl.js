(function (angular) {

	var app = angular.module('app');

	var korisnikProjekatZadaciCtrl = function ($scope, $resource, $location, $stateParams, $http) 
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
			$location.path('/korisnik/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar_korisnik');
		}

		//slanje na odredjeni URL za edit zadatka
		$scope.editZadatak = function (zadatakId, projekatId) {
			$location.path('/korisnik/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/edit_korisnik');
			 
		}

		$scope.nazadNaProjekte = function () 
		{
			$location.path('/korisnik/' + korEntryId);	
		}

		$scope.izmeneZadatka = function (zadatakID, projekatID) 
		{
			$location.path('korisnik/' + korEntryId + '/projekat/' + projekatID + '/zadatak/' + zadatakID + '/izmene');
				
		}
		
	};

	app.controller('korisnikProjekatZadaciCtrl', korisnikProjekatZadaciCtrl);
	
})(angular)