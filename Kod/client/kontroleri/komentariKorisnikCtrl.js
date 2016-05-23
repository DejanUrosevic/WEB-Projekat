(function(angular){
	
	var app = angular.module('app');

	var komentariKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location) {

		var CommEntry = $resource('/api/comment/:id', {id:'@_id'});

		var loadEntries = function () 
		{
			$scope.commEntries = CommEntry.query();		
			$scope.commEntry = new CommEntry();
		}
		loadEntries();

		var ZadEntry = $resource('/api/zadatak/:_id');
		if(!angular.equals({}, $stateParams)){
			var zadEntryId = $stateParams.id2;
			var projEntryId = $stateParams.id;
			var korEntryId = $stateParams.id3;
		}
		
    	$scope.listaKomentara = [];
    	$scope.zadatak = ZadEntry.get({_id:zadEntryId}, function(zadatak)
    	{
    		for(var i=0; i<$scope.commEntries.length; i++)
    		{
    			for(var j=0; j<zadatak.komentari.length; j++)
    			{
    				if($scope.commEntries[i]._id === zadatak.komentari[j]._id)
    				{
    					$scope.listaKomentara.push($scope.commEntries[i]);
    					break;
    				}
    			}
    		}
    	});

    	//da se u URL-u nalazi id projekta i id zadatka prilikom dodavanja komentara
    	$scope.noviKom = function() {
    		$location.path('/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentar');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$http.post('/api/comment/', {params:{tekst: $scope.commEntry.tekst, autor: korEntryId, zadatakID: zadatakID}})
				.success(function(data, status, headers)
				{
					$location.path('/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar');
				});

			}
		}

		$scope.nazadNaZadatke = function () 
		{
			$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/korisnik_zadaci');	
		}
	}

	app.controller('komentariKorisnikCtrl', komentariKorisnikCtrl);
	
})(angular)