(function(angular){

	var komentariModul = angular.module('commEntry');
	komentariModul.controller('komentariIzmenaCtrl',["$scope", "$http", "$stateParams", "ZadatakEntry", "ProjekatEntry", "KomentarEntry", "$state", function ($scope, $http, $stateParams, ZadatakEntry, ProjekatEntry, KomentarEntry, $state)
	{

		if(!angular.equals({}, $stateParams))
		{
			var korEntryId = $stateParams.id4;
			var commEntryId = $stateParams.id3;
    		var projID = $stateParams.id;
    		var zadID = $stateParams.id2;

    		$scope.comm = KomentarEntry.get({_id:commEntryId});

		}

		$scope.izmeniKomentar = function(isValid, comment)
		{
			if(isValid)
			{
				$scope.comm.$update();
				$state.go('zadKom', {id3: korEntryId, id: projID, id2: zadID});
				
			}
		}

	}]);
})(angular)