sv.directive('includeWithScope', function() {
    return {
        restrict: 'AE',
        templateUrl: function(ele, attrs) {
            return attrs.templatePath;
        }
    };
});