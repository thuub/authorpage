"use strict";
function publicationList() {
    return {
        restrict: "AE",
        transclude: false,
        templateUrl: "scripts/publication-list/publication-list.tpl.html",
        scope: {
            svHeight: "=",
            publinId: "=",
            flat: "="
        },
        controller: publicationListController,
        link: function (scope, element, attributes) {


        }
    };
}
sv.directive('publicationList', publicationList);


var publicationListController = function ($scope, DataProvider, focus, $timeout, SETTINGS_PUBLICATIONS) {
    $scope.SETTINGS_PUBLICATIONS = SETTINGS_PUBLICATIONS;
    $scope.DataProvider = DataProvider;
    $scope.searchValue = "";
    $scope.filterVisible = false;
    $scope.showSelectBox = false;
    $scope.selectAll = false;
    $scope.exportFormat = "bibtex";

    $scope.style = {
        height: $scope.svHeight ? (typeof $scope.svHeight == "number") ? $scope.svHeight + "px" : $scope.svHeight : "600px",
        overflow: "hidden"
    };
    DataProvider.reg("pl","start");
    DataProvider.getAuthor($scope.publinId)
    $scope.data = DataProvider.publicationData[$scope.publinId];


    $scope.selectedYear = null;
    $scope.years = [];
    $scope.checkPublicationCheckboxes = checkPublicationCheckboxes;
    $scope.toggleSelectPublication = toggleSelectPublication;
    var allSelected = false;
    $scope.toggleSelectedAll = toggleSelectedAll;
    $scope.exportSelectedElements = exportSelectedElements;

    function exportSelectedElements() {
        var exportData = "";
        for (var year in $scope.data) {
            if ($scope.data.hasOwnProperty(year)) {
                for (var pub in $scope.data[year]) {
                    if ($scope.data[year].hasOwnProperty(pub)) {
                        var publication = $scope.data[year][pub];
                        if (publication.checkForExport) {
                            switch ($scope.exportFormat) {
                                case "bibtex" :
                                    exportData += generateExportBibtex(publication);
                                    break;
                                case "json" :
                                    exportData += generateExportJson(publication);
                                    break;
                            }

                        }
                    }
                }
            }
        }
        if (exportData.length > 0) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", exportData);
        }

    }

    function generateExportBibtex(pub) {
        var type = pub.Type.charAt(0).toUpperCase() + pub.Type.slice(1);
        var id = type + pub.Authors[0].Given + "_" + pub.Authors[0].Family;

        var authors = "";
        for (var i in pub.Authors) {
            var a = pub.Authors[i];
            authors += a.Given + " " + a.Family;
            if (i < pub.Authors.length - 1) {
                authors += " and ";
            }
        }
        var str = "@" + type + "{" + id + ",";
        str += pub.Title.length > 0 ? "title     = {" + pub.Title + "}," : "";
        str += authors.length > 0 ? "author    = {" + authors + "}," : "";
        str += pub.Booktitle !== null && pub.Booktitle.length > 0 ? "booktitle    = {" + pub.Booktitle + "}," : "";
        str += pub.Edition !== null && pub.Edition.length > 0 ? "edition    = {" + pub.Edition + "}," : "";
        str += pub.Institution !== null && pub.Institution.length > 0 ? "institution    = {" + pub.Institution + "}," : "";
        str += pub.Journal !== null && pub.Journal.length > 0 ? "journal   = {" + pub.Journal + "}," : "";
        str += pub.Year !== null && pub.Year.length > 0 ? "year      = {" + pub.Year + "}," : "";
        str += pub.Volume !== null && pub.Volume.length > 0 ? "volume    = {" + pub.Volume + "}," : "";
        str += pub.Number !== null && pub.Number.length > 0 ? "number    = {" + pub.Number + "}," : "";
        str += pub.PagesFrom !== null && pub.PagesFrom.length > 0 ? "pages     = {" + pub.PagesFrom + "--" + pub.PagesTo + "}," : "";
        str += pub.Publisher !== null && pub.Publisher.length > 0 ? "publisher = {" + pub.Publisher + "}," : "";
        str += pub.Series !== null && pub.Series.length > 0 ? "series = {" + pub.Series + "}," : "";
        //letztes "," weg
        str = str.slice(0, str.length - 1);
        return str + "}";
    }

    function generateExportJson(pub) {
        return JSON.stringify(pub);

    }

    $scope.alert = function (item) {
       console.log("ALERT",item);
       
    };


    $scope.toggleSelectAll = function (state) {
        $timeout(function () {
            for (var i in DataProvider.publicationData[$scope.publinId]) {

                if (DataProvider.publicationData[$scope.publinId].hasOwnProperty(i)) {
                    var year = DataProvider.publicationData[$scope.publinId][i];
                    for (var j in year) {
                        if (year.hasOwnProperty(j)) {
                            var pub = year[j];
                            pub.checkForExport = $scope.selectAll;
                        }
                    }
                }
            }
        })
    };

    $scope.showFilter = function () {
        $scope.filterVisible = true;
        focus('filterActive');
    };
    $scope.hideFilter = function () {
        $scope.filterVisible = false;
    };

    $scope.$watch(function () {
        return DataProvider.publicationData[$scope.publinId];
    }, function (newValue) {
        $scope.data = DataProvider.publicationData[$scope.publinId];
        updateYears();
        if(DataProvider.data[$scope.publinId].request == "done"){
            DataProvider.unreg("pl");
        }
    }, true);


    function updateYears() {
        $scope.years = [];
        for (var key in $scope.data) {
            if ($scope.data.hasOwnProperty(key)) {
                $scope.years.push(key);
            }
        }
    }


    function toggleSelectPublication(publication) {
        publication.checkForExport = !publication.checkForExport;
    }

    function toggleSelectedAll(publication) {
        if (typeof $scope.data != "undefined") {
            for (var i in $scope.data) {
                if ($scope.data.hasOwnProperty(i)) {
                    var years = $scope.data[i];
                    for (var index in years) {
                        if (years.hasOwnProperty(index)) {
                            var pub = years[index];
                            pub.checkForExport = allSelected
                        }
                    }

                }
            }
        }
        allSelected = !allSelected;
    }

    function checkPublicationCheckboxes() {
        var count = 0;
        if (typeof $scope.data != "undefined") {
            for (var i in $scope.data) {
                if ($scope.data.hasOwnProperty(i)) {
                    var years = $scope.data[i];
                    for (var index in years) {
                        if (years.hasOwnProperty(index)) {
                            var pub = years[index];
                            if (pub.checkForExport) {
                                console.log("pub", pub.Title)
                                count++;
                            }
                        }
                    }

                }
            }
        }
        if (count > 0) {
            return true;
        } else {
            return false;
        }

    }

};
publicationListController.$inject = ['$scope', 'DataProvider', 'focus', '$timeout', 'SETTINGS_PUBLICATIONS'];