import { countBy } from "lodash";

export default class Pages {

    constructor(){
        this.pages = [...document.querySelectorAll("[data-js-page]")].reduce((pages, page) => {
            const [pageName, size] = page.dataset.jsPage.split("|");
            return {
                ...pages,
                [pageName]: {
                    el: page,
                    size: size || "default",
                }
            };
        }, {});
        this.links = [...document.querySelectorAll("[data-js-page-href]")];
        this.root = document.querySelector("main");

        this.links.forEach(link => {
            link.addEventListener("click", e => {
                this.navigate(link.dataset.jsPageHref);
            });
        });
    }

    navigate(pageName){

        const nextPage = this.pages[pageName];

        if(!nextPage){
            return;
        }

        const startPos = this.root.getBoundingClientRect();

        Object.values(this.pages).forEach(page => {
            page.el.classList.add("u-hidden");
        });

        nextPage.el.classList.remove("u-hidden");

        const isWide = this.root.classList.contains("is-wide");

        if( (!isWide && nextPage.size === "wide") || (isWide && nextPage.size !== "wide") ){

            if( nextPage.size === "wide" ){
                this.root.classList.add("is-wide");
            } else {
                this.root.classList.remove("is-wide");
            }

            requestAnimationFrame(() => {
                const endPos = this.root.getBoundingClientRect();
                nextPage.el.classList.add("u-hidden");
                this.resizeEffect(startPos, endPos).then(() => {
                    setTimeout(() => {
                        nextPage.el.classList.remove("u-hidden");
                        this.root.removeAttribute("style");
                    }, 50);
                });
            });
            
        } else {
            this.root.removeAttribute("style");
        }

    }


    resizeEffect(start, end){
        return new Promise(resolve => {
            this.applyStyles({
                position: "absolute",
                top: start.top + "px",
                left: start.left + "px",
                width: start.width + "px",
                height: start.height + "px",
                overflow: "hidden",
            });
            requestAnimationFrame(() => {
                this.applyStyles({
                    transition: "150ms cubic-bezier(0.2, 0, 0, 0.8)",
                    top: end.top + "px",
                    left: end.left + "px",
                    width: end.width + "px",
                    height: end.height + "px",
                });
                this.root.addEventListener("transitionend", () => {
                    resolve();
                }, { once: true });
            });
        });
    }


    applyStyles(styles){
        Object.entries(styles).map(([prop, value]) => {
            this.root.style[prop] = value;
        });
    }


}