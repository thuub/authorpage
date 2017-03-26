function LatexParser() {
    this.debugValue = true;
    this.mathjsString = "";
    this.tempMathjsString = "";
    this.mathjsTokens = [];
    this.tree = null;
    this.sumDeepness = 0;
    this.sumContent = [];
    this.inSum = 0;


    this.addToTempMathString = function (string) {
        this.tempMathjsString += string;
    };


    this.getTree = function (string) {
        this.checkDependencies();
        if (string.length == 0)throw new Error("getTree => parameter must be set")
        this.tree = katex.getTree(string);
        return this.tree;
    };

    this.parse = function (data) {
        if (typeof data == "undefined") {
            if (typeof this.tree == "undefined" || this.tree == null) {
                throw new Error("nothing to parse ")
            } else {
                data = this.tree;
            }
        }
        if (data.length == 0)throw new Error("Parse => parameter must be set")

        this.mathjsString2 = this.loopThroughNodes(data);
        this.mathjsString = OutputBuffer.getOutput();


        return this.mathjsString;

    };

    this.getMathjsString = function () {
        return this.mathjsString;
    };

    this.loopThroughNodes = function (tree) {
        var temp = "";
        for (var i in tree) {
            if (tree.hasOwnProperty(i)) {
                var rootNode = tree[i];
                this.debug(rootNode, "loopThrougNodes", "red", "black")


                if (this.inSum > 0) {
                    console.log("IN SUM " + this.inSum + " :", this.processNode(rootNode));
                } else {
                    // OutputBuffer.setInput(this.processNode(rootNode));
                    temp += this.processNode(rootNode);
                }

            } else {
                console.group("Error! Tree hat nicht ownProperty:");
                console.log("tree", tree);
                console.log("i: ", i);
                console.log("tree[i]", tree[i]);
                console.groupEnd();
            }
        }
        return temp;
    };

    this.processNode = function (currentNode) {
        this.debug(currentNode, "processNode()", "green", "black")

        var temp = "";

        switch (currentNode.type) {
            case "genfrac" :
                temp = this.genfrac(currentNode);
                break;
            case "textord" :
            case "bin" :
            case "mathord" :
            case "open" :
            case "close" :
            case "rel" :
                temp = this.textord(currentNode);
                break;
            case "ordgroup" :
                temp = this.ordgroup(currentNode);
                break;
            case "supsub" :
                temp = this.supsub(currentNode);
                break;
            case "op" :
                temp = this.op(currentNode);
                break;
            case "sqrt" :
                temp = this.sqrt(currentNode);
                break;
            default :
                console.group("ERROR!! unbekannter Type:");
                console.log("currentNode.type", currentNode.type);
                console.log("currentNode", currentNode);
                console.groupEnd();
        }
        return temp;
    };

    this.genfrac = function (node) {
        this.debug(node, "genfrac", "blue", "black")
        var temp = "";
        var numer = node.value.numer;
        var denom = node.value.denom;

        if (numer.value.length > 1) {
            temp += "(";
            OutputBuffer.setInput("(", "genfrac1A");
        }

        temp += this.processNode(numer, "genfrac->numer");

        if (numer.value.length > 1) {
            OutputBuffer.setInput(")", "genfrac1B");

            temp += ")";
        }
        OutputBuffer.setInput("/", "genfrac2");
        temp += "/";

        if (denom.value.length > 1) {
            OutputBuffer.setInput("(");
            temp += "(";
        }
        temp += this.processNode(denom, "genfrac->numer");
        if (denom.value.length > 1) {
            OutputBuffer.setInput(")", "genfrac3");
            temp += ")";
        }


        return temp;
    };

    this.getEscapeSequence = function () {

        if (this.sumDeepness == 1) {
            return Array(this.sumDeepness + 1).join("\\")
        }
        if (this.sumDeepness > 1) {
            return Array(this.sumDeepness + 2).join("\\")
        }
    };


    this.supsub = function (node) {

        var value = node.value;
        var temp = "";

        if (
            typeof value.base !== "undefined" &&
            typeof value.sub !== "undefined" &&
            typeof value.sup !== "undefined"
        ) {
            if (typeof value.base.value != "undefined" && value.base.value.body != "undefined") {
                if (value.base.value.body == "\\sum") {
                    this.sumDeepness++;
                    temp += "sumFromTo(";
                    OutputBuffer.setInput("sumFromTo", "sum");
                    OutputBuffer.setInput("(", "sum_start");
                    var iterator_from = '';
                    for (var i in value.sub.value) {
                        iterator_from += value.sub.value[i].value;
                    }
                    var iterator_from_splitted = iterator_from.split("=");
                    temp += this.getEscapeSequence() + '"' + iterator_from_splitted[0] + this.getEscapeSequence() + '",';

                    OutputBuffer.setInput(iterator_from_splitted[0], "sum_sub_iterator");
                    OutputBuffer.setInput(iterator_from_splitted[1], "sum_sub_from");

                    temp += iterator_from_splitted[1] + ",";

                    var to = "";
                    // if (value.sup.value.length > 1) {
                    to += "(";
                    OutputBuffer.setInput("(", "sum_sup_bracket_open");
                    // }


                    if (value.sup.value.length == 1) {
                        OutputBuffer.setInput(value.sup.value, "sum_sup");
                    } else {

                        for (var i in value.sup.value) {
                            to += value.sup.value[i].value;


                            console.log("value.sup ========>", value.sup)
                            console.log("value.sup.value ========>", value.sup.value)
                            console.log("value.sup.value[i] ========>", value.sup.value[i])


                            OutputBuffer.setInput(value.sup.value[i].value, "sum_sup");
                        }
                    }
                    // if (value.sup.value.length > 1) {
                    to += ")";
                    OutputBuffer.setInput(")", "sum_sup_bracket_close");
                    // }

                    temp += to + ",";
                }
                return temp;
            }
        }


        if (typeof value.base !== "undefined") {
            temp += this.processNode(value.base, "supsub base");
        }

        if (typeof value.sub !== "undefined") {
            temp += "_";
            OutputBuffer.setInput("_");
            var subValues = value.sub.value;
            if (subValues.length > 1) {
                temp += "(";
                OutputBuffer.setInput("(");
            }

            if (subValues.length == 1) {
                temp += this.processNode(value.sub, "sub2");
            } else {
                for (var i in subValues) {
                    temp += this.processNode(subValues[i], "sub");
                }
            }
            if (subValues.length > 1) {
                temp += ")";
                OutputBuffer.setInput(")");
            }
        }

        if (typeof value.sup !== "undefined") {
            temp += "^";
            OutputBuffer.setInput("^", "sup");

            var supValues = value.sup.value;
            if (supValues.length > 1) {
                temp += "(";
                OutputBuffer.setInput("(", "sup");

            }


            if (supValues.length == 1) {
                temp += this.processNode(value.sup, "sup2");
            } else {
                for (var j in supValues) {

                    console.log("supValues[j]", supValues[j])


                    temp += this.processNode(supValues[j], "sup");
                }
            }
            if (supValues.length > 1) {
                temp += ")";
                OutputBuffer.setInput(")", "sup");
            }
        }

        return temp;
    };


    this.textord = function (node) {
        this.debug(node, "textord", "yellow", "grey");
        OutputBuffer.setInput(node.value, "textord");
        return node.value;
    };

    this.ordgroup = function (node) {
        this.debug(node, "ordgroup", "yellow", "grey");
        var temp = "";
        for (var i in node.value) {
            temp += this.processNode(node.value[i], "ordgroup")
        }
        // OutputBuffer.setInput(temp,"ordgroup");
        return temp;
    };

    this.op = function (node) {
        this.debug(node, "OP", "yellow", "grey");
        OutputBuffer.setInput(node.value.body, "op");
        return node.value.body
    };

    this.debug = function (log, identifier, c, bg) {
        if (!this.debugValue) return;
        var format = "";
        switch (c) {
            case "red" :
                format += ' color: #f44336;';
                break;
            case "green" :
                format += ' color: #4caf50;';
                break;
            case "yellow" :
                format += ' color: #ffeb3b;';
                break;
            case "blue" :
                format += ' color: #2196f3;';
                break;
            case "purple" :
                format += ' color: #673ab7;';
                break;
            default:
                format += "color'#fafafa;"
        }

        switch (bg) {
            case "black" :
                format += ' background: #222;';
                break;
            case "grey" :
                format += ' background: #424242;';
                break;
            case "white" :
                format += ' background: #fff;';
                break;
            default:
                format += ' background: #f0f0f0;';

        }

        identifier = identifier ? identifier : "";
        var filler = Array(20 - identifier.length).join(" ");
        if (this.debugValue) {
            console.log("%c" + filler + identifier + ": ", format, log)
        }
    };


    this.checkDependencies = function () {
        if (typeof katex == "undefined") {
            throw new Error("katex is not defined! please install katex")
        }
        if (typeof math == "undefined") {
            throw new Error("katex is not defined! please install katex")
        }
    };


    this.reset = function () {
        this.mathjsTokens = [];
        this.mathjsString = "";
        this.tree = null;
        this.sumDeepness = 0;
    }

}




