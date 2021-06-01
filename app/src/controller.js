app.controller('controller', ['$scope', 'memory', 'opcodes', 'cpu', 'parser', function($scope, memory, opcodes, cpu, parser){

    $scope.text = "MOV A, B";

    $scope.cpu = cpu;
    $scope.memory = memory;
    


    // RESET
    $scope.reset = function(){
        memory.reset();
        cpu.reset();
    };

    // ASSEMBLE
    $scope.assemble = function(){
        $scope.reset();
        let assembler = parser.on($scope.text);
        $scope.codes = assembler.code;

        $scope.labels = assembler.labels;

        
        for(let i=0; i<$scope.codes.length; i++) memory.data[i] = $scope.codes[i];
        
    };

    // RUN
    $scope.run = function(){
        while(cpu.running && cpu.valid)
        {
            setTimeout(cpu.on(),500);
        }
    };

}]);