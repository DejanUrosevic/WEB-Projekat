(function (angular) {
	var korisnikCtrl = function ($scope, $resource) 
	{
		var KorEntry = $resource('/api/korisnik');
		var loadEntries = function () 
		{
			$scope.korEntries = KorEntry.query();		
			$scope.korEntry = new KorEntry();
		}
		loadEntries();
		$scope.save = function () 
		{
			if(!$scope.korEntry._id)
			{
				$scope.korEntry.$save(loadEntries);
			}
		}  
	};
	var app = angular.module('app',['ngResource']);
	app.controller('korisnikCtrl', korisnikCtrl);
}(angular));