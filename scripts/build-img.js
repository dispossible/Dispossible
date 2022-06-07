const fs = require("fs-extra");
const Image = require("@11ty/eleventy-img");

const { output } = require("./path");

const galleryDir = "./src/img/gallery";
const images = fs.readdirSync(galleryDir);
images.forEach(img => {
    const url = galleryDir + "/" + img;
    Image(url, {
        widths: [300, 600, 1000, 1500],
        formats: ["webp", "jpeg"],
        outputDir: `${output}/img/gallery/`,
        filenameFormat: (id, src, width, format, options) => {
            return `${img.replace(/\.\w+$/, "")}-${width}.${format}`;
        }
    });
});