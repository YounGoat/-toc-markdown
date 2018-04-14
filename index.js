'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */

    /* in-file */
    , text2aname = text => text.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9\-]/g, '')
    ;

/**
 * @param  {string}    md - markdown text
 * @param  {Object}   [options]
 * @param  {string}   [options.ignore]
 * @param  {Array}    [options.ignore]
 * @param  {number}   [options.position]  - put ToC before the n-th second-level title
 * @param  {boolean}  [options.overwrite] - whether to overwrite exsiting ToC section
 * @param  {number}   [options.title]     - title of ToC section
 */
function toc(md, options) {
    let opt = Object.assign({
        /**
         * . -1 - Put ToC at first (before the headline).
         * .  0 - Put ToC just after the headline.
         * .  1 - Put Toc just before 1st second-level title line.
         * .  2 - Put Toc just before 2nd second-level title line.
         */
        position: 1,

        ignore: '< position',

        indent: '\u0009',

        /**
         * Set falsy to disable the title of ToC section.
         */
        title: 'Table of Contents',

        /**
         * Whether to overwrite existing ToC section.
         */
        overwrite: true,
    }, options);

    if (!(opt.ignore instanceof Array)) {
        opt.ignore = [ opt.ignore ];
    }

    let NEWLINES = [ '\r\n', '\n', '\r' ];
    let newline = NEWLINES.find(n => md.indexOf(n) >= 0);
    let lines = md.split(newline);
    
    let titles = [];
    
    // Register to store the starting line no of expecting ToC.
    let tocLineno = null;

    // Next to the level of the first title line.
    let secondLevel = 0;
    
    // Count of found second level titles.
    let secondLevelTitles = 0;

    // Title line pattern.
    let re = /^(#+)(\s+)(.+)$/;

    // Whitespaces between sharps and text in second level title.
    let secondLevelIndent = null;

    // To indicate if text line is in a code block.
    let inCodeBlock = false;

    let exsitingTocBegin = null;
    let exsitingTocEnd = null;

    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return;
        }
        
        if (inCodeBlock) {
            // DO NOTHING.
            return;
        }

        if (re.test(line)) {
            let text = RegExp.$3;
            let level = RegExp.$1.length;
            let indent = RegExp.$2;
            
            if (!secondLevel) {
                secondLevel = level + 1;
                if (opt.position == -1) tocLineno = index;
                return;
            }

            if (opt.position == 0 && tocLineno == null) {
                tocLineno = index;
            }
            
            if (level == secondLevel) {
                secondLevelIndent = indent;
                secondLevelTitles++;

                if (opt.title == text && exsitingTocBegin == null) {
                    exsitingTocBegin = index;
                }
                else if (exsitingTocBegin != null && exsitingTocEnd == null) {
                    exsitingTocEnd = index - 1;
                }

                if (opt.position > 0 && secondLevelTitles == opt.position) {
                    tocLineno = index;
                }
            }

            let ignoreCurrent = false;
            if (exsitingTocBegin !== null && exsitingTocEnd == null) {
                ignoreCurrent = true;
            }

            if (!ignoreCurrent) {
                opt.ignore.every(ignore => {
                    if (ignore == text) {
                        ignoreCurrent = true;
                    }
                    else if (ignore == secondLevelTitles) {
                        ignoreCurrent = true;                        
                    }
                    else if (/^(>|>=|<|<=|=)\s*(position|\d+)?$/i.test(ignore)) {
                        let op = RegExp.$1;
                        let position = 'position' == RegExp.$2 ? opt.position : parseInt(RegExp.$2);
                        switch (op) {
                            case '>':
                                ignoreCurrent = secondLevelTitles > position;
                                break;

                            case '>=':
                                ignoreCurrent = secondLevelTitles >= position;
                                break;

                            case '<':
                                ignoreCurrent = secondLevelTitles < position;
                                break;
                        
                            case '<=':
                                ignoreCurrent = secondLevelTitles <= position;
                                break;
                            
                            case '=':
                                ignoreCurrent = secondLevelTitles == position;
                                break;
                        }
                    }
                    return !ignoreCurrent;
                });
            }
            
            if (!ignoreCurrent) {
                titles.push({ text, level });
            }
        }
        
        if (opt.position == 0 && tocLineno == null && secondLevel && line.trim() == '') {
            tocLineno = index;
            return;
        }
    });

    let tocLines = [];
    
    if (opt.title) {
        tocLines.push(`${'#'.repeat(secondLevel)}${secondLevelIndent}${opt.title}`);
        tocLines.push('');
    }

    let indent = typeof opt.indent == 'number' ? '\u0020'.repeat(opt.indent) : opt.indent;
    titles.forEach(title => {
        let text = title.text;
        let aname = text2aname(text);
        let leading = indent.repeat(title.level - secondLevel);
        tocLines.push(`${leading}* [${text}](#${aname})`);
    });

    // Remove existing ToC section.
    if (exsitingTocBegin != null && opt.overwrite) {
        if (exsitingTocEnd == null) exsitingTocEnd = lines.length;
        lines = lines.slice(0, exsitingTocBegin).concat(lines.slice(exsitingTocEnd));
        tocLineno = exsitingTocBegin;
    }

    // Insert an empty line respectively at the begining and end if necessary.
    if (tocLineno > 0 && lines[tocLineno - 1].trim() != '') {
        tocLines.unshift('');
    }
    if (lines[tocLineno].trim() != '') {
        tocLines.push('');
    }

    lines = [].concat(lines.slice(0, tocLineno), tocLines, lines.slice(tocLineno));

    return lines.join(newline);
}

module.exports = toc;