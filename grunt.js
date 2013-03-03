"use strict";

module.exports = function (grunt) {

    // Add our custom tasks.
    grunt.loadNpmTasks('grunt-mocha-test');

    // Project configuration.
    grunt.initConfig({
                         pkg:'<json:package.json>',
                         test:{
                             files:['test/**/unit/**/*.js']
                         },
                         lint:{
                             files:['grunt.js', 'src/**/*.js']
                         },
                         mochaTest:{
                             unit:['test/unit/**/*.js']
                         },
                         mochaTestConfig:{
                             unit:{
                                 options:{
                                     reporter:process.env.TEST_REPORTER || 'spec'
                                 }
                             }
                         },
                         watch:{
                             files:'<config:lint.files>',
                             tasks:'default'
                         },
                         jshint:{
                             options:{
                                 curly:true,
                                 eqeqeq:true,
                                 es5: true,
                                 expr: true,
                                 globalstrict: true,
                                 immed:true,
                                 latedef:true,
                                 multistr: true,
                                 newcap:true,
                                 noarg:true,
                                 node: true,
                                 onecase: true,
                                 sub:true,
                                 undef:true,
                                 boss:true,
                                 eqnull:true
                             },
                             globals:{
                                 exports:true,
                                 after: false,
                                 afterEach: false,
                                 before: false,
                                 beforeEach: false,
                                 describe: false,
                                 it: false
                             }
                         }
                     });

    // Default task.
    grunt.registerTask('default', 'lint mochaTest:unit');

};