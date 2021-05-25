app.controller('controller', ['$scope', 'memory', 'opcodes', 'cpu', function($scope, memory, opcodes, cpu){

    $scope.text = "Write here";
    $scope.cpu = cpu;
    $scope.memory = memory;


    // RESET
    $scope.reset = function(){
        memory.reset();
    };

    // RUN
    $scope.assemble = function(){

    };


    

}]);