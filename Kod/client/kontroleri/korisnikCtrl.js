(function (angular) {
	
	var app = angular.module('app');

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

	app.controller('korisnikCtrl', korisnikCtrl);
	
})(angular)