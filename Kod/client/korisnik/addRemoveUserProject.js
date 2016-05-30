(function(angular){

	var korisnikModul = angular.module('korEntry');
	korisnikModul.controller('addRemoveUserProject', ["$scope", "$http", "$resource", "$stateParams", "$location", "$state", "ProjekatEntry", "KorisnikEntry", function ($scope, $http, $resource, $stateParams, $location, $state, ProjekatEntry, KorisnikEntry) {
		//preuzimanje odgovarajuceg projekta (provera da li URL ima id)
		
		$scope.dodatiKorisnici = [];

		if(!angular.equals({}, $stateParams))
		{
			var projEntryId = $stateParams.id;
	    	$scope.projUser = ProjekatEntry.get({_id:projEntryId}, function(response){
	    		$scope.dodatiKorisnici = response.korisnici;
	    	});
	    	var korEntryId = $stateParams.id2;
		}


		var loadEntries = function () 
		{
			$scope.korEntries = KorisnikEntry.query();	
		}
		
		loadEntries();

		$scope.obrisiUsera = function (korisnik, index) 
		{
			$scope.projUser.$obrisiKorisnika( {'korId': korisnik._id});
         	$scope.dodatiKorisnici.splice(index, 1);
           	$scope.korEntries.push(korisnik);
		}

		if(!angular.equals({}, $stateParams))
		{
			var projEntryId = $stateParams.id;
	    	$scope.projUser = ProjekatEntry.get({_id:projEntryId} , function (projekatt) 
		    {
		    	for(var i=0; i<projekatt.korisnici.length; i++)
		    	{		 
					for(var j=0; j<$scope.korEntries.length; j++)
					{						
						if($scope.korEntries[j]._id === projekatt.korisnici[i]._id)
						{
							$scope.korEntries.splice(j, 1);
							break;  	
						} 
					}
				}
		    });
		}

		$scope.dodajUsera = function (kor, index)
		{
	        $scope.projUser.$dodajKorisnika({'korId': kor._id});
         	$scope.korEntries.splice(index, 1);
           	$scope.dodatiKorisnici.push(kor);
		}

		$scope.nazadNaMain = function(){
			$state.go('main', {id2: korEntryId});
		}
	}]);
})(angular)