(function(angular){

	var commModule = angular.module('commEntry');
	commModule.controller('komentariIzmenaKorisnikCtrl',["$scope", "$stateParams", "$state", "KomentarEntry", function ($scope, $stateParams, $state, KomentarEntry)
	{
		if(!angular.equals({}, $stateParams))
		{
			var commEntryId = $stateParams.id4;
    		$scope.comm = KomentarEntry.get({_id:commEntryId});
    		var projID = $stateParams.id;
    		var zadID = $stateParams.id2;
    		var korID = $stateParams.id3;
		}

		$scope.izmeniKomentar = function(isValid, comment)
		{
			if(isValid)
			{
				$scope.comm.$update();
				$state.go('korKomentari', {id: korID, id2: projID, id3: zadID});
					

			}
		}

	}]);

})(angular)