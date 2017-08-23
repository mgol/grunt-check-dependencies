/**
 * grunt-check-dependencies
 * https://github.com/mgol/grunt-check-dependencies
 *
 * Author Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: {
                src: [
                    'test/*-copy',
                ],
            },
        },

        eslint: {
            all: {
                src: [
                    '*.js',
                    'src',
                    'tasks',
                    'test',
                ],
            },
        },

        // Configuration to be run (and tested).
        checkDependencies: {
            ok: {
                options: {
                    packageDir: 'test/ok/',
                },
            },
            continueWithoutInstall: {
                options: {
                    packageDir: 'test/ok/',
                    continueAfterInstall: true,
                },
            },
            notOk: {
                options: {
                    packageDir: 'test/not-ok/',
                },
            },
            notOkCopyInstall: {
                options: {
                    packageDir: 'test/not-ok-install-copy/',
                    install: true,
                },
            },
            notOkCopyInstallContinueAfterInstall: {
                options: {
                    packageDir: 'test/not-ok-install-copy/',
                    install: true,
                    continueAfterInstall: true,
                },
            },
            notOkCopy: {
                options: {
                    packageDir: 'test/not-ok-install-copy/',
                },
            },

            // Deprecated.
            notOkCopyInstallContinue: {
                options: {
                    packageDir: 'test/not-ok-install-copy/',
                    install: true,
                    continue: true,
                },
            },
        },

        // Unit tests.
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/*.js'],
            },
        },
    });

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    // Load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.registerTask('lint', [
        'eslint',
    ]);

    grunt.registerTask('test', ['mochaTest']);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'clean',
        'lint',
        'test',
    ]);
};
