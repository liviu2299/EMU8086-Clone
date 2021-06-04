app.controller('controller', ['$scope', 'memory', 'opcodes', 'cpu', 'parser', function($scope, memory, opcodes, cpu, parser){

    $scope.text = "Write here.";

    $scope.cpu = cpu;
    $scope.memory = memory;
    $scope.error = "";

    $scope.rows = [];
    $scope.rows_stack = [];

    $scope.preset1 = function(){
        $scope.text = `;Loop Support
MOV C, 10
MOV B, 1
        
bucla: 
INC B
loop bucla`;
    };
    $scope.preset2 = function(){
        $scope.text = `;Error Support
MOV C, 3

bucla:
INC C
loop bucla`;
    };
    $scope.preset3 = function(){
        $scope.text = `;Carry
MOV A, 1
ADD A, 300
        
;Sign Carry
MOV B, 15
CMP B, A
        
;Zero Flag
MOV A, 15
CMP B, A`;
    };
    $scope.preset4 = function(){
        $scope.text = `;Jumps
MOV A, 10
MOV B, 1
        
start:
CMP A, B
JLE gata
        
bucla:
INC B
JMP start
        
gata:
MOV D, 1
HLT`;
    };

    // Memory initialization
    let cells = [];
    for(var i=0; i < 256 ; i++){
        cells.push(memory.data[i]);
        if(((i+1) % 16) == 0 && i != 0) {
            $scope.rows.push(cells);
            cells = [];
        }
    }

    // Stack Initialization
    $scope.rows_stack = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
    

    // RESET
    $scope.reset = function(){
        memory.reset();
        cpu.reset();
        $scope.error = "";
        $scope.labels = [];
        
        let cells = [];
        $scope.rows = [];
        for(var i=0; i < 256 ; i++){
            cells.push(memory.data[i]);

            if(((i+1) % 16) == 0 && i != 0) {
                $scope.rows.push(cells);
                cells = [];
            }
        }
        $scope.rows_stack = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
    };

    // ASSEMBLE
    $scope.assemble = function(){

        try{
            memory.reset();
            cpu.reset();
            let assembler = parser.on($scope.text);
            $scope.codes = assembler.code;
    
            $scope.labels = assembler.labels;
    
            
            for(let i=0; i<$scope.codes.length; i++) memory.data[i] = $scope.codes[i];  
            
            let cells = [];
            $scope.rows = [];
            for(var i=0; i < 256 ; i++){
                cells.push(memory.data[i]);
    
                if(((i+1) % 16) == 0 && i != 0) {
                    $scope.rows.push(cells);
                    cells = [];
                }
            }
        }
        catch(e){
            $scope.error = e;
        }

    };

    // RUN
    $scope.compute = function(){

        try{
            while(cpu.running && cpu.valid)
            {
                setTimeout(cpu.on(),500);
            }
            let cells_stack = [];
            $scope.rows_stack = [];
            for(var i=0; i < 32 ; i++){
                if(memory.stack[i] != undefined) cells_stack.push(memory.stack[i]);
                else cells_stack.push(0);
    
                if(((i+1) % 16) == 0 && i != 0) {
                    $scope.rows_stack.push(cells_stack);
                    cells_stack = [];
                }
            }
        }
        catch(e){
            $scope.error = e;
        }

    };

    // STEP
    $scope.step = function(){

        try{
            if(cpu.running && cpu.valid) cpu.on();
            let cells_stack = [];
            $scope.rows_stack = [];
            for(var i=0; i < 32 ; i++){
                if(memory.stack[i] != undefined) cells_stack.push(memory.stack[i]);
                else cells_stack.push(0);
    
                if(((i+1) % 16) == 0 && i != 0) {
                    $scope.rows_stack.push(cells_stack);
                    cells_stack = [];
                }
            }
        }
        catch(e){
            $scope.error = e;
        }

    };

    // ASSEMBLE+COMPUTE
    $scope.run = function(){
        $scope.assemble();
        $scope.compute();
    };

}]);