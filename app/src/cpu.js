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

        // ON/OFF
        running: true,
        valid: true,

        codes: opcodes,

        on: function(){

            let self = this;

            /**
             * Checks and returns 0-5 for ax-sp.
             * @param {number} reg 
             * @returns {number} reg
             */
            let checkReg = function(reg){
                if(self.regid.includes(reg)) return reg;
                else throw "Invalid Register";
            };

            /**
             * Sets a register (0-5) with a given value.
             * @param {number} reg 
             * @param {number} value 
             */
            let setReg = function(reg,value){
                if(self.regid.includes(reg)){
                    switch(reg){
                        case(0):    self.ax = value;
                                    break;
                        case(1):    self.bx = value;
                                    break;
                        case(2):    self.cx = value;
                                    break;
                        case(3):    self.dx = value;
                                    break;
                        case(4):    self.ip = value;
                                    break;
                        case(5):    self.sp = value;
                                    break;
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
                if(self.regid.includes(reg)){
                    switch(reg){
                        case(0):    return self.ax;
                        case(1):    return self.bx;
                        case(2):    return self.cx;
                        case(3):    return self.dx;
                        case(4):    return self.ip;
                        case(5):    return self.sp;
                    }
                }
                else throw "Invalid Register";
            };

            /**
             * Checking if a value triggers the flags
             * @param {number} value 
             */
            let check = function(value){
                self.zero = false;;
                self.carry = false;

                if (value >= 256) {
                    self.carry = true;
                    value = value % 256;
                } else if (value === 0) {
                    self.zero = true;
                } else if (value < 0) {
                    self.carry = true;
                    value = 256 - (-value) % 256;
                }

                return value;
            };
            
            /**
             * Jumps to a given address and updates the ip (Intruction Pointer) register
             * @param {number} addr 
             */
            let jump = function(addr){ 
                if(addr > 0 && addr < memory.data.length){
                    self.ip = addr;
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
                    case opcodes.MOV_REG_ADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,memory.read(t2));
                        self.ip++;
                        break;
                    case opcodes.MOV_REG_REGADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,memory.read(getReg(t2)));
                        self.ip++;
                        break;
                    case opcodes.MOV_REG_NUMBER:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,t2);
                        self.ip++;
                        break;
                    case opcodes.MOV_ADDRESS_REG:
                        t1 = memory.read(++self.ip);
                        t2 = checkReg(memory.read(++self.ip));
                        memory.write(t1, getReg(t2));
                        self.ip++;
                        break;
                    case opcodes.MOV_ADDRESS_NUMBER:
                        t1 = memory.read(++self.ip);
                        t2 = memory.read(++self.ip);
                        memory.write(t1, t2);
                        self.ip++;
                        break;
                    case opcodes.MOV_REGADRESS_REG:
                        t1 = memory.read(++self.ip);
                        t2 = checkReg(memory.read(++self.ip));
                        memory.write(memory.read(getReg(t2)),getReg(t2));
                        self.ip++;
                        break;
                    case opcodes.MOV_REGADRESS_NUMBER:
                        t1 = memory.read(++self.ip);
                        t2 = memory.read(++self.ip);
                        memory.write(memory.read(getReg(t2)),t2);
                        self.ip++;
                        break;

                    ///////////////////////////////////////

                    case opcodes.ADD_REG_NUMBER:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1)+t2));
                        self.ip++;
                        break;
                    case opcodes.ADD_REG_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = checkReg(memory.read(++self.ip));
                        setReg(t1,check(getReg(t1)+getReg(t2)));
                        self.ip++;
                        break;
                    case opcodes.ADD_REG_REGADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1)+memory.read(getReg(t2))));
                        self.ip++;
                        break;
                    case opcodes.ADD_REG_ADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1)+memory.read(t2)));
                        self.ip++;
                        break;

                    ///////////////////////////////////////

                    case opcodes.SUB_REG_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = checkReg(memory.read(++self.ip));
                        setReg(t1,check(getReg(t1)-getReg(t2)));
                        self.ip++;
                        break;
                    case opcodes.SUB_REG_REGADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1)-memory.read(getReg(t2))));
                        self.ip++;
                        break;
                    case opcodes.SUB_REG_ADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1)-memory.read(t2)));
                        self.ip++;
                        break;
                    case opcodes.SUB_REG_NUMBER:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1)-t2));
                        self.ip++;
                        break;

                    ///////////////////////////////////////

                    case opcodes.INC_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        setReg(t1, check(getReg(t1)+1));
                        self.ip++;
                        break;
                    case opcodes.DEC_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        setReg(t1, check(getReg(t1)-1));
                        self.ip++;
                        break;

                    ///////////////////////////////////////

                    case opcodes.CMP_REG_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = checkReg(memory.read(++self.ip));
                        check(getReg(t1) - getReg(t2));
                        self.ip++;
                        break;
                    case opcodes.CMP_REG_REGADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        check(getReg(t1) - memory.read(getReg(t2)));
                        self.ip++;
                        break;
                    case opcodes.CMP_REG_ADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        check(getReg(t1) - memory.read(t2));
                        self.ip++;
                        break;
                    case opcodes.CMP_REG_NUMBER:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        check(getReg(t1) - t2);
                        self.ip++;
                        break;

                    ///////////////////////////////////////

                    case opcodes.JMP_REGADDRESS:
                        t2 = memory.read(++self.ip);
                        jump(getReg(t2));
                        break;
                    case opcodes.JMP_ADDRESS:
                        t2 = memory.read(++self.ip);
                        jump(t2);
                        break;

                    ///////////////////////////////////////

                    case opcodes.MUL_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        setReg(0,check(getReg(0)*getReg(t1)));
                        self.ip++;
                        break;
                    case opcodes.MUL_REGADDRESS:
                        t1 = memory.read(++self.ip);
                        setReg(0,check(getReg(0)*memory.read(getReg(t2))));
                        self.ip++;
                        break;
                    case opcodes.MUL_ADDRESS:
                        t1 = memory.read(++self.ip);
                        setReg(0,check(getReg(0)*memory.read(t1)));
                        self.ip++;
                        break;
                    case opcodes.MUL_NUMBER:
                        t1 = memory.read(++self.ip);
                        setReg(0,check(getReg(0)*t1));
                        self.ip++;
                        break;

                    ///////////////////////////////////////

                    case opcodes.DIV_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        setReg(0,check(getReg(0)/getReg(t1)));
                        self.ip++;
                        break;
                    case opcodes.DIV_REGADDRESS:
                        t1 = memory.read(++self.ip);
                        setReg(0,check(getReg(0)/memory.read(getReg(t2))));
                        self.ip++;
                        break;
                    case opcodes.DIV_ADDRESS:
                        t1 = memory.read(++self.ip);
                        setReg(0,check(getReg(0)/memory.read(t1)));
                        self.ip++;
                        break;
                    case opcodes.DIV_NUMBER:
                        t1 = memory.read(++self.ip);
                        setReg(0,check(getReg(0)/t1));
                        self.ip++;
                        break;

                    ///////////////////////////////////////

                    case opcodes.AND_REG_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = checkReg(memory.read(++self.ip));
                        setReg(t1,check(getReg(t1) & getReg(t2)));
                        self.ip++;
                        break;
                    case opcodes.AND_REG_REGADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1) & memory.read(getReg(t2))));
                        self.ip++;
                        break;
                    case opcodes.AND_REG_ADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1) & memory.read(t2)));
                        self.ip++;
                        break;
                    case opcodes.AND_REG_NUMBER:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1) & t2));
                        self.ip++;
                        break;

                    ///////////////////////////////////////

                    case opcodes.OR_REG_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = checkReg(memory.read(++self.ip));
                        setReg(t1,check(getReg(t1) | getReg(t2)));
                        self.ip++;
                        break;
                    case opcodes.OR_REG_REGADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1) | memory.read(getReg(t2))));
                        self.ip++;
                        break;
                    case opcodes.OR_REG_ADDRESS:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1) | memory.read(t2)));
                        self.ip++;
                        break;
                    case opcodes.OR_REG_NUMBER:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1) | t2));
                        self.ip++;
                        break;

                    //////////////////////////////////////

                    // ??????
                    case opcodes.NOT_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        setReg(t1, ~getReg(t1));
                        break;

                    default:
                        self.valid = false;
                        break;

                }
                return true;
            };

            // Main

            let instr = memory.read(self.ip);

            if(instr != 0){
                alu(instr);
                self.running = true;
            }
            else self.running = false;
            

        },

        reset: function(){ 
            let self = this;
            self.ax = 0;
            self.bx = 1;
            self.cx = 0;
            self.dx = 0;
            self.ip = 0;
            self.sp = 0;
            self.zero = false;
            self.carry = false;
            self.running = true;
            self.valid = true;
            memory.reset();
        }

    };

    
    return cpu;

}])