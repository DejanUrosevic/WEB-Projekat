(function (angular) 
{
	angular.module('korisnik.resource',['ngResource'])
	.factory('KorisnikEntry', ["$resource", function($resource)
	{
		var KorEntry = $resource('/api/korisnik/:_id',
		{_id:'@_id'},
		{
			update: {method: 'PUT'}
		});
		return KorEntry;
		
	}]);
}(angular));