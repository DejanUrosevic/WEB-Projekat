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
	};

	var projekatCtrl = function ($scope, $resource, $location, $stateParams) 
	{
		var ProjEntry = $resource('/api/projekat');
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
			else{
				$scope.projEntry.$update(loadEntries2);				
			}
		}

		$scope.dodajZad = function (projEntry) {
      		$location.path('/projekat/'+projEntry._id + '/zadatak');
    	}

    	$scope.dodajUser = function (projEntry) {
      		$location.path('/projekat/'+ projEntry._id + '/korisnik');
    	}

    	//za korisnike
    	var KorEntry = $resource('/api/korisnik');
		var loadEntries = function () 
		{
			$scope.korEntries = KorEntry.query();		
			$scope.korEntry = new KorEntry();
		}
		loadEntries();

		//preuzimanje odgovarajuceg projekta
		var ProjEntry2 = $resource('/api/projekat/:_id');
		var projEntryId = $stateParams.id;
    	$scope.projUser = ProjEntry2.get({_id:projEntryId});



	};

	var zadatakCtrl = function ($scope, $resource, $stateParams) 
	{
		var ZadEntry = $resource('/api/projekat/:id/zadatak');
		var loadEntries = function () 
		{
			$scope.zadEntries = ZadEntry.query();		
			$scope.zadEntry = new ZadEntry();
		}
		loadEntries();
		$scope.save = function () 
		{
			if(!$scope.zadEntry._id)
			{
				$scope.zadEntry.$save(loadEntries);
			}
		} 

		var ProjEntry = $resource('/api/projekat/:_id');
		var projEntryId = $stateParams.id;
    	$scope.projZad = ProjEntry.get({_id:projEntryId});
	};



	var app = angular.module('app',['ui.router', 'ngResource']);
	app.controller('korisnikCtrl', korisnikCtrl);
	app.controller('projekatCtrl', projekatCtrl);
	app.controller('zadatakCtrl', zadatakCtrl);

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
	    .state('addProjekat', {
	      url: '/newProject', 
	      templateUrl: 'projekat-unos.html'
	    //  controller: 'projekatCtrl'
	    })    
  	});

}(angular));