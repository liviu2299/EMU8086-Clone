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
        ADD_REG_ADDRESS: 12,

        SUB_REG_REG: 13,
        SUB_REG_REGADDRESS: 14,
        SUB_REG_ADDRESS: 15,
        SUB_REG_NUMBER: 16,

        INC_REG: 17,
        DEC_REG: 18,

        CMP_REG_REG: 19,
        CMP_REG_REGADDRESS: 20,
        CMP_REG_ADDRESS: 21,
        CMP_REG_NUMBER: 22,

        JMP_REGADDRESS: 23,
        JMP_ADDRESS: 24,

        MUL_REG: 25,
        MUL_REGADDRESS: 26,
        MUL_ADDRESS: 27,
        MUL_NUMBER: 28,

        DIV_REG: 29,
        DIV_REGADDRESS: 30,
        DIV_ADDRESS: 31,
        DIV_NUMBER: 32,

        AND_REG_REG: 33,
        AND_REG_REGADDRESS: 34,
        AND_REG_ADDRESS: 35,
        AND_REG_NUMBER: 36,

        OR_REG_REG: 37,
        OR_REG_REGADDRESS: 38,
        OR_REG_ADDRESS: 39,
        OR_REG_NUMBER: 40,

        NOT_REG: 41,

        HLT: 42,

        PUSH_REG: 43,
        PUSH_REGADDRESS: 44,
        PUSH_ADDDRESS: 45,
        PUSH_NUMBER: 46,

        POP_REG: 47,

        JG_ADDRESS: 48,
        JGE_ADDRESS: 49,
        JL_ADDRESS: 50,
        JLE_ADDRESS: 51
        // ...
    };
    return opcodes;
}])