(function(angular) {

	var zadatakModule = angular.module('zadEntry');
	zadatakModule.controller('zadatakBrisanjeCtrl', ["$scope", "$stateParams", "$location", "$state", "ZadatakEntry", "ProjekatEntry", function ($scope, $stateParams, $location, $state, ZadatakEntry, ProjekatEntry)
	{
		if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id2;
			var projEntryId = $stateParams.id;
		}

		$scope.nazadNaMain = function(){
			$state.go('main', {id2: korEntryId});
		}

		var loadEntries = function () 
		{
			$scope.zadEntries = ZadatakEntry.query();
			$scope.zadEntry = new ZadatakEntry();
		}

		loadEntries();

		//uzimamo samo zadatke sa tog projekta, ali moramo ovako, jer iz nekog razloga,
		//nece da prikaze ko je autor a kome je zadatak dodeljen
		//razlog je verovatno sto nece populate u dubinu...
		$scope.projZadaci = [];
		$scope.projZad = ProjekatEntry.get({_id:projEntryId} , function (projekatt) 
		{
			for(var i=0; i<projekatt.zadatak.length; i++)
			{		 
				for(var j=0; j<$scope.zadEntries.length; j++)
				{						
					if($scope.zadEntries[j]._id === projekatt.zadatak[i]._id)
					{
						$scope.projZadaci.push($scope.zadEntries[j]);
						break;  	
					} 
				}
			}
		});

		$scope.obrisiZad = function (zadatak, index) 
		{
			zadatak.$delete(loadEntries);
			$scope.projZadaci.splice(index, 1);
		}


		$scope.komentari = function(zadatakId, projekatId){
			///projekat/:id/zadatak/:id2/komentari
			$state.go('zadKom', {id3: korEntryId, id: projekatId, id2: zadatakId});
			//$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar');
		}

		//slanje na odredjeni URL za edit zadatka
		$scope.editZadatak = function (zadatakId, projekatId) {
			$state.go('zadaciEdit', {id3: korEntryId, id: projekatId, id2: zadatakId});
			//$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/edit');
		}

		$scope.izmeneZadatka = function (zadatakId, projekatId) {
			$state.go('zadaciIzmene', {id3: korEntryId, id: projekatId, id2: zadatakId});
			//$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/izmene');
		}
	}]);
})(angular)