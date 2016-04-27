/* global angular */
    (function () {
        'use strict';

        angular
            .module('app', ['ngAnimate', 'ngRoute', 'ngMaterial', 'ngMessages', 'md.data.table', 'ngLocale', 'pascalprecht.translate'])
            .config(routeConfig)
            .config(themeConfig)
            .config(translateConfig);
        
        // TODO : améliorer les routes (si recherche, popular, top_rated, upcoming)
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
                .warnPalette('teal')
                .backgroundPalette('grey');
        }
        
        translateConfig.$inject = ['$translateProvider'];
        function translateConfig ($translateProvider) {
            $translateProvider.translations('en', {
                POPULAR: 'Popular',
                TOP_RATED: 'Top rated',
                UPCOMING: 'Upcoming',
                LANGUAGE: 'Language',
                SEARCH: 'Search',
                POSTER: 'Poster',
                ORIGINAL_TITLE: 'Original title',
                POPULARITY: 'Popularity',
                RELEASE_DATE: 'Release date',
                VOTE_AVERAGE: 'Vote average',
                VOTE_COUNT: 'Vote count',
                OPEN_DETAILS: 'Open details',
                MORE: 'More',
                SEARCH_FORM: 'Search form',
                MOVIE_TITLE: 'Movie title',
                RELEASE_YEAR: 'Release year',
                RESET: 'Reset',
                SETTINGS: 'Settings',
                ABOUT: 'About',
                DEVELOPPED_BY: 'Developped by',
                NAME: 'Vivien Zoonekynd',
                VIEW_SOURCES: 'View sources on',
                MOVIE_DETAILS: 'Details of the movie',
                OVERVIEW: 'Overview',
                GENRES: 'Genres',
                ADDITIONAL_INFORMATION: 'Additional information',
                BELONGS_TO_COLLECTION: 'Belongs to collection',
                BUDGET: 'Budget',
                REVENUE: 'Revenue',
                RUNTIME: 'Runtime',
                ORIGINAL_LANGUAGE: 'Original language',
                HOMEPAGE: 'Homepage',
                OK: 'Ok',
                OF: 'of',
                PAGE: 'page',
                ROWS_PER_PAGE: 'Rows per page',
                RESPONSE_ERROR: 'Oops! The server is unavailable...'
            });
            $translateProvider.translations('fr', {
                POPULAR: 'Populaires',
                TOP_RATED: 'Mieux notés',
                UPCOMING: 'Prochainement',
                LANGUAGE: 'Langue',
                SEARCH: 'Rechercher',
                POSTER: 'Affiche',
                ORIGINAL_TITLE: 'Titre original',
                POPULARITY: 'Popularité',
                RELEASE_DATE: 'Date de sortie',
                VOTE_AVERAGE: 'Moyenne des votes',
                VOTE_COUNT: 'Nombre de votes',
                OPEN_DETAILS: 'Le film en details',
                MORE: 'Plus d\'info',
                SEARCH_FORM: 'Formulaire de recherche',
                MOVIE_TITLE: 'Titre du film',
                RELEASE_YEAR: 'Année de sortie',
                RESET: 'Réinitialiser',
                SETTINGS: 'Paramètres',
                ABOUT: 'À propos',
                DEVELOPPED_BY: 'Développé par',
                NAME: 'Vivien Zoonekynd',
                VIEW_SOURCES: 'Voir le code source sur',
                MOVIE_DETAILS: 'Details du film',
                OVERVIEW: 'Description',
                GENRES: 'Genres',
                ADDITIONAL_INFORMATION: 'Informations générales',
                BELONGS_TO_COLLECTION: 'Appartient à la série',
                BUDGET: 'Budget',
                REVENUE: 'Revenu',
                RUNTIME: 'Durée',
                ORIGINAL_LANGUAGE: 'Langue originale',
                HOMEPAGE: 'Site web',
                OK: 'Ok',
                OF: 'sur',
                PAGE: 'page',
                ROWS_PER_PAGE: 'Lignes par page',
                RESPONSE_ERROR: 'Oops! Le serveur est indisponible...'
            });
            $translateProvider.preferredLanguage('fr');
        }
        
    })();