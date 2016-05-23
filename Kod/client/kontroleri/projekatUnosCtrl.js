(function(angular){

	var app = angular.module('app');

	/**
	 * Funckcija koja predstavlja kontroler zadužen za kreiranje projekta
	 * @param $scope
	 * @param $resource
	 * @param $stateParams
	 * @param $state
	 */
	var projekatUnosCtrl = function($scope, $resource, $stateParams, $state) {
		if(!angular.equals({}, $stateParams)) {
			var korEntryId = $stateParams.id;
		}

		var ProjEntry = $resource('/api/projekat');

		$scope.projEntry = new ProjEntry();

		$scope.save = function () {
			if(!$scope.projEntry._id) {
					$scope.projEntry.$save(function() {
					$state.go('main', {id2: korEntryId});
				});
			}
		}

		$scope.kreirajProj = function(isValid) {
			if (isValid) {
				$scope.save();
			}
		};
	};

	app.controller('projekatUnosCtrl', projekatUnosCtrl);
	
})(angular)