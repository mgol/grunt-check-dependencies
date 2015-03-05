/**
 * grunt-check-dependencies
 * https://github.com/mzgol/grunt-check-dependencies
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

var cloneDeep = require('lodash.clonedeep'),
    checkDependencies = require('check-dependencies');

module.exports = function (grunt) {
    grunt.registerMultiTask('checkDependencies',
            'Checks if currently installed npm dependencies are installed in the exact same versions ' +
            'that are specified in package.json',
        function () {
            var options = cloneDeep(this.options()),
                done = this.async(),
                needContinue = options.continue === true;

            options.log = grunt.verbose.writeln;
            options.error = grunt.log.error;

            // Our verbose mode represents check-dependencies verbose mode but even in non-verbose
            // mode we want to have error messages logged so from check-dependencies perspective
            // we're always verbose.
            options.verbose = true;

            checkDependencies(options, function (output) {
                // The checkDependencies function succeeds if dependencies were mismatched
                // but `npm install` ended fine; however, in case of mismatch we might have
                // obsolete Grunt tasks loaded so it's better to fail this time and require
                // a re-run.
                if (output.status === 0 && !output.depsWereOk) {
                    if (!needContinue) {
                        grunt.log.error('Dependencies have been updated. Please re-run your Grunt task.');
                    }
                }
                done(output.status === 0 && (output.depsWereOk || needContinue));
            });
        }
    );
};
