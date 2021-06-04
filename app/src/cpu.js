app.service('cpu', ['opcodes', 'memory', function(opcodes,memory) {
    
    let cpu = {

        // Registers
        ax: 0,
        bx: 0,
        cx: 0,
        dx: 0,
        ip: 0,
        regid: [0, 1, 2, 3, 4],

        // Flags
        sign: false,
        zero: false,
        carry: false,

        // ALU Temporal Registers
        t1: 0,
        t2: 0,

        // Variables
        running: true,
        valid: true,
        loop_protection: 0,

        codes: opcodes,


        on: function(){

            let self = this;

            /**
             * Checks and returns 0-4 for ax-ip.
             * @param {number} reg 
             * @returns {number} reg
             */
            let checkReg = function(reg){
                if(self.regid.includes(reg)) return reg;
                else throw "Invalid Register" + reg;
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
                    }
                }
                else throw "Invalid Register" + reg;
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
                    }
                }
                else throw "Invalid Register" + reg;
            };

            /**
             * Checking if a value triggers the flags
             * @param {number} value 
             */
            let check = function(value){
                self.zero = false;;
                self.carry = false;
                self.sign = false;

                if (value >= 256) {
                    self.carry = true;
                    value = value % 256;
                } else if (value === 0) {
                    self.zero = true;
                } else if (value < 0) {
                    self.sign = true;
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
                if(addr >= 0 && addr < memory.data.length){
                    self.ip = addr;
                }
                else throw "Address out of memory " + addr;
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

                    case opcodes.LOOP:
                        if(self.cx > 1){
                            t2 = memory.read(++self.ip);
                            jump(t2);
                            self.cx--;
                            self.loop_protection++;
                            if(self.loop_protection > 500){
                                throw "Too many iteration in the loop (more than 500)"
                                break;
                            }
                        }
                        else {
                            self.ip += 2;
                            self.cx--;
                        }
                        break;

                    ///////////////////////////////////////

                    case opcodes.JMP_REGADDRESS:
                        t2 = memory.read(++self.ip);
                        jump(getReg(t2));
                        self.loop_protection++;
                        if(self.loop_protection > 500){
                            throw "Too many iteration in the loop (more than 500)"
                            break;
                        }
                        break;
                    case opcodes.JMP_ADDRESS:
                        t2 = memory.read(++self.ip);
                        jump(t2);
                        self.loop_protection++;
                        if(self.loop_protection > 500){
                            throw "Too many iteration in the loop (more than 500)"
                            break;
                        }
                        break;
                    case opcodes.JG_ADDRESS:
                        if(!self.sign && !self.zero)
                        {
                            t2 = memory.read(++self.ip);
                            jump(t2);
                            self.loop_protection++;
                            if(self.loop_protection > 500){
                                throw "Too many iteration in the loop (more than 500)"
                                break;
                            }
                        }
                        else self.ip += 2;
                        break;
                    case opcodes.JGE_ADDRESS:
                        if(!self.sign || self.zero)
                        {
                            t2 = memory.read(++self.ip);
                            jump(t2);
                            self.loop_protection++;
                            if(self.loop_protection > 500){
                                throw "Too many iteration in the loop (more than 500)"
                                break;
                            }
                        }
                        else self.ip += 2;
                        break;
                    case opcodes.JL_ADDRESS:
                        if(self.sign && !self.zero)
                        {
                            t2 = memory.read(++self.ip);
                            jump(t2);
                            self.loop_protection++;
                            if(self.loop_protection > 500){
                                throw "Too many iteration in the loop (more than 500)"
                                break;
                            }
                        }
                        else self.ip += 2;
                        break;
                    case opcodes.JLE_ADDRESS:
                        if(self.sign || self.zero)
                        {
                            t2 = memory.read(++self.ip);
                            jump(t2);
                            self.loop_protection++;
                            if(self.loop_protection > 500){
                                throw "Too many iteration in the loop (more than 500)"
                                break;
                            }
                        }
                        else self.ip += 2;
                        break;  
                    case opcodes.JCXZ_ADDRESS:  
                        if(self.cx === 0){
                            t2 = memory.read(++self.ip);
                            jump(t2);
                            self.loop_protection++;
                            if(self.loop_protection > 500){
                                throw "Too many iteration in the loop (more than 500)"
                                break;
                            }
                        }
                        else self.ip += 2;
                        break;
                    case opcodes.JE_ADDRESS:  
                        if(self.zero){
                            t2 = memory.read(++self.ip);
                            jump(t2);
                            self.loop_protection++;
                            if(self.loop_protection > 500){
                                throw "Too many iteration in the loop (more than 500)"
                                break;
                            }
                        }
                        else self.ip += 2;
                        break;
                    case opcodes.JNE_ADDRESS:  
                        if(!self.zero){
                            t2 = memory.read(++self.ip);
                            jump(t2);
                            self.loop_protection++;
                            if(self.loop_protection > 500){
                                throw "Too many iteration in the loop (more than 500)"
                                break;
                            }
                        }
                        else self.ip += 2;
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

                    case opcodes.NOT_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        setReg(t1, ~getReg(t1));
                        self.ip++;
                        break;

                    //////////////////////////////////////
                    
                    case opcodes.SHR_REG_NUMBER:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1) >>> t2));
                        self.ip++;
                        break;
                    case opcodes.SHL_REG_NUMBER:
                        t1 = checkReg(memory.read(++self.ip));
                        t2 = memory.read(++self.ip);
                        setReg(t1,check(getReg(t1) << t2));
                        self.ip++;
                        break;
                    
                    //////////////////////////////////////

                    case opcodes.PUSH_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        memory.push(getReg(t1));
                        self.ip++;
                        break;

                    case opcodes.PUSH_REGADDRESS:
                        t1 = memory.read(++self.ip);
                        memory.push(memory.read(getReg(t2)));
                        self.ip++;
                        break;
    
                    case opcodes.PUSH_ADDRESS:
                        t1 = memory.read(++self.ip);
                        memory.push(memory.read(t1));
                        self.ip++;
                        break;
                    
                    case opcodes.PUSH_NUMBER:
                        t1 = memory.read(++self.ip);
                        memory.push(t1);
                        self.ip++;
                        break;
                    
                    case opcodes.POP_REG:
                        t1 = checkReg(memory.read(++self.ip));
                        setReg(t1,memory.pop());
                        self.ip++;
                        break;

                    default:
                        self.valid = false;
                        break;

                }
                return true;
            };

            // Main

            try{
                let instr = memory.read(self.ip);

                if(instr != 0){
                    alu(instr);
                    self.running = true;
                }
                else self.running = false;
            }
            catch(e){
                throw e;
            }

            

        },

        reset: function(){ 
            let self = this;
            self.loop_protection = 0;
            self.ax = 0;
            self.bx = 0;
            self.cx = 0;
            self.dx = 0;
            self.ip = 0;
            self.sign = false;
            self.zero = false;
            self.carry = false;
            self.running = true;
            self.valid = true;
            memory.reset();
        }

    };

    
    return cpu;

}])