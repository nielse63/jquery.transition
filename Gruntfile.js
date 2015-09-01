
/*global module:false*/
module.exports = function(grunt) {

	// ========================================================================
	// Grunt modules
	// ========================================================================

	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner : '/*!\n' +
			' * <%= pkg.title || pkg.name %> - <%= pkg.description %>\n' +
			' * \n' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * \n' +
			' * Licensed under the MIT license:\n' +
			' *    http://www.opensource.org/licenses/mit-license.php\n' +
			' * \n' +
			' * Project home:\n' +
			' *    <%= pkg.homepage %>\n' +
			' * \n' +
			' * Version:  <%= pkg.version %>\n' +
			' * \n' +
			' */\n\n',
		watch: {
			js: {
				files: [ 'src/js/**/*.js', 'Gruntfile.js' ],
				tasks: [ 'newer:uglify' ]
			},
		},
		uglify: {
			options : {
				banner: '<%= banner %>',
				mangle : {},
				beautify : false,
				compress: {
					warnings: false
				},
				beautify: false,
				expression: false,
				maxLineLen: 32000,
				ASCIIOnly: false
			},
			unmin : {
				options: {
					mangle : false,
					compress : false,
					beautify : {
						beautify : true,
						bracketize : true
					},
				},
				files: [{
					expand: true,
					cwd : 'src',
					src: '*.js',
					dest: 'dist'
				}]
			},
			min: {
				files: [{
					expand: true,
					cwd: 'dist',
					src: ['*.js', '!*.min.js'],
					dest: 'dist',
					ext: '.min.js',
					extDot : 'last'
				}]
			},
		},
		jsbeautifier: {
			options: {
				js : {
					indentChar: "\t",
					indentLevel : 0,
					indentSize: 1,
					indentWithTabs : true,
					maxPreserveNewlines : 2,
					spaceAfterAnonFunction : false,
					spaceBeforeConditional : false,
				}
			},
			js : {
				src: ['dist/jquery.transition.js'],
				// filter : function(filepath) {
				// 	return filepath.indexOf('.min') < 0
				// }
			},
		},
		jshint: {
			options : {
				jshintrc : '.jshintrc',
				reporter: require('jshint-html-reporter'),
				reporterOutput: 'tests/results/jshint-report.html',
				force: true
			},
			all : ['dist/jquery.transition.js']
		},
	});

	// Custom Tasks
	grunt.registerTask(
		'build-js',
		'Builds, cleans, and optmiizes al .js',
		[ 'uglify', 'jsbeautifier' ]
	);

	grunt.registerTask( 'build', [ 'build-js' ] );
	grunt.registerTask( 'test', [ 'build', 'jshint' ] );
	grunt.registerTask( 'default', [ 'watch' ] );

};
