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
            limit: 10,
            page: 1,
            rowsPerPage: [5, 10, 50, 100]
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
            //on sélectionne la catégorie
            if (category === 'popular' || category === 'top_rated' || category === 'upcoming') {
                $scope.selectedCategory = category;
            } else {
                $scope.selectedCategory = 'popular';
            }
            //on retourne la promesse
            $scope.promise = moviesService.getMovies($scope.selectedCategory)
                .then(function (response) {
                    if (!response || (response.status === -1 && response.statusText) || !response.data || !response.data.results) {
                        $scope.showNotification(response.statusText);
                    } else if (response.status === 0 && response.statusText) {
                        $scope.showNotification(response.statusText);
                        $scope.movies = response.data.results;
                        $scope.moviesCount = response.data.results.length;
                    } else {
                        $scope.movies = response.data.results;
                        $scope.moviesCount = response.data.results.length;
                    }
                }
            );
            return $scope.promise;
        };
        
        
        /**
         * SEARCH FILTERS
         */
        
        //fonction qui ouvre le mdSidenav qui affiche le formulaire de recherche
        $scope.openSearch = function () {
            $mdSidenav('search-menu').open();
        };
        
        //fonction qui lance une recherche de film avec des filtres (nom, année de sortie)
        $scope.searchWithFilters = function () {
            console.info("search : ",$scope.search);
            moviesService.searchWithFilters($scope.search)
                .then(
                function successCallback (response) {
                    //on met à jour la liste à afficher
                    $scope.movies = response.data.results;
                    $scope.moviesCount = response.data.results.length;
                },
                function errorCallback (response) {
                    $scope.showNotification('RESPONSE_ERROR');
                }
            );
            $mdSidenav('search-menu').close();
        };
        
        //fonction qui réinitialise le formulaire de recherche
        $scope.resetSearchForm = function () {
            $scope.search = {};
        };
        
        
        /**
         * MOVIE DETAILS
         */
        
        // Fonction qui lance une requête pour demander les détails d'un film puis qui lance le mdDialog
        $scope.openDetails = function(ev, movie) {
            $scope.promise = moviesService.getDetails(movie.id).then(function (response) {
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
         * LISTENERS
         */
        
        // Fonction appelée par la directive md-data-table lorsque l'utilisateur change de page dans le tableau
        $scope.onpagechange = function(page, limit) {
            // console.log("onpagechange(page,limit)",page,limit);
            // var deferred = $q.defer();
            // $timeout(function () {
            //     deferred.resolve();
            // }, 100);
            // return deferred.promise;
        };
        
        // Fonction appelée par la directive md-data-table lorsque l'utilisateur change l'ordre d'une colonne du tableau
        $scope.onorderchange = function(order) {
            // console.log("onorderchange(order)",order);
            // var deferred = $q.defer();
            // $timeout(function () {
            //     deferred.resolve();
            // }, 100);
            // return deferred.promise;
        };
        
        
        /**
         * INITIALISATION
         */
        
        // Lance la fonction d'affichage des films les plus populaires
        $scope.deferred = $scope.getMovies('popular');
        
    };
    
})();