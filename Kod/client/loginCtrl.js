(function(angular){

	var app = angular.module('app');

	/**
	 * Kontroler zadužen za prijavljivanje korisnika na sistem.
	 * @param $scope
	 * @param $http
	 * @param $state
	 */
	var loginCtrl = function($scope, $http, $state) {
		$scope.loginKor = {};
		$scope.loginKor.email = "";
		$scope.loginKor.pass = "";

		$scope.prijaviSe = function(isValid) {
			var loginKor = $scope.loginKor;
			if (isValid) {
				$http.post('/login', {user: loginKor.email, pass: loginKor.pass})
					 .success(function(data) {
						 if (data.korisnik) {
							 if (data.korisnik.vrsta == 'admin') {
								 $state.go('main', {id2: data.korisnik._id});
							 } else if (data.korisnik.vrsta == 'korisnik') {
								 $state.go('korDash', {id: data.korisnik._id});
							 }
						 } else {
							 alert('Neki od unetih podataka nije ispravan!');
						 }
					 });
			}
		};
	};

	app.controller('loginCtrl', loginCtrl);

})(angular)