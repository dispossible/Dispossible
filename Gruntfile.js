module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: 
            '/***************************\\\n'+
            '    <%= pkg.name %> <%= pkg.version %>\n'+
            '    by <%= pkg.author %>\n'+
            '    Built on <%= grunt.template.today("yyyy-mm-dd") %>\n'+
            '\\***************************/\n',
        
        
        /****************\
            Utils
        \****************/
        watch: {
            blog: {
                files: ['src/asset/blog/**'],
                tasks: ['copy:blog']
            },
            img: {
                files: ['src/asset/img/**'],
                tasks: ['copy:img']
            },
            javascript: {
                files: ['src/asset/js/**'],
                tasks: ['javascript']
            },
            page: {
                files: ['src/asset/page/**'],
                tasks: ['copy:page']
            },
            script: {
                files: ['src/asset/script/**'],
                tasks: ['copy:script']
            },
            css: {
                files: ['src/asset/scss/**'],
                tasks: ['css']
            },
            svg: {
                files: ['src/asset/svg/**'],
                tasks: ['copy:svg']
            },
            font: {
                files: ['src/asset/font/**'],
                tasks: ['copy:font']
            },
            portfolio: {
                files: ['src/asset/port/**'],
                tasks: ['copy:portfolio']
            },
            root: {
                files: ['src/*'],
                tasks: ['copy:root']
            }
        },
        
        copy: {
            full: {
                src: ['*','asset/*','!asset/scss','asset/img/**','asset/script/**','asset/page/**','asset/blog/**','asset/svg/**','asset/font/**','asset/port/**'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            },
            blog: {
                src: ['asset/blog/**'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            },
            img: {
                src: ['asset/img/**'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            },
            page: {
                src: ['asset/page/**'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            },
            script: {
                src: ['asset/script/**'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            },
            svg: {
                src: ['asset/svg/**'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            },
            font: {
                src: ['asset/font/**'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            },
            portfolio: {
                src: ['asset/port/**'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            },
            root: {
                src: ['*'],
                cwd: 'src/',
                dest: 'dist/',
                expand: true
            }
        },
        
        clean: {
            build: {
                src: ['build']
            },
            full: {
                src: ['dist/**','dist']
            }
        },
        
        
        /****************\
            CSS
        \****************/
        concat: {
            options: {
                seperator: '/n/n/n'
            },
            build: {
                src: ['src/asset/scss/*'],
                dest: 'build/scss/style.scss'
            }
        },

        sass: {
            build: {
                files: {
                    "build/css/style.css": ['build/scss/style.scss']
                }
            }
        },
        
        autoprefixer: {
            options: {
                browsers: ['firefox >= 1','chrome >= 1','ie >= 1','ios >= 1','android >= 1','opera >= 1','> 1%']
            },
            build: {
                src: 'build/css/style.css',
                dest: 'build/pcss/',
                expand: true,
                flatten: true
            }
        },
        
        csslint: {
            options: {
                "universal-selector": false,
                "outline-none": false,
                "box-model": false,
                "box-sizing": false,
                "compatible-vendor-prefixes": false,
                "important": false
            },
            src: ['build/pcss/*']
        },
        
        cssmin: {
            build: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    'dist/asset/css/style.css': ['build/pcss/*']
                }
            }
        },
        
        
        /****************\
            Javascript
        \****************/
        jshint: {
            all: ['src/asset/js/1*.js']
        },
        
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            javascript: {
                src: ['src/asset/js/0*.js','src/asset/js/1*.js'],
                dest: 'dist/asset/js/js.js'
            },
            polyfill: {
                src: ['src/asset/js/2*.js'],
                dest: 'dist/asset/js/poly.js'
            }
        }
        
        
        /****************\
            SVG
        \****************/
        /*svgstore: {
            options: {},
            build: {
                files: {
                    'dist/asset/svg/lib.svg': ['src/asset/svg/**.svg']
                }
            }
        }*/
        
    });
    
    
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-svgstore');
    
    
    
    grunt.registerTask('default', ['clean:full','copy:full','javascript','css'/*,'svg'*/]);
    grunt.registerTask('javascript', ['jshint','uglify']);
    grunt.registerTask('css', ['clean:build','concat','sass','autoprefixer'/*,'csslint'*/,'cssmin']);
    //grunt.registerTask('svg', ['svgstore']);
    
};