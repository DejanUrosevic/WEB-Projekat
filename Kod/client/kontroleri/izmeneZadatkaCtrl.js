(function(angular){

	var app = angular.module('app');

	var izmeneZadatkaCtrl = function ($scope, $http, $resource, $stateParams, $location, $state) 
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
					$state.go('zadaciProj', {id2: korEntryId, id: projEntryId});
					//$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/zadaci');
				}
				else if(data.vrsta === 'korisnik')
				{
					$state.go('zadaciProjKorisnik', {id2: korEntryId, id: projEntryId});
					//$location.path('/korisnik/' + korEntryId + '/projekat/' + projEntryId + '/korisnik_zadaci');
				}
			})
			
		}
	}

	app.controller('izmeneZadatkaCtrl', izmeneZadatkaCtrl);
	
})(angular)