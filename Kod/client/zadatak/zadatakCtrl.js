(function(angular) {

	angular.module('zadEntry', ['zadatak.resource', 'projekat.resource', 'korisnik.resource'])
    .controller('zadatakCtrl', function ($scope, $stateParams, $state, $location, ZadatakEntry, ProjekatEntry, $http)
    {
    	if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id2;	
		}

		var loadEntries = function () {
			$scope.zadEntries = ZadatakEntry.query();		
			$scope.zadEntry = new ZadatakEntry();

			//--------------------
			if(!angular.equals({}, $stateParams)) 
			{
				var projEntryId = $stateParams.id;

			    $scope.projZad = ProjekatEntry.get({_id:projEntryId}, function (projekatt) 
			    {
			    	 $scope.zadEntry.oznaka = projekatt.oznaka;
			    	 if(angular.equals(0, projekatt.zadatak.length)) {
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

		$scope.saveZadatak = function () 
		{
			if(!$scope.zadEntry._id) 
			{
				$scope.zadEntry.$save(function() 
				{
					if (!angular.equals({}, $stateParams)) 
					{
						$http.get('/api/korisnik/' + korEntryId)
							 .then(function(response) 
							 {
								 if (response.data.vrsta == 'admin') 
								 {
									$state.go('main', {id2: korEntryId});
								 } else if (response.data.vrsta == 'korisnik') 
								 {
									 $state.go('korDash', {id: korEntryId});
									 //$location.path('/korisnik/' + korEntryId);
								 }
							});
					}
				});
			}
		}

		$scope.kreirajZad = function(isValid) {
			if (isValid) 
			{
				$scope.saveZadatak();
			}
		};


    });
})(angular)