(function(angular) {
	
	var commModule = angular.module('commEntry');
	commModule.controller('korisnikKomentariCtrl', ["$scope", "$stateParams", "$state", "KorisnikEntry", "ProjekatEntry", "ZadatakEntry", "KomentarEntry", function($scope, $stateParams, $state, KorisnikEntry, ProjekatEntry, ZadatakEntry, KomentarEntry)
	{
		/*
		Kontroler zaduzen za preuzimanje komentara korisnika i njihovo prikazivanje, dodavanje, brisanje
		*/
	

		//ucitavanje korisnika
		if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id3;
			var zadEntryId = $stateParams.id2;
    		$scope.User = KorisnikEntry.get({_id:korEntryId});

    		var projEntryId = $stateParams.id;
    		$scope.projekat = ProjekatEntry.get({_id:projEntryId});
		}

		$scope.myComments = [];

		var ucitaj = function()
		{
			ZadatakEntry.get({_id: $stateParams.id3}, function(response)
			{
				var komentari = [];
				$scope.zadatak = response;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.zadatak.komentari.length; i++)
				{
					if($scope.zadatak.komentari[i].autor === korId)
					{
						komentari.push($scope.zadatak.komentari[i]);
					}
				}
				$scope.myComments = komentari;
			});	
		}

		ucitaj();	


		$scope.nazadNaZadatke = function(){
			$state.go('korZadaci', {id: $stateParams.id, id2: $stateParams.id2});
			//$location.path('/korisnik/' + $stateParams.id +'/projekat/' + $stateParams.id2 +'/zadaci');

		}
		
		$scope.noviKom = function() {
			$state.go('addCommentKorisnikUnos', {id3: $stateParams.id, id: $stateParams.id2, id2: $stateParams.id3 });
    		//$location.path('/korisnik/' + $stateParams.id +'/projekat/' + $stateParams.id2 + '/zadatak/' + $stateParams.id3 + '/noviKomentarKorisnik');
    	}

    	$scope.hitEditComment = function (commentID) 
		{
			$state.go('izmenaKomKor', {id3: $stateParams.id, id: $stateParams.id2, id2: $stateParams.id3, id4: commentID});
			//$location.path('/korisnik/' + $stateParams.id +'/projekat/' + $stateParams.id2 + '/zadatak/' + $stateParams.id3 + '/komentar/' + commentID);
		}

		$scope.obrisiKomentar = function (comment, index) 
		{

			KomentarEntry.get({_id: comment._id}, function(komentar)
			{
				komentar.$delete(ucitaj);
				$scope.myComments.splice(index, 1);
			})
			

		}

	}]);
	
})(angular)