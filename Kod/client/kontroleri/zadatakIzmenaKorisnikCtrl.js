(function(angular){

	var app = angular.module('app');

	var zadatakIzmenaKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location, $state)
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
			$http.put('/api/zadatak/' + $scope.zad._id, {params : {naslov: $scope.zad.naslov, opis: $scope.zad.opis,  status : $scope.zad.status, prioritet: $scope.zad.prioritet, korisnik: $scope.zad.korisnik._id}})
			.success(function (data, status, headers) 
			{
				$state.go('zadaciProjKorisnik', {id2: korEntryId, id: $scope.projID});
				//$location.path('/korisnik/' + korEntryId + '/projekat/' + $scope.projID + '/korisnik_zadaci');
			})
		}

		$scope.izmeniZad = function(isValid) {
			if (isValid) {
				$scope.izmena();
			}
		};
	}

	app.controller('zadatakIzmenaKorisnikCtrl', zadatakIzmenaKorisnikCtrl);

})(angular)