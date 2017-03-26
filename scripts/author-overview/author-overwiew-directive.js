"use strict";
function authorOverview() {
    return {
        restrict: "AE",
        transclude: false,
        templateUrl: "scripts/author-overview/author-overview.tpl.html",
        scope: {
            publinId: "="
        },
        controller: authorOverviewController,
        link: indexEditorLink
    };
}
var authorOverviewController = function ($scope, DataProvider, SETTINGS_FDG_CITE, $timeout, $sce, SETTINGS_INDEX_CALCULATOR, $mdDialog, $mdBottomSheet, $window, $compile, $location, clipboard) {
        DataProvider.getAuthor($scope.publinId);
        DataProvider.reg("ao","start")
        var authorData = null;
        $scope.$watch(function () {
            return DataProvider.data[$scope.publinId].request;
        }, function (newValue, oldValue) {
            if (oldValue !== newValue) {
                if (newValue !== "error") {

                    $scope.error = false;
                    authorData = DataProvider.data[$scope.publinId];
                    $scope.contact = $sce.trustAsHtml(authorData.Contact);
                    $scope.About = $sce.trustAsHtml(authorData.About);

                    $scope.name = authorData.Given + " " + authorData.Family;
                    $scope.profil = "";

                    var citesNumber = 0;
                    var authorNumber = 0;
                    authorData.publications.forEach(function (elem, index) {
                        citesNumber += elem.Citescount;
                        authorNumber += elem.Authors.length;
                    });
                    $scope.citesNumber = "Zitate gesamt: " + citesNumber;
                    $scope.citPerPub = "Zitate / Publikation: " + Math.round(citesNumber / authorData.publications.length);
                    $scope.authorPerPub = "Koautoren / Publikation: " + Math.round(authorNumber / authorData.publications.length);
                    $scope.pub = "Publikationen: " + authorData.publications.length;

                }
            }else{
                $scope.error = true;
            }

            if(DataProvider.data[$scope.publinId].request == "done"){
                DataProvider.unreg("ao");
            }

        });
    };

sv.directive('authorOverview', authorOverview);

authorOverviewController.$inject = ['$scope', 'DataProvider', 'SETTINGS_FDG_CITE', '$timeout', '$sce', 'SETTINGS_INDEX_CALCULATOR', '$mdDialog', '$mdBottomSheet', '$window', '$compile', '$location', 'clipboard'];