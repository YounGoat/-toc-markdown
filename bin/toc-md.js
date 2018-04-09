#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	
	/* NPM */
	, noda = require('noda')
	, write = require('jinang/write')
	, cloneObject = require('jinang/cloneObject')
	, commandos = require('commandos')
	
	/* in-package */
	, toc = noda.inRequire('index')
	;

function help() {
	console.log(noda.nextRead('help.txt', 'utf8'));
}

function addToC(inputPath, outputPath, options) {
	let md = fs.readFileSync(inputPath, 'utf8');
	md = toc(md, options);
	
	if (outputPath) {
		try {
			write(outputPath, md);
			console.log('Section "Table of Contents" inserted.');
		}
		catch(ex) {
			console.error('failed writing to:', outputPath);
			console.error(ex.message);
		}
	}
	else {
		console.log(md);
	}
}

let cmd = commandos.parse({
	groups: [
		[ 
			'--help -h [*:=* help] REQUIRED', 
		], [
			'--file -f NOT NULL REQUIRED',
			'--overwrite NOT ASSIGNABLE',
			'--title -t',
			'--position NOT NULL',
		], [
			'--input -i [0] NOT NULL REQUIRED',
			'--output -o [1] NOT NULL',
			'--overwrite NOT ASSIGNABLE',
			'--title -t',
			'--position NOT NULL',
		],
	],
	catcher: help
});

if (!cmd) {
	return;
}
else if (cmd.help) {
	return help();
}
else if (cmd.file) {
	let options = cloneObject(cmd, [ 'overwrite', 'title', 'position' ]);
	addToC(cmd.file, cmd.file, options);
}
else {
	let { input, output } = cmd;
	let options = cloneObject(cmd, [ 'overwrite', 'title', 'position' ]);
	addToC(input, output, options);
}