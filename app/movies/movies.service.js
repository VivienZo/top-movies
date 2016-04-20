(function () {
    'use strict';

    angular
        .module('app')
        .factory('moviesService', moviesService);

    moviesService.$inject = ['$http', '$q'];

    function moviesService($http, $q) {
        
        /**
         * Définition de l'URL de l'API utilisée par le service
         */
        // API infos :
        // api_key=8781b7598f5ea90173b90d07812925d7
        // http://docs.themoviedb.apiary.io/#reference/search/searchmovie/get
        // 10 requêtes / 40 secondes
        var apiUrl = "http://api.themoviedb.org/3/";
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
        function getMovies(category) {
            console.log("getMovies(category)",category);
            
            var deferred = $q.defer(),
            promises = [],
            promise1, promise2, promise3, promise4, promise5,
            page1, page2, page3, page4, page5;
            
            promise1 = $http({method: 'GET', url: apiUrl + "movie/" + category + apiKey + "&page=1"}).then(
                function successCallback (response) {
                    // console.log("response: ",response);
                    page1 = response.data.results;
                },
                function errorCallback (response) {
                    console.error("ERROR",response);
                    page1 = [];
                });
            promises.push(promise1);
            
            promise2 = $http({method: 'GET', url: apiUrl + "movie/popular" + apiKey + "&page=2"}).then(
                function successCallback (response) {
                    // console.log("response: ",response);
                    page2 = response.data.results;
                },
                function errorCallback (response) {
                    console.error("ERROR",response);
                    page2 = [];
                });
            promises.push(promise2);
            
            promise3 = $http({method: 'GET', url: apiUrl + "movie/popular" + apiKey + "&page=3"}).then(
                function successCallback (response) {
                    // console.log("response: ",response);
                    page3 = response.data.results;
                },
                function errorCallback (response) {
                    console.error("ERROR",response);
                    page3 = [];
                });
            promises.push(promise3);
                
            promise4 = $http({method: 'GET', url: apiUrl + "movie/popular" + apiKey + "&page=4"}).then(
                function successCallback (response) {
                    // console.log("response: ",response);
                    page4 = response.data.results;
                },
                function errorCallback (response) {
                    console.error("ERROR",response);
                    page4 = [];
                });
            promises.push(promise4);
            
            promise5 = $http({method: 'GET', url: apiUrl + "movie/popular" + apiKey + "&page=5"}).then(
                function successCallback (response) {
                    // console.log("response: ",response);
                    page5 = response.data.results;
                },
                function errorCallback (response) {
                    console.error("ERROR",response);
                    page5 = [];
                });
            promises.push(promise5);
            
            // console.log("promises",promises);
                
            $q.all(promises).then( function () {
                var allMovies = page1
                        .concat(page2)
                        .concat(page3)
                        .concat(page4)
                        .concat(page5);
                // console.log("All movies are loaded: ", allMovies);
                deferred.resolve({
                    success         : true,
                    movies          : allMovies
                });
            });
            
            return deferred.promise;
        };
        
        
        /**
         * Fonction permettant de récupérer les détails d'un film
         */
        function getDetails(movieId, lang) {
            return $http({method: 'GET', url: apiUrl + 'movie/' + movieId + apiKey + (lang ? "&language="+lang : "")});
        }
        
        
        /**
         * Fonction permettant de récupérer la liste des films qui correspond à la recherche de l'utilisateur
         * http://docs.themoviedb.apiary.io/#reference/search/searchmovie/get
         * ?api_key=8781b7598f5ea90173b90d07812925d7
         * 
         * http://api.themoviedb.org/3/search/movie?api_key=8781b7598f5ea90173b90d07812925d7&page=1&query=Dead
         * 
         * echapper le titre avec urlencode()
         */
        function searchWithFilters(filters) {
            console.log("searchWithFilters(filters)",filters);
            // url encode sur les paramètres de search
            var encodedFilters = angular.copy(filters);
            Object.keys(encodedFilters).forEach(function (searchKey) {
                encodedFilters[searchKey] = encodeURI(encodedFilters[searchKey]);
            });
            //on génère l'url
            var calledUrl = apiUrl + 'search/movie' + apiKey
                + ((encodedFilters.movieTitle) ? '&query=' + encodedFilters.movieTitle : '')
                + ((encodedFilters.movieReleaseYear) ? '&year=' + encodedFilters.movieReleaseYear : '')
                + ((encodedFilters.movieLanguage) ? '&language=' + encodedFilters.movieLanguage : '')
                + '&page=1';
            //on lance la requête
            return $http({method: 'GET', url: calledUrl});
        };
        
    }
})();