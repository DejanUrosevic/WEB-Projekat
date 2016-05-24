(function(angular) {

	var app = angular.module('app');

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
				$scope.zadEntry.$save(function() {
					if (!angular.equals({}, $stateParams)) {
						$http.get('/api/korisnik/' + korEntryId)
							 .then(function(response) {
								 if (response.data.vrsta == 'admin') {
									$state.go('main', {id2: korEntryId});
								 } else if (response.data.vrsta == 'korisnik') {
									 $state.go('korDash', {id: korEntryId});
									 //$location.path('/korisnik/' + korEntryId);
								 }
							 });
					}
				});
			}
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

	app.controller('zadatakCtrl', zadatakCtrl);
	
})(angular)