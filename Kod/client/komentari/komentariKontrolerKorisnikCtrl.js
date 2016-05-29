(function(angular){

	/*
	var commModule = angular.module('commEntry');
	commModule.controller('komentariKontrolerKorisnikCtrl', function ($scope, $stateParams, $state, KomentarEntry, ZadatakEntry, KorisnikEntry)
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

		var autorKomentara = KorisnikEntry.get({_id:korEntryId});
    	$scope.zadatak = ZadatakEntry.get({_id:zadEntryId});

    	//da se u URL-u nalazi id projekta i id zadatka prilikom dodavanja komentara
    	$scope.noviKom = function() {
    		$state.go('addCommentKorisnikUnos', {id3: korEntryId, id: projEntryId, id2: zadEntryId});
    		//$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentarKorisnik');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$scope.commEntry.$save(loadEntries);
				$state.go('korKomentari', {id: korEntryId, id2: projEntryId, id3: zadEntryId});
			}
		}

		$scope.zapamtiKom = function(isValid, zadatakID) {
			if (isValid) {
				$scope.zapamti(zadatakID);
			}
		}
		$scope.hitEditComment = function (commentID) 
		{
			$state.go('izmenaKomKor', {id3: korEntryId, id: projEntryId, id2: zadEntryId, id4:commentID});
			
		}

	});	
	*/
})(angular)