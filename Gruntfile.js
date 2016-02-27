/**
 * grunt-check-dependencies
 * https://github.com/mgol/grunt-check-dependencies
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

// Disable options that don't work in Node.js 0.12.
// Gruntfile.js & tasks/*.js are the only non-transpiled files.
/* eslint-disable no-var, object-shorthand, prefer-arrow-callback, prefer-const,
 prefer-spread, prefer-reflect, prefer-template */

var fs = require('fs');
var assert = require('assert');

var newNode;
try {
    assert.strictEqual(eval('(r => [...r])([2])[0]'), 2); // eslint-disable-line no-eval
    newNode = true;
} catch (e) {
    newNode = false;
}

var transformRelativePath = function transformRelativePath(filepath) {
    return newNode ? filepath : 'dist/' + filepath;
};

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        clean: {
            test: {
                src: [
                    'dist',
                    'test/*-copy',
                ],
            },
        },

        copy: {
            nonGenerated: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        src: [
                            'test/**/*',
                            '!test/**/*.js',
                        ],
                        dest: 'dist',
                    },
                ],
            },
        },

        babel: {
            options: {
                sourceMap: true,
                retainLines: true,
            },
            all: {
                files: [
                    {
                        expand: true,
                        src: [
                            'src/**/*.js',
                            'test/**/*.js',
                        ],
                        dest: 'dist',
                    },
                ],
            },
        },

        eslint: {
            all: {
                src: [
                    '*.js',
                    'tasks',
                    'test',
                ],
            },
        },

        // Configuration to be run (and tested).
        checkDependencies: {
            ok: {
                options: {
                    packageDir: transformRelativePath('test/ok/'),
                },
            },
            continueWithoutInstall: {
                options: {
                    packageDir: transformRelativePath('test/ok/'),
                    continue: true,
                },
            },
            notOk: {
                options: {
                    packageDir: transformRelativePath('test/not-ok/'),
                },
            },
            notOkCopyInstall: {
                options: {
                    packageDir: transformRelativePath('test/not-ok-install-copy/'),
                    install: true,
                },
            },
            notOkCopyInstallContinue: {
                options: {
                    packageDir: transformRelativePath('test/not-ok-install-copy/'),
                    install: true,
                    continue: true,
                },
            },
            notOkCopy: {
                options: {
                    packageDir: transformRelativePath('test/not-ok-install-copy/'),
                },
            },
        },

        // Unit tests.
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: [transformRelativePath('test/*.js')],
            },
        },
    });

    // Load all grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    // Actually load this plugin's task(s).
    if (fs.existsSync(__dirname + '/dist')) {
        grunt.loadTasks('tasks');
    }

    grunt.registerTask('lint', [
        'eslint',
    ]);

    // In modern Node.js we just use the non-transpiled source as it makes it easier to debug;
    // in older version we transpile (but keep the lines).
    grunt.registerTask('build', [
        'copy:nonGenerated',
        'babel',
    ]);

    grunt.registerTask('test', ['mochaTest']);

    // By default, lint and run all tests.
    grunt.registerTask('default', [
        'clean',
        'lint',
        'build',
        'test',
    ]);
};
