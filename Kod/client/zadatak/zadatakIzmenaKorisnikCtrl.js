(function(angular){

	var appModule = angular.module('zadEntry');
	appModule.controller('zadatakIzmenaKorisnikCtrl', ["$scope", "$stateParams", "$state", "ZadatakEntry", function ($scope, $stateParams, $state, ZadatakEntry)
	{
		if(!angular.equals({}, $stateParams))
		{
			var zadEntryId = $stateParams.id2;
			var korEntryId = $stateParams.id3;
    		$scope.zad = ZadatakEntry.get({_id:zadEntryId});
    		$scope.projID = $stateParams.id;
		}

		$scope.izmena = function () 
		{
			$scope.zad.$update();
			$state.go('zadaciProjKorisnik', {id2: korEntryId, id: $scope.projID});

		}

		$scope.izmeniZad = function(isValid) {
			if (isValid) {
				$scope.izmena();
			}
		};
	}]);
})(angular)