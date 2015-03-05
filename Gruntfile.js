/**
 * grunt-check-dependencies
 * https://github.com/mzgol/grunt-check-dependencies
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        eslint: {
            all: {
                src: [
                    '*.js',
                    'tasks',
                    'test',
                ],
            },
        },

        jscs: {
            all: {
                src: [
                    'Gruntfile.js',
                    'tasks/**/*.js',
                    'test/**/*.js',
                ],
                options: {
                    config: '.jscsrc',
                },
            },
        },

        // Configuration to be run (and tested).
        checkDependencies: {
            ok: {
                options: {
                    packageDir: './test/ok/',
                },
            },
            notOk: {
                options: {
                    packageDir: './test/not-ok/',
                },
            },
            notOkCopyInstall: {
                options: {
                    packageDir: './test/not-ok-install-copy/',
                    install: true,
                },
            },
            notOkCopyInstallContinue: {
                options: {
                    packageDir: './test/not-ok-install-copy/',
                    install: true,
                    continue: true,
                },
            },
            notOkCopy: {
                options: {
                    packageDir: './test/not-ok-install-copy/',
                },
            },
        },

        // Unit tests.
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/spec.js'],
            },
        },
    });

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', [
        'eslint',
        'jscs',
    ]);

    grunt.registerTask('test', ['mochaTest']);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'lint',
        'test',
    ]);
};
