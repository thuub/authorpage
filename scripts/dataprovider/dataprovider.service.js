sv.factory(
    'DataProvider', ['Author', 'Abstract', "$timeout", '$rootScope',
        function (Author, Abstract, $timeout, $rootScope) {
            var clients = [

            ];


            var factory = {
                getAuthor: getAuthor,
                // getAbstract: getAbstract,
                data: {},
                publicationData: {},
                publicationDataYears: {},
                graphIndex: {},
                indexVariables: {"param1": 20},
                reg: register,
                unreg: unRegister
            };

            function register(name, type) {
                clients[name] = type;
            }

            function unRegister(name,type) {
                delete clients[name];
                if ( Object.keys(clients).length == 0 ||  Object.keys(clients).length == 1) {
                    $timeout(function () {
                        $rootScope.$broadcast("allReady")
                    },5000)
                }
            }

            function getAuthor(publinId) {
                if (typeof factory.data[publinId] === "undefined") {

                    factory.data[publinId] = {request: "pending"};
                    var options = {
                        id: publinId
                    };

                    function getAuthorSuccess(response) {
                        angular.extend(factory.data[options.id], response);
                        factory.data[publinId].request = "done";

                        $timeout(function () {
                            factory.data[publinId].request = "done";
                        }, 0);
                        generatePublicationData(publinId);

                        $rootScope.$broadcast("sv:data:new")
                    }

                    function getAuthorError(err) {
                        factory.data[publinId].request = "error";
                        factory.data[publinId].error = err.data.text;
                        console.error(err);
                    }

                    Author.get(options, getAuthorSuccess, getAuthorError);
                }
            }

            function generatePublicationData(publinId) {
                factory.publicationData[publinId] = {};


                for (var i = 0; i < factory.data[publinId].publications.length; i++) {
                    var pub = factory.data[publinId].publications[i];
                    //publin
                    // var year = parseInt(pub.DatePublished.split("-")[0], 10);

                    //mag
                    var year = pub.Year;

                    if (typeof factory.publicationData[publinId][year] == "undefined") {
                        factory.publicationData[publinId][year] = [];
                    }
                    factory.publicationData[publinId][year].push(pub);

                    if (typeof factory.publicationDataYears[publinId] == "undefined") {
                        factory.publicationDataYears[publinId] = [];
                    }
                    if (factory.publicationDataYears[publinId].indexOf(year) == -1) {
                        factory.publicationDataYears[publinId].push(year);
                    }
                }
            }


            return factory;
        }]);