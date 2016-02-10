module.exports = function(grunt) {

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'js/carousel-es2015.transpiled.js': 'js/carousel-es2015.js'
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-babel');



    grunt.registerTask('default', ['babel']);

}