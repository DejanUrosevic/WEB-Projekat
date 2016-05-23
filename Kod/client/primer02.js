(function (angular) {
	/**
	 * Kontroler zadužen za prijavljivanje korisnika na sistem.
	 * @param $scope
	 * @param $http
	 * @param $state
	 */
	var loginCtrl = function($scope, $http, $state) {
		$scope.loginKor = {};
		$scope.loginKor.email = "";
		$scope.loginKor.pass = "";

		$scope.prijaviSe = function(isValid) {
			var loginKor = $scope.loginKor;
			if (isValid) {
				$http.post('/login', {user: loginKor.email, pass: loginKor.pass})
					 .success(function(data) {
						 if (data.korisnik) {
							 if (data.korisnik.vrsta == 'admin') {
								 $state.go('main', {id2: data.korisnik._id});
							 } else if (data.korisnik.vrsta == 'korisnik') {
								 $state.go('korDash', {id: data.korisnik._id});
							 }
						 } else {
							 alert('Neki od unetih podataka nije ispravan!');
						 }
					 });
			}
		};
	};

	var korisnikCtrl = function ($scope, $resource, $location, $state, $stateParams, $http) {
		var KorEntry = $resource('/api/korisnik/');

		var loadEntries = function () {
			$scope.korEntries = KorEntry.query();		
			$scope.korEntry = new KorEntry();
		};

		loadEntries();

		$scope.registrujSe = function(isValid) {
			var korEntry = $scope.korEntry;
			if (isValid) {
				/*
				$scope.korEntry.ime = korEntry.ime.trim();
				$scope.korEntry.prezime = korEntry.prezime.trim();
				$scope.korEntry.email = korEntry.email.trim();
				*/
				
				$scope.korEntry.$save(function() {
					$state.go('login');
				}, function() {
					console.log('Došlo je do greške! Prvo proverite da i su ispravno uneti podaci.')
				});
			}
		};

		$scope.save = function () {
			if(!$scope.korEntry._id) {
				$scope.korEntry.$save(loadEntries);
			}
		}

		$scope.delete = function (user) {
			user.$delete(loadEntries);
		};

		if(!angular.equals({}, $stateParams)) {
			var KorEntry2 = $resource('/api/korisnik/:_id');
			var korEntryId = $stateParams.id;
    		$scope.User = KorEntry2.get({_id:korEntryId});
    		//console.log($scope.User);
		}
	
		$scope.dodajZad = function (projEntry) {
      		$location.path('/korisnik/' + korEntryId + '/projekat/' + projEntry._id + '/noviZadatak');
    	};

    	$scope.pregledZadataka = function (projEntry) {
      		$location.path('/korisnik/' + korEntryId + '/projekat/'+ projEntry._id + '/korisnik_zadaci');
      	};
      		
      	$scope.mojiZadaci = function(projEntry) {
      		///korisnik/:id/projekat/:id2/zadaci
      		$location.path('/korisnik/'+korEntryId +'/projekat/'+projEntry._id + '/zadaci');
      	};
	};

	var korisnikProjekatZadaciCtrl = function ($scope, $resource, $location, $stateParams, $http) 
	{
		if(!angular.equals({}, $stateParams))
		{
    		var projEntry = $resource('/api/projekat/:_id');
    		var projEntryId = $stateParams.id;
    		$scope.projZad = projEntry.get({_id:projEntryId});

    		var korEntry = $resource('/api/korisnik/:_id');
    		var korEntryId = $stateParams.id2;
    		$scope.korEntry = korEntry.get({_id:korEntryId});
		}

		$scope.komentari = function(zadatakId, projekatId){
			///projekat/:id/zadatak/:id2/komentari
			$location.path('/korisnik/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar_korisnik');
		}

		//slanje na odredjeni URL za edit zadatka
		$scope.editZadatak = function (zadatakId, projekatId) {
			$location.path('/korisnik/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/edit_korisnik');
			 
		}

		$scope.nazadNaProjekte = function () 
		{
			$location.path('/korisnik/' + korEntryId);	
		}

		$scope.izmeneZadatka = function (zadatakID, projekatID) 
		{
			$location.path('korisnik/' + korEntryId + '/projekat/' + projekatID + '/zadatak/' + zadatakID + '/izmene');
				
		}
		
	};

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

	/*
	Kontroler zaduzen za preuzimanje komentara korisnika i njihovo prikazivanje, dodavanje, brisanje
	*/
	var korisnikKomentariCtrl = function($scope, $http, $stateParams, $resource, $location){
		//$location.path('/korisnik/'+$scope.User._id+'/projekat/'+projekatId + '/zadatak/'+ zadatakId+'/komentari');
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

	var projekatCtrl = function ($scope, $http, $resource, $location, $stateParams, $state) {
		var ProjEntry = $resource('/api/projekat');

		var loadEntries2 = function () {
			$scope.projEntries = ProjEntry.query();		
			$scope.projEntry = new ProjEntry();
		}
		
		loadEntries2();
	

		if(!angular.equals({}, $stateParams)) {
			var korEntryId = $stateParams.id2;
			var projEntryID = $stateParams.id;
		}	

		$scope.save = function () {
			if(!$scope.projEntry._id) {
				/*
				// Validacija prilikom kreiranja/memorisanja projekta
				var tempProj = $scope.projEntry;
				
				if (tempProj.oznaka==undefined || tempProj.oznaka.trim()=='') {
					alert('Morate uneti oznaku projekta!');
				} else if (tempProj.naziv==undefined || tempProj.naziv.trim()=='') {
					alert('Morate uneti naziv projekta!');
				} else {
					$scope.projEntry.oznaka = tempProj.oznaka.trim();
					$scope.projEntry.naziv = tempProj.naziv.trim();

					// $scope.projEntry.$save(loadEntries2);
					$scope.projEntry.$save(function() {
						$state.go('main', {id2: projEntryID});
					});
				}
				*/

				$scope.projEntry.$save(function() {
					$state.go('main', {id2: korEntryId});
				});
			}
		}

		$scope.kreirajProj = function(isValid) {
			if (isValid) {
				$scope.save();
			}
		};

		$scope.dodajZad = function (projEntry) {
      		$location.path('/admin/' + korEntryId + '/projekat/'+projEntry._id + '/zadatak');
    	}

    	$scope.dodajUser = function (projEntry) {
      		$location.path('/admin/' + korEntryId + '/projekat/'+ projEntry._id + '/korisnik');	
    	}

    	$scope.pregledZadataka = function (projEntry) {
      		$location.path('/admin/' + korEntryId + '/projekat/'+ projEntry._id + '/zadaci');
      	}

      	$scope.izvestaji = function (projEntry) {
      		$location.path('/admin/' + korEntryId + '/projekat/'+ projEntry._id + '/izvestaji');
      	}

      	$scope.dodajProjekat = function(){
      		$state.go('addProjekat', {id:korEntryId});
      		//$location.path('/admin/' + korEntryId + '/dodajProjekat');
      	}


    	//za korisnike
    	var KorEntry = $resource('/api/korisnik');
		var loadEntries = function () {
			$scope.korEntries = KorEntry.query();		
			$scope.korEntry = new KorEntry();
		}
		loadEntries();


		//preuzimanje odgovarajuceg projekta (provera da li URL ima id)
		if(!angular.equals({}, $stateParams))
		{
			var ProjEntry2 = $resource('/api/projekat');
			var projEntryId = $stateParams.id;
    		$scope.projUser = ProjEntry2.get({_id:projEntryId});
		}
	};

	/**
	 * Funckcija koja predstavlja kontroler zadužen za kreiranje projekta
	 * @param $scope
	 * @param $resource
	 * @param $stateParams
	 * @param $state
	 */
	var projekatUnosCtrl = function($scope, $resource, $stateParams, $state) {
		if(!angular.equals({}, $stateParams)) {
			var korEntryId = $stateParams.id;
		}

		var ProjEntry = $resource('/api/projekat');

		$scope.projEntry = new ProjEntry();

		$scope.save = function () {
			if(!$scope.projEntry._id) {
					$scope.projEntry.$save(function() {
					$state.go('main', {id2: korEntryId});
				});
			}
		}

		$scope.kreirajProj = function(isValid) {
			if (isValid) {
				$scope.save();
			}
		};
	};

	var zadatakCtrl = function ($scope, $resource, $stateParams, $state, $location, $http) {
		var ZadEntry = $resource('/api/projekat/:_id/zadatak/');

		if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id2;	
		}
		
		var loadEntries = function () {
			$scope.zadEntries = ZadEntry.query();		
			$scope.zadEntry = new ZadEntry();

			//--------------------
			if(!angular.equals({}, $stateParams)) {
				var ProjEntry = $resource('/api/projekat/:_id');
				var projEntryId = $stateParams.id;

			    projZad = ProjEntry.get({_id:projEntryId}, function (projekatt) {
			    	 $scope.zadEntry.oznaka = projekatt.oznaka;
			    	 if(angular.equals(0, projekatt.zadatak.length)) {
			    	 	$scope.zadEntry.redni_broj = 1;
			    	 }
			    	 else {
			    	 	$scope.zadEntry.redni_broj = projekatt.zadatak[projekatt.zadatak.length-1].redni_broj+1;
			    	 } 
			    	 
			    });	
			}
		}

		loadEntries();
		$scope.save = function () {
			if(!$scope.zadEntry._id) {
				/*
				var tempZad = $scope.zadEntry;

				if (tempZad.oznaka.trim() == '') {
					alert('Nije uneta oznaka projekta kome zadatak pripada!');
				} else if (tempZad.redni_broj == undefined) {
					alert('Nije unet redni broj zadatka u projektu!');
				} else if (tempZad.naslov==undefined || tempZad.naslov.trim()=='') {
					alert('Nije unet naslov zadatka!');
				} else if (tempZad.opis==undefined || tempZad.opis.trim()=='') {
					alert('Nije unet opis zadatka!')
				} else if (tempZad.prioritet==undefined || tempZad.prioritet.trim()=='') {
					alert('Nije unet prioritet zadatka!');
				} else {
					$scope.zadEntry.oznaka = tempZad.oznaka.trim();
					$scope.zadEntry.redniBroj = tempZad.redni_broj;
					$scope.zadEntry.naslov = tempZad.naslov.trim();
					$scope.zadEntry.opis = tempZad.opis.trim();
					$scope.zadEntry.prioritet = tempZad.prioritet.trim();

					$scope.zadEntry.$save(function() {
						if(!angular.equals({}, $stateParams)){;
							var korisnikID = $stateParams.id2;
						}
						$http.get('/api/korisnik/' + korEntryId)
						.then(function(response){
							if(response.data.vrsta === "admin"){
								$state.go('main', {id2:korEntryId});
							}else if(response.data.vrsta === "korisnik"){
								$location.path('/korisnik/' + korisnikID );
							}
						});
						
						//$location.path('/admin/' + krojEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar');
					});
				}

				// $scope.zadEntry.$save(loadEntries);
				*/

				$scope.zadEntry.$save(function() {
					if (!angular.equals({}, $stateParams)) {
						$http.get('/api/korisnik/' + korEntryId)
							 .then(function(response) {
								 if (response.data.vrsta == 'admin') {
									$state.go('main', {id2: korEntryId});
								 } else if (response.data.vrsta == 'korisnik') {
									 // $location.path('/korisnik/' + korisnikID);
									 $location.path('/korisnik/' + korEntryId);
								 }
							 });
					}
				});
			}

			// $location.path('/admin/' + krojEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar');
		}

		$scope.kreirajZad = function(isValid) {
			if (isValid) {
				$scope.save();
			}
		};

		if(!angular.equals({}, $stateParams))
		{
			var ProjEntry = $resource('/api/projekat/:_id');
			var projEntryId = $stateParams.id;
    		$scope.projZad = ProjEntry.get({_id:projEntryId});
		}
	};

	var zadatakBrisanjeCtrl = function ($scope, $http, $resource, $stateParams, $location, $filter) 
	{
		var ZadEntry = $resource('/api/zadatak/:id',
			{id:'@_id'});
		var loadEntries = function () 
		{
			$scope.zadEntries = ZadEntry.query(function(data) {
				console.log(data);
			});
			$scope.zadEntry = new ZadEntry();
		}
		loadEntries();

		//brisanje selektovanog zadatka iz liste zadataka odgovarajuceg projekta.
		$scope.obrisiZad = function (zadatakID, index) 
		{

			$http.delete('/api/zadatak/' + zadatakID)
			.success(function (data, status, headers) {
				$scope.projZadaci.splice(index, 1);
            });
		}
		

		$scope.projZadaci = [];
		var ProjEntry = $resource('/api/projekat/:_id');

		if(!angular.equals({}, $stateParams))
		{
			
			
			var projEntryId = $stateParams.id;
    		
		}

		$scope.projZad = ProjEntry.get({_id:projEntryId} , function (projekatt) 
			{//zasto ovo nece??? Onaj deo Projekat.findByID({"oznaka": data.oznaka})
			    	for(var i=0; i<projekatt.zadatak.length; i++)
			    	{		 
						for(var j=0; j<$scope.zadEntries.length; j++)
						{						
							if($scope.zadEntries[j]._id === projekatt.zadatak[i]._id)
							{
								$scope.projZadaci.push($scope.zadEntries[j]);
								break;  	
							} 
						}
					}
				//?? da li ovako treba za filter??	$filter('orderBy')($scope.projZadaci, '-updatedAt');
			});

		if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id2;
		}

		$scope.nazadNaMain = function(){
			$location.path('/admin/' + korEntryId + '/main');
		}

		$scope.promeniStatus = function(zadatak, index){
			$http.put('/api/zadatak/' + zadatak._id, {params : {status : zadatak.status} });
		}

		$scope.komentari = function(zadatakId, projekatId){
			///projekat/:id/zadatak/:id2/komentari
			$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar');
		}

		//slanje na odredjeni URL za edit zadatka
		$scope.editZadatak = function (zadatakId, projekatId) {
			$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/edit');
		}

		$scope.izmeneZadatka = function (zadatakId, projekatId) {
			$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/izmene');
		}
		
		
	}

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

	var zadatakIzmenaCtrl = function ($scope, $http, $resource, $stateParams, $location, $state)
	{
		if(!angular.equals({}, $stateParams))
		{
			var ZadEntry = $resource('/api/zadatak/:_id');
			var zadEntryId = $stateParams.id2;
    		$scope.zad = ZadEntry.get({_id:zadEntryId});
    		$scope.projID = $stateParams.id;
    		var ProjEntry = $resource('/api/projekat/:id');
    		console.log($scope.projID);
    		$scope.projZad = ProjEntry.get({id:$scope.projID}); 
    		console.log($scope.projZad);
    		var korEntryId = $stateParams.id3;
		}

		$scope.izmena = function () 
		{
			$http.put('/api/zadatak/' + $scope.zad._id, {params : {naslov: $scope.zad.naslov, opis: $scope.zad.opis,  status : $scope.zad.status, prioritet: $scope.zad.prioritet } })
			.success(function (data, status, headers) 
			{
				//$location.path('/admin/' + korEntryId + '/projekat/' + $scope.projID + '/zadaci');
				$state.go('zadaciProj', {id2: korEntryId, id: $scope.projID});
			})
		}

		$scope.izmeniZad = function(isValid) {
			if (isValid) {
				$scope.izmena();
			}
		};
	}

	var zadatakIzmenaKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location)
	{
		if(!angular.equals({}, $stateParams))
		{
			var ZadEntry = $resource('/api/zadatak/:_id');
			var zadEntryId = $stateParams.id2;
			var korEntryId = $stateParams.id3;
    		$scope.zad = ZadEntry.get({_id:zadEntryId});
    		$scope.projID = $stateParams.id;
		}

		$scope.izmena = function () 
		{
			$http.put('/api/zadatak/' + $scope.zad._id, {params : {naslov: $scope.zad.naslov, opis: $scope.zad.opis,  status : $scope.zad.status, prioritet: $scope.zad.prioritet} })
			.success(function (data, status, headers) 
			{
				console.log('USPEO');
				$location.path('/korisnik/' + korEntryId + '/projekat/' + $scope.projID + '/korisnik_zadaci');
			})
		}

		$scope.izmeniZad = function(isValid) {
			if (isValid) {
				$scope.izmena();
			}
		};
	}

	var komentariIzmenaCtrl = function ($scope, $http, $resource, $stateParams, $location)
	{
		var korEntryId;
		if(!angular.equals({}, $stateParams))
		{
			var CommEntry = $resource('/api/comment/:_id');
			korEntryId = $stateParams.id4;
			var commEntryId = $stateParams.id3;
			console.log(commEntryId);
    		$scope.comm = CommEntry.get({_id:commEntryId});
    		var projID = $stateParams.id;
    		var zadID = $stateParams.id2;

		}

		$scope.izmeniKomentar = function(isValid, comment)
		{
			if(isValid){
				$http.put('/api/comment/' + comment._id, {params : {tekst : $scope.comm.tekst} })
				.success(function(data, status, headers)
				{
					$location.path('/admin/' + korEntryId + '/projekat/' + projID + '/zadatak/' + zadID + '/komentar');
				});
			}
		}
	}

	var komentariIzmenaKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location)
	{
		if(!angular.equals({}, $stateParams))
		{
			var CommEntry = $resource('/api/comment/:_id');
			var commEntryId = $stateParams.id4;
			console.log(commEntryId);
    		$scope.comm = CommEntry.get({_id:commEntryId});
    		var projID = $stateParams.id;
    		var zadID = $stateParams.id2;
    		var korID = $stateParams.id3;

		}

		$scope.izmeniKomentar = function(isValid, comment)
		{
			if(isValid){
				$http.put('/api/comment/' + comment._id, {params : {tekst : $scope.comm.tekst} })
				.success(function(data, status, headers)
				{
					$location.path('/korisnik/' + korID +'/projekat/' + projID + '/zadatak/' + zadID + '/komentari');
				});
			}
		}
	}

	var addRemoveUserProject = function ($scope, $http, $resource, $stateParams, $location) 
	{
			var KorEntry = $resource('/api/korisnik');
			var loadEntries = function () 
			{
				$scope.korEntries = KorEntry.query();		
			}
			loadEntries();

			//preuzimanje odgovarajuceg projekta (provera da li URL ima id)
			if(!angular.equals({}, $stateParams))
			{
				var ProjEntry2 = $resource('/api/projekat/:_id');
				var projEntryId = $stateParams.id;
	    		$scope.projUser = ProjEntry2.get({_id:projEntryId});
	    		var korEntryId = $stateParams.id2;
			}

			$scope.obrisiUsera = function (korisnik, index) 
			{
				$http.put('/api/projekat/' + projEntryId, {params : {korisnikID : korisnik._id} })
				.success(function (data, status, headers) {
					$scope.projUser.korisnici.splice(index, 1);
					$scope.korEntries.push(korisnik);
	            });
			}

			
			
			//ovde u $scope.nizKorisnika stavljamo samo one korisnike koji nisu na selektovanom projektu.
			if(!angular.equals({}, $stateParams))
			{
				var ProjEntry2 = $resource('/api/projekat/:_id');
				var projEntryId = $stateParams.id;
	    		$scope.projUser = ProjEntry2.get({_id:projEntryId} , function (projekatt) 
			    {
			    	for(var i=0; i<projekatt.korisnici.length; i++)
			    	{		 
						for(var j=0; j<$scope.korEntries.length; j++)
						{						
							if($scope.korEntries[j]._id === projekatt.korisnici[i]._id)
							{
								$scope.korEntries.splice(j, 1);
								break;  	
							} 
						}
					}
			    });
			}
			

			$scope.dodajUsera = function (kor, index)
			{
				$http.put('/api/projekat/' + projEntryId + '/dodajKor', {params : {korisnikID : kor._id} })
				.success(function (data, status, headers) {
					$scope.korEntries.splice(index, 1);
					$scope.projUser.korisnici.push(kor);
	            });
			}

			$scope.nazadNaMain = function(){
				$location.path('/admin/' + korEntryId + '/main');
			}
	}

	var komentariKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location) {

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

    	//da se u URL-u nalazi id projekta i id zadatka prilikom dodavanja komentara
    	$scope.noviKom = function() {
    		$location.path('/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentar');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$http.post('/api/comment/', {params:{tekst: $scope.commEntry.tekst, autor: korEntryId, zadatakID: zadatakID}})
				.success(function(data, status, headers)
				{
					$location.path('/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar');
				});

			}
		}

 
		$scope.nazadNaZadatke = function () 
		{
			$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/korisnik_zadaci');	
		}

		//pitaj  zasto nece da registruje na backend-u poslati request {params:{zadatakID: ID}} ??
		
	}

	var ZadaciKorisnicimaCtrl = function ($scope, $http, $resource, $stateParams, $location) 
	{
		var projEntryId;
		if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id2;
			projEntryId = $stateParams.id;	
		}
		
		$scope.Users = [];

		$http.get('/api/korisnik/').success(function(korisnici, status, headers1) {

			for(var i = 0; i < korisnici.length; i++){
				var korisnik = korisnici[i];
				if(korisnik.vrsta == 'korisnik'){
					$scope.Users.push(korisnik);
				}
			}
		});

    	

		
		$scope.izvestaj1 = function () 
		{
			$scope.podaci = [];
		
			if(!angular.equals({}, $stateParams))
			{
				// ok, sta ovde radimo..
				//tri for petlje, prva da prikaze koji korsnici rade na tom selektovanom projektu
				//druga je za da se prodju svi zadaci na kojima korisnici rade, iz svih projekata(jbg tako smo schemu napravili)
				//treca je da se uporede ti zadaci sa zadacima na trenutnom projektu
				//oni koji su isti se racunaju kao brojac++, inace se preskacu.
				$http.get('/api/projekat/' + $stateParams.id)
				.success(function(data, status, headers)
				{
					
					for (var i = 0; i < data.korisnici.length; i++) 
					{
						var brojac = 0;
						for(var j=0; j<data.zadatak.length; j++)
						{
							for(var z=0; z<data.korisnici[i].zadatak.length; z++)
							{
								if(data.zadatak[j]._id === data.korisnici[i].zadatak[z])
								{
									brojac = brojac + 1;
									break;
								}
							}
						}
						$scope.podaci.push({
								   key:data.korisnici[i].ime + ' ' + data.korisnici[i].prezime, 
								   y: brojac
						});
						
					}


					//sam kod za pravljenje dijagrama

					var height = 350;
				    var width = 350;

				    nv.addGraph(function() {
				        var chart = nv.models.pieChart()
				            .x(function(d) { return d.key })
				            .y(function(d) { return d.y })
				            .width(width)
				            .height(height)
				            .showTooltipPercent(true);

				        d3.select("#test1")
				            .datum($scope.podaci)
				            .transition().duration(1200)
				            .attr('width', width)
				            .attr('height', height)
				            .call(chart);

				        return chart;
				    });

				    nv.addGraph(function() {
				        var chart = nv.models.pieChart()
				            .x(function(d) { return d.key })
				            .y(function(d) { return d.y })
				            //.labelThreshold(.08)
				            //.showLabels(false)
				            .color(d3.scale.category20().range().slice(8))
				            .growOnHover(false)
				            .labelType('value')
				            .width(width)
				            .height(height);

				        // disable and enable some of the sections
				        var is_disabled = false;
				        setInterval(function() {
				            chart.dispatch.changeState({disabled: {2: !is_disabled, 4: !is_disabled}});
				            is_disabled = !is_disabled;
				        }, 3000);

				        return chart;
				    });

				    $location.path('/admin/' + korEntryId + '/projekat/' + data._id + '/izvestaji/izvestaj1');
				});
			}
		};

		$scope.izvestaj2 = function(){
			if(!angular.equals({}, $stateParams)){
				$http.get('/api/projekat/' + $stateParams.id)
				.success(function(data, status, headers){
					$scope.projekat = data;
					function podaci(){
						var ukupnoZadataka = [];
						var odradjeniZadaci = [];
						var podaciUkupno = [];
						var podaciOdradjeno = [];

						var all = 0;
						var done = 0;
						for(var i = 0; i < data.korisnici.length; i++){
							var all = 0;
							var done = 0;
							for(var j = 0; j < data.zadatak.length; j++){
								if(data.zadatak[j].korisnik !== null){
									if(data.korisnici[i]._id === data.zadatak[j].korisnik._id){
										all += 1;
										if(data.zadatak[j].status === "Done"){
											done += 1;
										}
									}
								}
								
							}
							ukupnoZadataka.push(all);
							odradjeniZadaci.push(done);
						}

						for(var i = 0; i < data.korisnici.length; i++){
							podaciUkupno.push({x: data.korisnici[i].ime+ " "+data.korisnici[i].prezime, y:ukupnoZadataka[i] })
						}

						for(var i = 0; i < data.korisnici.length; i++){
							podaciOdradjeno.push({x: data.korisnici[i].ime+ " "+data.korisnici[i].prezime, y:odradjeniZadaci[i] })
						}

						return [{
									key: 'Odradjeni zadaci',
									values : podaciOdradjeno
								},
								{
									key: 'Ukupno zadataka',
									values: podaciUkupno
								}]

					}

					console.log(podaci());

					var chart;
				    nv.addGraph(function() {
				        chart = nv.models.multiBarChart()
				            .barColor(d3.scale.category20().range())
				            .duration(300)
				            .margin({bottom: 100, left: 70})
				            .rotateLabels(45)
				            .groupSpacing(0.1)

				        ;

				        chart.reduceXTicks(false).staggerLabels(true);
				        //chart.height(500);
				        chart.xAxis
				            .axisLabel("Korisnici")
				            .axisLabelDistance(35)
				            .showMaxMin(false)
				        ;

				        chart.yAxis
				            .axisLabel("Broj zadataka")
				            .axisLabelDistance(-5)
				        ;

				        chart.dispatch.on('renderEnd', function(){
				            nv.log('Render Complete');
				        });

				        d3.select('#chart1 svg')
				            .datum(podaci())
				            .call(chart);

				        nv.utils.windowResize(chart.update);

				        chart.dispatch.on('stateChange', function(e) {
				            nv.log('New State:', JSON.stringify(e));
				        });
				        chart.state.dispatch.on('change', function(state){
				            nv.log('state', JSON.stringify(state));
				        });

				        return chart;
				    });
				    $location.path('/admin/' + korEntryId + '/projekat/' + data._id + '/izvestaji/izvestaj2');
				});
			}
		};

        $scope.izvestaj3 = function() {
             var podaci = [];

             if (!angular.equals({}, $stateParams)) {
                 $http.get('/api/projekat/' + $stateParams.id)
                      .success(function(data, status, headers) {
                          var zadaci = data.zadatak;                // Preuzmemo spisak zadataka

                          // var currentDate = new Date();             // Preuzmemo trenutni datum

                          var brojZadatakaPoDanu = {};              // Sadrži broj kreiranih zadataka po danu

                          // Određivanje broja kreiranih zadataka po danu
                          for (var i=0; i<zadaci.length; i++) {
                              var createdAt = zadaci[i].createdAt;

                              var year = createdAt.substr(0,4);
                              var month = createdAt.substr(5, 2);
                              var day = createdAt.substr(8, 2);

                              var createdAtFormated =  day+"/"+month+"/"+year;
                              if (brojZadatakaPoDanu[createdAtFormated]==undefined) {
                                  brojZadatakaPoDanu[createdAtFormated] = 1;
                              } else {
                                  brojZadatakaPoDanu[createdAtFormated]++;
                              }
                          }

                          for (var stavka in brojZadatakaPoDanu) {
                              console.log(stavka);
                              podaci.push({label: stavka, value: brojZadatakaPoDanu[stavka]});
                          }

                          var podaciChart = [{key: "Naslov", "color": "#d67777", values: podaci}];

                          // Crtanje grafika
                          nv.addGraph(function() {
                              var chart = nv.models.discreteBarChart() /*multiBarHorizontalChart()*/
                                                    .x(function(d) {return d.label;})
                                                    .y(function(d) {return d.value;})
                                                    // .margin({top: 30, right: 20, bottom: 50, left: 175})
                                                    // .staggerLabels(true)
                                                    .showValues(true);
                              chart.yAxis.tickFormat(d3.format(',f'));

                              d3.select('#test3')
                                  .datum(podaciChart)
                                  .call(chart);

                              return chart;
                          });

                          $location.path('/admin/' + korEntryId + '/projekat/'+data._id+'/izvestaji/izvestaj3');
                      });
             }
         };

		$scope.izvestaj4 = function() {
			var podaci = [];

			if (!angular.equals({}, $stateParams)) {
				$http.get('/api/projekat/' + $stateParams.id)
					 .success(function(data, status, headers) {
						 var zadaci = data.zadatak;					// Preuzmemo spisak zadataka

						 // var currentDate = new Date();				// Preuzmemo trenutni datum

						 var brojZadatakaPoDanu = {};				// Sadrži broj završenih zadataka po danu

						 // Određivanje broja završenih zadataka po danu
						 for (var i=0; i<zadaci.length; i++) {
							 var zadatak = zadaci[i];

							 if (zadatak.status == 'Done') {
								 var updatedAt = zadatak.updatedAt;

								 var year = updatedAt.substr(0, 4);
								 var month = updatedAt.substr(5, 2);
								 var day = updatedAt.substr(8, 2);

								 var updatedAtFormated = day+"/"+month+"/"+year;
								 if (brojZadatakaPoDanu[updatedAtFormated] == undefined) {
									 brojZadatakaPoDanu[updatedAtFormated] = 1;
								 } else {
									 brojZadatakaPoDanu[updatedAtFormated]++;
								 }
							 }
						 }

						 for (var stavka in brojZadatakaPoDanu) {
							 podaci.push({label: stavka, value: brojZadatakaPoDanu[stavka]});
						 }

						 // Sortirati podatke po danima
						 podaci.sort(function(a, b) {
							 var daya = a.label.substr(0, 2);
							 var dayb = b.label.substr(0, 2);
							 var montha = a.label.substr(3, 2);
							 var monthb = b.label.substr(3, 2);
							 var yeara = a.label.substr(6, 4);
							 var yearb = b.label.substr(6, 4);

							 var datea = new Date(yeara, montha, daya);
							 var dateb = new Date(yearb, monthb, dayb);

							 // console.log(datea+"||"+dateb);
							 if (datea > dateb) {
								 return 1;
							 }
							 if (datea < dateb)
								 return -1;

							 return 0;
						 });

						 var podaciChart = [{key: "Naslov", values: podaci}];

						 // Crtanje grafika
						 nv.addGraph(function() {
							 var chart = nv.models.discreteBarChart()
								 .x(function(d) {return d.label;})
								 .y(function(d) {return d.value;})
								 .showValues(true);
							 d3.select("#test4")
								 .datum(podaciChart)
								 .call(chart);

							 return chart;
						 });

						 $location.path('/admin/' + korEntryId + '/projekat/'+data._id+'/izvestaji/izvestaj4');
					 });
			}
		};	


		$scope.izvestaj5 = function(prosledjeniKorisnik) {
			var podaciKorisnika = {};
			var redniBrojKorisnika = 0;
			$http.get('/api/projekat/').success(function(projekti, status, headers) {
				$http.get('/api/korisnik/').success(function(svi_korisnici, status1, headers1) {
					
					
					
					// OVDE SU SVI KORISNICI----> ONI KOJI NISU ADMINI
					var korisnici = [];
					for (var i = 0; i < svi_korisnici.length; i++) {
						if(svi_korisnici[i].vrsta =='korisnik'){
							korisnici.push(svi_korisnici[i]);
						}
					}

					// STAVLJAMO SVE KORISNIKE NA SCOPE
					$scope.Users = korisnici;

					// OVDE SU SVU MOGUCI ZADACI NA SVIM PROJEKTIMA
					var zadaci = [];
					for (var i = 0; i < projekti.length; i++) {
						for (var j = 0; j < projekti[i].zadatak.length; j++) {
							zadaci.push( projekti[i].zadatak[j]);
						}	
					}

					// OVDE SU ZADACI NASEG KORISNIKA KOJEG SMO SELEKTOVALI U COMBOBOX-U U HTML-U
					var zadaciOdabranogKorisnika = [];
					// for (var i = 0; i < korisnici.length; i++) {
					// 	var zadaciKorisnika = [];
					// 	var korisnik = korisnici[i];
					for (var j = 0; j < zadaci.length; j++) {
						var zadatak = zadaci[j];
						if(prosledjeniKorisnik == zadatak.korisnik){
							zadaciOdabranogKorisnika.push(zadatak);
						}
					}
					// 	zadaciSvihKorisnika[korisnici[i]._id] = zadaciKorisnika;
					// }
						
					// var redniBrojKorisnika = 0;
					// for (var korisnik in zadaciSvihKorisnika) {
						var zadaci = zadaciOdabranogKorisnika;
						var podaci = [];
						var brojZadatakaPoDanu = {};						// Sadrži broj završenih zadataka po danu

						 // Određivanje broja završenih zadataka po danu
						for (var i = 0; i < zadaci.length; i++) {
							 var zadatak = zadaci[i];

							 if (zadatak.status == 'Done') {
								 var updatedAt = zadatak.updatedAt;

								 var year = updatedAt.substr(0, 4);
								 var month = updatedAt.substr(5, 2);
								 var day = updatedAt.substr(8, 2);

								 var updatedAtFormated = day+"/"+month+"/"+year;
								 if (brojZadatakaPoDanu[updatedAtFormated] == undefined) {
									 brojZadatakaPoDanu[updatedAtFormated] = 1;
								 } else {
									 brojZadatakaPoDanu[updatedAtFormated]++;
								 }
							 }
						}

						for (var stavka in brojZadatakaPoDanu) {
							 podaci.push({label: stavka, value: brojZadatakaPoDanu[stavka]});
						}

						 podaci.sort(function(a, b) {
							 var daya = a.label.substr(0, 2);
							 var dayb = b.label.substr(0, 2);
							 var montha = a.label.substr(3, 2);
							 var monthb = b.label.substr(3, 2);
							 var yeara = a.label.substr(6, 4);
							 var yearb = b.label.substr(6, 4);

							 var datea = new Date(yeara, montha, daya);
							 var dateb = new Date(yearb, monthb, dayb);

							 // console.log(datea+"||"+dateb);
							 if (datea > dateb) {
								 return 1;
							 }
							 if (datea < dateb)
								 return -1;

							 return 0;
						 });

						 var podaciChart = [{key: "Naslov", values: podaci}];

						  nv.addGraph(function() {
							 var chart = nv.models.discreteBarChart()
								 .x(function(d) {return d.label;})
								 .y(function(d) {return d.value;})
								 .showValues(true);
							var id_grafika = "#test5" + " svg";
							 d3.select(id_grafika)
								 .datum(podaciChart)
								 .call(chart);


							// 	 var proba = 5;

							// redniBrojKorisnika++;	
							 return chart;

						 });
						
					// }

					 $location.path('/admin/' + korEntryId + '/projekat/'+ $stateParams.id +'/izvestaji/izvestaj5');
				 });
				 });	
		};	

		$scope.selektuj = function(selektovanKorisnik){

    		$scope.izvestaj5(selektovanKorisnik);
    	}

    	$scope.prikaz = function(){

    		$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/izvestaji/izvestaj5');
    	}

		$scope.nazadNaZadatke = function(){
			$location.path('/admin/' + korEntryId + '/main' );
		}
	}

	var komentariKontrolerKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location) {

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
    		$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentarKorisnik');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$http.post('/api/comment/', {params:{tekst: $scope.commEntry.tekst, autor: korEntryId, zadatakID: zadatakID}})
				.success(function(data, status, headers)
				{
					$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentari');
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
			$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar/' + commentID);
		}
 
		$scope.nazadNaZadatke = function () 
		{
			$location.path('/projekat/' + projEntryId + '/komentar_korisnik');	
		}

		//pitaj  zasto nece da registruje na backend-u poslati request {params:{zadatakID: ID}} ??
		// $scope.obrisiKomentar = function (comment, index) 
		// {
		// 	$http.delete('/api/comment/' + comment._id)
		// 	.success(function (data, status, headers) {
		// 		console.log('U success-u sam!!!++');
		// 		$scope.zadatak.komentari.splice(index, 1);
  //           })
  //           .error(function (data, status, headers) 
  //           {
  //           	console.log(data + "--" + status + "headers");
  //           });
		// }
	}


	var izmeneZadatkaCtrl = function ($scope, $http, $resource, $stateParams, $location) 
	{
		if(!angular.equals({}, $stateParams)){
			var zadEntryId = $stateParams.id2;
			var korEntryId = $stateParams.id3;
			var projEntryId = $stateParams.id;
		}

		$http.get('/api/zadatak/' + zadEntryId)
		.success(function(data, status, headers)
		{
			$scope.sveIzmene = data.izmeneZadatka;
		});

		$scope.nazadNaMain = function(){
			$http.get('/api/korisnik/' + korEntryId)
			.success(function(data)
			{
				if(data.vrsta === 'admin')
				{
					$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/zadaci');
				}
				else if(data.vrsta === 'korisnik')
				{
					$location.path('/korisnik/' + korEntryId + '/projekat/' + projEntryId + '/korisnik_zadaci');
				}
			})
			
		}



	}

	var app = angular.module('app',['ui.router', 'ngResource']);
	app.controller('loginCtrl', loginCtrl);
	app.controller('korisnikCtrl', korisnikCtrl);
	app.controller('korisnikProjekatZadaciCtrl', korisnikProjekatZadaciCtrl);
	app.controller('projekatCtrl', projekatCtrl);
	app.controller('projekatUnosCtrl', projekatUnosCtrl);
	app.controller('zadatakCtrl', zadatakCtrl);
	app.controller('zadatakBrisanjeCtrl', zadatakBrisanjeCtrl);

	app.controller('komentariKontrolerKorisnikCtrl', komentariKontrolerKorisnikCtrl);
	app.controller('komentariCtrl', komentariCtrl);
	app.controller('zadatakIzmenaCtrl', zadatakIzmenaCtrl);
	app.controller('zadatakIzmenaKorisnikCtrl', zadatakIzmenaKorisnikCtrl);
	app.controller('komentariKorisnikCtrl', komentariKorisnikCtrl);
	app.controller('komentariIzmenaCtrl', komentariIzmenaCtrl);
	app.controller('komentariIzmenaKorisnikCtrl', komentariIzmenaKorisnikCtrl);
	app.controller('addRemoveUserProject', addRemoveUserProject);
	app.controller('ZadaciKorisnicimaCtrl', ZadaciKorisnicimaCtrl);
	app.controller('mojiZadaciCtrl', mojiZadaciCtrl);
	app.controller('korisnikKomentariCtrl', korisnikKomentariCtrl);
	app.controller('izmeneZadatkaCtrl', izmeneZadatkaCtrl);

	app.config(function($stateProvider, $urlRouterProvider) {

	    $urlRouterProvider.otherwise('/login');

	    $stateProvider
	    .state('login', {//naziv stanja!
	      url: '/login',
	      templateUrl: 'logIn.html',
		  controller: 'loginCtrl'
	    })
	    .state('reg', {
	      url: '/reg', 
	      templateUrl: 'reg-unos.html',
	      controller: 'korisnikCtrl'
	    })
	    .state('main', {
	      url: '/admin/:id2/main', 
	      templateUrl: 'dahsboard-admin-zadaci.html',
	      controller: 'projekatCtrl'
	    })
	    .state('addZad', {
	      url: '/admin/:id2/projekat/:id/zadatak', 
	      templateUrl: 'zad-unos.html'
	    //  controller: 'projekatCtrl'
	    })
	    .state('spisakUserProjekat', {
	      url: '/admin/:id2/projekat/:id/korisnik', 
	      templateUrl: 'spisak-korisnika-projekat.html',
	      controller: 'addRemoveUserProject'
	    })
	    .state('zadaciProj', {
	      url: '/admin/:id2/projekat/:id/zadaci', 
	      templateUrl: 'svi-zadaci-projekat.html',
	      controller: 'zadatakBrisanjeCtrl'
	    })
	    .state('addProjekat', {
	      url: '/admin/:id/dodajProjekat', 
	      templateUrl: 'projekat-unos.html',
	      controller: 'projekatUnosCtrl'
	    })
	    .state('zadKom', {
	      url: '/admin/:id3/projekat/:id/zadatak/:id2/komentar', 
	      templateUrl: 'zadatak-komentari.html',
	      controller: 'komentariCtrl'
	    })
	    .state('izmenaKom', {
	      url: '/admin/:id4/projekat/:id/zadatak/:id2/komentar/:id3', 
	      templateUrl: 'komentari-izmena.html',
	      controller: 'komentariIzmenaCtrl'
	    })
	    .state('zadaciEdit', {
	      url: '/admin/:id3/projekat/:id/zadatak/:id2/edit', 
	      templateUrl: 'zadatak-edit.html',
	      controller: 'zadatakIzmenaCtrl'
	    })
	    .state('zadaciIzmene', {
	      url: '/admin/:id3/projekat/:id/zadatak/:id2/izmene', 
	      templateUrl: 'izmene-zadatak.html',
	      controller: 'izmeneZadatkaCtrl'
	    })
	    .state('addComment', {
	      url: '/admin/:id3/projekat/:id/zadatak/:id2/noviKomentar', 
	      templateUrl: 'komentari-unos.html',
	      controller: 'komentariCtrl'
	    })
	    .state('izvestaji', {
	      url: '/admin/:id2/projekat/:id/izvestaji', 
	      templateUrl: 'izvestaj-zadaci-dodeljeni-projekat.html',
	      controller: 'ZadaciKorisnicimaCtrl'
	    })
	    .state('zadaciProjKorisnik', {
	      url: '/korisnik/:id2/projekat/:id/korisnik_zadaci', 
	      templateUrl: 'korisnik-zadaci-projekat.html',
	      controller: 'korisnikProjekatZadaciCtrl'
	    })
	    .state('zadaciKorisnikEdit', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/edit_korisnik', 
	      templateUrl: 'zadatak-edit-korisnik.html',
	      controller: 'zadatakIzmenaKorisnikCtrl'
	    })
	    .state('zadKomKor', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/komentar_korisnik', 
	      templateUrl: 'zadatak-komentari-korisnik.html',
	      controller: 'komentariKorisnikCtrl'
	    })
	    .state('zadaciIzmeneKorisnik', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/izmene', 
	      templateUrl: 'izmene-zadatak.html',
	      controller: 'izmeneZadatkaCtrl'
	    })    
	    .state('izmenaKomKor', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/komentar/:id4', 
	      templateUrl: 'komentari-izmena-korisnik.html',
	      controller: 'komentariIzmenaKorisnikCtrl'
	    })
	    .state('addCommentKorisnikUnos', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/noviKomentarKorisnik', 
	      templateUrl: 'komentari-unos-korisnik.html',
	      controller: 'komentariKontrolerKorisnikCtrl'
	    })
	     .state('korDash', {
	      url: '/korisnik/:id', 
	      templateUrl: 'korisnik-dashboard.html',
	      controller: 'korisnikCtrl'
	    }) 
	    .state('korZadaci', {
	    	url: '/korisnik/:id/projekat/:id2/zadaci',
	    	templateUrl: 'korisnik-zadaci.html',
	    	controller: 'mojiZadaciCtrl'
	    })
	    .state('dodajZadatak', {
	    	url: '/korisnik/:id2/projekat/:id/noviZadatak',
	    	templateUrl: 'zad-unos.html'
	    })
	    .state('korKomentari',{
	    	//'/korisnik/'+$scope.User._id+'/projekat/'+projekatId + '/zadatak/'+ zadatakId+'/komentari'
	    	url: '/korisnik/:id/projekat/:id2/zadatak/:id3/komentari',
	    	templateUrl: 'korisnik-zadatak-komentari.html',
	    	controller: 'korisnikKomentariCtrl'
	    }) 
	    .state('izvestaji.izvestaj1', {
	      url: '/izvestaj1', 
	      templateUrl: 'izvestaj-izvestaj1.html'
	    })
	    .state('izvestaji.izvestaj2', {
	      url: '/izvestaj2', 
	      templateUrl: 'izvestaj-izvestaj2.html'
	    })
        .state('izvestaji.izvestaj3', {
          url: '/izvestaj3',
          templateUrl: 'izvestaj-izvestaj3.html'
        })
		.state('izvestaji.izvestaj4', {
			url: '/izvestaj4',
			templateUrl: 'izvestaj-izvestaj4.html'
		})
		.state('izvestaji.izvestaj5', {
			url: '/izvestaj5',
			templateUrl: 'izvestaj-izvestaj5.html'
		})
	   
  	});

}(angular));