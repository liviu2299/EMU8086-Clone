let cpu = {

    // Registers
    ax: 0,
    bx: 0,
    cx: 0,
    dx: 0,
    ip: 0,
    sp: 0,
    regid: [0, 1, 2, 3, 4, 5],

    // Flags
    zero: false,
    carry: false,

    // ALU Temporal Registers
    t1: 0,
    t2: 0,

    on: function(){

        /**
         * Checks and returns 0-5 for ax-sp.
         * @param {number} reg 
         * @returns {number} reg
         */
        let checkReg = function(reg){
            if(regid.includes(reg)) return reg;
            else throw "Invalid Register";
        };

        /**
         * Sets a register (0-5) with a given value.
         * @param {number} reg 
         * @param {number} value 
         */
        let setReg = function(reg,value){
            if(regid.includes(reg)){
                switch(reg){
                    case(0):    ax = value;
                    case(1):    bx = value;
                    case(2):    cx = value;
                    case(3):    dx = value;
                    case(4):    ip = value;
                    case(5):    sp = value;
                }
            }
            else throw "Invalid Register";
        };

        /**
         * Returns the value of a given register (0-5).
         * @param {number} reg 
         * @returns {number} value
         */
        let getReg = function(reg){
            if(regid.includes(reg)){
                switch(reg){
                    case(0):    return ax;
                    case(1):    return bx;
                    case(2):    return cx;
                    case(3):    return dx;
                    case(4):    return ip;
                    case(5):    return sp;
                }
            }
            else throw "Invalid Register";
        };

        // Checking if a value is no bigger than 16 bits ?????????????????
        let check = function(value){ };
        
        /**
         * Jumps to a given address and updates the ip (Intruction Pointer) register
         * @param {number} addr 
         */
        let jump = function(addr){ 
            if(addr > 0 && addr < memory.data.length){
                this.ip = addr;
            }
            else throw "Address out of memory";
        };

        // Arithmetic Logic Unit (ALU)
        let alu = function(instr){

            switch(instr){

                case opcodes.NONE:
                    return false;
                case opcodes.MOV_REG_REG:
                    t1 = checkReg(memory.read(++self.ip));
                    t2 = checkReg(memory.read(++self.ip));
                    setReg(t1,getReg(t2));
                    self.ip++;
                    break;
                case opcodes.MOV_ADDRESS_REG:
                case opcodes.MOV_REG_ADDRESS:
                case opcodes.MOV_REG_NUMBER:
                case opcodes.MOV_ADDRESS_NUMBER:
                case opcodes.ADD_REG_REG:
                case opcodes.ADD_REG_ADDRESS:
                case opcodes.ADD_REG_NUMBER:
                case opcodes.SUB_REG_REG:
                case opcodes.SUB_REG_ADDRESS:
                case opcodes.SUB_REG_NUMBER:
                case opcodes.INC_REG:
                case opcodes.DEC_REG:

                // ...

            }
            return true;
        };

        // Main
        let instr = memory.read(this.ip);
        alu(instr);

    },

    reset: function(){ 
        this.ax = 0;
        this.bx = 0;
        this.cx = 0;
        this.dx = 0;
        this.ip = 0;
        this.sp = 0;
        this.zero = false;
        this.carry = false;
        memory.reset();
    }

};

let memory = {
    
    data: Array(256).fill(0),
    index: -1,
    
    /**
     * Returns the data in the array corresponding the address
     * @param {number} address 
     * @returns {number} data
     */
    read: function(addr){
        if(addr < 0 || addr > this.data.length) throw "Memory access violation";
        else this.index = addr;

        return this.data[addr];
    },

    /**
     * Writes data at a given address
     * @param {number} address 
     * @param {number} data
     */
    write: function(addr, value){
        if(addr < 0 || addr > this.data.length) throw "Memory access violation";
        else{
            this.index = addr;
            this.data[addr] = value;
        }
    },

    /**
     * Resets memory
     */
    reset: function(){
        this.data.fill(0);
        this.index = 0;
    }

};

let opcodes = {
        
    NONE: 0,
    MOV_REG_REG: 1,
    MOV_ADDRESS_REG: 2,
    MOV_REG_ADDRESS: 3,
    MOV_REG_NUMBER: 4,
    MOV_ADDRESS_NUMBER: 5,
    ADD_REG_REG: 6,
    ADD_REG_ADDRESS: 7,
    ADD_REG_NUMBER: 8,
    SUB_REG_REG: 10,
    SUB_REG_ADDRESS: 11,
    SUB_REG_NUMBER: 12,
    INC_REG: 13,
    DEC_REG: 14

    // ...
};

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
            labels[input] = code.length;
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
                                opCode = 1;
                            else
                                throw "MOV does not support this operands";

                            code.push(opCode, t1.value, t2.value);
                            break;
                        case 'ADD':

                        // ....

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
        
        return {code: code, mapping: mapping, labels: labels};
    }


};

// TEST

let text = "MOV A, B";

let memorie = memory;
let assembler = parser;

let result = assembler.on(text);
console.log(result);

