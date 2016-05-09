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

	var projekatCtrl = function ($scope, $resource, $location, $stateParams) 
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
			    projZad = ProjEntry.get({_id:projEntryId}, function (userInfo) 
			    {
			    	 $scope.zadEntry.oznaka = userInfo.oznaka;
			    	 $scope.zadEntry.redni_broj = userInfo.zadatak.length+1;
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

	var zadatakBrisanjeCtrl = function ($scope, $resource, $stateParams) 
	{
		var ZadEntry = $resource('/api/zadatak/:id',
			{id:'@_id'});
		var loadEntries = function () 
		{
			$scope.zadEntries = ZadEntry.query();		
			$scope.zadEntry = new ZadEntry();
		}
		loadEntries();


		$scope.obrisiZad = function (zadatak) 
		{
			console.log(zadatak._id);
			var zad = ZadEntry.get({"_id": zadatak._id},function (userInfo) 
		    {
		    	console.log(zad);
				console.log(zadatak);
		    });
			
			zad.$delete(loadEntries);
		}

		if(!angular.equals({}, $stateParams))
		{
			var ProjEntry = $resource('/api/projekat/:_id');
			var projEntryId = $stateParams.id;
    		$scope.projZad = ProjEntry.get({_id:projEntryId});
		}
		
	}





	var app = angular.module('app',['ui.router', 'ngResource']);
	app.controller('korisnikCtrl', korisnikCtrl);
	app.controller('projekatCtrl', projekatCtrl);
	app.controller('zadatakCtrl', zadatakCtrl);
	app.controller('zadatakBrisanjeCtrl', zadatakBrisanjeCtrl);

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
	    .state('addProjekat', {
	      url: '/newProject', 
	      templateUrl: 'projekat-unos.html'
	    //  controller: 'projekatCtrl'
	    })    
  	});

}(angular));