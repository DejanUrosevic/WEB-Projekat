(function(angular){

	var app = angular.module('app');

	var projekatCtrl = function ($scope, $http, $resource, $location, $stateParams, $state) {
		var ProjEntry = $resource('/api/projekat');

		var loadEntries2 = function () {
			$scope.projEntries = ProjEntry.query();		
			$scope.projEntry = new ProjEntry();
		}

		if(!angular.equals({}, $stateParams)) {
			var korEntryId = $stateParams.id2;
			var projEntryID = $stateParams.id;
		}	
		
		loadEntries2();
		
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

	app.controller('projekatCtrl', projekatCtrl);
	
})(angular)