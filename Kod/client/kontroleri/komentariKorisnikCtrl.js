(function(angular){
	
	var app = angular.module('app');

	var komentariKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location, $state) {

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

		$scope.nazadNaZadatke = function () 
		{
			$state.go('zadaciProjKorisnik', {id2: korEntryId, id: projEntryId});
			//$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/korisnik_zadaci');	
		}
	}

	app.controller('komentariKorisnikCtrl', komentariKorisnikCtrl);
	
})(angular)