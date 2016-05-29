(function (angular) 
{
	angular.module('komentar.resource',['ngResource'])
	.factory('KomentarEntry', ["$resource", function($resource)
	{
		var ComEntry = $resource('/api/comment/:_id',
		{_id:'@_id'},
		{
			update: {method: 'PUT'},
			save:
			{
				method:'POST',
				url:'/api/comment/zadatak/:zadId/autor/:korId'
			}
			
		});
		return ComEntry;
		
	}]);
}(angular));