(function (angular) {
	var korisnikCtrl = function ($scope, $resource, $location, $stateParams, $http) 
	{
		var KorEntry = $resource('/api/korisnik/');
		var loadEntries = function () 
		{
			$scope.korEntries = KorEntry.query();		
			$scope.korEntry = new KorEntry();
		}
		loadEntries();
		$scope.save = function () 
		{
			if(!$scope.korEntry._id)
			{
				$scope.korEntry.$save(loadEntries);
			}
		}

		$scope.delete = function (user) {
			user.$delete(loadEntries);
		}

		var korEntryId;
		if(!angular.equals({}, $stateParams))
		{
			var KorEntry2 = $resource('/api/korisnik/:_id');
			korEntryId = $stateParams.id;
    		$scope.User = KorEntry2.get({_id:korEntryId});
    		//console.log($scope.User);
		}
	
		$scope.dodajZad = function (projEntry) {
      		$location.path('/projekat/'+projEntry._id + '/zadatak');
    	}

    	$scope.pregledZadataka = function (projEntry) {
      		$location.path('/korisnik/' + korEntryId + '/projekat/'+ projEntry._id + '/korisnik_zadaci');
      	}
      		
      	$scope.mojiZadaci = function(projEntry){
      		///korisnik/:id/projekat/:id2/zadaci
      		$location.path('/korisnik/'+korEntryId +'/projekat/'+projEntry._id + '/zadaci');
      	}
		
	};

	var korisnikProjekatZadaciCtrl = function ($scope, $resource, $location, $stateParams, $http) 
	{
		console.log('USAO');
		var korEntryId;
		if(!angular.equals({}, $stateParams))
		{
    		var projEntry = $resource('/api/projekat/:_id');
    		var projEntryId = $stateParams.id;
    		$scope.projZad = projEntry.get({_id:projEntryId});

    		var korEntry = $resource('/api/korisnik/:_id');
    		korEntryId = $stateParams.id2;
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
		
	};





	/*
	Kontroler zaduzen za preuzimanje zadataka korisnika i njihovo prikazivanje i filtriranje
	*/
	var mojiZadaciCtrl = function($scope, $http, $resource, $location, $stateParams){
		$scope.myTask = [];
		var korEntryId;

		if(!angular.equals({}, $stateParams)){
			var KorEntry = $resource('/api/korisnik/:_id');
			korEntryId = $stateParams.id;
    		$scope.User = KorEntry.get({_id:korEntryId});
    		//console.log($scope.User);
		}
		
		/*
		Funkcija koja povlaci projekat sa baze i uporedjuje korisnika kojem je dodjeljen zadatak na tom projektu sa
		korisnikom koji je ulogovan i dodaje te zadatke na $scope
		*/
		var ucitaj = function(){
			var projekat = $http.get('/api/projekat/'+$stateParams.id2)
			.then(function(response){
				var zadaci = [];
				$scope.projekat = response.data;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++){
					console.log($scope.projekat.zadatak[i].korisnik + " " +korId);
					if($scope.projekat.zadatak[i].korisnik === korId){
						zadaci.push($scope.projekat.zadatak[i]);
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
			var projekat = $http.get('/api/projekat/'+$stateParams.id2)
			.then(function(response){
				$scope.projekat = response.data;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++){
					console.log($scope.projekat.zadatak[i].korisnik + " " +korId);
					if($scope.projekat.zadatak[i].korisnik === korId){
						if($scope.projekat.zadatak[i].status === status){
							zadaci.push($scope.projekat.zadatak[i]);
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
			var projekat = $http.get('/api/projekat/'+$stateParams.id2)
			.then(function(response){
				$scope.projekat = response.data;
				var korId = $stateParams.id;
				for(var i = 0; i < $scope.projekat.zadatak.length; i++){
					console.log($scope.projekat.zadatak[i].korisnik + " " +korId);
					if($scope.projekat.zadatak[i].korisnik === korId){
						if($scope.projekat.zadatak[i].prioritet === prioritet){
							zadaci.push($scope.projekat.zadatak[i]);
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
		
	};

	/*
	Kontroler zaduzen za preuzimanje komentara korisnika i njihovo prikazivanje, dodavanje, brisanje
	*/
	var korisnikKomentariCtrl = function($scope, $http, $stateParams, $resource, $location){
		//$location.path('/korisnik/'+$scope.User._id+'/projekat/'+projekatId + '/zadatak/'+ zadatakId+'/komentari');
		$scope.myComments = [];

		var korEntryId;
		var zadEntryId;
		
		//ucitavanje korisnika
		if(!angular.equals({}, $stateParams)){
			var KorEntry = $resource('/api/korisnik/:_id');
			korEntryId = $stateParams.id;
			zadEntryId = $stateParams.id3;
    		$scope.User = KorEntry.get({_id:korEntryId});
		}

		//ucitavanje projekta
		if(!angular.equals({}, $stateParams)){
			var ProjEntry = $resource('/api/projekat/:_id');
			var projEntryId = $stateParams.id2;
    		$scope.projekat = ProjEntry.get({_id:projEntryId});
		}
		
		/*
		//uvitavanje zadatka
		if(!angular.equals({}, $stateParams)){
			var ZadEntry = $resource('/api/zadatak/:_id');
			var zadEntryId = $stateParams.id3;
    		$scope.zadatak = ZadEntry.get({_id:zadEntryId});
		}*/
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
			$location.path('/korisnik/' + korEntryId +'/projekat/' + projEntryId +'/zadaci');

		}
	};

	var projekatCtrl = function ($scope, $http, $resource, $location, $stateParams) 
	{
		var ProjEntry = $resource('/api/projekat/:id',
			{id: '@_id'});
		var loadEntries2 = function () 
		{
			$scope.projEntries = ProjEntry.query();		
			$scope.projEntry = new ProjEntry();
		}
		loadEntries2();
		//dodavanje novog projekta
		$scope.save = function () 
		{
			if(!$scope.projEntry._id)
			{
				$scope.projEntry.$save(loadEntries2);
			}
		}

		$scope.dodajZad = function (projEntry) {
      		$location.path('/projekat/'+projEntry._id + '/zadatak');
    	}

    	$scope.dodajUser = function (projEntry) {
      		$location.path('/projekat/'+ projEntry._id + '/korisnik');	
    	}

    	$scope.pregledZadataka = function (projEntry) {
      		$location.path('/projekat/'+ projEntry._id + '/zadaci');
      	}

      	$scope.izvestaji = function (projEntry) {
      		$location.path('/projekat/'+ projEntry._id + '/izvestaji');
      	}


    	//za korisnike
    	var KorEntry = $resource('/api/korisnik');
		var loadEntries = function () 
		{
			$scope.korEntries = KorEntry.query();		
			$scope.korEntry = new KorEntry();

		}
		loadEntries();


		//preuzimanje odgovarajuceg projekta (provera da li URL ima id)
		if(!angular.equals({}, $stateParams))
		{
			var ProjEntry2 = $resource('/api/projekat/:_id');
			var projEntryId = $stateParams.id;
    		$scope.projUser = ProjEntry2.get({_id:projEntryId});
		}	

	};

	var zadatakCtrl = function ($scope, $resource, $stateParams, $location) 
	{
		var ZadEntry = $resource('/api/projekat/:_id/zadatak/');

		var loadEntries = function () 
		{
			$scope.zadEntries = ZadEntry.query();		
			$scope.zadEntry = new ZadEntry();

			//--------------------
			if(!angular.equals({}, $stateParams))
			{
				var ProjEntry = $resource('/api/projekat/:_id');
				var projEntryId = $stateParams.id;
			    projZad = ProjEntry.get({_id:projEntryId}, function (projekatt) 
			    {
			    	 $scope.zadEntry.oznaka = projekatt.oznaka;
			    	 if(angular.equals(0, projekatt.zadatak.length))
			    	 {
			    	 	$scope.zadEntry.redni_broj = 1;
			    	 }
			    	 else
			    	 {
			    	 	$scope.zadEntry.redni_broj = projekatt.zadatak[projekatt.zadatak.length-1].redni_broj+1;
			    	 } 
			    	 
			    });	
			}
			

		}
		loadEntries();
		$scope.save = function () 
		{
			if(!$scope.zadEntry._id)
			{
				$scope.zadEntry.$save(loadEntries);
			}
		} 

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
			$scope.zadEntries = ZadEntry.query();		
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

		if(!angular.equals({}, $stateParams))
		{
			$scope.projZadaci = [];
			var ProjEntry = $resource('/api/projekat/:_id');
			var projEntryId = $stateParams.id;
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
		}

		$scope.promeniStatus = function(zadatak, index){
			$http.put('/api/zadatak/' + zadatak._id, {params : {status : zadatak.status} });
		}

		$scope.komentari = function(zadatakId, projekatId){
			///projekat/:id/zadatak/:id2/komentari
			$location.path('/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar');
		}

		//slanje na odredjeni URL za edit zadatka
		$scope.editZadatak = function (zadatakId, projekatId) {
			$location.path('/projekat/' + projekatId + '/zadatak/' + zadatakId + '/edit');
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
		var zadEntryId = $stateParams.id2;
		var projEntryId = $stateParams.id;
    	$scope.zadatak = ZadEntry.get({_id:zadEntryId});

    	//da se u URL-u nalazi id projekta i id zadatka prilikom dodavanja komentara
    	$scope.noviKom = function() {
    		$location.path('/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentar');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$http.post('/api/comment/', {params:{tekst: $scope.commEntry.tekst, zadatakID: zadatakID}})
				.success(function(data, status, headers)
				{
					$location.path('/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar');
				});

			}
		}

		$scope.hitEditComment = function (commentID) 
		{
			$location.path('/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/komentar/' + commentID);
		}
 
		$scope.nazadNaZadatke = function () 
		{
			$location.path('/projekat/' + projEntryId + '/komentar_korisnik');	
		}

		//pitaj  zasto nece da registruje na backend-u poslati request {params:{zadatakID: ID}} ??
		$scope.obrisiKomentar = function (comment, index) 
		{
			$http.delete('/api/comment/' + comment._id)
			.success(function (data, status, headers) {
				console.log('U success-u sam!!!++');
				$scope.zadatak.komentari.splice(index, 1);
            })
            .error(function (data, status, headers) 
            {
            	console.log(data + "--" + status + "headers");
            });
		}
	}

	var zadatakIzmenaCtrl = function ($scope, $http, $resource, $stateParams, $location)
	{
		if(!angular.equals({}, $stateParams))
		{
			var ZadEntry = $resource('/api/zadatak/:_id');
			var zadEntryId = $stateParams.id2;
    		$scope.zad = ZadEntry.get({_id:zadEntryId});
    		$scope.projID = $stateParams.id;
		}

		$scope.izmena = function () 
		{
			$http.put('/api/zadatak/' + $scope.zad._id, {params : {naslov: $scope.zad.naslov, opis: $scope.zad.opis,  status : $scope.zad.status} })
			.success(function (data, status, headers) 
			{
				$location.path('/projekat/' + $scope.projID + '/zadaci');
			})
		}
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
			$http.put('/api/zadatak/' + $scope.zad._id, {params : {naslov: $scope.zad.naslov, opis: $scope.zad.opis,  status : $scope.zad.status} })
			.success(function (data, status, headers) 
			{
				console.log('USPEO');
				$location.path('/korisnik/' + korEntryId + '/projekat/' + $scope.projID + '/korisnik_zadaci');
			})
		}
	}

	var komentariIzmenaCtrl = function ($scope, $http, $resource, $stateParams, $location)
	{
		if(!angular.equals({}, $stateParams))
		{
			var CommEntry = $resource('/api/comment/:_id');
			var commEntryId = $stateParams.id3;
			console.log(commEntryId);
    		$scope.comm = CommEntry.get({_id:commEntryId});
    		var projID = $stateParams.id;
    		var zadID = $stateParams.id2;

		}

		$scope.izmeniKomentar = function(comment)
		{
			$http.put('/api/comment/' + comment._id, {params : {tekst : $scope.comm.tekst} })
			.success(function(data, status, headers)
			{
				$location.path('/projekat/' + projID + '/zadatak/' + zadID + '/komentar');
			});
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
		var zadEntryId = $stateParams.id2;
		var projEntryId = $stateParams.id;
		var korEntryId = $stateParams.id3;
    	$scope.zadatak = ZadEntry.get({_id:zadEntryId});

    	//da se u URL-u nalazi id projekta i id zadatka prilikom dodavanja komentara
    	$scope.noviKom = function() {
    		$location.path('/projekat/' + projEntryId + '/zadatak/' + zadEntryId + '/noviKomentar');
    	}

    	$scope.zapamti = function (zadatakID) 
		{
			if(!$scope.commEntry._id)
			{
				$http.post('/api/comment/', {params:{tekst: $scope.commEntry.tekst, zadatakID: zadatakID}})
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

				    $location.path('/projekat/' + data._id + '/izvestaji/izvestaj1');
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

                          $location.path('/projekat/'+data._id+'/izvestaji/izvestaj3');
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

						 $location.path('/projekat/'+data._id+'/izvestaji/izvestaj4');
					 });
			}
		};
	}

	var app = angular.module('app',['ui.router', 'ngResource']);
	app.controller('korisnikCtrl', korisnikCtrl);
	app.controller('korisnikProjekatZadaciCtrl', korisnikProjekatZadaciCtrl);
	app.controller('projekatCtrl', projekatCtrl);
	app.controller('zadatakCtrl', zadatakCtrl);
	app.controller('zadatakBrisanjeCtrl', zadatakBrisanjeCtrl);
	app.controller('komentariCtrl', komentariCtrl);
	app.controller('zadatakIzmenaCtrl', zadatakIzmenaCtrl);
	app.controller('zadatakIzmenaKorisnikCtrl', zadatakIzmenaKorisnikCtrl);
	app.controller('komentariKorisnikCtrl', komentariKorisnikCtrl);
	app.controller('komentariIzmenaCtrl', komentariIzmenaCtrl);
	app.controller('addRemoveUserProject', addRemoveUserProject);
	app.controller('ZadaciKorisnicimaCtrl', ZadaciKorisnicimaCtrl);
	app.controller('mojiZadaciCtrl', mojiZadaciCtrl);
	app.controller('korisnikKomentariCtrl', korisnikKomentariCtrl);

	app.config(function($stateProvider, $urlRouterProvider) {

	    $urlRouterProvider.otherwise('/login');

	    $stateProvider
	    .state('login', {//naziv stanja!
	      url: '/login',
	      templateUrl: 'logIn.html'
	    })
	    .state('reg', {
	      url: '/reg', 
	      templateUrl: 'reg-unos.html',
	      controller: 'korisnikCtrl'
	    })
	    .state('main', {
	      url: '/main', 
	      templateUrl: 'dahsboard-admin-zadaci.html',
	      controller: 'projekatCtrl'
	    })
	    .state('addZad', {
	      url: '/projekat/:id/zadatak', 
	      templateUrl: 'zad-unos.html'
	    //  controller: 'projekatCtrl'
	    })
	    .state('spisakUserProjekat', {
	      url: '/projekat/:id/korisnik', 
	      templateUrl: 'spisak-korisnika-projekat.html'
	    //  controller: 'projekatCtrl'
	    })
	    .state('zadaciProj', {
	      url: '/projekat/:id/zadaci', 
	      templateUrl: 'svi-zadaci-projekat.html',
	      controller: 'zadatakBrisanjeCtrl'
	    })
	    


	    .state('zadaciProjKorisnik', {
	      url: '/korisnik/:id2/projekat/:id/korisnik_zadaci', 
	      templateUrl: 'korisnik-zadaci-projekat.html',
	      controller: 'korisnikProjekatZadaciCtrl'
	    })



	    .state('zadaciEdit', {
	      url: '/projekat/:id/zadatak/:id2/edit', 
	      templateUrl: 'zadatak-edit.html',
	      controller: 'zadatakIzmenaCtrl'
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



	    .state('addProjekat', {
	      url: '/newProject', 
	      templateUrl: 'projekat-unos.html'
	    //  controller: 'projekatCtrl'
	    })
	    .state('zadKom', {
	      url: '/projekat/:id/zadatak/:id2/komentar', 
	      templateUrl: 'zadatak-komentari.html',
	      controller: 'komentariCtrl'
	    })
	    .state('izmenaKom', {
	      url: '/projekat/:id/zadatak/:id2/komentar/:id3', 
	      templateUrl: 'komentari-izmena.html',
	      controller: 'komentariIzmenaCtrl'
	    })
	    .state('addComment', {
	      url: '/projekat/:id/zadatak/:id2/noviKomentar', 
	      templateUrl: 'komentari-unos.html',
	      controller: 'komentariCtrl'
	    })
	    .state('izvestaji', {
	      url: '/projekat/:id/izvestaji', 
	      templateUrl: 'izvestaj-zadaci-dodeljeni-projekat.html'
	    //  controller: 'komentariCtrl'
	    })
	    .state('izvestaji.izvestaj1', {
	      url: '/izvestaj1', 
	      templateUrl: 'izvestaj-izvestaj1.html'
	    })
        .state('izvestaji.izvestaj3', {
          url: '/izvestaj3',
          templateUrl: 'izvestaj-izvestaj3.html'
        })
		.state('izvestaji.izvestaj4', {
			url: '/izvestaj4',
			templateUrl: 'izvestaj-izvestaj4.html'
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
	    .state('korKomentari',{
	    	//'/korisnik/'+$scope.User._id+'/projekat/'+projekatId + '/zadatak/'+ zadatakId+'/komentari'
	    	url: '/korisnik/:id/projekat/:id2/zadatak/:id3/komentari',
	    	templateUrl: 'korisnik-zadatak-komentari.html',
	    	controller: 'korisnikKomentariCtrl'
	    }) 
  	});

}(angular));