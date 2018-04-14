'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , toc = require('../index')
    ;

describe('generate ToC for markdown', () => {
    let md = noda.inRead('README.md', 'utf8');

    it('normal', () => {
        assert(toc(md));
    });
   
    it('put at position', () => {
        assert(toc(md, { position: 2 }));
    });

    it('ignore', () => {
        assert(toc(md, { ignore: [1, 2] }));
        assert(toc(md, { ignore: '> 3' }));
        assert(toc(md, { ignore: '>= position' }));
    });
});