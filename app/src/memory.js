app.service('memory', [function() {

    let memory = {
    
        data: Array(256).fill(0),
        stack: [],
        stack_size: 32,
        index: -1,
        
        /**
         * Returns the data in the array corresponding the address
         * @param {number} address 
         * @returns {number} data
         */
        read: function(addr){
            if(addr < 0 || addr > this.data.length) throw "Memory access violation";
            else return this.data[addr];    
        },

        /**
         * Writes data at a given address
         * @param {number} address 
         * @param {number} data
         */
        write: function(addr, value){
            if(addr < 0 || addr > this.data.length) throw "Memory access violation";
            else this.data[addr] = value;
        },

        push: function(value){
            if(this.index < this.stack_size-1){
                this.stack.push(value);
                this.index++;
            }
            else throw "Stack Overflow";
        },

        pop: function(){
            if(this.index >= 0){
                let x = this.stack.pop();
                this.index--;
                return x;
            }
            else throw "Stack UnderFlow";
        },

        /**
         * Resets memory
         */
        reset: function(){
            this.data.fill(0);
            this.stack = [];
            this.index = -1;
        }

    };

    return memory;

}]);
