app.service('parser', ['opcodes', function(opcodes){

    return {

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

            // Temporals
            let t1,t2,opCode;

            // Array of lines
            let lines = input.split('\n');

            /**
             * Parsing a string value in a number.
             * @param {string} input 
             * @returns {number} input
             */
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

            /**
             * Parsing a register as char to number (A - D) --> (0 - 3)
             * @param {char} input 
             * @returns {number} input
             */
            let parseRegister = function(input) {
                input = input.toUpperCase();

                if (input === 'A') {
                    return 0;
                } else if (input === 'B') {
                    return 1;
                } else if (input === 'C') {
                    return 2;
                } else if (input === 'D') {
                    return 3;
                } else {
                    return undefined;
                }
            };

            /**
             * Returns a label if the format corresponds.
             * @param {string} input 
             * @returns {string} input
             */
            let parseLabel = function(input) {
                return regexLabel.exec(input) ? input : undefined;
            };

            /**
             * Adds a label.
             * @param {string} input 
             */
            let addLabel = function(input) {
                //labels[input] = code.length;
                labels.push({name: input, address: code.length});
            };

            /**
             * Returns a structure that defines the addressing type: {type: REG/NUMBER, value: INPUT}
             * @param {number} input 
             * @param {string} typeReg 
             * @param {string} typeNumber 
             * @returns {{string,number}} 
             */
            let parseRegOrNumber = function(input, typeReg, typeNumber) {

                let register = parseRegister(input);
                let label = parseLabel(input);

                if(register !== undefined) return {type: typeReg, value: register};
                else if(label !== undefined) return {type: typeNumber, value: label};

                let value = parseNumber(input);
                if (isNaN(value)) {
                    throw "Not a " + typeNumber + ": " + value;
                }
                
                return {type: typeNumber, value: value};
               
            };

            /**
             * Returns {type: REGISTER/REGADDRESS/ADDRESS/NUMBER, value: INPUT}
             * @param {string} input 
             * @returns {{string,number}}
             */
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

            // Main()
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

                        switch(instr){

                            case 'MOV':
                                t1 = getValue(match[op1_group]);
                                t2 = getValue(match[op2_group]);

                                if (t1.type === "register" && t2.type === "register")
                                    opCode = opcodes.MOV_REG_REG;
                                else if (t1.type === "register" && t2.type === "address")
                                    opCode = opcodes.MOV_REG_ADDRESS;
                                else if (t1.type === "register" && t2.type === "regaddress")
                                    opCode = opcodes.MOV_REG_REGADDRESS;
                                else if (t1.type === "address" && t2.type === "register")
                                    opCode = opcodes.MOV_ADDRESS_REG;
                                else if (t1.type === "regaddress" && t2.type === "register")
                                    opCode = opcodes.MOV_REGADRESS_REG;
                                else if (t1.type === "register" && t2.type === "number")
                                    opCode = opcodes.MOV_REG_NUMBER;
                                else if (t1.type === "address" && t2.type === "number")
                                    opCode = opcodes.MOV_ADDRESS_NUMBER;
                                else if (t1.type === "regaddress" && t2.type === "number")
                                    opCode = opcodes.MOV_REGADRESS_NUMBER;
                                else
                                    throw "MOV does not support this operands";

                                code.push(opCode, t1.value, t2.value);
                                break;
                            case 'ADD':
                                t1 = getValue(match[op1_group]);
                                t2 = getValue(match[op2_group]);

                                if (t1.type === "register" && t2.type === "register")
                                    opCode = opcodes.ADD_REG_REG;
                                else if (t1.type === "register" && t2.type === "regaddress")
                                    opCode = opcodes.ADD_REG_REGADDRESS;
                                else if (t1.type === "register" && t2.type === "address")
                                    opCode = opcodes.ADD_REG_ADDRESS;
                                else if (t1.type === "register" && t2.type === "number")
                                    opCode = opcodes.ADD_REG_NUMBER;
                                else
                                    throw "ADD does not support this operands";

                                code.push(opCode, t1.value, t2.value);
                                break;
                            case 'SUB':
                                t1 = getValue(match[op1_group]);
                                t2 = getValue(match[op2_group]);

                                if (t1.type === "register" && t2.type === "register")
                                    opCode = opcodes.SUB_REG_REG;
                                else if (t1.type === "register" && t2.type === "regaddress")
                                    opCode = opcodes.SUB_REG_REGADDRESS;
                                else if (t1.type === "register" && t2.type === "address")
                                    opCode = opcodes.SUB_REG_ADDRESS;
                                else if (t1.type === "register" && t2.type === "number")
                                    opCode = opcodes.SUB_REG_NUMBER;
                                else
                                    throw "SUB does not support this operands";

                                code.push(opCode, t1.value, t2.value);
                                break;
                            case 'INC':
                                t1 = getValue(match[op1_group]);
                                if(match[op2_group]) throw "This instruction supports only one argument";

                                if (t1.type === "register")
                                    opCode = opcodes.INC_REG;
                                else
                                    throw "INC does not support this operand";

                                code.push(opCode, t1.value);
                                break;
                            case 'DEC':
                                t1 = getValue(match[op1_group]);
                                if(match[op2_group]) throw "This instruction supports only one argument";

                                if (t1.type === "register")
                                    opCode = opcodes.DEC_REG;
                                else
                                    throw "DEC does not support this operand";

                                code.push(opCode, t1.value);
                                break;
                            case 'CMP':
                                t1 = getValue(match[op1_group]);
                                t2 = getValue(match[op2_group]);

                                if (t1.type === "register" && t2.type === "register")
                                    opCode = opcodes.CMP_REG_REG;
                                else if (t1.type === "register" && t2.type === "regaddress")
                                    opCode = opcodes.CMP_REG_REGADDRESS;
                                else if (t1.type === "register" && t2.type === "address")
                                    opCode = opcodes.CMP_REG_ADDRESS;
                                else if (t1.type === "register" && t2.type === "number")
                                    opCode = opcodes.CMP_REG_NUMBER;
                                else
                                    throw "CMP does not support this operands";

                                code.push(opCode, t1.value, t2.value);
                                break;
                            case 'JMP':
                                t1 = getValue(match[op1_group]);
                                if(match[op2_group]) throw "This instruction supports only one argument";

                                if (t1.type === "register")
                                    opCode = opcodes.JMP_REGADDRESS;
                                else if (t1.type === "number")
                                    opCode = opcodes.JMP_ADDRESS;
                                else
                                    throw "JMP does not support this operands";

                                code.push(opCode, t1.value);
                                break;
                            case 'MUL':
                                t1 = getValue(match[op1_group]);
                                if(match[op2_group]) throw "This instruction supports only one argument";

                                if (t1.type === "register")
                                    opCode = opcodes.MUL_REG;
                                else if (t1.type === "regaddress")
                                    opCode = opcodes.MUL_REGADDRESS;
                                else if (t1.type === "address")
                                    opCode = opcodes.MUL_ADDRESS;
                                else if (t1.type === "number")
                                    opCode = opcodes.MUL_NUMBER;
                                else
                                    throw "MUL does not support this operand";

                                code.push(opCode, t1.value);
                                break;
                            case 'DIV':
                                t1 = getValue(match[op1_group]);
                                if(match[op2_group]) throw "This instruction supports only one argument";

                                if (t1.type === "register")
                                    opCode = opcodes.DIV_REG;
                                else if (t1.type === "regaddress")
                                    opCode = opcodes.DIV_REGADDRESS;
                                else if (t1.type === "address")
                                    opCode = opcodes.DIV_ADDRESS;
                                else if (t1.type === "number")
                                    opCode = opcodes.DIV_NUMBER;
                                else
                                    throw "DIV does not support this operand";

                                code.push(opCode, t1.value);
                                break;
                            case 'AND':
                                t1 = getValue(match[op1_group]);
                                t2 = getValue(match[op2_group]);

                                if (t1.type === "register" && t2.type === "register")
                                    opCode = opcodes.AND_REG_REG;
                                else if (t1.type === "register" && t2.type === "regaddress")
                                    opCode = opcodes.AND_REG_REGADDRESS;
                                else if (t1.type === "register" && t2.type === "address")
                                    opCode = opcodes.AND_REG_ADDRESS;
                                else if (t1.type === "register" && t2.type === "number")
                                    opCode = opcodes.AND_REG_NUMBER;
                                else
                                    throw "AND does not support this operands";

                                code.push(opCode, t1.value, t2.value);
                                break;
                            case 'OR':
                                t1 = getValue(match[op1_group]);
                                t2 = getValue(match[op2_group]);

                                if (t1.type === "register" && t2.type === "register")
                                    opCode = opcodes.OR_REG_REG;
                                else if (t1.type === "register" && t2.type === "regaddress")
                                    opCode = opcodes.OR_REG_REGADDRESS;
                                else if (t1.type === "register" && t2.type === "address")
                                    opCode = opcodes.OR_REG_ADDRESS;
                                else if (t1.type === "register" && t2.type === "number")
                                    opCode = opcodes.OR_REG_NUMBER;
                                else
                                    throw "OR does not support this operands";

                                code.push(opCode, t1.value, t2.value);
                                break;
                            case 'NOT':
                                t1 = getValue(match[op1_group]);
                                if(match[op2_group]) throw "This instruction supports only one argument";

                                if (t1.type === "register")
                                    opCode = opcodes.NOT_REG;
                                else
                                    throw "NOT does not support this operand";
                                
                                code.push(opCode, t1.value);
                                break;
                            case 'HLT':
                                if(match[op1_group]) throw "This instruction supports no arguments";
                                if(match[op2_group]) throw "This instruction supports no arguments";
                                opCode = opcodes.NONE;
                                code.push(opCode);
                                break;
                            case 'PUSH':
                                t1 = getValue(match[op1_group]);
                                if(match[op2_group]) throw "This instruction supports only one argument";

                                if (t1.type === "register")
                                    opCode = opcodes.PUSH_REG;
                                else if (t1.type === "regaddress")
                                    opCode = opcodes.PUSH_REGADDRESS;
                                else if (t1.type === "address")
                                    opCode = opcodes.PUSH_ADDRESS;
                                else if (t1.type === "number")
                                    opCode = opcodes.PUSH_NUMBER;
                                else
                                    throw "PUSH does not support this operand";

                                code.push(opCode, t1.value);
                                break;
                            case 'POP':
                                t1 = getValue(match[op1_group]);
                                if(match[op2_group]) throw "This instruction supports only one argument";
    
                                if (t1.type === "register")
                                    opCode = opcodes.POP_REG;
                                else
                                throw "POP does not support this operand";
                                
                                code.push(opCode, t1.value);
                                break;
                            

                            default: throw("Invalid instruction " + match[instr_group]);

                        }

                    }
                }
                // Check for Syntax Error
                else{
                    var line = lines[i].trim();
                    if (line !== "" && line.slice(0, 1) !== ";") {
                        throw "Syntax error";
                    }
                }

            }
            // Replace labels
            for(let i=0; i<code.length; i++){
                if(!angular.isNumber(code[i])){
                    let error = true;
                    for(let j=0; j<labels.length; j++){
                        if(code[i]==labels[j].name){
                            code[i] = labels[j].address;
                            error = false;
                        }
                    }
                    if(error) throw "Undefined label";
                }
            }
            
            return {code: code, mapping: mapping, labels: labels};
        }


    };
}]);