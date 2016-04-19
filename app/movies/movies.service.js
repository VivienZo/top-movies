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
        function getMovies() {
            console.log("getMovies()");
            
            var deferred = $q.defer(),
            promises = [],
            promise1, promise2, promise3, promise4, promise5,
            page1, page2, page3, page4, page5;
            
            promise1 = $http({method: 'GET', url: apiUrl + "movie/popular" + apiKey + "&page=1"}).then(
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
        function getDetails(movieId) {
            console.log("getDetails(movieId)",movieId);
            return $http({method: 'GET', url: apiUrl + 'movie/' + movieId + apiKey});
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
            Object.keys(filters).forEach(function (searchKey) {
                filters[searchKey] = encodeURI(filters[searchKey]);
            });
            //on génère l'url
            var calledUrl = apiUrl + 'search/movie' + apiKey
                + ((filters.movieTitle) ? '&query=' + filters.movieTitle : '')
                + ((filters.movieReleaseDate) ? '&year=' + filters.movieReleaseYear : '')
                + ((filters.movieLanguage) ? '&language=' + filters.movieLanguage : '')
                + '&page=1';
            //on lance la requête
            return $http({method: 'GET', url: calledUrl});
        };
        
    }
})();