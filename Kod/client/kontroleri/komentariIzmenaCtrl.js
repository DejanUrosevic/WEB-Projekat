(function(angular){

	var app = angular.module('app');

	var komentariIzmenaCtrl = function ($scope, $http, $resource, $stateParams, $location)
	{
		var korEntryId;
		if(!angular.equals({}, $stateParams))
		{
			var CommEntry = $resource('/api/comment/:_id');
			korEntryId = $stateParams.id4;
			var commEntryId = $stateParams.id3;
			console.log(commEntryId);
    		$scope.comm = CommEntry.get({_id:commEntryId});
    		var projID = $stateParams.id;
    		var zadID = $stateParams.id2;

		}

		$scope.izmeniKomentar = function(isValid, comment)
		{
			if(isValid){
				$http.put('/api/comment/' + comment._id, {params : {tekst : $scope.comm.tekst} })
				.success(function(data, status, headers)
				{
					$location.path('/admin/' + korEntryId + '/projekat/' + projID + '/zadatak/' + zadID + '/komentar');
				});
			}
		}
	}

	app.controller('komentariIzmenaCtrl', komentariIzmenaCtrl);
	
})(angular)