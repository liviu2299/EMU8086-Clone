app.service('cpu', ['opcodes', 'memory', function(opcodes,memory) {
    
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
            this.ip = 1;
            this.sp = 0;
            this.zero = false;
            this.carry = false;
            memory.reset();
        }

    };

    
    return cpu;

}])