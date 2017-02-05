//Vars
var src = "src";
var dist = "public";


//imports
import pkg from './package.json';
import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import mainBowerFiles from 'main-bower-files';

const $ = gulpLoadPlugins();



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
    gulp.watch(src+"/*.html",["html","versionPat"]);
});

gulp.task("dist", ()=>
    runSequence(
        "zip",
        "versionMin"
    )
);



// Versions

gulp.task("versionPat", ()=>{
    gulp.src("package.json")
        .pipe($.bump({type:"patch"}))
        .pipe(gulp.dest("./"))
});

gulp.task("versionMin", ()=>{
    gulp.src("package.json")
        .pipe($.bump({type:'minor'}))
        .pipe(gulp.dest("./"))
});




// Utils

gulp.task("clean", ()=>
    del(
        [".tmp", dist+"/*"],
        { dot: true }
    )
);

gulp.task("copy", ()=>
    gulp
        .src(
            [
                src + "/*.*",
                "!" + src + "/*.html"
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

gulp.task("zip", ()=>{
    gulp
        .src([
            ".ebextentions/**",
            "public/**",
            "routes/**",
            "views/**",
            "app.js",
            "app_config.json",
            "package.json"
        ])
        .pipe($.zip(pkg.name+"."+pkg.version+".zip"))
        .pipe(gulp.dest("dist"))
        .pipe($.size({title: "dist"}))
});




//JS

gulp.task("bower", ()=>
    gulp
        .src(mainBowerFiles())
        .pipe($.uglify())
        .pipe(gulp.dest(dist+"/lib"))
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