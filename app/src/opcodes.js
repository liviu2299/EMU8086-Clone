app.service('opcodes', [function() {
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
    }
}])