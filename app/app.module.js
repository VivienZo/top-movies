/* global angular */
    (function () {
        'use strict';

        angular
            .module('app', ['ngAnimate', 'ngRoute', 'ngMaterial', 'ngMessages', 'md.data.table', 'ngLocale'])
            .config(routeConfig)
            .config(themeConfig);
        
        routeConfig.$inject = ['$routeProvider'];
        function routeConfig($routeProvider) {
            $routeProvider
                .when('/',{ templateUrl: './app/movies/movies.html', title: 'movies'})
                .otherwise({ redirectTo: '/' });
        }
        
        themeConfig.$inject = ['$mdThemingProvider'];
        function themeConfig($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('red')
                .warnPalette('amber')
                .backgroundPalette('grey');
        }
        
    })();