(function(angular){

	var zadatakModule = angular.module('zadEntry');
	zadatakModule.controller('izmeneZadatkaCtrl', function ($scope, $http, $stateParams, $location, $state, ZadatakEntry)
	{
		if(!angular.equals({}, $stateParams))
		{
			var zadEntryId = $stateParams.id2;
			var korEntryId = $stateParams.id3;
			var projEntryId = $stateParams.id;
		}

		ZadatakEntry.get({_id: zadEntryId}, function (zadatak) 
		{
			$scope.sveIzmene = zadatak.izmeneZadatka;
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
					$state.go('korZadaci', {id: korEntryId, id2: projEntryId});
					//$location.path('/korisnik/' + korEntryId + '/projekat/' + projEntryId + '/korisnik_zadaci');
				}
			})
			
		}

	});
})(angular)