(function(){

    const OPEN_CLASS = "is-open";

    $(function(){
        var el = $("[data-js-nav]").first();
        var btn = $("[data-js-nav-btn]").first();
        w.dsp.nav = new Nav(el, btn);
    });


    class Nav {

        constructor(el,btn) {

            this.el = el;
            this.btn = btn;

            this.open = false;

            this.bindDom();

        }


        bindDom(){
            this.btn.on("click",function(e){
                this.toggle();
            }.bind(this));
        }


        toggle(){
            this.open = !this.open;
            (this.open)? this.show() : this.hide();
        }

        show(){
            this.btn.addClass(OPEN_CLASS);
            this.el.addClass(OPEN_CLASS);
        }
        
        hide(){
            this.btn.removeClass(OPEN_CLASS);
            this.el.removeClass(OPEN_CLASS);
        }

    }

})();