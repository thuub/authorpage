/**
 * Created by Han on 15.09.2016.
 */



"use strict";
function citeSpace() {
    return {
        restrict: "AE",
        transclude: false,
        templateUrl: "scripts/citeSpace/citeSpace.tpl.html",
        scope: {
            svHeight: "=",
            vkEdit: "=",
            publinId: "="
        },
        controller: citeSpaceController,
        link: function (scope, element, attributes) {


        }
    };
}
sv.directive('citeSpace', citeSpace);


var citeSpaceController = function ($scope, DataProvider, SETTINGS_FDG_CITE, $timeout) {
        $scope.DataProvider = DataProvider;
        DataProvider.reg("cs","start");
        $scope.showLoader = true;
        $scope.loadingMessage = "load data";


        $scope.toggleEdges = toggleEdges;
        $scope.toggleNodesVisible = toggleNodesVisible;
        $scope.edgeHiddenIcon = "visibility";
        $scope.edgeHidden = false;
        $scope.nodeHiddenIcon = "visibility";
        $scope.nodeHidden = false;
        $scope.doZoomAfterStabilized = true;
        DataProvider.getAuthor($scope.publinId)


        $scope.doFullscreen = doFullScreen;
        var initState = true;
        $scope.$watch(function () {
            return DataProvider.publicationData[$scope.publinId];
        }, function (newValue, oldValue) {
            if (newValue !== oldValue && $scope.doZoomAfterStabilized) {
                DataProvider.unreg("cs","start");
            }
        }, true);
        $scope.$on("allReady",function () {
            $scope.loadingMessage = "generate graph";
            $timeout(function () {
                startDrawing()
            },0)
        });

        function startDrawing() {
            if (initState) {
                initState = false;
            } else {
                return;
            }
            var centerX = (document.getElementById('networkWrapper').offsetWidth / 2);

            var author = {
                id: "author_" + DataProvider.data[$scope.publinId].Id,
                label: DataProvider.data[$scope.publinId].Given + " " + DataProvider.data[$scope.publinId].Family,
                title: DataProvider.data[$scope.publinId].Given + " " + DataProvider.data[$scope.publinId].Family,
                group: 'author',
                color: SETTINGS_FDG_CITE.color.author,
                fixed: true,
                x: 0,
                y: 0,
                mass: 10,
                size: 50,
                font: {
                    size: 40
                }
            };
            var isAuthorIn = $scope.nodesDataset.get("author_" + DataProvider.data[$scope.publinId].Id);
            if (isAuthorIn === null) {
                $scope.nodesDataset.add(author);
            }
            $timeout(function () {
                $scope.network.focus("author_" + DataProvider.data[$scope.publinId].Id, {
                    scale: 0.3,
                    animation: {
                        duration: 1000,
                        easingFunction: "easeInOutQuad"
                    }
                });
            }, 2000);


            for (var years in DataProvider.publicationData[$scope.publinId]) {
                if (DataProvider.publicationData[$scope.publinId].hasOwnProperty(years)) {
                    var year = DataProvider.publicationData[$scope.publinId][years]
                    for (var pub in year) {
                        if (year.hasOwnProperty(pub)) {
                            var publication = year[pub];
                            var size = 25 + 2 * publication.Citescount;
                            var autor = publication["Authors"][0]["Family"] + " et al.";
                            var publisher = publication.Publisher != null ? "<br><small>" + publication.Publisher + "</small>" : "";
                            var graphPublication = {
                                id: "pub_" + publication.Id,
                                label: publication.Year + " - " + publication.Title.substring(0, 30) + "...",
                                title: "<b>" + publication.Title + "</b><br>" + autor + publisher,
                                group: 'publication',
                                color: SETTINGS_FDG_CITE.color.publication,
                                mass: 2 - (1 / size),
                                size: size
                            };

                            var isInPub = $scope.nodesDataset.get("pub_" + publication.Id);
                            if (isInPub === null) {
                                $scope.nodesDataset.add(graphPublication);
                            }
                            // Kanten zwischen Author und seinen Publikationen
                            var authorEdge = {
                                from: "author_" + DataProvider.data[$scope.publinId].Id,
                                to: "pub_" + publication.Id,
                                dashes: false,
                                font: {align: 'middle'},
                                arrows: {to: {scaleFactor: .5}},
                                color: SETTINGS_FDG_CITE.color.edgeAuthorPublication,
                                length: 500
                            };
                            var authorEdgesExists = $scope.edgesDataset.get({
                                filter: function (item) {
                                    return (item.from == "author_" + DataProvider.data[$scope.publinId].Id && item.to == "pub_" + publication.Id);
                                }
                            });
                            if (authorEdgesExists.length < 1) {
                                $scope.edgesDataset.add(authorEdge)
                            }
                        }
                    }
                }
            }
            for (var years in DataProvider.publicationData[$scope.publinId]) {
                if (DataProvider.publicationData[$scope.publinId].hasOwnProperty(years)) {
                    var year = DataProvider.publicationData[$scope.publinId][years]
                    for (var pub in year) {
                        if (year.hasOwnProperty(pub)) {
                            var publication = year[pub];
                            for (var citesId in publication.Cites) {
                                if (publication.Cites.hasOwnProperty(citesId)) {
                                    var cite = publication.Cites[citesId];

                                    var autor = cite["Authors"][0]["Family"] + " et al.";
                                    var publisher = cite.Publisher != null ? "<br><small>" + cite.Publisher + "</small>" : "";
                                    var graphPublicationCite = {
                                        id: "pub_" + cite.Id,
                                        label: cite.Title.substring(0, 30) + "...",
                                        title: "<b>" + cite.Title + "</b><br>" + autor + publisher,
                                        group: "cite",
                                        color: SETTINGS_FDG_CITE.color.citation,
                                    };
                                    var isInPubCite = $scope.nodesDataset.get("pub_" + cite.Id);
                                    if (isInPubCite === null) {
                                        $scope.nodesDataset.add(graphPublicationCite);
                                    }
                                    var citeEdge = {
                                        from: "pub_" +cite.Id,
                                        to: "pub_" +  publication.Id,
                                        dashes: false,
                                        font: {align: 'middle'},
                                        arrows: {to: {scaleFactor: .5}},
                                        color: SETTINGS_FDG_CITE.color.edgePublicationCitation,
                                        length: 50,
                                        title : publication.Title +" -> " + cite.Title
                                    };
                                    var citeEdgeExists = $scope.edgesDataset.get({
                                        filter: function (item) {
                                            return (item.from == "pub_" + publication.Id && item.to == "cite_" + cite.Id);
                                        }
                                    });
                                    if (citeEdgeExists.length < 1) {
                                        $scope.edgesDataset.add(citeEdge)
                                    }
                                    // Authoren von Zitaten hinzufügen
                                    // cite.Authors.forEach(function (elem,index) {
                                    //     var cite_author = {
                                    //         id: "author_" + elem.Id,
                                    //         label: elem.Given + " " + elem.Family,
                                    //         title: elem.Given + " " + elem.Family,
                                    //         group: "author",
                                    //         color: "#c7eaff",
                                    //         size: 5
                                    //     };
                                    //     var isInNodeDataSet = $scope.nodesDataset.get("author_" + elem.Id);
                                    //     if (isInNodeDataSet === null) {
                                    //         $scope.nodesDataset.add(cite_author);
                                    //     }
                                    //
                                    //     var citeToAuthorEdge = {
                                    //         from: "author_" + elem.Id,
                                    //         to: "pub_" + cite.Id,
                                    //         dashes: false,
                                    //         font: {align: 'middle'},
                                    //         arrows: {to: {scaleFactor: .5}},
                                    //         color: "#c7eaff",
                                    //         length: 10
                                    //     };
                                    //     var citeToAuthorEdgeExists = $scope.edgesDataset.get({
                                    //         filter: function (item) {
                                    //             return (item.from == "author_" + elem.Id && item.to == "pub_" + cite.Id);
                                    //         }
                                    //     });
                                    //     if (citeToAuthorEdgeExists.length < 1) {
                                    //         $scope.edgesDataset.add(citeToAuthorEdge)
                                    //     }
                                    // })
                                }
                            }
                        }
                    }
                }
            }
            $scope.showLoader = false;
        }




        var allNodes;
        var highlightActive = false;

        $scope.nodesDataset = new vis.DataSet(); // these come from WorldCup2014.js
        $scope.edgesDataset = new vis.DataSet(); // these come from WorldCup2014.js

        function initDraw() {
            var container = document.getElementById('mynetwork');
            var options = {
                nodes: {
                    shape: 'dot',
                    scaling: {
                        min: 10,
                        max: 30,
                        label: {
                            min: 8,
                            max: 30,
                            // drawThreshold: 12,
                            drawThreshold: 3,
                            maxVisible: 11
                        }
                    },
                    font: {
                        size: 12,
                        face: 'Tahoma'
                    }
                },
                edges: {
                    width: 0.15,
                    // color: {inherit: 'from'},
                    color: {
                        inherit: 'both'
                    },
                    length: 100,
                    smooth: {
                        type: 'discrete'
                    },
                    arrows: {
                        to: {
                            enabled: true
                        }
                    },
                },
                // physics: {
                //     barnesHut: {
                //         centralGravity: 0.7,
                //         springLength: 200,
                //         springConstant: 0.02,
                //         avoidOverlap: 0.87,
                //         gravitationalConstant: -28650
                //     },
                //     maxVelocity: 50,
                //     minVelocity: 10,
                //     timestep: 0.99,
                //     stabilization: {
                //         enabled: true,
                //         // iterations: 10, // maximum number of iteration to stabilize
                //         updateInterval: 50,
                //         onlyDynamicEdges: false,
                //         fit: true,
                //
                //     },
                //     adaptiveTimestep: true
                // },
                //
                interaction: {
                    //     tooltipDelay: 200,
                    hideEdgesOnDrag: true
                },
                physics: {
                    barnesHut: {
                        gravitationalConstant: -60000,
                        springConstant: 0.01
                    }
                },
                // physics: {
                //     barnesHut: {
                //         avoidOverlap: 1,
                //         centralGravity: 0.2,
                //         gravitationalConstant: -60000,
                //         springConstant: 0.01
                //     }
                // }

            };
            var data = {nodes: $scope.nodesDataset, edges: $scope.edgesDataset} // Note: data is coming from ./datasources/WorldCup2014.js

            $scope.network = new vis.Network(container, data, options);
            $scope.network.on("click", neighbourhoodHighlight);
            $scope.network.on('dragEnd', function (params) {
                //node (un)fixed
                if (typeof params.nodes[0] !== "undefined") {
                    $scope.nodesDataset.update({
                        id: params.nodes[0],
                        allowedToMoveX: false,
                        allowedToMoveY: false,
                        fixed: true,
                        // value: 500,
                        // size: 500
                    });
                }
            });
            $scope.network.on('dragStart', function (params) {
                $scope.doZoomAfterStabilized = false;
                if (typeof params.nodes[0] !== "undefined") {
                    $scope.nodesDataset.update({
                        id: params.nodes[0],
                        allowedToMoveX: true,
                        allowedToMoveY: true,
                        fixed: false
                    });
                }
            });

            // Jahresringe
            // $scope.network.on("beforeDrawing", function (ctx) {
            //     var radius = 200
            //     for (var years in DataProvider.publicationData[$scope.publinId]) {
            //         var ctx_temp = ctx;
            //
            //         ctx_temp.beginPath();
            //
            //         ctx_temp.strokeStyle = '#ccc';
            //         ctx_temp.lineWidth = 1;
            //         ctx_temp.circle(0, 0, radius);
            //         ctx_temp.stroke();
            //
            //         ctx_temp.font = '16pt Calibri';
            //         ctx_temp.fillStyle = '#333';
            //         ctx_temp.textAlign = 'center';
            //         ctx_temp.fillText(years, 0, radius + 20);
            //         radius += 200;
            //     }
            // });

        }


        function neighbourhoodHighlight(params) {
            allNodes = $scope.nodesDataset.get({returnType: "Object"});

            if (params.nodes.length > 0) {
                highlightActive = true;
                var i, j;
                var selectedNode = params.nodes[0];
                var degrees = 2;

                for (var nodeId in allNodes) {
                    allNodes[nodeId].color = 'rgba(200,200,200,0.1)';
                    if (allNodes[nodeId].hiddenLabel === undefined) {
                        allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
                        allNodes[nodeId].label = undefined;
                    }
                }
                var connectedNodes = $scope.network.getConnectedNodes(selectedNode);
                var allConnectedNodes = [];

                for (i = 1; i < degrees; i++) {
                    for (j = 0; j < connectedNodes.length; j++) {
                        allConnectedNodes = allConnectedNodes.concat($scope.network.getConnectedNodes(connectedNodes[j]));
                    }
                }
                for (i = 0; i < allConnectedNodes.length; i++) {
                    allNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.4)';
                    if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
                        allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
                        allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
                    }
                }

                // all first degree nodes get their own color and their label back
                for (i = 0; i < connectedNodes.length; i++) {

                    var color = "";
                    switch (allNodes[connectedNodes[i]].group) {
                        case "author":
                            color = SETTINGS_FDG_CITE.hightlightColor.author;
                            break;
                        case "publication":
                            color = SETTINGS_FDG_CITE.hightlightColor.publication;
                            break;
                        case "cite":
                            color = SETTINGS_FDG_CITE.hightlightColor.citation;
                            break;
                        default:
                            color = "#000";
                    }

                    allNodes[connectedNodes[i]].color = color;
                    if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
                        allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
                        allNodes[connectedNodes[i]].hiddenLabel = undefined;
                    }
                }

                // the main node gets its own color and its label back.
                var color = "";
                switch (allNodes[selectedNode].group) {
                    case "author":
                        color = SETTINGS_FDG_CITE.hightlightColor.author;
                        break;
                    case "publication":
                        color = SETTINGS_FDG_CITE.hightlightColor.publication;
                        break;
                    case "cite":
                        color = SETTINGS_FDG_CITE.hightlightColor.citation;
                        break;
                    default:
                        color = "#000";
                }

                allNodes[selectedNode].color = color;
                if (allNodes[selectedNode].hiddenLabel !== undefined) {
                    allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
                    allNodes[selectedNode].hiddenLabel = undefined;
                }
            }
            else if (highlightActive === true) {
                // reset all nodes
                for (var nodeId2 in allNodes) {
                    var color = "";
                    switch (allNodes[nodeId2].group) {
                        case "author":
                            color = SETTINGS_FDG_CITE.color.author;
                            break;
                        case "publication":
                            color = SETTINGS_FDG_CITE.color.publication;
                            break;
                        case "cite":
                            color = SETTINGS_FDG_CITE.color.citation;
                            break;
                        default:
                            color = "#000";
                    }
                    allNodes[nodeId2].color = color;
                    if (allNodes[nodeId2].hiddenLabel !== undefined) {
                        allNodes[nodeId2].label = allNodes[nodeId2].hiddenLabel;
                        allNodes[nodeId2].hiddenLabel = undefined;
                    }
                }
                highlightActive = false
            }

            // transform the object into an array
            var updateArray = [];
            for (var nodeId3 in allNodes) {
                if (allNodes.hasOwnProperty(nodeId3)) {
                    if (allNodes[nodeId3].fixed == true) {
                        delete(allNodes[nodeId3].x);
                        delete(allNodes[nodeId3].y);
                    }


                    updateArray.push(allNodes[nodeId3]);
                }
            }
            $scope.nodesDataset.update(updateArray);
        }

        function toggleEdges() {
            var updateArray = [];
            var allEdges = $scope.edgesDataset.get({returnType: "Object"});

            for (var edgeId in allEdges) {
                var edge = allEdges[edgeId];
                edge.hidden = typeof edge.hidden == "undefined" || edge.hidden == false ? true : false;
                var hidden = edge.hidden;
                updateArray.push(edge);
            }
            $scope.edgesDataset.update(updateArray);
            $scope.edgeHiddenIcon = hidden ? "visibility_off" : "visibility";
            $scope.edgeHidden = hidden;
        }

        function toggleNodesVisible() {
            var updateArray = [];
            var allPubs = $scope.nodesDataset.get({returnType: "Object"});

            for (var pubsId in allPubs) {
                var pub = allPubs[pubsId];

                if (pub.group = "publication") {
                    pub.hidden = typeof pub.hidden == "undefined" || pub.hidden == false ? true : false;
                    var hidden = pub.hidden;
                    updateArray.push(pub);
                }
            }
            $scope.nodesDataset.update(updateArray);
            $scope.nodeHiddenIcon = hidden ? "visibility_off" : "visibility";
            $scope.nodeHidden = hidden;

            // publication

            // var updateArray = [];
            // var allEdges = $scope.edgesDataset.get({returnType: "Object"});
            //
            // for (var edgeId in allEdges) {
            //     var edge = allEdges[edgeId];
            //     edge.hidden = typeof edge.hidden == "undefined" || edge.hidden == false ? true : false;
            //     var hidden = edge.hidden;
            //     updateArray.push(edge);
            // }
            // $scope.edgesDataset.update(updateArray);
            // $scope.edgeHiddenIcon = hidden ? "visibility_off" : "visibility";
            // $scope.edgeHidden = hidden ;
        }

        initDraw();


        /*
         * Ermöglicht dem Netzwerk in den Fullscreen-Modus zu wechseln
         *
         * */
        function doFullScreen() {
            if (
                document.fullscreenEnabled ||
                document.webkitFullscreenEnabled ||
                document.mozFullScreenEnabled ||
                document.msFullscreenEnabled
            ) {
                var elem = document.getElementById("mynetwork");
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            }
        }


    $scope.selectedItem = null;
        $scope.searchText = "";
        $scope.selectedItemChange = function (item) {
            if (item !== undefined) {
                $scope.network.focus(item.id, {
                    scale: 1,
                    animation: {
                        duration: 1000,
                        easingFunction: "easeInOutQuad"
                    }
                });
            }
        };
        $scope.querySearch = function (str) {
            var ret =  $scope.nodesDataset.get({
                filter: function (item) {
                    return item.title.toLowerCase().includes(str.toLowerCase());
                }
            });
            return ret;
        }
    };
citeSpaceController.$inject = ['$scope', 'DataProvider', 'SETTINGS_FDG_CITE', '$timeout'];