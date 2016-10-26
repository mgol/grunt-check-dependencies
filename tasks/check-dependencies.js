/**
 * grunt-check-dependencies
 * https://github.com/mzgol/grunt-check-dependencies
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

const cloneDeep = require('lodash.clonedeep');
const checkDependencies = require('check-dependencies');

module.exports = grunt => {
    grunt.registerMultiTask('checkDependencies',
        'Checks if currently installed npm dependencies are installed in the exact ' +
        'same versions that are specified in package.json',
        function () {
            const options = cloneDeep(this.options());
            const done = this.async();

            if ('continue' in options) {
                options.continueAfterInstall = options.continue;
                delete options.continue;

                grunt.log.warn('The `continue` option is deprecated. Use `continueAfterInstall`.');
            }

            const needContinue = options.continueAfterInstall === true;

            if (needContinue && !options.install) {
                grunt.fail.fatal([
                    'The `continueAfterInstall` option requires seting the `install` option',
                    'to `true`.',
                ].join(' '));
            }

            options.log = grunt.verbose.writeln;
            options.error = grunt.log.error;

            // Our verbose mode represents check-dependencies verbose mode but even in non-verbose
            // mode we want to have error messages logged so from check-dependencies perspective
            // we're always verbose.
            options.verbose = true;

            checkDependencies(options, output => {
                // The checkDependencies function succeeds if dependencies were mismatched
                // but `npm install` ended fine; however, in case of mismatch we might have
                // obsolete Grunt tasks loaded so it's better to fail this time and require
                // a re-run.
                if (output.status === 0 && !output.depsWereOk) {
                    if (!needContinue) {
                        grunt.log.error(
                            'Dependencies have been updated. Please re-run your Grunt task.');
                    }
                }
                done(output.status === 0 && (output.depsWereOk || needContinue));
            });
        }
    );
};
