(function(angular){

	var app = angular.module('app');

	var komentariCtrl = function ($scope, $http, $resource, $stateParams, $location) {

		var CommEntry = $resource('/api/comment/:id',
			{id:'@_id'});
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
		
		//trazimo da se poklope oni komentari koji su na zadatku od svih komentara
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
    		$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentar');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$http.post('/api/comment/', {params:{tekst: $scope.commEntry.tekst, autor: korEntryId, zadatakID: zadatakID}})
				.success(function(data, status, headers)
				{
					$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar');
				});

			}
		}

		$scope.zapamtiKom = function(isValid, zadatakID) {
			if (isValid) {
				$scope.zapamti(zadatakID);
			}
		}

		$scope.hitEditComment = function (commentID) 
		{
			$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar/' + commentID);
		}
 
		$scope.nazadNaZadatke = function () 
		{
			$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/zadaci');	
		}

		//pitaj  zasto nece da registruje na backend-u poslati request {params:{zadatakID: ID}} ??
		$scope.obrisiKomentar = function (comment, index) 
		{
			$http.delete('/api/comment/' + comment._id)
			.success(function (data, status, headers) {
				console.log('U success-u sam!!!++');
				$scope.listaKomentara.splice(index, 1);
            })
            .error(function (data, status, headers) 
            {
            	console.log(data + "--" + status + "headers");
            });
		}
	}

	app.controller('komentariCtrl', komentariCtrl);
	
})(angular)