app.service('cpu', ['opcodes', 'memory', function(opcodes,memory) {
    
    let cpu = {

        // Registers
        ax: 0,
        bx: 0,
        cx: 0,
        dx: 0,
        ip: 0,
        sp: 0,

        // Flags
        zero: false,
        carry: false,

        // ALU Temporal Registers
        t1: 0,
        t2: 0,

        on: function(){

            // Checking a register
            let checkReg = function(reg){ };
            // Setting a register
            let setReg = function(reg,value){ };
            // Getting a register
            let getReg = function(reg){ };
            // Checking if a value is no bigger than 16 bits
            let check = function(value){ };
            
            // Setting the instruction pointer IP
            let jump = function(addr){ };

            // Arithmetic Logic Unit (ALU)
            let alu = function(instr){
                switch(instr){

                    case opcodes.NONE:
                        return false;
                    case opcodes.MOV_REG_REG:
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
            let instr = memory.load(this.ip);
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

    }

    return cpu;

}])