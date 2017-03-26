"use strict";
function indexEditor() {
    return {
        restrict: "AE",
        transclude: false,
        templateUrl: "scripts/index-editor/index-editor.tpl.html",
        scope: {
            publinId: "="
        },
        controller: indexEditorController,
        link: indexEditorLink
    };
}

var indexEditorController = function ($scope, DataProvider, SETTINGS_FDG_CITE, $timeout, $sce, SETTINGS_INDEX_CALCULATOR, $mdDialog, $mdBottomSheet, $window, $compile, $location, clipboard) {

    $scope.showSolution = true;
    $scope.showCharts = false;
        var code = false;

        if ($location.path().includes("eCalc=")) {
            code = $location.path().split("eCalc=")[1];
            $window.location.hash = "";
        }

        DataProvider.reg("ie","start");
        DataProvider.getAuthor($scope.publinId)

        /* TEMPLATE */
        $scope.SETTINGS_INDEX_CALCULATOR = SETTINGS_INDEX_CALCULATOR;
        $scope.showTerm = false;

        $scope.toggleTerm = toggleTerm;
        $scope.toggleTab = toggleTab;
        $scope.setTab = setTab;
        $scope.exampleBlur = exampleBlur;

        $scope.checkShiftEnter = checkShiftEnter;
        $scope.addTab = addTab;
        $scope.shareCalc = shareCalc;
        $scope.helpTabContent = '\norderByYear(a,b) = a.year - b.year\n /s n = clone(author.publications)\n /s sort(n, orderByYear) \n\n';

        /*  PLOTS   */
        $scope.hideSettings = true;
        $scope.removeTab = removeTab;
        $scope.selectedTab = code ? SETTINGS_INDEX_CALCULATOR.startTab + 1 : SETTINGS_INDEX_CALCULATOR.startTab;
        $scope.showTab = code ? "showEditor" : "";
        // $scope.showTab = "showEditor";
        $scope.tabs = [];

        var firstUpdateSelectedTabCall = true;
        $scope.updateSelectedTab = function (tab) {
            var index = $scope.tabs.indexOf(tab);
            if (firstUpdateSelectedTabCall) {
                firstUpdateSelectedTabCall = false;
                $scope.editorInput = $scope.tabs[index].editorInput;
                $scope.evaluate();
            } else {
                var oldIndex = $scope.selectedTab;
                $scope.tabs[oldIndex].editorInput = $scope.editorInput;
                $scope.tabs[oldIndex].solutions = $scope.solutions;
                $scope.selectedTab = index;
                $scope.editorInput = $scope.tabs[index].editorInput;
                $scope.solutions = $scope.tabs[index].solutions;
                if (typeof $scope.tabs[index].solutions == "undefined") {
                    $scope.evaluate();
                }
            }
        };

        $scope.$watch(function () {
            return DataProvider.data[$scope.publinId].request;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                generateAuthorDataforMathscope(DataProvider.data[$scope.publinId]);
                if (SETTINGS_INDEX_CALCULATOR.hasOwnProperty("editor")) {
                    if (SETTINGS_INDEX_CALCULATOR.editor.hasOwnProperty("initText")) {
                        SETTINGS_INDEX_CALCULATOR.editor.initText.forEach(function (item, index) {
                            // $scope.editorInput = item.text;
                            //addTab(type,chartData,solution,editorInput,mathscope) {
                            if (SETTINGS_INDEX_CALCULATOR.showHelpTab && index == 0) {
                                $scope.addTab("line", "help_outline", null, null, $scope.helpTabContent);
                            }
                            $scope.addTab("MOIN", item.icon, null, null, item.text, index);
                        })
                    }
                }
                if (code && code.length > 0) {
                    $scope.addTab("MOIN", "play_for_work", null, null, code, null);
                    console.log("$scope.selectedTab", $scope.selectedTab);
                }
            }
            if(DataProvider.data[$scope.publinId].request == "done"){
                DataProvider.unreg("ie");
            }

        });

        function generateAuthorDataforMathscope(data) {
            var currentYear = new Date().getFullYear();

            var pub = [];
            var scientificAgeSmallest = 99999;

            var authorNameValue = data.Given.toLowerCase() + data.Family.toLowerCase();
            var coAuthors = {};

            //sortieren der Publikationen nach Jahr aufsteigend
            data.publications.sort(function (a, b) {
                return a.Year - b.Year
            });

            var tempCitesCountAll = 0;

            for (var i in data.publications) {
                if (data.publications.hasOwnProperty(i)) {
                    var autArray = [];
                    var citeArray = [];
                    if (i % 1 == 0) {
                        var publication = data.publications[i];

                        //Autoren
                        publication.Authors.forEach(function (item) {

                            var currentCoAuthor = item.Given.toLowerCase() + item.Family.toLowerCase();
                            // Coautoren sammeln und hinzufügen
                            if (coAuthors !== authorNameValue) {
                                if (!coAuthors.hasOwnProperty(currentCoAuthor)) {
                                    coAuthors[currentCoAuthor] = 1
                                } else {
                                    coAuthors[currentCoAuthor]++
                                }
                            }
                            autArray.push({name: item.Given + " " + item.Family, id: item.Id});
                        });
                        //Cites
                        publication.Cites.forEach(function (zitat) {
                            var cite = {
                                id: zitat.Id,
                                title: zitat.Title,
                                type: "NOTSET",
                                isOwn: null,
                                isAssociate: null,
                                isForeign: null,
                                year: zitat.Year,
                                age : new Date().getFullYear()-zitat.Year,
                                authors: []
                            };
                            zitat.Authors.forEach(function (zitatAuthor) {
                                var currentCiteAuthor = zitatAuthor.Given.toLowerCase() + zitatAuthor.Family.toLowerCase();
                                if (currentCiteAuthor == authorNameValue) {
                                    cite.type = "own";
                                    cite.isOwn = true;
                                    cite.isAssociate = false;
                                    cite.isForeign = false;
                                    zitatAuthor.type = "own";
                                    zitatAuthor.isOwn = true;
                                    zitatAuthor.isAssociate = false;
                                    zitatAuthor.isForeign = false;
                                } else {
                                    // wenn noch kein Selbstzitat erkannt wurde
                                    if (cite.isOwn == null) {
                                        // Wenn Zitatautor in der KoAutor liste vorkommt
                                        if (coAuthors.hasOwnProperty(currentCiteAuthor)) {
                                            cite.type = "associate";
                                            cite.isOwn = false;
                                            cite.isAssociate = true;
                                            cite.isForeign = false;

                                            zitatAuthor.type = "associate";
                                            zitatAuthor.isOwn = false;
                                            zitatAuthor.isAssociate = true;
                                            zitatAuthor.isForeign = false;
                                        } else {
                                            // Zitatautor ist nicht der Autor und noch nicht in der Koautoren Liste
                                            if (cite.isOwn == null && cite.isAssociate == null) {
                                                cite.type = "foreign";
                                                cite.isOwn = false;
                                                cite.isAssociate = false;
                                                cite.isForeign = true;
                                                //
                                                zitatAuthor.type = "foreign";
                                                zitatAuthor.isOwn = false;
                                                zitatAuthor.isAssociate = false;
                                                zitatAuthor.isForeign = true;
                                            }
                                        }
                                    }
                                }

                                cite.authors.push({
                                    name: zitatAuthor.Given + " " + zitatAuthor.Family,
                                    id: zitatAuthor.Id,
                                    type: zitatAuthor.type,
                                    isOwn: zitatAuthor.isOwn,
                                    isAssociate: zitatAuthor.isAssociate,
                                    isForeign: zitatAuthor.isForeign,
                                });
                            });
                            cite["age"] = currentYear - zitat.Year;
                            citeArray.push(cite)
                        });

                        tempCitesCountAll += publication.Citescount;
                        var currentPublication = {
                            id: publication.Id,
                            title: publication.Title,
                            age: currentYear - publication.Year,
                            citesCount: publication.Citescount,
                            cites: citeArray,
                            sourcesCount: publication.Sourcescount,
                            year: publication.Year,
                            isFirstAuthor: autArray[0].id == data.Id,
                            isLastAuthor: autArray[autArray.length - 1].id == data.Id,
                            authorsCount: autArray.length,
                            authors: autArray
                        };

                        if (publication.Year < scientificAgeSmallest) {
                            scientificAgeSmallest = publication.Year;
                        }

                        pub.push(currentPublication)
                    }
                }

                var content = {
                    name: data.Given + " " + data.Family,
                    given: data.Given,
                    family: data.Family,
                    id: data.Id,
                    scientificAge: currentYear - scientificAgeSmallest,
                    publications: pub,
                    publicationsCount: pub.length
                };
                $scope.mathscope["author"] = content;
            }
        }

        $scope.$watch("tabs", function (newvalue, oldvalue) {
            if (newvalue != oldvalue) {
                // console.log("$watch tabs", newvalue);
            }

        }, true);

        /* MATH */
        $scope.solutions = {};
        $scope.mathscope = {};
        $scope.evaluate = evaluate;
        $scope.resetMathCalc = resetMathCalc;
        $scope.plotArray = {};

        /*
         *
         * MATH FUNCTIONS
         *
         * */
        function evaluate() {
            $scope.solutions = [];
            $scope.plotArray = {};
            $scope.editorInput.split("\n").forEach(function (currentLine, index) {
                $scope.solutions[index] = {txt: "", error: null};
                if (currentLine.trim().length > 0) {
                    parseMath(currentLine.trim(), index)
                }
                else {
                    $scope.solutions[index].txt = $sce.trustAsHtml(" &nbsp; ");
                }
            });
        }

        function parseMath(line, index) {
            var isComment = line.indexOf("//") !== -1;
            var isSilent = line.indexOf("/s") >= 0 && line.indexOf("/s") < 2;

            if (isSilent) {
                line = line.substring(line.indexOf("/s") + 2, line.length).trim();
            }
            try {
                if (!isComment) {

                    var solution = math.eval(line, $scope.mathscope);



                    solution = typeof solution == "function" ? "" : "= " + solution;
                    solution = solution == "= undefined" ? "" : solution;
                    var expression = math.parse(line, $scope.mathscope);

                    if (!isSilent) {
                        try {
                            $scope.solutions[index].txt = $sce.trustAsHtml(katex.renderToString(expression.toTex()) + katex.renderToString(solution));

                        } catch (e) {
                            $scope.solutions[index].txt = $sce.trustAsHtml(katex.renderToString(expression.toTex()));
                        }
                    }
                } else {
                    if (!isSilent) {
                        line = line.replace("//", "").trim();
                        $scope.solutions[index].txt = $sce.trustAsHtml("<code style='color:#999; margin-left: -20px;'>" + line + "</code>");
                    }
                }

            } catch (e) {
                console.log(e);

                $scope.solutions[index].error = $sce.trustAsHtml(e.message);
            }
        }

        function resetMathCalc() {
            $scope.solutions = [];
            $scope.plotArray = {};
            $scope.mathscope = {};
            var tt = {name: "name in string", age: 11, cit: 12};
            var tt1 = {name: "name in string", age: 12, cit: 12};
            var tt2 = {name: "name in string", age: 13, cit: 12};
            $scope.mathscope.objectTest = {string: "striiing", array: [tt, tt1, tt2], prop: "ab"}
        }


        /*
         *
         * MATH IMPORTS   ==> Sum
         *
         * */
        function sumFromTo(iteratorName, from, to, toString, f) {
            var firstRun = true;
            // console.log("SUM FROM TO ", iteratorName, from, to, toString, f);
            var total = 0;
            var toVal = typeof to == "number" ? to : to.length;
            for (var iterator = from; iterator <= toVal; iterator++) {
                $scope.mathscope[iteratorName] = iterator;
                $scope.mathscope[toString + "_" + iterator] = to[iterator];
                total += parseFloat(math.eval(f, $scope.mathscope));
            }
            return total;
        }

        sumFromTo.transform = function (args, math, scope) {
            /*   Iterator    */
            var iteratorName = "notfound";
            if (args[0] instanceof math.expression.node.SymbolNode) {
                iteratorName = args[0].name;
            } else {

                console.log("SymbolNode)",args[0] instanceof math.expression.node.SymbolNode);
                console.log("FunctionNode)",args[0] instanceof math.expression.node.FunctionNode);
                console.log("ConstantNode)",args[0] instanceof math.expression.node.ConstantNode);

                console.log("args[0]",args[0]);


                if (args[0] instanceof math.expression.node.FunctionNode) {
                    if (args[0].fn instanceof math.expression.node.SymbolNode) {
                        console.log("args[0].fn", args[0].fn, args[0].fn == "collect", args[0].fn.name == "collect");

                        if (args[0].fn.name == "collect") {
                            iteratorName = args[0].args[0].name;
                            var iti = args[0].compile().eval(scope);
                        } else {
                            throw new Error('if function is used, second parameter must be a symbol');
                        }
                    } else {
                        throw new Error('if function is used, second parameter must be a symbol');
                    }
                } else {
                    throw new Error('First argument must be a symbol');
                }
            }
            /*    Startvalue of Iterator    */
            if (args[1] instanceof math.expression.node.ConstantNode) {
                if (args[1].value == 0) {
                    throw new Error('Sum must counting from >=1: 0 given');
                }
            }
            /*    to: Array to loop    */
            if (args[2] instanceof math.expression.node.SymbolNode) {
                var toString = args[2].name;
            } else {
                if (args[2] instanceof math.expression.node.FunctionNode) {
                    if (args[2].fn instanceof math.expression.node.SymbolNode) {
                        if (args[2].fn == "collect") {
                            toString = args[2].args[1].name;
                        }
                    }
                }
            }
            /*    compile    */
            var from = args[1].compile().eval(scope);
            scope[iteratorName] = from;
            
            var to = args[2].compile().eval(scope);

            if (to.constructor.name == "Matrix" || to.hasOwnProperty("_data")) {
                to = to.toArray();
                scope[toString] = to;
                scope[to] = to;
            }

            /*   resolve variables in scope  */
            // var f = args[3].transform(function (node, path, parent) {
            //     console.group("f transfrom");
            //     console.log("node",node);
            //
            //
            //     if (node.isSymbolNode && node.name in scope) {
            //         var inp = node;
            //         var out = new math.expression.node.ConstantNode(scope[node.name]);
            //
            //         console.log("inp",inp);
            //         console.log("out",out);
            //
            //
            //
            //         return out;
            //     }
            //     else {
            //         return node;
            //     }
            // });
            Object.assign( $scope.mathscope, scope);

            return sumFromTo(iteratorName, from, to, toString, args[3].toString());
            // return sumFromTo(iteratorName, from, to, toString, f.toString());
            // return sumFromTo(iteratorName, from, to, toString, fToScope);

        };
        sumFromTo.transform.rawArgs = true;
        sumFromTo.toTex = function (node, options) {
            return "\\sum\\limits_{" + node.args[0].toTex(options) + "=" + node.args[1].toTex(options) + "}^{" + node.args[2].toTex(options) + "}" + node.args[3].toTex(options)
        };

        // math.sum.toTex = function (node, options) {
        //     // return "\\sum_{n=0}^N";
        //     return "\\sum\\limits_{tief}^{hoch}";
        // };


        var importOptions = {override: false, silent: false, wrap: true};
        math.import({sum: sumFromTo}, {override: true});
        // math.import({sft: sumFromTo, options: importOptions});
        math.sum.toTex = function (node, options) {
            return "\\sum\\limits_{" + node.args[0].toTex(options) + "=" + node.args[1].toTex(options) + "}^{" + node.args[2].toTex(options) + "}" + node.args[3].toTex(options)
        };
        /*
         *
         * MATH IMPORTS   ==> Prod
         *
         * */
        function prodFromTo(iteratorName, from, to, toString, f) {
            console.log("PROD FROM TO");
            var total = 1;
            var toVal = typeof to == "number" ? to : to.length;
            for (var iterator = from; iterator <= toVal; iterator++) {
                $scope.mathscope[iteratorName] = iterator;
                $scope.mathscope[toString + "_" + iterator] = to[iterator];
                total = total * math.eval(f, $scope.mathscope);
                console.log("total",total);
                
            }
            return total;
        }

        prodFromTo.transform = function (args, math, scope) {
            /*   Iterator    */
            var iteratorName = "notfound";
            if (args[0] instanceof math.expression.node.SymbolNode) {
                iteratorName = args[0].name;
            } else {
                if (args[0] instanceof math.expression.node.FunctionNode) {
                    if (args[0].fn instanceof math.expression.node.SymbolNode) {
                        console.log("args[0].fn", args[0].fn, args[0].fn == "collect", args[0].fn.name == "collect");

                        if (args[0].fn.name == "collect") {
                            iteratorName = args[0].args[0].name;
                            var iti = args[0].compile().eval(scope);
                        } else {
                            throw new Error('if function is used, second parameter must be a symbol');
                        }
                    } else {
                        throw new Error('if function is used, second parameter must be a symbol');
                    }
                } else {
                    throw new Error('First argument must be a symbol');
                }
            }
            /*    Startvalue of Iterator    */
            if (args[1] instanceof math.expression.node.ConstantNode) {
                if (args[1].value == 0) {
                    throw new Error('Sum must counting from >=1: 0 given');
                }
            }
            /*    to: Array to loop    */
            if (args[2] instanceof math.expression.node.SymbolNode) {
                var toString = args[2].name;
            } else {
                if (args[2] instanceof math.expression.node.FunctionNode) {
                    if (args[2].fn instanceof math.expression.node.SymbolNode) {
                        if (args[2].fn == "collect") {
                            toString = args[2].args[1].name;
                        }
                    }
                }
            }
            /*    compile    */
            var from = args[1].compile().eval(scope);
            scope[iteratorName] = from;

            var to = args[2].compile().eval(scope);

            if (to.constructor.name == "Matrix" || to.hasOwnProperty("_data")) {
                to = to.toArray();
                scope[toString] = to;
                scope[to] = to;
            }

            Object.assign( $scope.mathscope, scope);
            return prodFromTo(iteratorName, from, to, toString, args[3].toString());

        };
        prodFromTo.transform.rawArgs = true;
        prodFromTo.toTex = function (node, options) {
            return "\\sum\\limits_{" + node.args[0].toTex(options) + "=" + node.args[1].toTex(options) + "}^{" + node.args[2].toTex(options) + "}" + node.args[3].toTex(options)
        };
        math.import({prod: prodFromTo}, {override: true});

        function example(x) {
            return x
        }

        math.import({example: example});

        /*
         *
         * MATH IMPORTS
         *          ==> Plot
         *
         * */
        function chart(type, value) {
            var chartData = $scope.tabs[$scope.selectedTab].chartData;
            switch (type) {
                case "icon" :
                    $scope.tabs[$scope.selectedTab].icon = value;
                    break;
                case "title" :
                    chartData.title.text = value;
                    break;
                case "title align" :
                case "title-align" :
                case "titleAlign" :
                    if (value.trim() == "left" || value.trim() == "center" || value.trim() == "right") {
                        chartData.title.align = value;
                    } else {
                        throw new Error('title align expects  "left" or "center" or "right" as parameter."' + value + '" was given');
                    }
                    break;
                case "subtitle" :
                    chartData.subtitle.text = value;
                    break;
                case "subtitle align" :
                case "subtitle-align" :
                case "subtitleAlign" :
                    if (value.trim() == "left" || value.trim() == "center" || value.trim() == "right") {
                        chartData.subtitle.align = value;
                    } else {
                        throw new Error('subtitle align expects  "left" or "center" or "right" as parameter."' + value + '" was given');
                    }
                    break;
                case "chart type" :
                case "chart-type" :
                case "chartType" :
                    switch (value.trim()) {
                        case "column":
                        case "spline":
                        case "pie":
                        case "bar":
                        case "area":
                        case "areaspline":
                        case "scatter":
                        case "line":
                            chartData.options.chart.type = value.trim();
                            break;
                        default:
                            throw new Error('possible charttypes are: "column","spline","pie","bar","line","area","areaspline","scatter", ."' + value + '" was given');
                    }
                    break;
                case "polar" :
                    chartData.options.chart.polar = value;
                    break;
                case "zoom" :
                    switch (value.trim()) {
                        case "x" :
                        case "y" :
                        case "xy" :
                            chartData.options.chart.zoomType = value;
                            break;
                        default :
                            throw new Error('zoom expects  "x" or "y" or "xy" or "none" as parameter."' + value + '" was given');
                    }
                    break;

                case "xaxis legend" :
                case "xaxis-legend" :
                case "xaxisLegend" :
                    chartData.options.xAxis.title.text = value;
                    break;
                case "xaxis legend align" :
                case "xaxis-legend-align" :
                case "xaxisLegendAlign" :
                    switch (value.trim()) {
                        case "left" :
                        case "bottom" :
                            chartData.options.xAxis.title.align = "low";
                            break;
                        case "right" :
                        case "top" :
                            chartData.options.xAxis.title.align = "high";
                            break;
                        case "center" :
                            chartData.options.xAxis.title.align = "middle";
                            break;
                        case "low" :
                        case "middle" :
                        case "high" :
                            chartData.options.xAxis.title.align = value.trim();
                            break;
                        default:
                            throw new Error('xaxis legend align align expects  "left" or "center" or "right" as parameter."' + value + '" was given');
                    }
                    break;
                case "xaxis values" :
                case "xaxis-values" :
                case "xaxisValues" :
                    // fügt ein Array hinzu
                    if (typeof value == "string") {
                        throw new Error('xaxis values expects an array. String was given. For single values use "xaxis push values"');
                    }
                    value = value.constructor.name == "Matrix" ? value.toArray() : value;
                    value = value.hasOwnProperty("_data") ? value.toArray() : value;
                    value = typeof value == "number" ? value = [value] : value;

                    chartData.options.xAxis.categories = value;
                    break;
                case "xaxis push value" :
                case "xaxis-push-value" :
                case "xaxisPushValue" :
                    // fügt EIN wert hinzu

                    if(!chartData.hasOwnProperty("options")){
                        chartData.options = {}
                    }
                    if(!chartData.options.hasOwnProperty("xAxis")){
                        chartData.options.xAxis = {}
                    }
                    if(!chartData.options.xAxis.hasOwnProperty("categories")){
                        chartData.options.xAxis.categories = []
                    }
                    var val = value.hasOwnProperty("_data") ? value.toArray() : value;
                    chartData.options.xAxis.categories.push(val)
                    break;
                case "xaxis push values" :
                case "xaxis-push-values" :
                case "xaxisPushValues" :
                    throw new Error('unkown type "xaxis push values". Did you mean "xaxis push value" or "xaxis values"?');


                case "xaxis plotLine color" :
                case "xaxis-plotLine-color" :
                case "xaxisPlotLineColor" :
                    if (!chartData.options.hasOwnProperty("xAxis")) {
                        chartData.options.xAxis = {};
                    }
                    if (!chartData.options.xAxis.hasOwnProperty("plotLines")) {
                        chartData.options.xAxis.plotLines = [{zIndex: 50}];
                    }
                    chartData.options.xAxis.plotLines[0].color = value;
                    break;
                case "xaxis plotLine width" :
                case "xaxis-plotLine-width" :
                case "xaxisPlotLineWidth" :
                    if (!chartData.options.hasOwnProperty("xAxis")) {
                        chartData.options.xAxis = {};
                    }
                    if (!chartData.options.xAxis.hasOwnProperty("plotLines")) {
                        chartData.options.xAxis.plotLines = [{zIndex: 50}];
                    }
                    chartData.options.xAxis.plotLines[0].width = value;
                    break;
                case "xaxis plotLine dashStyle" :
                case "xaxis-plotLine-dashStyle" :
                case "xaxisPlotLineDashStyle" :
                    if (!chartData.options.hasOwnProperty("xAxis")) {
                        chartData.options.xAxis = {};
                    }
                    if (!chartData.options.xAxis.hasOwnProperty("plotLines")) {
                        chartData.options.xAxis.plotLines = [];
                        chartData.options.xAxis.plotLines.push({zIndex: 50});
                    }
                    chartData.options.xAxis.plotLines[0].dashStyle = value;
                    break;

                case "xaxis plotLine value" :
                case "xaxis-plotLine-value" :
                case "xaxisPlotLineValue" :
                    if (!chartData.options.hasOwnProperty("xAxis")) {
                        chartData.options.xAxis = {};
                    }
                    if (!chartData.options.xAxis.hasOwnProperty("plotLines")) {
                        chartData.options.xAxis.plotLines = [{}];
                        chartData.options.xAxis.plotLines.push({zIndex: 50});
                    }
                    chartData.options.xAxis.plotLines[0].value = value;
                    break;


                case "xaxis plotLine label" :
                case "xaxis-plotLine-label" :
                case "xaxisPlotLineLabel" :
                    if (!chartData.options.hasOwnProperty("xAxis")) {
                        chartData.options.xAxis = {};
                    }
                    if (!chartData.options.xAxis.hasOwnProperty("plotLines")) {
                        chartData.options.xAxis.plotLines = [{}];
                        chartData.options.xAxis.plotLines.push({zIndex: 50});
                    }
                    chartData.options.xAxis.plotLines[0].label = {text: value, verticalAlign: 'top', textAlign: 'left', y: 20, x: 5, rotation: 0};
                    break;

                case "xaxis plotLine dash" :
                case "xaxis-plotLine-dash" :
                case "xaxisPlotLineDash" :
                    if (!chartData.options.hasOwnProperty("xAxis")) {
                        chartData.options.xAxis = {};
                    }
                    if (!chartData.options.xAxis.hasOwnProperty("plotLines")) {
                        chartData.options.xAxis.plotLines = [{}];
                        chartData.options.xAxis.plotLines.push({zIndex: 50});
                    }
                    chartData.options.xAxis.plotLines[0].dashStyle= value;
                    break;



                case "yaxis legend" :
                case "yaxis-legend" :
                case "yaxisLegend" :
                    chartData.options.yAxis.title.text = value;
                    break;
                case "yaxis legend align" :
                case "yaxis-legend-align" :
                case "yaxisLegendAlign" :
                    switch (value.trim()) {
                        case "left" :
                        case "bottom" :
                            chartData.options.yAxis.title.align = "low";
                            break;
                        case "right" :
                        case "top" :
                            chartData.options.yAxis.title.align = "high";
                            break;
                        case "center" :
                            chartData.options.yAxis.title.align = "middle";
                            break;
                        case "low" :
                        case "middle" :
                        case "high" :
                            chartData.options.yAxis.title.align = value.trim();
                            break;
                        default:
                            throw new Error('yaxis legend align align expects  "left" or "center" or "right" as parameter."' + value + '" was given');
                    }
                    break;
                case "yaxis values" :
                case "yaxis-values" :
                case "yaxisValues" :
                    // fügt ein Array hinzu
                    if (typeof value == "string") {
                        throw new Error('yaxis values expects an array. String was given. For single values use "yaxis push values"');
                    }
                    value = value.constructor.name == "Matrix" ? value.toArray() : value;
                    value = typeof value == "number" ? value = [value] : value;
                    chartData.options.yAxis.categories = value;
                    break;
                case "yaxis push value" :
                case "yaxis-push-value" :
                case "yaxisPushValue" :
                    // fügt EIN wert hinzu
                    chartData.options.yAxis.categories.push(value)
                    break;
                case "yaxis push values" :
                case "yaxis-push-values" :
                case "yaxisPushValues" :
                    throw new Error('unkown type "yaxis push values". Did you mean "yaxis push value" or "yaxis values"?');
                case "yaxis min value" :
                case "yaxis-min-value" :
                case "yaxisMinValue" :
                    chartData.options.yAxis.min = parseInt(value);
                    break;

                case "yaxis plotLine color" :
                case "yaxis-plotLine-color" :
                case "yaxisPlotLineColor" :
                    if (!chartData.options.hasOwnProperty("yAxis")) {
                        chartData.options.yAxis = {};
                    }
                    if (!chartData.options.yAxis.hasOwnProperty("plotLines")) {
                        chartData.options.yAxis.plotLines = [{zIndex: 50}];
                    }
                    chartData.options.yAxis.plotLines[0].color = value
                    break;

                case "yaxis plotLine width" :
                case "yaxis-plotLine-width" :
                case "yaxisPlotLineWidth" :
                    if (!chartData.options.hasOwnProperty("yAxis")) {
                        chartData.options.yAxis = {};
                    }
                    if (!chartData.options.yAxis.hasOwnProperty("plotLines")) {
                        chartData.options.yAxis.plotLines = [{zIndex: 50}];
                    }
                    chartData.options.yAxis.plotLines[0].width = value;
                    break;
                case "yaxis plotLine dashStyle" :
                case "yaxis-plotLine-dashStyle" :
                case "yaxisPlotLineDashStyle" :
                    if (!chartData.options.hasOwnProperty("yAxis")) {
                        chartData.options.yAxis = {};
                    }
                    if (!chartData.options.yAxis.hasOwnProperty("plotLines")) {
                        chartData.options.yAxis.plotLines = [{zIndex: 50}];
                    }
                    chartData.options.yAxis.plotLines[0].dashStyle = value;
                    break;
                case "yaxis plotLine value" :
                case "yaxis-plotLine-value" :
                case "yaxisPlotLineValue" :
                    if (!chartData.options.hasOwnProperty("yAxis")) {
                        chartData.options.yAxis = {};
                    }
                    if (!chartData.options.yAxis.hasOwnProperty("plotLines")) {
                        chartData.options.yAxis.plotLines = [{zIndex: 50}];
                    }
                    chartData.options.yAxis.plotLines[0].value = value;
                    break;

                case "yaxis plotLine label" :
                case "yaxis-plotLine-label" :
                case "yaxisPlotLineLabel" :
                    if (!chartData.options.hasOwnProperty("yAxis")) {
                        chartData.options.yAxis = {};
                    }
                    if (!chartData.options.yAxis.hasOwnProperty("plotLines")) {
                        chartData.options.yAxis.plotLines = [{}];
                        chartData.options.yAxis.plotLines.push({zIndex: 50});
                    }
                    chartData.options.yAxis.plotLines[0].label = {text: value, align: 'right', x: -10};
                    break;

                case "yaxis plotLine dash" :
                case "yaxis-plotLine-dash" :
                case "yaxisPlotLineDash" :
                    if (!chartData.options.hasOwnProperty("yAxis")) {
                        chartData.options.yAxis = {};
                    }
                    if (!chartData.options.yAxis.hasOwnProperty("plotLines")) {
                        chartData.options.yAxis.plotLines = [{}];
                        chartData.options.yAxis.plotLines.push({zIndex: 50});
                    }
                    chartData.options.yAxis.plotLines[0].dashStyle= value;
                    break;

                case "yaxis type" :
                case "yaxis-type" :
                case "yaxisType" :
                    if (!chartData.options.hasOwnProperty("yAxis")) {
                        chartData.options.yAxis = {};
                    }
                    chartData.options.yAxis.type = value;

                    break;


                case "reset" :
                case "clear" :
                    $scope.tabs[$scope.selectedTab].chartData = createChartSkeleton();
                    break;
                default :
                    throw new Error('unknown first parameter for chart: "' + type);
            }
            return value;
        }

        // collect.transform = function (args, math, scope) {
        //     var x;
        //     try {
        //         x = args[0].compile().eval(scope)
        //     } catch (e) {
        //         x = args[0]
        //     }
        //     return collect(x, args[1], false)
        //
        // };
        // collect.transform.rawArgs = true;


        chart.toTex = function (node, options) {
            var type = node.args[0].value;
            var color = "#009688"
            var color = "#004b5a"
            var colorlight = "#009688"
            return "\\color{" + color + "}{\\text{chart }}\\quad\\color{" + colorlight + "}{\\text{" + type + "}}";
        };
        math.import({chart: chart});

        function serie(numberInput, settings, value) {
            var number = -999999;
            if (typeof numberInput == "string") {
                number = getIdFromSeriesName(numberInput);
                if (number == -1) {
                    var tempValue = createSeriesSkeleton(numberInput);
                    $scope.tabs[$scope.selectedTab].chartData.series.push(tempValue);
                    number = getIdFromSeriesName(numberInput);
                }
            } else {
                number = parseInt(numberInput);
            }
            if (typeof number == "string") {
                throw new Error('no serie found with "' + number + '"');
            }

            if (number == 0) {
                throw new Error('serie is one based, so you can get the first serie with: serie(1,  ...)');
            }
            var series = $scope.tabs[$scope.selectedTab].chartData.series[number - 1];
            switch (settings) {

                case "name" :
                    series.name = value;
                    break;
                case "type" :
                    
                    // if(value == "pie" && series.type !== "pie"){
                    //     console.log("WAR "+series.type+" soll nun PIE WERDEN");
                    //
                    //     //struktur umwandeln
                    //     var tempData = [];
                    //     series.data.forEach(function (elem) {
                    //         var tempObj = {name : series.name, y:elem};
                    //         tempData.push(tempObj)
                    //     });
                    //     series.data = tempData;
                    // }
                    // if(value != "pie" && series.type == "pie"){
                    //     console.log(" VON PIE ZURÜCK ZU "+value);
                    //
                    // }
                    //
                    
                    
                    series.type = value;
                    break;
                case "label" :
                    value = value == true || value == "yes" || value == "true" || value == 1 || value == "1" ? true : false;

                    if (!series.hasOwnProperty("dataLabels")) {
                        series.dataLabels = {shadow : false};
                    }
                    if (!series.dataLabels.hasOwnProperty("enabled")) {
                        series.dataLabels.enabled = false;
                    }
                    series.dataLabels.enabled = value;
                    break;

                case "label-color" :
                case "label color" :
                case "label_color" :
                case "labelColor" :

                    if (!series.dataLabels) series.dataLabels = {shadow : false}

                    series.dataLabels.color = value;
                    break;
                case "stack" :
                    series.stack = value;
                    break;
                case "color" :
                    series.color = value;
                    break;
                case "size" :
                    if (series.type !== "pie") {
                        throw new Error('size is only for type "pie" available, current type is: "' + series.type + '"');
                    }
                    series.size = value;
                    break;
                case "position" :
                    if (series.type !== "pie") {
                        throw new Error('position(x,y) is only on type "pie" available, current type is: "' + series.type + '"');
                    }
                    value = value.constructor.name == "Matrix" ? value.toArray() : value;
                    if (typeof value == "string") {
                        value = value.replace("[", "");
                        value = value.replace("]", "");
                        var temp = value.split(",");
                        value = [temp[0], temp[1]]
                    }

                    series.center = value;
                    break;
                case "remove" :
                    $scope.tabs[$scope.selectedTab].chartData.series.splice(number - 1, 1)
                    // getIdFromSeriesName(number);
                    break;
                case "reset" :
                case "clear" :
                    series.name = "unnamed";
                    series.type = "column";
                    series.dataLabels = {shadow : false};
                    series.dataLabels.enabled = true;
                    series.dataLabels.color = "#000000";
                    series.stack = "stack_" + number;
                    series.color = Highcharts.getOptions().colors[number];
                    series.data = [];
                    break;
                default :
                    throw new Error('Unknown second parameter for serie: "' + settings+'"');
            }
            return value
        }

        serie.toTex = function (node, options) {
            var number = node.args[0].value;

            if (typeof number == "string") {
                number = getIdFromSeriesName(number);
            }
            var settings = node.args[1].value;
            var color = getColor(number - 1);

            var colorLight = shadeBlend(0.5, color);
            return "\\color{" + color + "}{\\text{serie}_{" + number + "}}\\quad\\color{" + colorLight + "}{\\text{" + settings + "}}";
        };
        math.import({serie: serie});


        /*
         *
         *
         * Mathjs PUSH
         *
         *
         * */
        function push(number, x,pieName) {
            if (typeof number == "string") {
                var numberStringToInteger = getIdFromSeriesName(number);
                if (numberStringToInteger == -1) {
                    var tempValue = createSeriesSkeleton(number);
                    $scope.tabs[$scope.selectedTab].chartData.series.push(tempValue);
                    number = getIdFromSeriesName(number);
                } else {
                    number = numberStringToInteger;
                }
            }
            number = parseInt(number);
            if (number == 0) {
                throw new Error('first series started with 1, you wrote "0"');
            }
            var series = $scope.tabs[$scope.selectedTab].chartData.series[number - 1];
            x = x.constructor.name == "Matrix" ? x.toArray() : x;
            x = x.hasOwnProperty("_data") ? x.toArray() : x;
            if (typeof x == "string") x = parseInt(x, 10);

            if (x instanceof Array) {
                x.forEach(function (elem) {
                    var tempObj = {
                        name : pieName ? pieName : " ",
                        y : parseFloat(elem.toFixed(2))
                    };
                    series.data.push(tempObj);
                })
            } else {
                var tempObj = {
                    name : pieName ? pieName : " ",
                    y : parseFloat(x.toFixed(2))
                };
                series.data.push(tempObj);
            }
            return x;
        }

        push.toTex = function (node, options) {
            var type = node.args[0].value;
            var color = "#f00";
            if (typeof type == "string") {
                var typeNumber = getIdFromSeriesName(type);
                color = getColor(typeNumber - 1);
            } else {
                color = getColor(type - 1);
            }
            return "\\color{" + color + "}{" + node.args[1].toTex(options) + "}"
        };

        math.import({push: push});


        function getIdFromSeriesName(name) {
            var numberStringToInteger = -1;
            if (typeof name == "string") {
                var searchNumber = name.replace(/\s/g, "").toLowerCase();
                $scope.tabs[$scope.selectedTab].chartData.series.forEach(function (elem, index) {
                    var searchName = elem.name.replace(/\s/g, "").toLowerCase();
                    if (searchName == searchNumber) {
                        numberStringToInteger = index + 1;
                    }
                })
            }
            return numberStringToInteger;
        }

        function collect(x, type) {
            // var returnX = x;
            x = x.constructor.name == "Matrix" ? x.toArray() : x;

            // console.log("collect",math.typeof(x),x, type);
            // console.log("collect toString",x.toString());
            // console.log("collect parse",math.parse(x));
            // console.log("collect eval",math.eval(x));


            type = typeof type != "undefined" ? type.constructor.name == "Node" ? type.value : type : type;
            if (typeof type == "undefined") {
                type = "notnamed"
            }
            if (typeof $scope.plotArray[type] == "undefined") {
                $scope.plotArray[type] = [];
            }
            if (x instanceof math.expression.node.ArrayNode) {
                x.forEach(function (value) {
                    if (value instanceof math.expression.node.ConstantNode) {
                        $scope.plotArray[type].push(value.value);
                    }
                    value.forEach(function (value2) {
                        if (value2 instanceof math.expression.node.ConstantNode) {
                            $scope.plotArray[type].push(value2.value);
                        }
                        if (value2 instanceof math.expression.node.ArrayNode) {
                            console.error("ArrayNode deepness >2");

                        }

                    })
                })
            } else {
                if (typeof x == "object") {
                    x.forEach(function (value) {
                        $scope.plotArray[type].push(value);
                    })
                } else {
                    $scope.plotArray[type].push(x);
                }
            }

            // return returnX;
            return x;
        }

        // collect.transform = function (args, math, scope) {
        //     var x;
        //     try {
        //         x = args[0].compile().eval(scope)
        //     } catch (e) {
        //         x = args[0]
        //     }
        //     return collect(x, args[1], false)
        //
        // };
        // collect.transform.rawArgs = true;
        collect.toTex = function (node, options) {
            var type = node.args[1].value;
            if (typeof type != "undefined") {
                var color = getColor(type);
            }
            return "\\color{" + color + "}{" + node.args[0].toTex(options) + "}"
        };
        math.import({collect: collect});

        /*Show data */
        function showdata(x, type) {}

        showdata.toTex = function (node, options) {
            console.log("show data => toTex", node);
            var name = node.args[0].value;
            console.log(" TO TOEX", name);
            for (var i in $scope.mathscope) {
                console.log("i", i, $scope.mathscope[i]);

                if (i.toLowerCase() == name.toLowerCase()) {
                    console.log("BÄHM", $scope.mathscope[i]);
                    return "\\text{" + name + "}\\begin{cases} {2}, &\\quad{\\text{if }1}" +
                        '\\\\{3}, &\\quad{\\text{otherwise1}}' +
                        "\\\\{3}, &\\quad{\\text{otherwise2}}" +
                        "\\\\{3}, &\\quad{\\text{otherwise3}}" +
                        "\\end{cases}";
                }
            }
        };
        math.import({showdata: showdata});

        /*log */
        function printl(x) {
            console.info("┏──────────────────────────────");
            console.info("├", x);
            return x;
        }

        math.import({printl: printl});


        /*
         *
         * TEMPLATE FUNCTIONS
         *
         * */
        function toggleTerm() {
            $scope.showTerm = !$scope.showTerm;
            $scope.evaluate();
        }

        function toggleTab(tabname) {
            if (tabname == "close") {
                $scope.showFilter = false;
                $scope.showTab = "";
            }
            $scope.showTab = $scope.showTab == tabname ? "" : tabname
        }

        function setTab(tabname) {
            $scope.showTab = tabname;
        }

        function exampleBlur() {
            $scope.example = null;
        }


        function checkShiftEnter(event) {
            event.stopPropagation();
            var code = event.keyCode || event.which;
            if (code === 13 && event.ctrlKey) {
                $scope.evaluate();
            }

        }


        function removeTab(tab) {
            var index = $scope.tabs.indexOf(tab);
            $scope.tabs.splice(index, 1);
            $scope.selectedTab = index;
            $scope.editorInput = $scope.tabs[index].editorInput
            $scope.solutions = $scope.tabs[index].solutions
        }

        function addTab(type, icon, chartData, solution, editorInput, mathscope) {
            type = typeof type == "undefined" || type == null ? "column" : type;
            icon = typeof icon == "undefined" || icon == null ? "bar" : icon;
            chartData = typeof chartData == "undefined" || chartData == null ? createChartSkeleton() : chartData;
            solution = typeof solution == "undefined" || solution == null ? [] : solution;
            editorInput = typeof editorInput == "undefined" || editorInput == null ? "//new Tab" : editorInput;
            mathscope = typeof mathscope == "undefined" || mathscope == null ? {} : mathscope;
            var tabObj = {
                type: type,
                icon: icon,
                chartData: chartData,
                solution: solution,
                editorInput: editorInput,
                mathscope: mathscope
            };
            $scope.tabs.push(tabObj);

            // console.log("$scope.tabs", $scope.tabs);
            // $scope.tabs.push({
            //     type: type,
            //     chartData: generateChartData(type),
            //     editor: $scope.editorInput
            // });
            // console.log("$scope.tabs", $scope.tabs);
            // $scope.selectedTab = $scope.tabs.length - 1;

            // $timeout(function () {
            //     $window.dispatchEvent(new Event('resize'));
            // }, 500)

        }

        $scope.showPopup = function showPopup() {
            var left = screen.width / 2 - 250;
            var top = screen.height / 2 - 350;
            var resizable = false;
            var win = $window.open(SETTINGS_INDEX_CALCULATOR.helpUrl, '', "top=" + top + ",left=" + left + ",directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=700");
        };
        $scope.aceLoaded = function (_editor) {
            ace.require("ace/ext/language_tools");
            _editor.$blockScrolling = Infinity;
        };


        var colors = [
            '#424242',
            '#004b5a',
            '#3f51b5',
            '#e91e63',
            '#03a9f4',
            '#009688',
            '#9c27b0',
            '#f44336',
            '#673ab7',
            '#ff5722',
            '#2196f3',
            '#4caf50',
            '#8bc34a',
            '#cddc39',
            '#ffc107',
            '#ff9800'];


        function getColor(index) {return colors[index % colors.length]}

        Highcharts.theme = {
            colors: colors,
            chart: {
                backgroundColor: '#fff'
            },
            title: {
                style: {
                    color: '#666',
                    font: 'Roboto, "Helvetica Neue", sans-serif'
                }
            },
            subtitle: {
                style: {
                    color: '#666666',
                    font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
                }
            },

            legend: {
                itemStyle: {
                    font: '9pt Roboto, "Helvetica Neue", sans-serif',
                    color: '#666'
                },
                itemHoverStyle: {
                    color: 'gray'
                }
            }
        };

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);

        function createChartSkeleton() {

            var data = {
                title: {
                    text: ""
                },
                subtitle: {
                    text: ""
                },
                options: {
                    chart: {
                        type: "column",
                        zoomType: "",
                        style: {
                            fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
                        }
                    },

                    xAxis: {
                        title: {
                            text: "",
                            align: "middle"
                        },
                        labels: {
                            formatter: function () {
                                var label = this.axis.defaultLabelFormatter.call(this);
                                return typeof this.value == "number" ? this.value+1 : this.value;
                            }
                        },
                        tickmarkPlacement: 'on',
                        lineWidth: 0
                    },
                    yAxis: {
                        type: 'linear',
                        minorTickInterval: 0.1,
                        categories: [],
                        allowDecimals: false,
                        title: {
                            text: ""
                        },
                        gridLineInterpolation: 'polygon',
                        lineWidth: 0,
                        min: null
                    },
                    tooltip: {
                        formatter: function (a, b, c) {
                            var x = this.x || this.key
                            if(typeof x == "number"){
                                x = x+1;
                            }

                            var str =  '<b>' + x + '</b><br/>' + this.series.name + ': ' + this.y + '<br/>';
                            // var str =  this.series.name + ': ' + this.y + '<br/>';
                            return str;
                            // 'Total: ' + this.point.stackTotal;
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: "normal",
                            dataLabels: {
                                enabled: true,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                shadow: false
                            }
                        },
                        pie: {
                            dataLabels: {
                                distance: -30,
                                // color: 'white'
                            }

                        }
                    },
                    credits: {
                        enabled: false
                    }
                },
                series: [
                    //     {
                    //         name: 'EMPTY DATA',
                    //         data: [],
                    //         type: "line",
                    //         dataLabels: {
                    //             enabled: true,
                    //             color: "lime"
                    //         }
                    //     }, {
                    //         name: 'Year 1800NB',
                    //         data: [Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10],
                    //         type: "area",
                    //         dataLabels: {
                    //             enabled: true,
                    //             color: "lime"
                    //         }
                    //     },
                    //     {
                    //         name: 'Year 1800',
                    //         data: [Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10],
                    //         stack: "HI",
                    //         dataLabels: {
                    //             enabled: true,
                    //             color: "lime"
                    //         }
                    //     }, {
                    //         name: 'Year 2012',
                    //         data: [Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10],
                    //         stack: "HI"
                    //     }, {
                    //         name: 'Year 1900',
                    //         type: "spline",
                    //         color: "#000",
                    //         data: [Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10],
                    //
                    //     }, {
                    //         name: 'H-Index',
                    //         data: [Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10, Math.floor(Math.random() * (100 - 10 + 1)) + 10],
                    //         center: [50, 50],
                    //         size: 100,
                    //     },
                    //     {
                    //         type: "pie",
                    //         name: "BRABRAB",
                    //         data: [
                    //             {
                    //                 name: 'Year 1800',
                    //                 y: Math.floor(Math.random() * (100 - 10 + 1)) + 10
                    //             }, {
                    //                 name: 'Chrome',
                    //                 y: 24.03,
                    //                 sliced: false,
                    //                 selected: true
                    //             }, {
                    //                 name: 'Firefox',
                    //                 y: 10.38
                    //             }, {
                    //                 name: 'Safari',
                    //                 y: 4.77
                    //             }, {
                    //                 name: 'Opera',
                    //                 y: 0.91
                    //             }, {
                    //                 name: 'Proprietary or Undetectable',
                    //                 y: 0.2
                    //             }
                    //         ],
                    //         center: [50, 50],
                    //         size: 100,
                    //         showInLegend: false,
                    //         allowPointSelect: false,
                    //         dataLabels: {
                    //             enabled: false,
                    //             //     format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    //             //     style: {
                    //             //         color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    //             //     }
                    //         }
                    //     }
                    //
                ]
            };
            return data;
        }


//
//         function myFunction(args, math, scope) {
//             // get string representation of the arguments
//             var str = args.map(function (arg) {
//                 return arg.toString();
//             });
//             // evaluate the arguments
//             var res = args.map(function (arg) {
//                 return arg.compile().eval(scope);
//             });
//             var returnStr =  'arguments: ' + str.join(',') + ', evaluated: ' + res.join(',');
//             console.log(returnStr);
//
//             return 45
//         }
//
// // mark the function as "rawArgs", so it will be called with unevaluated arguments
//         myFunction.rawArgs = true;
//
// // import the new function in the math namespace
//         math.import({
//             myFunction: myFunction
//         })
//




        function trySum(iteratorName, from, to,f){
            // console.group("trySum")
            // console.log("iteratorName",typeof iteratorName,iteratorName);
            // console.log("from",typeof from,from);
            // console.log("to",typeof to,to);

            $scope.mathscope[iteratorName] = from;



            var toVal = "NOT SET";
            if(typeof to == "number"){
                toVal = to;
            }
            if (to.constructor.name == "Matrix") {
                toVal = to.toArray().length;
            }
            // console.log("toVal",typeof toVal,toVal);
            // console.log("f",typeof f,f);


            var total = " ";
            var firstRun = true;
            for (var iterator = from; iterator <= toVal; iterator++) {
                // $scope.mathscope[toString + "_" + iterator] = to[iterator];
                $scope.mathscope[iteratorName] = iterator;
                // console.log(iteratorName+"=",$scope.mathscope[iteratorName],iterator);
                // console.log("f=",typeof f,f);

                


                // if(firstRun){
                //     total = math.eval(f, $scope.mathscope);
                //     firstRun = false;
                // }else{
                    total += math.eval(f, $scope.mathscope)+"-";
                // }
            }
            // delete $scope.mathscope[iteratorName];
                console.groupEnd();
            return total

        }
        trySum.transform = function (iteratorName, from, to,f) {
            // console.log("args",args.toString(), args);
            // console.log("math",math);
            // console.log("scope",scope);

            // console.log("iteratorName --> ",typeof iteratorName,iteratorName);

            iteratorName = iteratorName.toString();
            $scope.mathscope[iteratorName] = "hihi";
            // console.log("iteratorName --> ",typeof iteratorName,iteratorName);
            // console.log("f -->",typeof f, f);

            f = f.toString();
            // console.log("f -->",typeof f, f);
           //
           //  /*   Iterator    */
           //  var iteratorName = "notfound";
           // console.log("args[0]",args);
           //
           //
           //  if (args[0] instanceof math.expression.node.SymbolNode) {
           //      iteratorName = args[0].name;
           //  }
           //
           //  var from = args[1].compile().eval($scope.mathscope);
           //  var to = args[2].compile().eval($scope.mathscope);
           //  var f = args[3].compile().eval($scope.mathscope);
           //  console.log("scope2",scope);
           //  return trySum(iteratorName, from, to,args[3].toString())
            return trySum(iteratorName, from, to,f)

        };
        // trySum.transform.rawArgs = true;

        math.import({trySum: trySum}, {override: true});


        function createSeriesSkeleton(name) {
            name = typeof name == "undefined" ? "createSeriesSkeleton" : name;
            return {
                name: name,
                data: [],
                type: "column",
                dataLabels: {
                    enabled: true,
                    // color: "teal"
                }
            }
        }

        function shadeBlend(p, c0, c1) {
            try {
                var n = p < 0 ? p * -1 : p, u = Math.round, w = parseInt;
                if (c0.length > 7) {
                    var f = c0.split(","), t = (c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(","), R = w(f[0].slice(4)), G = w(f[1]), B = w(f[2]);
                    return "rgb(" + (u((w(t[0].slice(4)) - R) * n) + R) + "," + (u((w(t[1]) - G) * n) + G) + "," + (u((w(t[2]) - B) * n) + B) + ")"
                } else {
                    var f = w(c0.slice(1), 16), t = w((c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF").slice(1), 16), R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF;
                    return "#" + (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (u(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1)
                }
            }

            catch (e) {
                return "#004b5a";
            }
        }


        function shareCalc() {
            var share = $location.absUrl().split("eCalc=")[0] + "#eCalc=" + encodeURIComponent($scope.editorInput);
            clipboard.copyText(share);
            console.log("COPY:", share);
        }


    }
    ;

sv.directive('indexEditor', indexEditor);


indexEditorController.$inject = ['$scope', 'DataProvider', 'SETTINGS_FDG_CITE', '$timeout', '$sce', 'SETTINGS_INDEX_CALCULATOR', '$mdDialog', '$mdBottomSheet', '$window', '$compile', '$location', 'clipboard'];