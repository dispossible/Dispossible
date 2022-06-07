

export default class Gallery {

    constructor(){
        this.root = document.querySelector("[data-js-gallery]");
        this.pictures = [...this.root.querySelectorAll("picture")];

        this.pictures.forEach((pic, i) => {
            pic.dataset.index = i;
        });

        this.root.addEventListener("click", e => {
            const pic = e.target.closest("button")?.querySelector("picture");
            pic && this.showImage(pic);
        });
    }

    showImage(originalPic){
        let pic = this.getNextPicture(originalPic, 0);

        const backdrop = document.createElement("div");
        backdrop.classList.add("gallery-backdrop");

        const next = document.createElement("button");
        next.classList.add("gallery-next");

        const prev = document.createElement("button");
        prev.classList.add("gallery-prev");

        const close = document.createElement("button");
        close.classList.add("gallery-close");

        backdrop.addEventListener("click", e => {
            if( e.target === next ){
                const nextPic = this.getNextPicture(pic, 1);
                pic.remove();
                backdrop.append(nextPic);
                pic = nextPic;
            }
            else if( e.target === prev ){
                const nextPic = this.getNextPicture(pic, -1);
                pic.remove();
                backdrop.append(nextPic);
                pic = nextPic;
            }
            else {
                backdrop.remove();
                originalPic.parentNode.focus();
            }
        });

        backdrop.addEventListener("keydown", e => {
            if( e.key === "Escape" ){
                backdrop.remove();
                originalPic.parentNode.focus();
            }
        });

        backdrop.append(pic);
        backdrop.append(next);
        backdrop.append(prev);
        backdrop.append(close);
        document.body.append(backdrop);
        next.focus();
    }

    getNextPicture(pic, additon){
        let index = parseInt(pic.dataset.index, 10) + additon;
        if( index < 0 ){
            index = this.pictures.length - 1;
        }
        if( index > this.pictures.length - 1 ){
            index = 0;
        }
        const nextPic = this.pictures[index].cloneNode(true);
        const img = nextPic.querySelector("img");
        img.setAttribute("sizes", "min-width(1000px) 1000px, 100vw");
        return nextPic;
    }

}