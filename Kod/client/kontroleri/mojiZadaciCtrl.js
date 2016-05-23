(function(angular) {

	var app = angular.module('app');

	/*
	Kontroler zaduzen za preuzimanje zadataka korisnika i njihovo prikazivanje i filtriranje
	*/
	var mojiZadaciCtrl = function($scope, $http, $resource, $location, $stateParams){
		$scope.myTask = [];

		if(!angular.equals({}, $stateParams)){
			var KorEntry = $resource('/api/korisnik/:_id');
			var korEntryId = $stateParams.id;
    		$scope.User = KorEntry.get({_id:korEntryId});
    		var projEntryId = $stateParams.id2;
		}
		
		/*
		Funkcija koja povlaci projekat sa baze i uporedjuje korisnika kojem je dodjeljen zadatak na tom projektu sa
		korisnikom koji je ulogovan i dodaje te zadatke na $scope
		*/
		var ucitaj = function(){
			var korisnik = $http.get('/api/projekat/'+$stateParams.id2)
			.then(function(response){
				var zadaci = [];
				$scope.projekat = response.data;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++){
					if($scope.projekat.zadatak[i].korisnik !== null){
						if($scope.projekat.zadatak[i].korisnik._id === korId){
							zadaci.push($scope.projekat.zadatak[i]);
						}
					}
					
 				}
 				$scope.myTask = zadaci;
 			});
		}

		//sluzi da mozemo da pozovemo gornju funkiciju sa html-a
		$scope.ucitavanje = ucitaj;

		//sluzi da odmag ucita sadrzaj
		ucitaj();

		/*
		Filtriranje korsnikovih zadataka na osnovu statusa koji je izabrao, sa baze se povlaci projekat i na osnovu njegovih
		zadataka proverava se koji pripada trenutno ulogovanom korisniku, a nakon toga se proverava da li je i status tog 
		zadatka isti kao i odabrani. Prvo se dodaje u obican niz ZADACI, koji se nakon svih provera postavlja na $scope 
		*/
		$scope.filtriraj = function(status){
			var zadaci = [];
			var projekat = $http.get('/api/projekat/'+projEntryId)
			.then(function(response){
				$scope.projekat = response.data;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++){
					if($scope.projekat.zadatak[i].korisnik !== null){
						if($scope.projekat.zadatak[i].korisnik._id === korId){
							if($scope.projekat.zadatak[i].status === status){
								zadaci.push($scope.projekat.zadatak[i]);
							}
						}
					}
				}
				$scope.myTask = zadaci;
			});	
		}

		/*
		Isto radi kao i filtriraj samo sto se ovde proverava prioritet zadatka.
		*/
		$scope.filtriraj2 = function(prioritet){
			var zadaci = [];
			var projekat = $http.get('/api/projekat/'+projEntryId)
			.then(function(response){
				$scope.projekat = response.data;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++){
					if($scope.projekat.zadatak[i].korisnik !== null){
						if($scope.projekat.zadatak[i].korisnik._id === korId){
							if($scope.projekat.zadatak[i].prioritet === prioritet){
								zadaci.push($scope.projekat.zadatak[i]);
							}
						}
					}
				}
				$scope.myTask = zadaci;
			});	
		}

		/*
		Funkcija zaduzena za prikaz komentara korisnika na zadatku koji je njemu dodeljen
		*/			
		$scope.komentari = function(zadatakId, projekatId){
			$location.path('/korisnik/' + korEntryId + '/projekat/'+projekatId + '/zadatak/'+ zadatakId+'/komentari');
		}

		$scope.nazadNaProjekte = function () 
		{
			$location.path('/korisnik/' + korEntryId);	
		}

		$scope.hitEditComment = function (commentID) 
		{
			$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar/' + commentID);
		}

		$scope.izmeneZadatka = function (zadatakID, projekatID) 
		{
			$location.path('korisnik/' + korEntryId + '/projekat/' + projekatID + '/zadatak/' + zadatakID + '/izmene');
				
		}

	};

	app.controller('mojiZadaciCtrl', mojiZadaciCtrl);
	
})(angular)