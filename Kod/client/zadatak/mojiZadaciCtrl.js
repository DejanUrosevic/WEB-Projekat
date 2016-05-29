(function(angular) {

	var appModule = angular.module('zadEntry');
	appModule.controller('mojiZadaciCtrl', function($scope, $stateParams, $state, ZadatakEntry, ProjekatEntry, KorisnikEntry)
	{
		if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id;
    		$scope.User = KorisnikEntry.get({_id:korEntryId});
    		var projEntryId = $stateParams.id2;
		}
		$scope.myTask = [];

		/*
		Funkcija koja povlaci projekat sa baze i uporedjuje korisnika kojem je dodjeljen zadatak na tom projektu sa
		korisnikom koji je ulogovan i dodaje te zadatke na $scope
		*/
		var ucitaj = function()
		{
			ProjekatEntry.get({_id: projEntryId}, function(response)
			{
				var zadaci = [];
				$scope.projekat = response;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++)
				{
					if($scope.projekat.zadatak[i].korisnik !== null && $scope.projekat.zadatak[i].korisnik !== undefined){
						if($scope.projekat.zadatak[i].korisnik._id === korId)
						{
							zadaci.push($scope.projekat.zadatak[i]);
						}
					}
					
 				}
 				$scope.myTask = zadaci;
 			});
		}

		//sluzi da mozemo da pozovemo gornju funkiciju sa html-a
		$scope.ucitavanje = ucitaj;

		//sluzi da odmah ucita sadrzaj
		ucitaj();

		/*
		Filtriranje korsnikovih zadataka na osnovu statusa koji je izabrao, sa baze se povlaci projekat i na osnovu njegovih
		zadataka proverava se koji pripada trenutno ulogovanom korisniku, a nakon toga se proverava da li je i status tog 
		zadatka isti kao i odabrani. Prvo se dodaje u obican niz ZADACI, koji se nakon svih provera postavlja na $scope 
		*/
		$scope.filtriraj = function(status)
		{
			var zadaci = [];
			ProjekatEntry.get({_id: projEntryId}, function(response)
			{
				$scope.projekat = response;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++)
				{
					if($scope.projekat.zadatak[i].korisnik !== null && $scope.projekat.zadatak[i].korisnik !== undefined){
						if($scope.projekat.zadatak[i].korisnik._id === korId)
						{
							if($scope.projekat.zadatak[i].status === status)
							{
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
		$scope.filtriraj2 = function(prioritet)
		{
			var zadaci = [];
			ProjekatEntry.get({_id: projEntryId}, function(response)
			{
				$scope.projekat = response;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++)
				{
					if($scope.projekat.zadatak[i].korisnik !== null && $scope.projekat.zadatak[i].korisnik !== undefined){
						if($scope.projekat.zadatak[i].korisnik._id === korId)
						{
							if($scope.projekat.zadatak[i].prioritet === prioritet)
							{
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
			$state.go('korKomentari', {id: korEntryId, id2: projekatId, id3: zadatakId});
			//$location.path('/korisnik/' + korEntryId + '/projekat/'+projekatId + '/zadatak/'+ zadatakId+'/komentari');
		}

		$scope.nazadNaProjekte = function () 
		{
			$state.go('korDash', {id: korEntryId});
			//$location.path('/korisnik/' + korEntryId);	
		}

		$scope.hitEditComment = function (commentID) 
		{
			$state.go('izmenaKomKor', {id3: korEntryId, id: projEntryId, id2: zadEntryId, id4: commentID});
			//$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar/' + commentID);
		}

		$scope.izmeneZadatka = function (zadatakID, projekatID) 
		{
			$state.go('zadaciIzmeneKorisnik', {id3: korEntryId, id: projekatID, id2: zadatakID});
			//$location.path('korisnik/' + korEntryId + '/projekat/' + projekatID + '/zadatak/' + zadatakID + '/izmene');
				
		}

	});
})(angular)