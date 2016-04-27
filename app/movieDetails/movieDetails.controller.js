(function () {
    'use strict';

    angular
        .module('app')
        .controller('MovieDetailsCtrl', MovieDetailsCtrl);

    MovieDetailsCtrl.$inject = ['$scope', '$mdDialog', 'movie'];
    
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