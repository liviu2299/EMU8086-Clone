app.service('parser', ['opcodes', function(opcodes){

    let parser = {

        on: function(input){

            // Matches: "label: INSTRUCTION (["')OPERAND1(]"'), (["')OPERAND2(]"')
            // GROUPS:      1       2               3                    7
            let regex = /^[\t ]*(?:([.A-Za-z]\w*)[:])?(?:[\t ]*([A-Za-z]{2,4})(?:[\t ]+(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[.A-Za-z0-9]\w*)(?:[\t ]*[,][\t ]*(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[.A-Za-z0-9]\w*))?)?)?/;
            
            // Regex Group Indexes
            let label_group = 1;
            let instr_group = 2;
            let op1_group = 3;
            let op2_group = 7;

            // Num
            let regexNum = /^[-+]?[0-9]+$/;
            // Label
            let regexLabel = /^[.A-Za-z]\w*$/;
            
            // Code
            let code = [];
            // Mapping
            let mapping = [];
            // Labels
            let labels = [];

            // Array of lines
            let lines = input.split('\n');

            // Number parser: string -> int
            let parseNumber = function(input){
                if (input.slice(0, 2) === "0x") {
                    return parseInt(input.slice(2), 16);
                } else if (input.slice(0, 2) === "0o") {
                    return parseInt(input.slice(2), 8);
                } else if (input.slice(input.length - 1) === "b") {
                    return parseInt(input.slice(0, input.length - 1), 2);
                } else if (input.slice(input.length - 1) === "d") {
                    return parseInt(input.slice(0, input.length - 1), 10);
                } else if (regexNum.exec(input)) {
                    return parseInt(input, 10);
                } else {
                    throw "Invalid number format";
                }
            };

            // Register parser: string -> char
            let parseRegister = function(input) {
                input = input.toUpperCase();

                if (input === 'A') {
                    return 'a';
                } else if (input === 'B') {
                    return 'b';
                } else if (input === 'C') {
                    return 'c';
                } else if (input === 'D') {
                    return 'd';
                } else {
                    return undefined;
                }
            };

            // Label parser: string -> string
            let parseLabel = function(input) {
                return regexLabel.exec(input) ? input : undefined;
            };

            // Add label
            let addLabel = function(input) {
                labels[input] = code.length;
            };

            // Defining the addressing type
            let parseRegOrNumber = function(input, typeReg, typeNumber) {

                let register = parseRegister(input);
                let label = parseLabel(input);

                if(register !== undefined) return {type: typeReg, value: register};
                else if(label !== undefined) return {type: typeNumber, value: lable};

                let value = parseNumber(input);
                if (isNaN(value)) {
                    throw "Not a " + typeNumber + ": " + value;
                }
                
                return {type: typeNumber, value: value};
               
            };

            // input -> {type: register/regaddress/address/number, value: x}
            let getValue = function(input) {
                switch (input.slice(0, 1)) {
                    case '[': // [int] or [REG]
                        var address = input.slice(1, input.length - 1);

                        return parseRegOrNumber(address, "regaddress", "address");
                    case "'": // 'C'
                        var character = input.slice(1, input.length - 1);
                        if (character.length > 1) throw "Only one character is allowed. Use String instead";

                        return {type: "number", value: character.charCodeAt(0)};
                    default: // REGISTER, NUMBER or LABEL
                        return parseRegOrNumber(input, "register", "number");
                }
            }

            // Main
            // Iterative checking of each line
            for(let i = 0; i < lines.length; i++){

                let match = regex.exec(lines[i]);

                // If LABEL or INSTR exist
                if(match[label_group] !== undefined || match[instr_group] !== undefined) {

                    // LABEL
                    if(match[label_group] !== undefined) addLabel(match[label_group]);
                    // INSTR
                    if(match[instr_group] !== undefined){

                        let instr = match[instr_group].toUpperCase();
                        let p1,p2, opCode;

                        switch(instr){

                            case 'MOV':
                            case 'ADD':

                            // ....

                            default: throw("Invalid instruction " + match[instr_group]);

                        }

                    }
                }
                else{
                    var line = lines[i].trim();
                    if (line !== "" && line.slice(0, 1) !== ";") {
                        throw "Syntax error";
                    }
                }

            }
            
            return {code: code, mapping: mapping, labels: labels};
        }


    }
}]);