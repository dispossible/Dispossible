(()=>{

    const ACTIVE_CLASS = "is-active";
    const SCROLL_CLASS = "is-scrolled";

    class Nav {

        constructor(el) {

            this.el = el;
            this.links = this.el.querySelectorAll("[data-js-nav-link]");

            this.bindEvents();
            this.scrollHandler();

        }


        bindEvents(){
            w.addEventListener("scroll",this.scrollHandler.bind(this));
            this.el.addEventListener("click",e=>{
                if( e.target.hasAttribute("href") && e.target.getAttribute("href").startsWith("#") ){
                    this.scrollTo( e.target.getAttribute("href") );
                } else
                if( e.target.parentElement !== this.el && e.target.parentElement.hasAttribute("href") && e.target.parentElement.getAttribute("href").startsWith("#") ){
                    this.scrollTo( e.target.parentElement.getAttribute("href") );
                }
            });
        }


        scrollHandler(event){
            if( d.body.scrollTop > 0 ){
                this.el.classList.add(SCROLL_CLASS);
            } else {
                this.el.classList.remove(SCROLL_CLASS);
            }

            this.links.forEach(link=>{
                let href= link.getAttribute("href");
                let rect = d.querySelector(href).getBoundingClientRect();

                if( rect.top < w.outerHeight/2 && rect.bottom > w.outerHeight/2 ){
                    link.classList.add(ACTIVE_CLASS);
                } else {
                    link.classList.remove(ACTIVE_CLASS);
                }
            });

        }

        scrollTo(href){
            if( href === "#" ){
                w.scroll({ top: 0, left: 0, behavior: "smooth" });
            } else {
                d.querySelector(href).scrollIntoView({ behavior: "smooth" });
            }
        }

    }

    let el = d.querySelector("[data-js-nav]");
    website.newModule( "nav",  new Nav(el) );

})();