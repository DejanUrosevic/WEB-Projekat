(function (angular) 
{
	angular.module('zadatak.resource',['ngResource'])
	.factory('ZadatakEntry', ["$resource", function($resource)
	{
		var ZadEntry = $resource('/api/zadatak/:_id',
		{_id:'@_id'},
		{
			update: {method: 'PUT'}
			
		});
		return ZadEntry;
		
	}]);
}(angular));