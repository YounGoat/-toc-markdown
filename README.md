#	@toc/markdown
__ToC generator for markdown.__

>	If links in this document not avaiable, please access [README on GitHub](./README.md) directly.

##  Description

Analyse markdown text and generate *Table of Contents*.

##	Table of Contents

* [Get Started](#get-started)
* [API](#api)
* [Links](#links)

##	Get & Started

*   API mode
    ```javascript
    const toc = require('@toc/markdown');

    toc(markdownText);
    // Return markdown text containing a "Table of Contents" section.
    ```

*   CLI mode
    ```bash
    # Install globally.
    # Command `toc-md` will be created.
    npm install -g @toc/markdown

    # Read markdown file and write markdown text with "Table of Contents" 
    # section into another file.
    toc-md /path/of/input.md /path/of/output.md
    ```

##	API

*   void __toc__( string *markdownText* [, Object *options* ])

*options* may contain following properties:
*   __options.indent__ *number* | *string* DEFAULT "\u0009"  
    Indent used on creating sub list in the ToC catalog. The default value is a TABSTOP character.

*   __options.ignore__ *string* | *string[]* DEFAULT "\< position"  
    Indicate what titles should be ignored.  
    The possible values may be:
    ```javascript
    // Titles of sections preceding ToC section will be ingored.
    { ignore: '< position' }

    // Titles of sections following ToC section will be ingored.
    { ignore: '> position' }

    // Title of section No.3 will be ignored.
    { ignore: 3 }

    // Title of section No.1, No.2, No.9 and the following will be ignored.
    { ignore: [ 1, 2, '> 9' ] }
    ```

*   __options.position__ *number* DEFAULT 1  
    Indicate where to put the generated ToC section.  
    -1 means to put ToC at first (before the headline), while 0 to put ToC just after the headline.   
    If the value is larger than 0, ToC will be put just before the n-th second leve title line.

*   __options.title__ *string* DEFAULT "Table of Contents"  
    If set falsy, generated ToC will be bare without section title.
    
*   __options.overwrite__ *boolean* DEFAULT true  
    Whether to overwrite existing ToC section (a second level section with the same title equals to __options.title__).

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/-toc-markdown)