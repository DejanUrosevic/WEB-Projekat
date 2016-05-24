(function(angular){

	var app = angular.module('app');

	var komentariKontrolerKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location, $state) {

		var CommEntry = $resource('/api/comment/:id',
			{id:'@_id'});
		var loadEntries = function () 
		{
			$scope.commEntries = CommEntry.query();		
			$scope.commEntry = new CommEntry();
		}
		loadEntries();

		var ZadEntry = $resource('/api/zadatak/:_id');
		var korEntry = $resource('/api/korisnik/:_id');
		
		if(!angular.equals({}, $stateParams)){
			var zadEntryId = $stateParams.id2;
			var projEntryId = $stateParams.id;
			var korEntryId = $stateParams.id3;
		}
		
		var autorKomentara = korEntry.get({_id:korEntryId});
    	$scope.zadatak = ZadEntry.get({_id:zadEntryId});

    	//da se u URL-u nalazi id projekta i id zadatka prilikom dodavanja komentara
    	$scope.noviKom = function() {
    		$state.go('addCommentKorisnikUnos', {id3: korEntryId, id: projEntryId, id2: zadEntryId});
    		//$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentarKorisnik');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$http.post('/api/comment/', {params:{tekst: $scope.commEntry.tekst, autor: korEntryId, zadatakID: zadatakID}})
				.success(function(data, status, headers)
				{
					$state.go('korKomentari', {id: korEntryId, id2: projEntryId, id3: zadEntryId});
					//$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentari');
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
			//$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar/' + commentID);
		}
 
	}

	app.controller('komentariKontrolerKorisnikCtrl', komentariKontrolerKorisnikCtrl);
	
})(angular)