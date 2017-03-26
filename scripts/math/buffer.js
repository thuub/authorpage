/**
 * Created by Han on 19.11.2016.
 */
function OutputBuffer() {
    this.debugValue = true;
    this.input = "";
    this.stack = {};
    this.output = "";


    this.sumDeepness = 0;
    this.bracketDeepness = 0;

    this.setInput = function (string, origin) {
        this.input = string;
        this.origin = origin;

        if (this.sumDeepness > 0) {



            if (string == "(") this.bracketDeepness++;
            if (string == ")") this.bracketDeepness--;

            if (this.bracketDeepness == 0 && this.sumDeepness > 0) {
                this.pushToStack(")", this.sumDeepness);
                this.pushToStack("<--", this.sumDeepness);

                this.popStackToOutput();

            } else {
                console.info("pushToStack ========>",string)

                if (string.indexOf("sumFromTo") < 0) {
                    this.pushToStack(string, this.sumDeepness);
                }


                if (origin == "sum_sub_iterator" || origin == "sum_sub_from"|| origin == "sum_sup_bracket_close") this.pushToStack(",", this.sumDeepness);

            }

        }

        if (string.indexOf("sumFromTo") >= 0) {
            this.sumDeepness++;
            this.pushToStack(string, this.sumDeepness);
            // this.pushToStack("--->", this.sumDeepness);
        }



        if (this.sumDeepness == 0 && this.bracketDeepness == 0) {
            this.setOutput(string);
        }
        this.debug("setInput");
        this.input = "";
    };


    this.reset = function () {
        this.input = "";
        this.stack = {};
        this.output = "";

        this.sumDeepness = 0;
        this.bracketDeepness = 0;
    };

    this.pushToStack = function (elem, level) {
        if (typeof this.stack[level] == "undefined") {
            this.stack[level] = [];
        }
            this.stack[level].push(elem);


    };
    this.popStackToOutput = function () {
        this.output += this.stack[this.sumDeepness].join("");
        this.stack[this.sumDeepness] = [];
        this.sumDeepness--;
    };

    this.setOutput = function (string) {
        this.output += string;
    };


    this.getOutput = function () {
        if (this.sumDeepness > 0) {
            var count = 1;

            while(this.sumDeepness > 0){

                console.log("#####################")
                console.log("#####################")
                console.log("########"+count+"#############")
                console.log("#####################")
                console.log("#####################")




                // this.output += this.stack[this.sumDeepness].join("");
                this.output += this.stack[count].join("");
                // this.stack[this.sumDeepness] = [];
                this.stack[count] = [];
                this.output += ")";
                this.sumDeepness--;
                count++;
            }
            // this.output += ')'.repeat(this.sumDeepness);
        }
        this.debug("☕ Output ☕");
        return this.output;
    };


    this.debug = function (place) {
        if (this.debugValue) {

            var o = this.origin ? " → " + this.origin : "";

            var inputLength = "input";
            var stackLength = "stack";
            var stackLength_0 = "stack[0]";
            var stackLength_1 = "stack[1]";
            var stackLength_2 = "stack[2]";
            var stackLength_3 = "stack[3]";
            var outputLength = "output";
            var inSumDeepness = "sumDeepness";
            var inbracketDeepness = "bracketDeepness";


            var line = Array(30 - outputLength.length).join("─");
            console.log("%c" + "┌" + line + place + o + line, "background: #ccc; color: #222");

            var fillerIn = Array(20 - inputLength.length).join(" ");
            console.log("%c" + "|" + fillerIn + inputLength + ": ", "background: #ccc; color: #222", this.input);

            var inSum = Array(20 - inSumDeepness.length).join(" ");
            console.log("%c" + "|" + inSum + inSumDeepness + ": ", "background: #ccc; color: #222", this.sumDeepness);

            var inBrack = Array(20 - inbracketDeepness.length).join(" ");
            console.log("%c" + "|" + inBrack + inbracketDeepness + ": ", "background: #ccc; color: #222", this.bracketDeepness);

            var fillerStack = Array(20 - stackLength.length).join(" ");
            console.log("%c" + "|" + fillerStack + stackLength + ": ", "background: #ccc; color: #222", this.stack);


            console.table(this.stack);



            if (typeof this.stack[0] !== "undefined") {
                var fillerStack_0 = Array(20 - stackLength_0.length).join(" ");
                console.log("%c" + "|" + fillerStack_0 + stackLength_0 + ": ", "background: #ccc; color: #222", this.stack[0].join(""));
            }
            if (typeof this.stack[1] !== "undefined") {
                var fillerStack_1 = Array(20 - stackLength_1.length).join(" ");
                console.log("%c" + "|" + fillerStack_1 + stackLength_1 + ": ", "background: #ccc; color: #222", this.stack[1].join(""));
            }

            if (typeof this.stack[2] !== "undefined") {
                var fillerStack_2 = Array(20 - stackLength_2.length).join(" ");
                console.log("%c" + "|" + fillerStack_2 + stackLength_2 + ": ", "background: #ccc; color: #222", this.stack[2].join(""));
            }

            if (typeof this.stack[3] !== "undefined") {
                var fillerStack_3 = Array(20 - stackLength_3.length).join(" ");
                console.log("%c" + "|" + fillerStack_3 + stackLength_3 + ": ", "background: #ccc; color: #222", this.stack[3].join(""));
            }

            var fillerOut = Array(20 - outputLength.length).join(" ");
            console.log("%c" + "|" + fillerOut + outputLength + ": ", "background: #ccc; color: #222", this.output);
            console.log("%c" + "└" + line, "background: #ccc; color: #222");
        }

    }
}