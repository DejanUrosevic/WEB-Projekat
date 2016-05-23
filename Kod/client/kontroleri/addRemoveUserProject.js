(function(angular){

	var app = angular.module('app');
	
	var addRemoveUserProject = function ($scope, $http, $resource, $stateParams, $location) 
	{
			var KorEntry = $resource('/api/korisnik');
			var loadEntries = function () 
			{
				$scope.korEntries = KorEntry.query();		
			}
			loadEntries();

			//preuzimanje odgovarajuceg projekta (provera da li URL ima id)
			if(!angular.equals({}, $stateParams))
			{
				var ProjEntry2 = $resource('/api/projekat/:_id');
				var projEntryId = $stateParams.id;
	    		$scope.projUser = ProjEntry2.get({_id:projEntryId});
	    		var korEntryId = $stateParams.id2;
			}

			$scope.obrisiUsera = function (korisnik, index) 
			{
				$http.put('/api/projekat/' + projEntryId, {params : {korisnikID : korisnik._id} })
				.success(function (data, status, headers) {
					$scope.projUser.korisnici.splice(index, 1);
					$scope.korEntries.push(korisnik);
	            });
			}

			//ovde u $scope.nizKorisnika stavljamo samo one korisnike koji nisu na selektovanom projektu.
			if(!angular.equals({}, $stateParams))
			{
				var ProjEntry2 = $resource('/api/projekat/:_id');
				var projEntryId = $stateParams.id;
	    		$scope.projUser = ProjEntry2.get({_id:projEntryId} , function (projekatt) 
			    {
			    	for(var i=0; i<projekatt.korisnici.length; i++)
			    	{		 
						for(var j=0; j<$scope.korEntries.length; j++)
						{						
							if($scope.korEntries[j]._id === projekatt.korisnici[i]._id)
							{
								$scope.korEntries.splice(j, 1);
								break;  	
							} 
						}
					}
			    });
			}
			
			$scope.dodajUsera = function (kor, index)
			{
				$http.put('/api/projekat/' + projEntryId + '/dodajKor', {params : {korisnikID : kor._id} })
				.success(function (data, status, headers) {
					$scope.korEntries.splice(index, 1);
					$scope.projUser.korisnici.push(kor);
	            });
			}

			$scope.nazadNaMain = function(){
				$location.path('/admin/' + korEntryId + '/main');
			}
	}

	app.controller('addRemoveUserProject', addRemoveUserProject);
	
})(angular)