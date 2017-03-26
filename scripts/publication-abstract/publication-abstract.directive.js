"use strict";
function publicationAbstract() {
    return {
        restrict: "AE",
        transclude: false,
        templateUrl: "scripts/publication-abstract/publication-abstract.tpl.html",
        scope: {
            publicationId: "=",
            publinId: "="
        },
        controller: publicationAbstractController
    };
}
sv.directive('publicationAbstract', publicationAbstract);


var publicationAbstractController = function ($scope, Abstract) {
    $scope.showLoader = true;
    $scope.showAbstract = true;
    // $scope.abstract = "loading abstract";
    if (typeof $scope.abstract == "undefined") {
        $scope.showLoader = true;
        Abstract.get({id: $scope.publicationId}, success, error);
    }
    function success(response) {
        
        if(response.abstract != null){
            $scope.abstract = response.abstract;
        }else{
            $scope.abstract = "no abstract found";
        }

        $scope.showAbstract = true;
        

        $scope.showLoader = false;
    }
    function error(err) {
        $scope.showLoader = false;
        console.info("ERROR Abstract GET Request: ", err);
        $scope.abstract = err.statusText;
        $scope.showAbstract = false;
    }

};
publicationAbstractController.$inject = ['$scope','Abstract'];