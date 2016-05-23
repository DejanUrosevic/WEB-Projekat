(function(angular) {

	var app = angular.module('app');

	var zadatakIzmenaCtrl = function ($scope, $http, $resource, $stateParams, $location, $state)
	{
		if(!angular.equals({}, $stateParams))
		{
			var ZadEntry = $resource('/api/zadatak/:_id');
			var zadEntryId = $stateParams.id2;
    		$scope.zad = ZadEntry.get({_id:zadEntryId});
    		$scope.projID = $stateParams.id;
    		var ProjEntry = $resource('/api/projekat/:id');
    		$scope.projZad = ProjEntry.get({id:$scope.projID}); 
    		var korEntryId = $stateParams.id3;
 
    		$scope.optionValue = [];

    		$http.get('/api/zadatak/'+zadEntryId)
    		.then(function(response){
    			if((response.data.korisnik !== null) && (response.data.korisnik !== undefined)){
    				$scope.stariKorisnik = response.data.korisnik;
    				$scope.optionValue.push({key: response.data.korisnik._id, value: response.data.korisnik.ime + " " + response.data.korisnik.prezime});	
    				for(var i = 0; i < $scope.projZad.korisnici.length; i++){
    					if($scope.projZad.korisnici[i]._id !== response.data.korisnik._id){
    						$scope.optionValue.push({key: $scope.projZad.korisnici[i]._id, value: $scope.projZad.korisnici[i].ime + " " + $scope.projZad.korisnici[i].prezime});
    					}
    				}
    			}else{
    				for(var i = 0; i < $scope.projZad.korisnici.length; i++){
    					$scope.optionValue.push({key: $scope.projZad.korisnici[i]._id, value: $scope.projZad.korisnici[i].ime + " " + $scope.projZad.korisnici[i].prezime});
    				}
    			}
    		});	
		}

		
		$scope.izmena = function () 
		{
			$http.put('/api/zadatak/' + $scope.zad._id, {params : {naslov: $scope.zad.naslov, opis: $scope.zad.opis,  status : $scope.zad.status, prioritet: $scope.zad.prioritet, korisnik: $scope.zad.korisnik, stariKor: $scope.stariKorisnik } })
			.success(function (data, status, headers) 
			{
				$state.go('zadaciProj', {id2: korEntryId, id: $scope.projID});
			})
		}

		$scope.izmeniZad = function(isValid) {
			if (isValid) {
				$scope.izmena();
			}
		};
	}

	app.controller('zadatakIzmenaCtrl', zadatakIzmenaCtrl);
	
})(angular)