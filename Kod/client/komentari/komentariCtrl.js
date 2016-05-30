(function(angular){

	angular.module('commEntry', ['zadatak.resource', 'projekat.resource', 'komentar.resource', 'korisnik.resource'])
	.controller('komentariCtrl', ["$scope", "$http", "$stateParams", "$state", "ZadatakEntry", "ProjekatEntry", "KomentarEntry" ,function ($scope, $http, $stateParams, $state, ZadatakEntry, ProjekatEntry, KomentarEntry)
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

		

		//trazimo da se poklope oni komentari koji su na zadatku od svih komentara
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
			$state.go('zadaciProj', {id2: korEntryId, id: projEntryId});
			//$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/zadaci');	
		}

    	//da se u URL-u nalazi id projekta i id zadatka prilikom dodavanja komentara
    	$scope.noviKom = function() {
    		$state.go('addComment', {id3: korEntryId, id: projEntryId, id2: zadEntryId});
    		//$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentar');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$scope.commEntry.$save({'zadId': zadatakID, 'korId': korEntryId}, function()
				{
					$state.go('zadKom', {id3: korEntryId, id: projEntryId, id2: zadEntryId});
				});
			}
		}

		$scope.zapamtiKom = function(isValid, zadatakID) {
			if (isValid) {
				$scope.zapamti(zadatakID);
			}
		}

		//-------------------------------------------
		$scope.hitEditComment = function (commentID) 
		{
			$state.go('izmenaKom', {id4: korEntryId, id: projEntryId, id2: zadEntryId, id3: commentID});
			
		}


		//pitaj  zasto nece da registruje na backend-u poslati request {params:{zadatakID: ID}} ??
		$scope.obrisiKomentar = function (comment, index) 
		{
			comment.$delete(loadEntries);
			$scope.listaKomentara.splice(index, 1);
		}
	}])
	.controller('komentariKontrolerKorisnikCtrl', ["$scope", "$stateParams", "$state", "KomentarEntry", "ZadatakEntry", "KorisnikEntry", function ($scope, $stateParams, $state, KomentarEntry, ZadatakEntry, KorisnikEntry)
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
				$scope.commEntry.$save({'zadId': zadatakID, 'korId': korEntryId}, function()
				{
					$state.go('korKomentari', {id: korEntryId, id2: projEntryId, id3: zadEntryId});
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
			$state.go('izmenaKomKor', {id3: korEntryId, id: projEntryId, id2: zadEntryId, id4:commentID});
			
		}

	}]);	
})(angular)