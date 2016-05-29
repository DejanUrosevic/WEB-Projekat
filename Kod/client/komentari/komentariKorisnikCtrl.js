(function(angular){
	
	var commModule = angular.module('commEntry');
	commModule.controller('komentariKorisnikCtrl', function ($scope, $stateParams, $state, KomentarEntry, ZadatakEntry)
	{
		if(!angular.equals({}, $stateParams))
		{
			var zadEntryId = $stateParams.id2;
			var projEntryId = $stateParams.id;
			var korEntryId = $stateParams.id3;
		}

		var loadEntries = function () 
		{
			$scope.commEntries = KomentarEntry.query();		
			$scope.commEntry = new KomentarEntry();
		}
		loadEntries();

		$scope.listaKomentara = [];
    	$scope.zadatak = ZadatakEntry.get({_id:zadEntryId}, function(zadatak)
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

    	$scope.nazadNaZadatke = function () 
		{
			$state.go('zadaciProjKorisnik', {id2: korEntryId, id: projEntryId});
			//$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/korisnik_zadaci');	
		}


	});
	
})(angular)