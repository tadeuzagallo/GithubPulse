module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      app: {
        src: ['vendor/jquery/dist/jquery.js','assets/js/*.js','!assets/js/main.js'],
        dest: 'assets/js/main.js',
      }
    },
    concat_css: {
      all: {
        src: ['vendor/skeleton-css/css/*.css','assets/css/*.css','!assets/css/main.css'],
        dest: 'assets/css/main.css'
      },
    },
    cssmin: {
      target: {
        files: {
          'assets/css/main.css': ['assets/css/main.css']
        }
      }
    },
    jshint: {
      options: {
        browser: true,
        globals: {
          jQuery: true
        },
      },
      all: ['assets/js/*.js','!assets/js/main.js']
    },
    uglify: {
      js: {
        files: {
          'assets/js/main.js': 'assets/js/main.js'
        }
      }
    },
    watch: {
      js: {
        files: ['assets/js/*.js'],
        tasks: ['concat','jshint'],
      },
      css: {
        files: 'assets/css/*.css',
        tasks: ['concat_css'],
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['default','cssmin','uglify']);

  grunt.registerTask('dev', ['default','watch']);

  // Default task.
  grunt.registerTask('default', ['concat_css','concat','jshint']);

};