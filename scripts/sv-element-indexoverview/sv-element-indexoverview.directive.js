"use strict";
function svElementIndexoverview() {
    return {
        restrict: "AE",
        transclude: false,
        replace: true,
        templateUrl: "scripts/sv-element-indexoverview/sv-element-indexoverview.tpl.html",
        scope: {
            svHeight: "=",
            vkEdit: "=",
            publinId: "="
        },
        controller: ['$scope', 'DataProvider', '$element', '$timeout', function ($scope, DataProvider) {

            $scope.addValue = function () {
                DataProvider.updateCitationData();
            };

            $scope.$watch(function () {
                return DataProvider.citationData
            }, function (newValue, oldvalue) {
                // console.log("HIER HIER HIER ",newValue)

                // console.log("$scope.chart.series[0]",$scope.chart.series[0].getData)


                // $scope.chart.series[0].setData([], true);
                // $scope.chart.series[0].setData(newValue, true);
                // $scope.chart.redraw(true);


                var labels = [];
                var values = [];
                for (var i in newValue) {

                    if (newValue.hasOwnProperty(i)) {
                        var chartData = newValue[i];

                        console.log("chartData", chartData)

                        labels.push(chartData.name)
                        values.push(chartData.y)

                    }
                }
                $scope.labels = labels;
                $scope.data = values;


            }, true);


            $scope.color = ['#004B5A', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
            $scope.options = {
                title:{
                  display : true,
                    padding: 4
                },
                tooltips : {
                    enabled : false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                animation: {

                    onProgress: function () {
                        var chartInstance = this.chart;
                        var ctx = chartInstance.ctx;
                        ctx.textAlign = "center";
                        ctx.fillStyle = '#333';
                        Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            Chart.helpers.each(meta.data.forEach(function (bar, index) {
                                ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 10);
                            }), this)
                        }), this);
                    },

                    onComplete: function () {
                        var chartInstance = this.chart;
                        var ctx = chartInstance.ctx;
                        ctx.textAlign = "center";
                        ctx.fillStyle = '#333';
                        Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            Chart.helpers.each(meta.data.forEach(function (bar, index) {
                                ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 10);
                            }), this)
                        }), this);
                    }
                }
            }

            $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            $scope.data = [
                [65, -59, 80, 81, -56, 55, -40],
                [65, 59, 80, 81, 56, 55, 4],
                [28, 48, -40, 19, 86, 27, 90]
            ];
            $scope.datasetOverride = [
                {
                    label: "Bar chart",
                    borderWidth: 1,
                    type: 'bar'
                },
                {
                    label: "Line chart",
                    borderWidth: 3,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    type: 'line'
                },
                {
                    label: "Line chart",
                    borderWidth: 6,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    type: 'line'
                },

            ];

        }],
        link: function ($scope, $element, attrs, ctrl) {
            // var graphElement = $element[0].getElementsByClassName("graph-index")[0];
            // $scope.chart = new Highcharts.Chart({
            //     chart: {
            //         type: 'column',
            //         renderTo: graphElement,
            //         plotBackgroundColor: null,
            //         plotBorderWidth: null,
            //         plotShadow: false,
            //         animation: {
            //             duration: 1500,
            //             easing: 'easeOutBounce'
            //         }
            //     },
            //     title: {
            //         text: null,
            //         x: 0 //center
            //     },
            //     plotOptions: {
            //         series: {
            //             borderWidth: 0,
            //             dataLabels: {
            //                 enabled: true,
            //                 format: '{point.y}'
            //             }
            //         }
            //     },
            //
            //     xAxis: {
            //         type: 'category'
            //     },
            //
            //     yAxis: {
            //         title: {
            //             text: 'Index value'
            //         },
            //         plotLines: [{
            //             value: 0,
            //             width: 1,
            //             color: '#ff0000'
            //         }]
            //     },
            //     tooltip: {
            //         headerFormat: null,//'<span style="font-size:11px;">{series.name}</span>: <span>{point.y}--{point.name}--</span><br>',
            //         pointFormat: '<span style="color:{point.color}; font-weight: bold;">{point.name}</span>: <span style="font-weight: bold;">{point.y}</span>',
            //         backgroundColor: '#fff',
            //         borderColor: 'black',
            //         borderRadius: 3,
            //         borderWidth: 1,
            //         // crosshairs: [true]
            //     },
            //     legend: {
            //         enabled: false,
            //         layout: 'horizontal',
            //         align: 'left',
            //         verticalAlign: 'bottom',
            //         borderWidth: 0
            //     },
            //     series: [
            //         {
            //             name: 'Indices',
            //             // colorByPoint: true,
            //             data: [0,1,2,3,4,5]
            //         }
            //     ],
            //     drilldown: {
            //         series: [{
            //             name: 'hindex',
            //             id: 'hindex',
            //             data: [['2012', 2], ['2013', 7], ['2014', 8], ['2015', 10], ['2016', 11], ['2017', 24]]
            //         }, {
            //             name: 'otherindex',
            //             id: 'otherindex',
            //             data: [['2009', 5], ['2010', 6], ['2011', 1], ['2012', 11], ['2013', 12], ['2014', 13], ['2015', 16], ['2016', 12], ['2017', 20]]
            //         }
            //         ]
            //     },
            //     credits: {
            //         enabled: false
            //     }
            // });

        }
    };
}
sv.directive('svElementIndexoverview', svElementIndexoverview);
