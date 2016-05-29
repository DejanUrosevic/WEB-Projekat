(function (angular) 
{
	angular.module('projekat.resource',['ngResource'])
	.factory('ProjekatEntry', ["$resource", function($resource)
	{
		var ProjEntry = $resource('/api/projekat/:_id',
		{_id:'@_id'},
		{
			obrisiKorisnika: 
			{
				method: 'PUT',
				url: 'api/projekat/:_id/:korId'
			}
			
		});
		return ProjEntry;
		
	}]);
}(angular));