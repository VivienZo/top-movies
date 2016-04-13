(function () {
    'use strict';

    angular
        .module('app')
        .controller('MoviesCtrl', MoviesCtrl);

    MoviesCtrl.$inject = ['$scope', 'dataservice', '$timeout','$q', '$mdDialog', '$mdSidenav'];
    
    function MoviesCtrl($scope, dataservice, $timeout, $q, $mdDialog, $mdSidenav) {
        
        /**
         * Définition des variables du controller
         */
        $scope.getMovies = getMovies;
        $scope.movies = [];
        $scope.moviesCount = 0;
        $scope.query = {
            order: '-popularity',
            limit: 10,
            page: 1,
            rowsPerPage: [5, 10, 50, 100]
        };
        
        
        /**
         * Fonction appelée par la directive md-data-table lorsque l'utilisateur change de page dans le tableau
         */
        $scope.onpagechange = function(page, limit) {
            // console.log("onpagechange(page,limit)",page,limit);
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, 100);
            return deferred.promise;
        };

        /**
         * Fonction appelée par la directive md-data-table lorsque l'utilisateur change l'ordre d'une colonne du tableau
         */
        $scope.onorderchange = function(order) {
            // console.log("onorderchange(order)",order);
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve();
            }, 100);
            return deferred.promise;
        };
        
        /**
         * Fonction appelée au chargement de la page qui permet de récupérer les 100 movies à afficher par défaut
         */
        function getMovies() {
            console.log("getMovies()");
            //on retourne la promesse
            return dataservice.getMovies()
                .then(function (data) {
                    console.log('dataservice.getMovies data',data);
                    if (data && data.movies) {
                        $scope.movies = data.movies;
                        $scope.moviesCount = data.movies.length;
                    }
                    return $scope.movies;
                });
        };
        
        // ---------- md-dialog ----------
        $scope.openDetails = function(ev, movie) {
            dataservice.getDetails(movie.id).then(function (response) {
                console.log("aze", response.details);
                console.log("qsd", movie);
                $mdDialog.show({
                    locals: {
                        movie: response.details
                    },
                    controller: MovieDetailsCtrl,
                    templateUrl: './app/movieDetails/movieDetails.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                });
            });
        };
        
        // ---------- md-sidenav ----------
        $scope.openSidenav = function () {
            $mdSidenav('filter-menu').open();
        };
        
        
        /**
         * SEARCH FILTER 
         */
        
        $scope.searchWithFilters = function () {
            console.info("search : ",$scope.search);
            dataservice.searchWithFilters($scope.search).then( function (response) {
                console.info("response", response);
            });
            $mdSidenav('filter-menu').close();
        };
        
        $scope.resetSearchForm = function () {
            $scope.search = {};
        };
        
        
        // --------------------- INITIALISATION ----------------------
        
        $scope.deferred = $scope.getMovies();
        
        // ------------------- FIN INITIALISATION --------------------
        
    };
    
    function MovieDetailsCtrl($scope, $mdDialog, movie) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.movie = movie;
    }
    
})();