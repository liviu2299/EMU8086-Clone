app.service('memory', [function() {

    let memory = {
    
        data: Array(256).fill(0),
        index: -1,
        
        /**
         * Returns the data in the array corresponding the address
         * @param {number} address 
         * @returns {number} data
         */
        read: function(addr){
            if(addr < 0 || addr > this.data.length) throw "Memory access violation";
            else this.index = addr;

            return this.data[addr];
        },

        /**
         * Writes data at a given address
         * @param {number} address 
         * @param {number} data
         */
        write: function(addr, value){
            if(addr < 0 || addr > this.data.length) throw "Memory access violation";
            else{
                this.index = addr;
                this.data[addr] = value;
            }
        },

        /**
         * Resets memory
         */
        reset: function(){
            this.data.fill(0);
            this.index = 0;
        }

    };

    return memory;

}]);
