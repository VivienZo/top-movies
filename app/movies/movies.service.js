(function () {
    'use strict';

    angular
        .module('app')
        .factory('moviesService', moviesService);

    moviesService.$inject = ['$http', '$q'];

    function moviesService($http, $q) {

        /**
         * Définition de l'URL de l'API utilisée par le service
         * Limite : 10 requêtes / 40 secondes
         */

        var apiUrl = "http://api.themoviedb.org/3/";
        var apiKey = "?api_key=8781b7598f5ea90173b90d07812925d7";

        /**
         * Fonctions exposées par le service
         */
        var service = {
            getMovies: getMovies,
            searchWithFilters: searchWithFilters,
            getDetails: getDetails
        };
        return service;


        /**
         * Fonction permettant de récupérer les films affichés sur la page d'accueil
         */
        function getMovies(category) {
            console.log("getMovies(category)", category);

            var deferred = $q.defer(),
                promises = [],
                promise1, promise2, promise3, promise4, promise5,
                page1, page2, page3, page4, page5;

            promise1 = $http({ method: 'GET', url: apiUrl + "movie/" + category + apiKey + "&page=1" }).then(
                function successCallback(response) {
                    page1 = response;
                },
                function errorCallback(response) {
                    console.error("ERROR", response);
                    page1 = response;
                });
            promises.push(promise1);

            promise2 = $http({ method: 'GET', url: apiUrl + "movie/" + category + apiKey + "&page=2" }).then(
                function successCallback(response) {
                    page2 = response;
                },
                function errorCallback(response) {
                    console.error("ERROR", response);
                    page2 = response;
                });
            promises.push(promise2);

            promise3 = $http({ method: 'GET', url: apiUrl + "movie/" + category + apiKey + "&page=3" }).then(
                function successCallback(response) {
                    page3 = response;
                },
                function errorCallback(response) {
                    console.error("ERROR", response);
                    page3 = response;
                });
            promises.push(promise3);

            promise4 = $http({ method: 'GET', url: apiUrl + "movie/" + category + apiKey + "&page=4" }).then(
                function successCallback(response) {
                    page4 = response;
                },
                function errorCallback(response) {
                    console.error("ERROR", response);
                    page4 = response;
                });
            promises.push(promise4);

            promise5 = $http({ method: 'GET', url: apiUrl + "movie/" + category + apiKey + "&page=5" }).then(
                function successCallback(response) {
                    page5 = response;
                },
                function errorCallback(response) {
                    console.error("ERROR", response);
                    page5 = response;
                });
            promises.push(promise5);

            $q.all(promises).then(function () {
                var status = -1,
                    statusText = "";
                
                //on calcule le status de la réponse globale :
                // - liste complète : pas d'erreur (status: 1)
                // - liste incomplète : au moins une requête en erreur (status: 0)
                // - liste vide : toutes les requêtes en erreur (status: -1)
                if (page1.status === -1 &&
                    page2.status === -1 &&
                    page3.status === -1 &&
                    page4.status === -1 &&
                    page5.status === -1) {
                    //toutes les requêtes sont en erreur
                    status = -1;
                    statusText = "RESPONSE_ERROR";
                } else if (page1.status === -1 ||
                    page2.status === -1 ||
                    page3.status === -1 ||
                    page4.status === -1 ||
                    page5.status === -1) {
                    //au moins une requête est en erreur
                    status = 0;
                    statusText = "RESPONSE_PARTIAL";
                } else {
                    status = 1;
                    statusText = "RESPONSE_OK";
                }
                
                var results = (page1.data && page1.data.results)? page1.data.results : [];
                results = results.concat( (page2.data && page2.data.results)? page2.data.results : [] );
                results = results.concat( (page3.data && page3.data.results)? page3.data.results : [] );
                results = results.concat( (page4.data && page4.data.results)? page4.data.results : [] );
                results = results.concat( (page5.data && page5.data.results)? page5.data.results : [] );
                
                console.log("response: ", {
                    data: { results: results },
                    status: status,
                    statusText: statusText
                });
                
                //on renvoie une réponse ayant la même forme que celle de $http
                deferred.resolve({
                    data: { results: results },
                    status: status,
                    statusText: statusText
                });
            });

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
            // on encode les caractères spéciaux pour qu'ils puissent être passés dans l'url
            var encodedFilters = angular.copy(filters);
            Object.keys(encodedFilters).forEach(function (searchKey) {
                encodedFilters[searchKey] = encodeURI(encodedFilters[searchKey]);
            });
            //on génère l'url
            var calledUrl = apiUrl + 'search/movie' + apiKey
                + ((encodedFilters.movieTitle) ? '&query=' + encodedFilters.movieTitle : '')
                + ((encodedFilters.movieReleaseYear) ? '&year=' + encodedFilters.movieReleaseYear : '')
                + ((encodedFilters.selectedLanguage) ? '&language=' + encodedFilters.selectedLanguage : '')
                + '&page=1';
            //on lance la requête
            return $http({
                method: 'GET',
                url: calledUrl
            });
        }


        /**
         * Fonction permettant de récupérer les détails d'un film
         */
        function getDetails(movieId, lang) {
            return $http({
                method: 'GET',
                url: apiUrl + 'movie/' + movieId + apiKey + (lang ? "&language=" + lang : "")
            });
        }

    }
})();