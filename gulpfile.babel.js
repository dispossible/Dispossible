//Vars
var src = "src";
var dist = "dist";
var temp = "_temp";


//imports
import site from './sitemap.json';
import faviconConf from './favicon.json';
import gulp from 'gulp';
import del from 'del';
import fs from 'fs';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import mainBowerFiles from 'main-bower-files';

const $ = gulpLoadPlugins();
const faviconData = "faviconData.json";


//Tasks

gulp.task("default", ()=>
    runSequence(
        "build",
        "watch"
    )
);

gulp.task("build", ()=>
    runSequence(
        "clean",
        "copy",
        "bower",
        "favicon",
        "html",
        "js",
        "images",
        "style",
        "size"
    )
);

gulp.task("watch", ()=>{
    gulp.watch(src+"/js/**/*.js",["js","versionPat"]);
    gulp.watch(src+"/img/**/*.{jpg,png,gif,svg}",["images","versionPat"]);
    gulp.watch(src+"/css/**/*.scss",["style","versionPat"]);
    gulp.watch(src+"/**/*.ejs",["html","versionPat"]);
});


// Versions

gulp.task("versionPat", ()=>{
    gulp.src("package.json")
        .pipe($.bump({type:"patch"}))
        .pipe(gulp.dest("./"))
});




// Utils

gulp.task("clean", ()=>
    del(
        [".tmp", dist+"/*", temp+"/*"],
        { dot: true }
    )
);

gulp.task("copy", ()=>
    gulp
        .src(
            [
                src + "/*.*",
                "!" + src + "/*.ejs"
            ],
            {dot: true}
        )
        .pipe(gulp.dest(dist))
        .pipe($.size({title: "root files"}))
);

gulp.task("size", ()=>
    gulp
        .src(dist+"/**/*")
        .pipe($.size({title: "public files"}))
);




//JS

gulp.task("bower", ()=>
    gulp
        .src(mainBowerFiles())
        .pipe($.uglify())
        .pipe(gulp.dest(temp))
        .pipe($.size({title: "libs"}))
);

gulp.task("lint", ()=>
    gulp
        .src(src+"/js/**/*.js")
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
);

gulp.task("js", ['lint'], ()=>
    gulp
        .src([
            temp+"/**/*.js",
            src+"/js/core.js",
            src+"/js/**/*.js"
        ])
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.concat("script.js"))
        .pipe($.jsWrapper({
            safeUndef: true,
            globals: {
                "window": "w",
                "document": "d"
            }
        }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write("."))
        .pipe(gulp.dest(dist))
        .pipe($.size({title: "javascript"}))
);




//Images

gulp.task("images", ()=>
    gulp
        .src(src+"/img/**/*.{jpg,png,gif,svg}")
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest(dist+"/img"))
        .pipe($.size({title: "images"}))
);




//Styles

gulp.task("style", ()=>
    gulp
        .src(src+"/css/template.scss")
        .pipe($.sourcemaps.init())
        .pipe($.sass().on("error",$.sass.logError))
        .pipe($.autoprefixer({browsers: "> 1%"}))
        .pipe($.cssnano())
        .pipe($.concat('style.css'))
        .pipe($.sourcemaps.write("."))
        .pipe(gulp.dest(dist))
        .pipe($.size({title: "style"}))
);



//HTML

gulp.task("html", ()=>{
    site.pages.forEach(page=>{
        page.title = site.title;
        
        gulp.src("src/template.ejs")
            .pipe($.ejs(page))
            .pipe($.realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(faviconData)).favicon.html_code))
            .pipe($.htmlmin({collapseWhitespace: true, removeComments: true}))
            .pipe($.rename(page.fileName))
            .pipe(gulp.dest("dist"));

    });
});



//Favicon

gulp.task("favicon", (d)=>{
    faviconConf.markupFile = faviconData;
    faviconConf.dest = dist;
    $.realFavicon.generateFavicon(faviconConf,d);
});