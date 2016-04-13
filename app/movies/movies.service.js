(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q'];

    function dataservice($http, $q) {
        
        /**
         * Définition de l'URL de l'API utilisée par le service
         */
        // API infos :
        // api_key=8781b7598f5ea90173b90d07812925d7
        // http://docs.themoviedb.apiary.io/#reference/search/searchmovie/get
        // 10 requêtes / 40 secondes
        var apiUrl = "http://api.themoviedb.org/3/movie/";
        var apiKey = "?api_key=8781b7598f5ea90173b90d07812925d7";
        
        /**
         * Fonctions exposées par le service
         */
        var service = {
            getMovies: getMovies,
            getDetails: getDetails,
            searchWithFilters: searchWithFilters
        };
        return service;
        
        /**
         * Fonction permettant de récupérer les Movies affichées sur la page d'accueil
         */
        function getMovies() {
            console.log("getMovies()");
            
            var deferred = $q.defer();
            
            $http({method: 'GET', url: apiUrl + "popular" + apiKey + "&page=1"}).
                success(function(data, status, headers, config) {
                    console.log(data);
                    
                    $http({method: 'GET', url: apiUrl + "popular" + apiKey + "&page=2"}).
                        success(function(data2, status, headers, config) {
                            console.log(data2);
                            
                            $http({method: 'GET', url: apiUrl + "popular" + apiKey + "&page=3"}).
                                success(function(data3, status, headers, config) {
                                    console.log(data3);
                                    
                                    $http({method: 'GET', url: apiUrl + "popular" + apiKey + "&page=4"}).
                                        success(function(data4, status, headers, config) {
                                            console.log(data4);
                                            
                                            $http({method: 'GET', url: apiUrl + "popular" + apiKey + "&page=5"}).
                                                success(function(data5, status, headers, config) {
                                                    console.log(data5);
                                                    
                                                    deferred.resolve({
                                                        success         : true,
                                                        movies          : data.results
                                                            .concat(data2.results)
                                                            .concat(data3.results)
                                                            .concat(data4.results)
                                                            .concat(data5.results)
                                                    });
                                                    
                                                }).
                                                error(function(data5, status, headers, config) {
                                                    console.error("ERROR",data5);
                                                    deferred.resolve({
                                                        success         : false,
                                                        movies          : data5
                                                    });
                                                });
                                            
                                        }).
                                        error(function(data4, status, headers, config) {
                                            console.error("ERROR",data4);
                                            deferred.resolve({
                                                success         : false,
                                                movies          : data4
                                            });
                                        });
                                    
                                }).
                                error(function(data3, status, headers, config) {
                                    console.error("ERROR",data3);
                                    deferred.resolve({
                                        success         : false,
                                        movies          : data3
                                    });
                                });
                            
                        }).
                        error(function(data2, status, headers, config) {
                            console.error("ERROR",data2);
                            deferred.resolve({
                                success         : false,
                                movies          : data2
                            });
                        });
                    
                }).
                error(function(data, status, headers, config) {
                    console.error("ERROR",data);
                    deferred.resolve({
                        success         : false,
                        movies          : data
                    });
                });
            
            return deferred.promise;
        };
        
        
        /**
         * Fonction permettant de récupérer les détails d'un film
         */
        function getDetails(movieId) {
            console.log("getDetails(movieId)",movieId);
            var deferred = $q.defer();
            
            $http({method: 'GET', url: apiUrl + movieId + apiKey})
                .success(function(data, status, headers, config) {
                    console.log(data);
                    deferred.resolve({
                        success: true,
                        details: data
                    });
                })
                .error(function(data, status, headers, config) {
                    console.error("ERROR",data);
                    deferred.resolve({
                        success         : false,
                        details          : data
                    });
                });
            
            return deferred.promise;
        }
        
        
        /**
         * Fonction permettant de récupérer la liste des films qui correspond à la recherche de l'utilisateur
         */
        function searchWithFilters(filters) {
            console.log("searchWithFilters(filters)",filters);
            var deferred = $q.defer();
            
            $http({method: 'GET', url: apiUrl+"&page=1"})
                .success(function(data, status, headers, config) {
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.error("ERROR",data);
                    deferred.resolve({
                        success         : false,
                        movies          : data
                    });
                });
            
            return deferred.promise;
        };
        
    }
})();