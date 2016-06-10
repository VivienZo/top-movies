(function () {
    'use strict';

    angular
        .module('app')
        .factory('moviesService', moviesService);

    moviesService.$inject = ['$http', '$q', '$translate'];

    function moviesService($http, $q, $translate) {

        /**
         * Définition de l'URL de l'API utilisée par le service
         * Limite : 10 requêtes / 40 secondes
         */

        var apiUrl = "http://api.themoviedb.org/3/";
        var apiKey = "?api_key=8781b7598f5ea90173b90d07812925d7";
        var selectedLanguage = $translate.use();
        var nextPage = 1;
        var totalPages = 1;
        var totalResults = 0;
        var baseUrl = "";

        /**
         * Fonctions exposées par le service
         */
        var service = {
            getMovies: getMovies,
            getNextMovies: getNextMovies,
            searchWithFilters: searchWithFilters,
            getDetails: getDetails
        };
        return service;


        /**
         * Fonction permettant de récupérer les films affichés sur la page d'accueil
         */
        function getMovies(category) {
            console.log("getMovies(category)", category);

            var deferred = $q.defer();
            
            baseUrl = apiUrl + "movie/" + category + apiKey;

            $http({ method: 'GET', url: baseUrl + "&language=" + selectedLanguage })
                .then( function (response) {
                    //on met à jour les informations dont on dispose
                    totalResults = response.data.total_results;
                    totalPages = response.data.total_pages;
                    nextPage = response.data.page + 1;
                    //on renvoie la réponse
                    deferred.resolve(response);
                })
                .catch( function (response) {
                    console.error("ERROR", response);
                    var returnedResponse = {
                        data: response.results,
                        page: response.page,
                        total_results: response.total_results,
                        total_pages: response.total_pages,
                        statusText: "RESPONSE_ERROR"
                    };
                    deferred.reject(returnedResponse);
                });

            return deferred.promise;
        }
        
        
        /**
         * Fonction permettant de charger les résultats suivants en appelant l'URL passée en paramètres
         */
        function getNextMovies() {
            console.log("getNextMovies()");
            var deferred = $q.defer();
            
            if (nextPage <= totalPages) {
                                
                $http({ method: 'GET', url: baseUrl + "&language=" + selectedLanguage + "&page=" + nextPage })
                    .then( function (response) {
                        //on met à jour les informations dont on dispose
                        totalResults = response.data.total_results;
                        totalPages = response.data.total_pages;
                        nextPage = response.data.page + 1;
                        //on renvoie la réponse
                        deferred.resolve(response);
                    })
                    .catch( function (response) {
                        console.error("ERROR", response);
                        var returnedResponse = {
                            data: response.results,
                            page: response.page,
                            total_results: response.total_results,
                            total_pages: response.total_pages,
                            statusText: "RESPONSE_ERROR"
                        };
                        deferred.reject(returnedResponse);
                    });
                    
            } else {
                //la dernière page a déjà été chargée
                console.info("No more pages to load.");
                deferred.reject({
                    statusText: "NO_MORE_RESULTS"
                });
            }
            
            return deferred.promise;
        }

        /**
         * Fonction permettant de récupérer la liste des films qui correspond à la recherche de l'utilisateur.
         * Documentation :
         * http://docs.themoviedb.apiary.io/#reference/search/searchmovie/get
         * Exemple de requête :
         * http://api.themoviedb.org/3/search/movie?api_key=8781b7598f5ea90173b90d07812925d7&page=1&query=batman
         */
        function searchWithFilters(filters) {
            console.log("searchWithFilters (filters)", filters);
            var deferred = $q.defer();
            
            // on encode les caractères spéciaux pour qu'ils puissent être passés dans l'url
            var encodedFilters = angular.copy(filters);
            Object.keys(encodedFilters).forEach(function (searchKey) {
                encodedFilters[searchKey] = encodeURI(encodedFilters[searchKey]);
            });
            
            //on génère l'url
            baseUrl = apiUrl + 'search/movie' + apiKey
                            + ((encodedFilters.movieTitle) ? '&query=' + encodedFilters.movieTitle : '')
                            + ((encodedFilters.movieReleaseYear) ? '&year=' + encodedFilters.movieReleaseYear : '');
            
            //on lance la requête
            $http({ method: 'GET', url: baseUrl + "&language=" + selectedLanguage })
                .then(function (response) {
                    //on met à jour les informations dont on dispose
                    totalResults = response.data.total_results;
                    totalPages = response.data.total_pages;
                    nextPage = response.data.page + 1;
                    //on renvoie la réponse
                    deferred.resolve(response);
                })
                .catch( function (response) {
                    console.error("ERROR", response);
                    var returnedResponse = {
                        data: response.results,
                        page: response.page,
                        total_results: response.total_results,
                        total_pages: response.total_pages,
                        statusText: "RESPONSE_ERROR"
                    };
                    deferred.reject(returnedResponse);
                })
            
            return deferred.promise;
        }


        /**
         * Fonction permettant de récupérer les détails d'un film
         */
        function getDetails(movieId) {
            return $http({
                method: 'GET',
                url: apiUrl + 'movie/' + movieId + apiKey + "&language=" + selectedLanguage
            });
        }

    }
})();