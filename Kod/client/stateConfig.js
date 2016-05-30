(function(angular){
	
	var app = angular.module('app');

	app.config(function($stateProvider, $urlRouterProvider) {

	    $urlRouterProvider.otherwise('/login');

	    $stateProvider
	    .state('login', {
	      url: '/login',
	      templateUrl: 'logIn.html',
		  controller: 'loginCtrl'
	    })
	    .state('reg', {
	      url: '/reg', 
	      templateUrl: 'korisnik/reg-unos.html',
	      controller: 'korisnikCtrl'
	    })
	    .state('main', {
	      url: '/admin/:id2/main', 
	      templateUrl: 'projekat/dahsboard-admin-zadaci.html',
	      controller: 'projekatCtrl'
	    })
	    .state('addZad', {
	      url: '/admin/:id2/projekat/:id/zadatak', 
	      templateUrl: 'zadatak/zad-unos.html'
	    //  controller: 'projekatCtrl'
	    })
	    .state('spisakUserProjekat', {
	      url: '/admin/:id2/projekat/:id/korisnik', 
	      templateUrl: 'korisnik/spisak-korisnika-projekat.html',
	      controller: 'addRemoveUserProject'
	    })
	    .state('zadaciProj', {
	      url: '/admin/:id2/projekat/:id/zadaci', 
	      templateUrl: 'zadatak/svi-zadaci-projekat.html',
	      controller: 'zadatakBrisanjeCtrl'
	    })
	    .state('addProjekat', {
	      url: '/admin/:id2/dodajProjekat', 
	      templateUrl: 'projekat/projekat-unos.html',
	      controller: 'projekatCtrl'
	    })
	    .state('zadKom', {
	      url: '/admin/:id3/projekat/:id/zadatak/:id2/komentar', 
	      templateUrl: 'komentari/zadatak-komentari.html',
	      controller: 'komentariCtrl'
	    })
	    .state('izmenaKom', {
	      url: '/admin/:id4/projekat/:id/zadatak/:id2/komentar/:id3', 
	      templateUrl: 'komentari/komentari-izmena.html',
	      controller: 'komentariIzmenaCtrl'
	    })
	    .state('zadaciEdit', {
	      url: '/admin/:id3/projekat/:id/zadatak/:id2/edit', 
	      templateUrl: 'zadatak/zadatak-edit.html',
	      controller: 'zadatakIzmenaCtrl'
	    })
	    .state('zadaciIzmene', {
	      url: '/admin/:id3/projekat/:id/zadatak/:id2/izmene', 
	      templateUrl: 'zadatak/izmene-zadatak.html',
	      controller: 'izmeneZadatkaCtrl'
	    })
	    .state('addComment', {
	      url: '/admin/:id3/projekat/:id/zadatak/:id2/noviKomentar', 
	      templateUrl: 'komentari/komentari-unos.html',
	      controller: 'komentariCtrl'
	    })
	    .state('izvestaji', {
	      url: '/admin/:id2/projekat/:id/izvestaji', 
	      templateUrl: 'projekat/izvestaj-zadaci-dodeljeni-projekat.html',
	      controller: 'ZadaciKorisnicimaCtrl'
	    })
	    .state('zadaciProjKorisnik', {
	      url: '/korisnik/:id2/projekat/:id/korisnik_zadaci', 
	      templateUrl: 'projekat/korisnik-zadaci-projekat.html',
	      controller: 'korisnikProjekatZadaciCtrl'
	    })
	    .state('zadaciKorisnikEdit', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/edit_korisnik', 
	      templateUrl: 'zadatak/zadatak-edit-korisnik.html',
	      controller: 'zadatakIzmenaKorisnikCtrl'
	    })
	    .state('zadKomKor', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/komentar_korisnik', 
	      templateUrl: 'komentari/zadatak-komentari-korisnik.html',
	      controller: 'komentariKorisnikCtrl'
	    })
	    .state('zadaciIzmeneKorisnik', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/izmene', 
	      templateUrl: 'zadatak/izmene-zadatak.html',
	      controller: 'izmeneZadatkaCtrl'
	    })    
	    .state('izmenaKomKor', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/komentar/:id4', 
	      templateUrl: 'komentari/komentari-izmena-korisnik.html',
	      controller: 'komentariIzmenaKorisnikCtrl'
	    })
	    .state('addCommentKorisnikUnos', {
	      url: '/korisnik/:id3/projekat/:id/zadatak/:id2/noviKomentarKorisnik', 
	      templateUrl: 'komentari/komentari-unos-korisnik.html',
	      controller: 'komentariKontrolerKorisnikCtrl'
	    })
	     .state('korDash', {
	      url: '/korisnik/:id', 
	      templateUrl: 'korisnik/korisnik-dashboard.html',
	      controller: 'korisnikCtrl'
	    }) 
	    .state('korZadaci', {
	    	url: '/korisnik/:id/projekat/:id2/zadaci',
	    	templateUrl: 'zadatak/korisnik-zadaci.html',
	    	controller: 'mojiZadaciCtrl'
	    })
	    .state('dodajZadatak', {
	    	url: '/korisnik/:id2/projekat/:id/noviZadatak',
	    	templateUrl: 'zadatak/zad-unos.html'
	    })
	    .state('korKomentari',{
	    	url: '/korisnik/:id/projekat/:id2/zadatak/:id3/komentari',
	    	templateUrl: 'komentari/korisnik-zadatak-komentari.html',
	    	controller: 'korisnikKomentariCtrl'
	    }) 
	    .state('izvestaji.izvestaj1', {
	      url: '/izvestaj1', 
	      templateUrl: 'projekat/izvestaj-izvestaj1.html'
	    })
	    .state('izvestaji.izvestaj2', {
	      url: '/izvestaj2', 
	      templateUrl: 'projekat/izvestaj-izvestaj2.html'
	    })
        .state('izvestaji.izvestaj3', {
          url: '/izvestaj3',
          templateUrl: 'projekat/izvestaj-izvestaj3.html'
        })
		.state('izvestaji.izvestaj4', {
			url: '/izvestaj4',
			templateUrl: 'projekat/izvestaj-izvestaj4.html'
		})
		.state('izvestaji.izvestaj5', {
			url: '/izvestaj5',
			templateUrl: 'projekat/izvestaj-izvestaj5.html'
		})
  	});
})(angular)