(function(angular){

	var app = angular.module('app');

	var komentariIzmenaKorisnikCtrl = function ($scope, $http, $resource, $stateParams, $location)
	{
		if(!angular.equals({}, $stateParams))
		{
			var CommEntry = $resource('/api/comment/:_id');
			var commEntryId = $stateParams.id4;
			console.log(commEntryId);
    		$scope.comm = CommEntry.get({_id:commEntryId});
    		var projID = $stateParams.id;
    		var zadID = $stateParams.id2;
    		var korID = $stateParams.id3;

		}

		$scope.izmeniKomentar = function(isValid, comment)
		{
			if(isValid){
				$http.put('/api/comment/' + comment._id, {params : {tekst : $scope.comm.tekst} })
				.success(function(data, status, headers)
				{
					$location.path('/korisnik/' + korID +'/projekat/' + projID + '/zadatak/' + zadID + '/komentari');
				});
			}
		}
	}

	app.controller('komentariIzmenaKorisnikCtrl', komentariIzmenaKorisnikCtrl);
	
})(angular)