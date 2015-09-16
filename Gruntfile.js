/**
 * grunt-check-dependencies
 * https://github.com/mzgol/grunt-check-dependencies
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

// Disable options that don't work in Node.js 0.10.
// Gruntfile.js & tasks/*.js are the only non-transpiled files.
/* eslint-disable no-var, object-shorthand, prefer-arrow-callback, prefer-const,
 prefer-spread, prefer-reflect, prefer-template */

var fs = require('fs');
var assert = require('assert');

var newNode;
try {
    assert.strictEqual(eval('(() => 2)()'), 2); // eslint-disable-line no-eval
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
                sourceMap: 'inline',
                sourceRoot: __dirname,
                retainLines: true,

                whitelist: [
                    // If a comment doesn't indicate otherwise, all commented out transformers
                    // would transpile features not available in latest stable Node.js yet
                    // so we can't use them as we don't transpile in latest Node.

                    'es6.arrowFunctions',
                    'es6.blockScoping',
                    'es6.classes',
                    'es6.constants',
//                    'es6.destructuring',
                    'es6.forOf',
//                    'es6.modules',
//                    'es6.parameters',
                    'es6.properties.computed',
                    'es6.properties.shorthand',

                    // Node 4.0 officially supports it but V8 4.4 has a critical bugs related to
                    // nested computed properties so don't rely on it for now:
                    // https://github.com/nodejs/node/issues/2507
                    // https://code.google.com/p/v8/issues/detail?id=4387
//                    'es6.properties.computed',
//                    'es6.properties.shorthand',

                    'es6.spread',
//                    'es6.tailCall',
                    'es6.templateLiterals',
//                    'es6.regex.unicode',
//                    'es6.regex.sticky',
                    'strict',
                ],

                loose: [
                    // Speed up for-of on arrays by not using the iterator directly.
                    'es6.forOf',
                ],
            },
            all: {
                files: [
                    {
                        expand: true,
                        src: [
                            '*.js',
                            'tasks/**/*.js',
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
