sv.factory('KatexService', ['Author', 'Abstract', "$timeout", 'H-Index', '$rootScope', function (Author, Abstract, $timeout, Hindex, $rootScope) {

    var factory = {
        visibleIndices: {"hindex": true, "otherindex": true, "unregistered": false, "thirdindex": false},
        indexVariables: {"param1": 20},
        getTree: getTree,
        parse: parse,
        mathjsString: "",
        mathjsTokens: []
    };


    return factory;


    function getTree(e) {
        console.log("KATEX getTree")
        return katex.getTree(e)
    }

    function parse(data) {
        factory.mathjsString = "";
        factory.mathjsTokens = [];
        var parsedString =  loopThroughAllNodes(data)
        var parsedArray = generateDataFromArray();
        console.log(parsedArray)
        
        
        return parsedString;
    }

    function generateDataFromArray() {
        var temp = [];
        for(var index=0; index< factory.mathjsTokens.length; index++){
            var token  = factory.mathjsTokens[index];
            console.log(typeof token, token);
            if(token == '\\sum'){
                temp.push("gefunen");
            }else{
                temp.push(factory.mathjsTokens[index]);
            }
        }
        return temp;
    }


    function loopThroughAllNodes(tree) {
        var temp = "";
        for (var i in tree) {
            if (tree.hasOwnProperty(i)) {
                var rootNode = tree[i];
                console.log('%c ===>          loopThroughAllNodes:   ', 'background: #222; color: #bada55', rootNode);
                temp += processNode(rootNode);
            } else {
                console.group("Error! Tree hat nichth ownProperty:");
                console.log("tree", tree);
                console.log("i: ", i);
                console.log("tree[i]", tree[i]);
                console.groupEnd();
            }
        }
        return temp;
    }


    function processNode(currentNode, log) {
        if (typeof log == "undefined") log = "processNode";

        var filler = Array(30 - log.length).join(" ");
        console.log('%c ===>' + filler + log + ':', 'background: #222; color: #f03322', currentNode);


        var temp = "";

        switch (currentNode.type) {
            case "genfrac" :
                temp = genfrac(currentNode);
                break;
            case "textord" :
            case "bin" :
            case "mathord" :
            case "open" :
            case "close" :
            case "rel" :
                temp = textord(currentNode);
                break;
            case "ordgroup" :
                temp = ordgroup(currentNode);
                break;
            case "supsub" :
                temp = supsub(currentNode);
                break;
            case "op" :
                temp = op(currentNode);
                break;
            case "sqrt" :
                temp = sqrt(currentNode);
                break;
            default :
                console.group("ERROR!! unbekannter Type:");
                console.log("currentNode.type", currentNode.type);
                console.log("currentNode", currentNode);
                console.groupEnd();
        }
        return temp;
    }

    function genfrac(node) {
        console.log("genfrac", node);
        var temp = "";
        var numer = node.value.numer;
        var denom = node.value.denom;

        if (numer.value.length > 1) {
            temp += "(";
            factory.mathjsTokens.push("(");
        }

        temp += processNode(numer, "genfrac->numer");

        if (numer.value.length > 1) {
            temp += ")";
            factory.mathjsTokens.push(")");
        }
        temp += "/";
        factory.mathjsTokens.push("/");

        if (denom.value.length > 1) {
            temp += "(";
            factory.mathjsTokens.push("(");
        }
        temp += processNode(denom, "genfrac->numer");
        if (denom.value.length > 1) {
            temp += ")";
            factory.mathjsTokens.push(")");
        }


        return temp;
    }

    function supsub(node) {
        var value = node.value;
        var temp = "";

        if(
            typeof value.base !== "undefined" &&
            typeof value.sub !== "undefined" &&
            typeof value.sup !== "undefined"
        ){
            if(typeof value.base.value != "undefined" && value.base.value.body != "undefined"){
                if(value.base.value.body == "\\sum"){
                    // function loopFromTo(iterator, from, to, func) {
                    temp += "loopFromTo(";

                    var iterator_from = "";
                    for(var i in value.sub.value){
                        iterator_from += value.sub.value[i].value;
                    }
                    var iterator_from_splitted = iterator_from.split("=");
                    temp += iterator_from_splitted[0]+",";
                    temp += iterator_from_splitted[1]+",";

                    var to = null;
                    if(value.sup.value.length > 1){
                        var iterator_to ="____"
                        for(var i in value.sup.value){
                            iterator_to += value.sup.value[i].value;
                        }
                        to = iterator_to;
                    }else{
                        to = value.sup.value;
                    }
                    temp += to+",";;
                }
                return temp;
            }
        }



        if (typeof value.base !== "undefined") {
            temp += processNode(value.base, "supsub base");
        }

        if (typeof value.sub !== "undefined") {
            temp += "_";
            factory.mathjsTokens.push("_");
            var subValues = value.sub.value;
            if (subValues.length > 1) {
                temp += "(";
                factory.mathjsTokens.push("(");
            }

            if (subValues.length == 1) {
                temp += processNode(value.sub, "sub2");
            } else {
                for (var i in subValues) {
                    temp += processNode(subValues[i], "sub");
                }
            }
            if (subValues.length > 1) {
                temp += ")";
                factory.mathjsTokens.push(")");
            }
        }
        if (typeof value.sup !== "undefined") {
            temp += "^";
            factory.mathjsTokens.push("^");
            var supValues = value.sup.value;
            if (supValues.length > 1) {
                temp += "(";
                factory.mathjsTokens.push("(");
            }

            if (supValues.length == 1) {
                temp += processNode(value.sup, "sup2");
            } else {
                for (var j in supValues) {
                    temp += processNode(supValues[j], "sup");
                }
            }
            if (supValues.length > 1) {
                temp += ")";
                factory.mathjsTokens.push(")");
            }
        }
        return temp;
    }


    function textord(node) {
        console.log("textord", node, "return " + node.value)
        factory.mathjsTokens.push(node.value);
        return node.value;
    }

    function ordgroup(node) {
        console.log("ordgroup", node)
        var temp = "";
        for (var i in node.value) {
            temp += processNode(node.value[i], "ordgroup")
        }
        return temp;
    }

    function op(node) {
        console.log("NODE = OP", node)
        factory.mathjsTokens.push(node.value.body);
        return node.value.body
    }

    function sqrt(node) {

        var temp = "sqrt";
        factory.mathjsTokens.push("sqrt");
        temp += "(";
        factory.mathjsTokens.push("(");

        if (typeof node.value.body !== "undefined") {
            temp += processNode(node.value.body);
        }

        if (node.value.index !== null) {
            alert("die x-te Wurzel ist nicht erlaubt :-(")
        }

        temp += ")";
        factory.mathjsTokens.push(")");

        return temp;
    }

}]);