(function(angular) {

	var app = angular.module('app');
	
	/*
	Kontroler zaduzen za preuzimanje komentara korisnika i njihovo prikazivanje, dodavanje, brisanje
	*/
	var korisnikKomentariCtrl = function($scope, $http, $stateParams, $resource, $location){
		$scope.myComments = [];

		//ucitavanje korisnika
		if(!angular.equals({}, $stateParams)){
			var KorEntry = $resource('/api/korisnik/:_id');
			var korEntryId = $stateParams.id3;
			var zadEntryId = $stateParams.id2;
    		$scope.User = KorEntry.get({_id:korEntryId});
		}

		//ucitavanje projekta
		if(!angular.equals({}, $stateParams)){
			var ProjEntry = $resource('/api/projekat/:_id');
			var projEntryId = $stateParams.id;
    		$scope.projekat = ProjEntry.get({_id:projEntryId});
		}
		
		var ucitaj = function(){
			var zadatak = $http.get('/api/zadatak/'+$stateParams.id3)
			.then(function(response){
				var komentari = [];
				$scope.zadatak = response.data;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.zadatak.komentari.length; i++){
					if($scope.zadatak.komentari[i].autor === korId){
						komentari.push($scope.zadatak.komentari[i]);
					}
				}
				$scope.myComments = komentari;
			});	
		}

		ucitaj();	

		$scope.nazadNaZadatke = function(){
			$location.path('/korisnik/' + $stateParams.id +'/projekat/' + $stateParams.id2 +'/zadaci');

		}
		
		$scope.noviKom = function() {
    		$location.path('/korisnik/' + $stateParams.id +'/projekat/' + $stateParams.id2 + '/zadatak/' + $stateParams.id3 + '/noviKomentarKorisnik');
    	}

		$scope.obrisiKomentar = function (comment, index) 
		{
			$http.delete('/api/comment/' + comment._id)
			.success(function (data, status, headers) {
				$scope.myComments.splice(index, 1);
            })
            .error(function (data, status, headers) 
            {
            	console.log(data + "--" + status + "headers");
            });
		}

		$scope.hitEditComment = function (commentID) 
		{
			$location.path('/korisnik/' + $stateParams.id +'/projekat/' + $stateParams.id2 + '/zadatak/' + $stateParams.id3 + '/komentar/' + commentID);
		}
	};

	app.controller('korisnikKomentariCtrl', korisnikKomentariCtrl);
	
})(angular)