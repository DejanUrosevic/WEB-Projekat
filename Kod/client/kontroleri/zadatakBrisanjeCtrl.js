(function(angular) {

	var app = angular.module('app');

	var zadatakBrisanjeCtrl = function ($scope, $http, $resource, $stateParams, $location, $filter) 
	{
		var ZadEntry = $resource('/api/zadatak/:id',
			{id:'@_id'});
		var loadEntries = function () 
		{
			$scope.zadEntries = ZadEntry.query(function(data) {
				//console.log(data);
			});
			$scope.zadEntry = new ZadEntry();
		}
		loadEntries();

		//brisanje selektovanog zadatka iz liste zadataka odgovarajuceg projekta.
		$scope.obrisiZad = function (zadatakID, index) 
		{

			$http.delete('/api/zadatak/' + zadatakID)
			.success(function (data, status, headers) {
				$scope.projZadaci.splice(index, 1);
            });
		}
		
		$scope.projZadaci = [];
		var ProjEntry = $resource('/api/projekat/:_id');

		if(!angular.equals({}, $stateParams))
		{
			var projEntryId = $stateParams.id;	
		}

		$scope.projZad = ProjEntry.get({_id:projEntryId} , function (projekatt) 
			{//zasto ovo nece??? Onaj deo Projekat.findByID({"oznaka": data.oznaka})
			    	for(var i=0; i<projekatt.zadatak.length; i++)
			    	{		 
						for(var j=0; j<$scope.zadEntries.length; j++)
						{						
							if($scope.zadEntries[j]._id === projekatt.zadatak[i]._id)
							{
								$scope.projZadaci.push($scope.zadEntries[j]);
								break;  	
							} 
						}
					}
				//?? da li ovako treba za filter??	$filter('orderBy')($scope.projZadaci, '-updatedAt');
			});

		if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id2;
		}

		$scope.nazadNaMain = function(){
			$location.path('/admin/' + korEntryId + '/main');
		}

		$scope.promeniStatus = function(zadatak, index){
			$http.put('/api/zadatak/' + zadatak._id, {params : {status : zadatak.status} });
		}

		$scope.komentari = function(zadatakId, projekatId){
			///projekat/:id/zadatak/:id2/komentari
			$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/komentar');
		}

		//slanje na odredjeni URL za edit zadatka
		$scope.editZadatak = function (zadatakId, projekatId) {
			$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/edit');
		}

		$scope.izmeneZadatka = function (zadatakId, projekatId) {
			$location.path('/admin/' + korEntryId + '/projekat/' + projekatId + '/zadatak/' + zadatakId + '/izmene');
		}
	};

	app.controller('zadatakBrisanjeCtrl', zadatakBrisanjeCtrl);
	
})(angular)