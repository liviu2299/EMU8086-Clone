app.controller('controller', ['$scope', 'memory', 'opcodes', 'cpu', 'parser', function($scope, memory, opcodes, cpu, parser){

    $scope.text = "MOV A, B";

    $scope.cpu = cpu;
    $scope.memory = memory;

    

    // RESET
    $scope.reset = function(){
        memory.reset();
        cpu.reset();
    };

    // RUN
    $scope.assemble = function(){
        $scope.reset();
        $scope.cpu.bx = 3;
        let assembler = parser.on($scope.text);
        $scope.cpu.bx = assembler.code;
        $scope.codes = assembler.code;
    };


    

}]);