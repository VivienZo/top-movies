(function () {
    'use strict';

    angular
        .module('app')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$scope', '$mdBottomSheet', '$translate', 'availableLanguages'];
    
    function SettingsCtrl($scope, $mdBottomSheet, $translate, availableLanguages) {
        $scope.hide = function() {
            $mdBottomSheet.hide();
        };
        $scope.cancel = function () {
            $mdBottomSheet.cancel();
        };
        //on récupère la liste des langues disponibles pour les afficher dans la vue des paramètres
        $scope.availableLanguages = availableLanguages;
        //fonction qui permet de changer la langue de l'application
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };
    }
    
})();