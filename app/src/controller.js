app.controller('controller', ['$scope', 'memory', 'opcodes', 'cpu', 'parser', function($scope, memory, opcodes, cpu, parser){

    $scope.text = "MOV A, B";

    $scope.cpu = cpu;
    $scope.memory = memory;
    $scope.error = "";

    $scope.rows = [];
    $scope.rows_stack = [];

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