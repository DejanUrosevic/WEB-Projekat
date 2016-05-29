(function(angular) {


	var zadatakModule = angular.module('zadEntry');
	zadatakModule.controller('zadatakIzmenaCtrl', function ($scope, $stateParams, $location, $state, ZadatakEntry, ProjekatEntry)
	{
		if(!angular.equals({}, $stateParams))
		{
			var zadEntryId = $stateParams.id2;
			$scope.projID = $stateParams.id;
			var korEntryId = $stateParams.id3;
		}

		var loadEntries = function () 
		{
			$scope.zadEntries = ZadatakEntry.query();
			$scope.projZad = ProjekatEntry.get({_id: $scope.projID});
			$scope.zad = ZadatakEntry.get({_id:zadEntryId});
		}

		loadEntries();

		//ubacivanje korisnika za izmenu na zadatku
		$scope.optionValue = [];

    		ZadatakEntry.get({_id:zadEntryId}, function(response)
    		{
    			if((response.korisnik !== null) && (response.korisnik !== undefined)){
    				$scope.stariKorisnik = response.korisnik;
    				$scope.optionValue.push({key: response.korisnik._id, value: response.korisnik.ime + " " + response.korisnik.prezime});	
    				for(var i = 0; i < $scope.projZad.korisnici.length; i++){
    					if($scope.projZad.korisnici[i]._id !== response.korisnik._id){
    						$scope.optionValue.push({key: $scope.projZad.korisnici[i]._id, value: $scope.projZad.korisnici[i].ime + " " + $scope.projZad.korisnici[i].prezime});
    					}
    				}
    			}else{
    				for(var i = 0; i < $scope.projZad.korisnici.length; i++){
    					$scope.optionValue.push({key: $scope.projZad.korisnici[i]._id, value: $scope.projZad.korisnici[i].ime + " " + $scope.projZad.korisnici[i].prezime});
    				}
    			}
    		});	

    	$scope.izmena = function (zadatak) 
		{
			$scope.zad.$update(loadEntries);
			$state.go('zadaciProj', {id2: korEntryId, id: $scope.projID});
		}

		$scope.izmeniZad = function(isValid, zad) {
			if (isValid) {
				$scope.izmena(zad);
			}
		};



	});
})(angular)