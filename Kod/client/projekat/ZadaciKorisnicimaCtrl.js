(function(angular){

	var projekatModul = angular.module('projEntry');

	projekatModul.controller('ZadaciKorisnicimaCtrl', ["$scope", "$http", "$resource", "$stateParams", "$location","ZadatakEntry", "ProjekatEntry", "KorisnikEntry" ,function ($scope, $http, $resource, $stateParams, $location, ZadatakEntry, ProjekatEntry, KorisnikEntry){
		var projEntryId;
		if(!angular.equals({}, $stateParams)){
			var korEntryId = $stateParams.id2;
			projEntryId = $stateParams.id;	
		}
		
		$scope.Users = [];

		ProjekatEntry.get({_id: projEntryId},function(projekat){
			$scope.Users = projekat.korisnici;
		});

		/*
		Funkcija za kreiranje izvestaja Zadaci dodeljeni klijentima.
		*/
		$scope.izvestaj1 = function () 
		{
			$scope.podaci = [];
		
			if(!angular.equals({}, $stateParams))
			{
				// ok, sta ovde radimo..
				//tri for petlje, prva da prikaze koji korsnici rade na tom selektovanom projektu
				//druga je za da se prodju svi zadaci na kojima korisnici rade, iz svih projekata(jbg tako smo schemu napravili)
				//treca je da se uporede ti zadaci sa zadacima na trenutnom projektu
				//oni koji su isti se racunaju kao brojac++, inace se preskacu.
				ProjekatEntry.get({_id: $stateParams.id}, function(data){
					
					for (var i = 0; i < data.korisnici.length; i++) 
					{
						var brojac = 0;
						for(var z=0; z<data.korisnici[i].zadatak.length; z++)
						{
							for(var j=0; j<data.zadatak.length; j++)
							{
							
								if(data.zadatak[j]._id === data.korisnici[i].zadatak[z])
								{
									brojac = brojac + 1;
									break;
								}
							}
						}
						$scope.podaci.push({
								   key:data.korisnici[i].ime + ' ' + data.korisnici[i].prezime, 
								   y: brojac
						});
						
					}

					//sam kod za pravljenje dijagrama

					var height = 350;
				    var width = 350;

				    nv.addGraph(function() {
				        var chart = nv.models.pieChart()
				            .x(function(d) { return d.key })
				            .y(function(d) { return d.y })
				            .width(width)
				            .height(height)
				            .showTooltipPercent(true);

				        d3.select("#test1")
				            .datum($scope.podaci)
				            .transition().duration(1200)
				            .attr('width', width)
				            .attr('height', height)
				            .call(chart);

				        return chart;
				    });

				    nv.addGraph(function() {
				        var chart = nv.models.pieChart()
				            .x(function(d) { return d.key })
				            .y(function(d) { return d.y })
				            //.labelThreshold(.08)
				            //.showLabels(false)
				            .color(d3.scale.category20().range().slice(8))
				            .growOnHover(false)
				            .labelType('value')
				            .width(width)
				            .height(height);

				        // disable and enable some of the sections
				        var is_disabled = false;
				        setInterval(function() {
				            chart.dispatch.changeState({disabled: {2: !is_disabled, 4: !is_disabled}});
				            is_disabled = !is_disabled;
				        }, 3000);

				        return chart;
				    });

				    $location.path('/admin/' + korEntryId + '/projekat/' + data._id + '/izvestaji/izvestaj1');
				});
				}
			}


		$scope.izvestaj2 = function(){
			if(!angular.equals({}, $stateParams)){
				ProjekatEntry.get({_id: $stateParams.id}, function(data){
					$scope.projekat = data;
					function podaci(){
						var ukupnoZadataka = [];
						var odradjeniZadaci = [];
						var podaciUkupno = [];
						var podaciOdradjeno = [];

						var all = 0;
						var done = 0;
						for(var i = 0; i < data.korisnici.length; i++){
							var all = 0;
							var done = 0;
							for(var j = 0; j < data.zadatak.length; j++){
								console.log(data.zadatak[j].korisnik);
								if(data.zadatak[j].korisnik !== null && data.zadatak[j].korisnik !== undefined){
									if(data.korisnici[i]._id === data.zadatak[j].korisnik._id){
										all += 1;
										if(data.zadatak[j].status === "Done"){
											done += 1;
										}
									}
								}
								
							}
							ukupnoZadataka.push(all);
							odradjeniZadaci.push(done);
						}

						for(var i = 0; i < data.korisnici.length; i++){
							podaciUkupno.push({x: data.korisnici[i].ime+ " "+data.korisnici[i].prezime, y:ukupnoZadataka[i] })
						}

						for(var i = 0; i < data.korisnici.length; i++){
							podaciOdradjeno.push({x: data.korisnici[i].ime+ " "+data.korisnici[i].prezime, y:odradjeniZadaci[i] })
						}

						return [{
									key: 'Odradjeni zadaci',
									values : podaciOdradjeno
								},
								{
									key: 'Ukupno zadataka',
									values: podaciUkupno
								}]

					}

					console.log(podaci());

					var chart;
				    nv.addGraph(function() {
				        chart = nv.models.multiBarChart()
				            .barColor(d3.scale.category20().range())
				            .duration(300)
				            .margin({bottom: 100, left: 70})
				            .rotateLabels(45)
				            .groupSpacing(0.1)

				        ;

				        chart.reduceXTicks(false).staggerLabels(true);
				        //chart.height(500);
				        chart.xAxis
				            .axisLabel("Korisnici")
				            .axisLabelDistance(35)
				            .showMaxMin(false)
				        ;

				        chart.yAxis
				            .axisLabel("Broj zadataka")
				            .axisLabelDistance(-5)
				        ;

				        chart.dispatch.on('renderEnd', function(){
				            nv.log('Render Complete');
				        });

				        d3.select('#chart1 svg')
				            .datum(podaci())
				            .call(chart);

				        nv.utils.windowResize(chart.update);

				        chart.dispatch.on('stateChange', function(e) {
				            nv.log('New State:', JSON.stringify(e));
				        });
				        chart.state.dispatch.on('change', function(state){
				            nv.log('state', JSON.stringify(state));
				        });

				        return chart;
				    });
				    $location.path('/admin/' + korEntryId + '/projekat/' + data._id + '/izvestaji/izvestaj2');
				});
			}
		};

		$scope.izvestaj3 = function() {
             var podaci = [];

             if (!angular.equals({}, $stateParams)) {
                      	ProjekatEntry.get({_id: $stateParams.id}, function(data){
                          var zadaci = data.zadatak;                // Preuzmemo spisak zadataka

                          // var currentDate = new Date();             // Preuzmemo trenutni datum

                          var brojZadatakaPoDanu = {};              // Sadrži broj kreiranih zadataka po danu

                          // Određivanje broja kreiranih zadataka po danu
                          for (var i=0; i<zadaci.length; i++) {
                              var createdAt = zadaci[i].createdAt;

                              var year = createdAt.substr(0,4);
                              var month = createdAt.substr(5, 2);
                              var day = createdAt.substr(8, 2);

                              var createdAtFormated =  day+"/"+month+"/"+year;
                              if (brojZadatakaPoDanu[createdAtFormated]==undefined) {
                                  brojZadatakaPoDanu[createdAtFormated] = 1;
                              } else {
                                  brojZadatakaPoDanu[createdAtFormated]++;
                              }
                          }

                          for (var stavka in brojZadatakaPoDanu) {
                              console.log(stavka);
                              podaci.push({label: stavka, value: brojZadatakaPoDanu[stavka]});
                          }

                          var podaciChart = [{key: "Naslov", "color": "#d67777", values: podaci}];

                          // Crtanje grafika
                          nv.addGraph(function() {
                              var chart = nv.models.discreteBarChart() /*multiBarHorizontalChart()*/
                                                   .x(function(d) {return d.label;})
                                                    .y(function(d) {return d.value;})
                                                    // .margin({top: 30, right: 20, bottom: 50, left: 175})
                                                    // .staggerLabels(true)
                                                    .showValues(true);
                              chart.yAxis.tickFormat(d3.format(',f'));

                              d3.select('#test3')
                                  .datum(podaciChart)
                                  .call(chart);

                              return chart;
                          });

                          $location.path('/admin/' + korEntryId + '/projekat/'+data._id+'/izvestaji/izvestaj3');
                      });
             }
         };

         $scope.izvestaj4 = function() {
			var podaci = [];

			if (!angular.equals({}, $stateParams)) {
				ProjekatEntry.get({_id: $stateParams.id}, function(data){
						 var zadaci = data.zadatak;					// Preuzmemo spisak zadataka

						 // var currentDate = new Date();				// Preuzmemo trenutni datum

						 var brojZadatakaPoDanu = {};				// Sadrži broj završenih zadataka po danu

						 // Određivanje broja završenih zadataka po danu
						 for (var i=0; i<zadaci.length; i++) {
							 var zadatak = zadaci[i];

							 if (zadatak.status == 'Done') {
								 var updatedAt = zadatak.updatedAt;

								 var year = updatedAt.substr(0, 4);
								 var month = updatedAt.substr(5, 2);
								 var day = updatedAt.substr(8, 2);

								 var updatedAtFormated = day+"/"+month+"/"+year;
								 if (brojZadatakaPoDanu[updatedAtFormated] == undefined) {
									 brojZadatakaPoDanu[updatedAtFormated] = 1;
								 } else {
									 brojZadatakaPoDanu[updatedAtFormated]++;
								 }
							 }
						 }

						 for (var stavka in brojZadatakaPoDanu) {
							 podaci.push({label: stavka, value: brojZadatakaPoDanu[stavka]});
						 }

						 // Sortirati podatke po danima
						 podaci.sort(function(a, b) {
							 var daya = a.label.substr(0, 2);
							 var dayb = b.label.substr(0, 2);
							 var montha = a.label.substr(3, 2);
							 var monthb = b.label.substr(3, 2);
							 var yeara = a.label.substr(6, 4);
							 var yearb = b.label.substr(6, 4);

							 var datea = new Date(yeara, montha, daya);
							 var dateb = new Date(yearb, monthb, dayb);

							 // console.log(datea+"||"+dateb);
							 if (datea > dateb) {
								 return 1;
							 }
							 if (datea < dateb)
								 return -1;

							 return 0;
						 });

						 var podaciChart = [{key: "Naslov", values: podaci}];

						 // Crtanje grafika
						 nv.addGraph(function() {
							 var chart = nv.models.discreteBarChart()
								 .x(function(d) {return d.label;})
								 .y(function(d) {return d.value;})
								 .showValues(true);
							 d3.select("#test4")
								 .datum(podaciChart)
								 .call(chart);

							 return chart;
						 });

						 $location.path('/admin/' + korEntryId + '/projekat/'+data._id+'/izvestaji/izvestaj4');
					 });
			}
		};

		$scope.izvestaj5 = function(prosledjeniKorisnik) {
			var podaciKorisnika = {};
			var redniBrojKorisnika = 0;
			ProjekatEntry.get({_id: $stateParams.id}, function(projekti){
				KorisnikEntry.query(function(svi_korisnici){
					
					/*
					$http.get('/api/projekat/').success(function(projekti, status, headers) {
						$http.get('/api/korisnik/').success(function(svi_korisnici, status1, headers1) 
					*/

					// OVDE SU SVI KORISNICI NA PROJEKTU
					var korisnici = projekti.korisnici;
					

					// STAVLJAMO SVE KORISNIKE NA SCOPE
					$scope.Users = korisnici;

					// OVDE SU ZADACI KOJI SE NALAZE NA PROJEKTU
					var zadaci = projekti.zadatak;

					// OVDE SU ZADACI NASEG KORISNIKA KOJEG SMO SELEKTOVALI U COMBOBOX-U U HTML-U
					var zadaciOdabranogKorisnika = [];
					// for (var i = 0; i < korisnici.length; i++) {
					// 	var zadaciKorisnika = [];
					// 	var korisnik = korisnici[i];
					for (var j = 0; j < zadaci.length; j++) {
						var zadatak = zadaci[j];
						if(prosledjeniKorisnik == zadatak.korisnik._id){
							zadaciOdabranogKorisnika.push(zadatak);
						}
					}
					// 	zadaciSvihKorisnika[korisnici[i]._id] = zadaciKorisnika;
					// }
						
					// var redniBrojKorisnika = 0;
					// for (var korisnik in zadaciSvihKorisnika) {
						var zadaci = zadaciOdabranogKorisnika;
						var podaci = [];
						var brojZadatakaPoDanu = {};						// Sadrži broj završenih zadataka po danu

						 // Određivanje broja završenih zadataka po danu
						for (var i = 0; i < zadaci.length; i++) {
							 var zadatak = zadaci[i];

							 if (zadatak.status == 'Done') {
								 var updatedAt = zadatak.updatedAt;

								 var year = updatedAt.substr(0, 4);
								 var month = updatedAt.substr(5, 2);
								 var day = updatedAt.substr(8, 2);

								 var updatedAtFormated = day+"/"+month+"/"+year;
								 if (brojZadatakaPoDanu[updatedAtFormated] == undefined) {
									 brojZadatakaPoDanu[updatedAtFormated] = 1;
								 } else {
									 brojZadatakaPoDanu[updatedAtFormated]++;
								 }
							 }
						}

						for (var stavka in brojZadatakaPoDanu) {
							 podaci.push({label: stavka, value: brojZadatakaPoDanu[stavka]});
						}

						 podaci.sort(function(a, b) {
							 var daya = a.label.substr(0, 2);
							 var dayb = b.label.substr(0, 2);
							 var montha = a.label.substr(3, 2);
							 var monthb = b.label.substr(3, 2);
							 var yeara = a.label.substr(6, 4);
							 var yearb = b.label.substr(6, 4);

							 var datea = new Date(yeara, montha, daya);
							 var dateb = new Date(yearb, monthb, dayb);

							 // console.log(datea+"||"+dateb);
							 if (datea > dateb) {
								 return 1;
							 }
							 if (datea < dateb)
								 return -1;

							 return 0;
						 });

						 var podaciChart = [{key: "Naslov", values: podaci}];

						  nv.addGraph(function() {
							 var chart = nv.models.discreteBarChart()
								 .x(function(d) {return d.label;})
								 .y(function(d) {return d.value;})
								 .showValues(true);
							var id_grafika = "#test5" + " svg";
							 d3.select(id_grafika)
								 .datum(podaciChart)
								 .call(chart);


							// 	 var proba = 5;

							// redniBrojKorisnika++;	
							 return chart;

						 });
						
					// }

					 $location.path('/admin/' + korEntryId + '/projekat/'+ $stateParams.id +'/izvestaji/izvestaj5');
				 });
				 });	
		};	

		$scope.selektuj = function(selektovanKorisnik){

    		$scope.izvestaj5(selektovanKorisnik);
    	}

    	$scope.prikaz = function(){

    		$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/izvestaji/izvestaj5');
    	}

		$scope.nazadNaZadatke = function(){
			$location.path('/admin/' + korEntryId + '/main' );
		}

	}]);

/*
	var ZadaciKorisnicimaCtrl = function ($scope, $http, $resource, $stateParams, $location) 
	{
	
        /*
		Funkcija za kreiranje izvestaja Dinamika završavanja zadataka na projektu.
        */
		/*

		/*
		Funkcija za kreiranje izvestaja Aktivnost korisnika na projektu.
		*/
		/*$scope.izvestaj5 = function(prosledjeniKorisnik) {
			var podaciKorisnika = {};
			var redniBrojKorisnika = 0;
			$http.get('/api/projekat/').success(function(projekti, status, headers) {
				$http.get('/api/korisnik/').success(function(svi_korisnici, status1, headers1) {
					
					
					
					// OVDE SU SVI KORISNICI----> ONI KOJI NISU ADMINI
					var korisnici = [];
					for (var i = 0; i < svi_korisnici.length; i++) {
						if(svi_korisnici[i].vrsta =='korisnik'){
							korisnici.push(svi_korisnici[i]);
						}
					}

					// STAVLJAMO SVE KORISNIKE NA SCOPE
					$scope.Users = korisnici;

					// OVDE SU SVU MOGUCI ZADACI NA SVIM PROJEKTIMA
					var zadaci = [];
					for (var i = 0; i < projekti.length; i++) {
						var projekat = projekti[i];
						if(projekat._id == projEntryId){
							for (var j = 0; j < projekat.zadatak.length; j++) {
								zadaci.push( projekti[i].zadatak[j]);
							}	
						}
					}

					// OVDE SU ZADACI NASEG KORISNIKA KOJEG SMO SELEKTOVALI U COMBOBOX-U U HTML-U
					var zadaciOdabranogKorisnika = [];
					// for (var i = 0; i < korisnici.length; i++) {
					// 	var zadaciKorisnika = [];
					// 	var korisnik = korisnici[i];
					for (var j = 0; j < zadaci.length; j++) {
						var zadatak = zadaci[j];
						if(prosledjeniKorisnik == zadatak.korisnik){
							zadaciOdabranogKorisnika.push(zadatak);
						}
					}
					// 	zadaciSvihKorisnika[korisnici[i]._id] = zadaciKorisnika;
					// }
						
					// var redniBrojKorisnika = 0;
					// for (var korisnik in zadaciSvihKorisnika) {
						var zadaci = zadaciOdabranogKorisnika;
						var podaci = [];
						var brojZadatakaPoDanu = {};						// Sadrži broj završenih zadataka po danu

						 // Određivanje broja završenih zadataka po danu
						for (var i = 0; i < zadaci.length; i++) {
							 var zadatak = zadaci[i];

							 if (zadatak.status == 'Done') {
								 var updatedAt = zadatak.updatedAt;

								 var year = updatedAt.substr(0, 4);
								 var month = updatedAt.substr(5, 2);
								 var day = updatedAt.substr(8, 2);

								 var updatedAtFormated = day+"/"+month+"/"+year;
								 if (brojZadatakaPoDanu[updatedAtFormated] == undefined) {
									 brojZadatakaPoDanu[updatedAtFormated] = 1;
								 } else {
									 brojZadatakaPoDanu[updatedAtFormated]++;
								 }
							 }
						}

						for (var stavka in brojZadatakaPoDanu) {
							 podaci.push({label: stavka, value: brojZadatakaPoDanu[stavka]});
						}

						 podaci.sort(function(a, b) {
							 var daya = a.label.substr(0, 2);
							 var dayb = b.label.substr(0, 2);
							 var montha = a.label.substr(3, 2);
							 var monthb = b.label.substr(3, 2);
							 var yeara = a.label.substr(6, 4);
							 var yearb = b.label.substr(6, 4);

							 var datea = new Date(yeara, montha, daya);
							 var dateb = new Date(yearb, monthb, dayb);

							 // console.log(datea+"||"+dateb);
							 if (datea > dateb) {
								 return 1;
							 }
							 if (datea < dateb)
								 return -1;

							 return 0;
						 });

						 var podaciChart = [{key: "Naslov", values: podaci}];

						  nv.addGraph(function() {
							 var chart = nv.models.discreteBarChart()
								 .x(function(d) {return d.label;})
								 .y(function(d) {return d.value;})
								 .showValues(true);
							var id_grafika = "#test5" + " svg";
							 d3.select(id_grafika)
								 .datum(podaciChart)
								 .call(chart);


							// 	 var proba = 5;

							// redniBrojKorisnika++;	
							 return chart;

						 });
						
					// }

					 $location.path('/admin/' + korEntryId + '/projekat/'+ $stateParams.id +'/izvestaji/izvestaj5');
				 });
				 });	
		};	

		$scope.selektuj = function(selektovanKorisnik){

    		$scope.izvestaj5(selektovanKorisnik);
    	}

    	$scope.prikaz = function(){

    		$location.path('/admin/' + korEntryId + '/projekat/' + projEntryId + '/izvestaji/izvestaj5');
    	}

		$scope.nazadNaZadatke = function(){
			$location.path('/admin/' + korEntryId + '/main' );
		}
	}

	app.controller('ZadaciKorisnicimaCtrl', ZadaciKorisnicimaCtrl);*/
})(angular)