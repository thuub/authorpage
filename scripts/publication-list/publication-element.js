function publicationElement() {
    return {
        restrict: "AE",
        transclude: false,
        templateUrl: "scripts/publication-list/publication-element.tpl.html",
        scope: {
            publication : "=",
            showSelectBox: "="
        },
        controller: publicationElementController,
    };
}
sv.directive('publicationElement', publicationElement);
var publicationElementController = function ($scope,SETTINGS_PUBLICATIONS) {
    $scope.SETTINGS_PUBLICATIONS = SETTINGS_PUBLICATIONS;
};