(function (angular) {
	var korisnikCtrl = function ($scope, $resource) 
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

	var zadatakBrisanjeCtrl = function ($scope, $http, $resource, $stateParams, $location) 
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
		$scope.obrisiZad = function (zadatak, index) 
		{

			$http.delete('/api/zadatak/' + zadatak._id)
			.success(function (data, status, headers) {
				$scope.projZad.zadatak.splice(index, 1);
            });
		}


		// ovde moram da uporedjujem zadatke sa nekog projekta i sve zadatke, 
		//da bih ispisao korisnika kome je u stvari zadat zadatak.
		//iz nekog razloga, nije hteo populate korisnika u zadatku, kada se uzme iz liste zadataka tog projekta,
		//pa sam morao ovako.
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
			$location.path('/projekat/' + projEntryId + '/zadaci');	
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

	var ZadaciKorisnicimaCtrl = function ($scope, $http, $resource, $stateParams, $location) 
	{
		$scope.podaci = [];
		
		$http.get('/api/korisnik/')
		.success(function(data, status, headers)
		{
			
			console.log(data);
			for (var i = 0; i < data.length; i++) 
			{
				$scope.podaci.push({
						   key:data[i].ime + ' ' + data[i].prezime, 
						   y: data[i].zadatak.length
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
		});

		

		var testdata2 = [
	        {key: "One", y: 5},
	        {key: "Two", y: 2},
	        {key: "Three", y: 9},
	        {key: "Four", y: 7},
	        {key: "Five", y: 4},
	        {key: "Six", y: 3},
	        {key: "Seven", y: 0.5}
	    ];

	    
	}



	var app = angular.module('app',['ui.router', 'ngResource']);
	app.controller('korisnikCtrl', korisnikCtrl);
	app.controller('projekatCtrl', projekatCtrl);
	app.controller('zadatakCtrl', zadatakCtrl);
	app.controller('zadatakBrisanjeCtrl', zadatakBrisanjeCtrl);
	app.controller('komentariCtrl', komentariCtrl);
	app.controller('zadatakIzmenaCtrl', zadatakIzmenaCtrl);
	app.controller('komentariIzmenaCtrl', komentariIzmenaCtrl);
	app.controller('addRemoveUserProject', addRemoveUserProject);
	app.controller('ZadaciKorisnicimaCtrl', ZadaciKorisnicimaCtrl);

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
	    .state('zadaciEdit', {
	      url: '/projekat/:id/zadatak/:id2/edit', 
	      templateUrl: 'zadatak-edit.html',
	      controller: 'zadatakIzmenaCtrl'
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
	    .state('izvestajZadaci1', {
	      url: '/izvestaj1', 
	      templateUrl: 'izvestaj-zadaci-dodeljeni-projekat.html'
	    //  controller: 'komentariCtrl'
	    })     
  	});

}(angular));