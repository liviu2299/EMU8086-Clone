app.service('memory', [function() {

    let memory = {
    
        data: Array(256),
        index = 0,
        
        // Read from memory
        read: function(addr){ },

        // Write in memory
        write: function(addr, value){ },

        // Reset memory
        reset: function(){ }

    }

    return memory;

}])