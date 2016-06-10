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
        
        //on enregistre les données du film dans le scope
        $scope.movie = movie;
        //et on re-formate les données pour l'affichage
        if ($scope.movie.budget) {
            $scope.movie.budgetString = formatMoney($scope.movie.budget);
        }
        if ($scope.movie.revenue) {
            $scope.movie.revenueString = formatMoney($scope.movie.revenue);
        }
        if ($scope.movie.vote_count) {
            $scope.movie.voteCountString = formatMoney($scope.movie.vote_count);
        }
        
        function formatMoney (money) {
            var numberString = '' + money;
            //on calcule le nombre d'espaces à ajouter
            var nbSpaces = numberString.length / 3;
            //on doit donc ajouter un espace tous les nbSpaces caractères en partant de la fin
            for (var i = 1; i <= nbSpaces; i++) {
                var spaceIndex = (i * -3) - (i - 1);
                numberString = numberString.slice(0, spaceIndex) + " " + numberString.slice(spaceIndex);
            }
            return numberString;
        }
        
    }
    
    
})();