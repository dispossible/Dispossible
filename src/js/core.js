(()=>{

    const STORE_KEY = "~~disp~~";
    const DATA_KEY = "JSON_";

    class Website{

        constructor(){

            this.args = {
                debug: false
            };

            let isDebug = this.load("debug");
            if( isDebug ){
                this.args.debug = true;
            }

        }


        save(key,data){
            key = STORE_KEY + key;
            let saveData = "";

            if( typeof data === "string" ){
                saveData = data;
            } else {
                saveData = DATA_KEY + JSON.stringify(data);
            }

            saveData = btoa(saveData);
            localStorage.setItem(key, data);
        }

        load(key){
            key = STORE_KEY + key;
            let data = localStorage.getItem(key);

            if( data === null ) return null;

            data = atob(data);

            if( data.startsWith(DATA_KEY) ){
                data = JSON.parse( data.substr(DATA_KEY.length) );
            }

            return data;
        }


        log(...args){
            if( this.args.debug && console && typeof console.log === "function" ){
                console.log(...args);
            }
        }


        newModule(name, module){
            if( typeof name !== "string" ){
                this.log("Failed to register new module, invalid name");
                return;
            }

            this[ name ] = module;
        }


    }


    w.website = new Website();

})();