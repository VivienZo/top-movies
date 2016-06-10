(function () {
    'use strict';

    angular
        .module('app')
        .controller('MoviesCtrl', MoviesCtrl);

    MoviesCtrl.$inject = ['$scope', 'moviesService', '$timeout','$q', '$mdDialog', '$mdSidenav', '$mdBottomSheet', '$mdToast', '$translate'];
    
    function MoviesCtrl($scope, moviesService, $timeout, $q, $mdDialog, $mdSidenav, $mdBottomSheet, $mdToast, $translate) {
        
        /**
         * VARIABLES
         */
        
        $scope.movies = [];
        $scope.moviesCount = 0;
        $scope.query = {
            order: '',
            limit: 5,
            page: 1,
            rowsPerPage: [5, 10, 20]
        };
        $scope.selectedCategory = 'popular';
        // https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1
        $scope.availableLanguages = [
            {code: 'en', countryCode: 'gb', name: 'English'},
            {code: 'fr', countryCode: 'fr', name: 'French'}
        ];
        
        
        /**
         * GET MOVIES BY CATEGORY
         */
        
        // Fonction qui permet de récupérer les films à afficher dans la liste selon la catégorie sélectionnée
        $scope.getMovies = function (category) {
            console.log("getMovies(category)",category);
            //on réinitialise le tri et la pagination
            $scope.query.page = 1;
            $scope.query.order = '';
            //on sélectionne la catégorie
            if (category === 'popular' || category === 'top_rated' || category === 'upcoming') {
                $scope.selectedCategory = category;
            } else {
                //catégorie par défaut
                $scope.selectedCategory = 'popular';
            }
            //on retourne la promesse à la directive md-progress de la data table pour qu'elle affiche
            //une barre de chargement tant que la requête est en cours
            $scope.promise = moviesService.getMovies($scope.selectedCategory)
                .then( function (response) {
                    //on affiche une notification si tout ne s'est pas passé comme prévu
                    if (!response || !response.statusText) {
                        $scope.showNotification('NO_RESPONSE');
                    } else if (response.status !== 200 || !response.data || !response.data.results) {
                        console.error("Error: ",response.statusText);
                        $scope.showNotification('RESPONSE_ERROR');
                    } else {
                        //si la requête s'est bien terminée
                        //on (ré)initialise la liste avec les films reçus
                        $scope.movies = response.data.results;
                        //on met à jour le nombre de films chargés (pour le listener onPaginate)
                        $scope.loadedMovies = $scope.movies.length;
                        //on met à jour le nombre de films total
                        $scope.totalMovies = response.data.total_results;
                    }
                })
                .catch( function (err) {
                    console.log('err', err);
                    $scope.showNotification('RESPONSE_ERROR');
                });
            return $scope.promise;
        };
        
        
        /**
         * SEARCH FILTERS
         */
        
        //fonction qui ouvre le panneau d'affichage du formulaire de recherche
        $scope.openSearch = function () {
            $mdSidenav('search-menu').open();
        };
        
        //fonction qui lance une recherche de films avec des filtres (nom, année de sortie)
        $scope.searchWithFilters = function () {
            console.log("searchWithFilters()");
            
            //on réinitialise le tri et la pagination
            $scope.query.order = '';
            $scope.query.page = 1;
            
            //on ferme le panneau de recherche
            $mdSidenav('search-menu').close();
            
            //on fait appel au service
            $scope.promise = moviesService.searchWithFilters($scope.search)
                .then( function (response) {
                    //on met à jour la liste à afficher
                    $scope.movies = response.data.results;
                    $scope.moviesCount = response.data.results.length;
                })
                .catch( function (err) {
                    console.log('err', err);
                    $scope.showNotification('RESPONSE_ERROR');
                });
            
            return $scope.promise;
        };
        
        //fonction qui réinitialise le formulaire de recherche
        $scope.resetSearchForm = function () {
            $scope.search = {};
        };
        
        
        /**
         * LISTENERS
         */
        
        // Fonction appelée par la directive md-data-table lorsque l'utilisateur change de page dans le tableau
        // permet de charger les résultats suivants, qu'ils viennent de getMovies() ou de searchWithFilters()
        $scope.onPaginate = function(page, limit) {
            console.log("onpagechange(page,limit)",page,limit);
            //on lance la requête si le chargement de la prochaine page n'est pas déjà en cours
            //et si le dernier résultat affiché fait parti des 5 derniers chargés 
            if (!$scope.disableNext && (page * limit) + 5 >= $scope.loadedMovies) {
                $scope.disableNext = true;
                $scope.promise = moviesService.getNextMovies()
                    .then(function (response) {
                        if (!response || !response.statusText) {
                            $scope.showNotification('NO_RESPONSE');
                        } else if (response.status !== 200 || !response.data || !response.data.results) {
                            console.error("Error: ",response.statusText);
                            $scope.showNotification('RESPONSE_ERROR');
                            //TODO : possibilité d'avoir atteind la fin des résultats
                            //ou pas de résultats du tout
                        } else {
                            $scope.movies = $scope.movies.concat(response.data.results);
                            $scope.loadedMovies = $scope.movies.length;
                            $scope.totalMovies = response.data.total_results;
                            console.log("$scope.loadedMovies",$scope.loadedMovies);
                        }
                        $scope.disableNext = false;
                    })
                    .catch(function (resp) {
                        console.log('resp', resp);
                        $scope.disableNext = false;
                        $scope.showNotification('RESPONSE_ERROR');
                    });
            }
        };
        
        // Fonction appelée par la directive md-data-table lorsque l'utilisateur change l'ordre d'une colonne du tableau
        $scope.onReorder = function(order) {
            console.log("onReorder(order)",order);
            $scope.query.page = 1;
        };
        
        
        /**
         * MOVIE DETAILS
         */
        
        // Fonction qui lance une requête pour demander les détails d'un film puis qui lance le mdDialog
        $scope.openDetails = function(ev, movie) {
            $scope.promise = moviesService.getDetails(movie.id)
                .then(function (response) {
                    $mdDialog.show({
                        locals: {
                            movie: response.data
                        },
                        controller: 'MovieDetailsCtrl',
                        templateUrl: './app/movieDetails/movieDetails.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    });
                }).catch( function (err) {
                    console.log('err', err);
                    $scope.showNotification('RESPONSE_ERROR');
                });
                
            return $scope.promise;
        };
        
        
        /**
         * SETTINGS
         */
        
        $scope.openSettings = function($event) {
            $mdBottomSheet.show({
                locals: {
                    availableLanguages: $scope.availableLanguages
                },
                controller: 'SettingsCtrl',
                templateUrl: './app/settings/settings.template.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true
            });
        };
        
        
        /**
         * NOTIFICATION
         */
        
        $scope.showNotification = function (messageCode) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent($translate.instant(messageCode))
                    .hideDelay(3000)
            );
        };
        
        
        /**
         * INITIALISATION
         */
        
        // Lance la fonction d'affichage des films les plus populaires
        $scope.deferred = $scope.getMovies('popular');
        
    };
    
})();