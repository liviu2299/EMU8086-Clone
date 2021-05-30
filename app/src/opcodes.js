app.service('opcodes', [function() {
    let opcodes = {
        
        NONE: 0,

        MOV_REG_REG: 1,
        MOV_REG_ADDRESS: 2,
        MOV_REG_REGADDRESS: 3,
        MOV_REG_NUMBER: 4,
        MOV_ADDRESS_REG: 5,
        MOV_ADDRESS_NUMBER: 6,
        MOV_REGADRESS_REG: 7,
        MOV_REGADRESS_NUMBER: 8,

        ADD_REG_NUMBER: 9,
        ADD_REG_REG: 10,
        ADD_REG_REGADDRESS: 11,
        ADD_REG_ADRESS: 12,

        SUB_REG_REG: 13,
        SUB_REG_REGADDRESS: 14,
        SUB_REG_ADDRESS: 15,
        SUB_REG_NUMBER: 16,

        INC_REG: 17,
        DEC_REG: 18,


        // ...
    };
    return opcodes;
}])