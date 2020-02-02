const nunjucks = require('nunjucks');
const { DateTime } = require("luxon");
const util = require('util');
const fs = require('fs');
const sitejson = JSON.parse(fs.readFileSync("src/_data/site.json"));
const semverCompare = require('semver/functions/compare');

module.exports = function (eleventyConfig) {

    // we want the "latest.js" file to exist only at the top level, because it is the single source of truth for site versioning
    // so, add it to the ignores list if we are writing a version (i.e. to a subfolder)
    if (process.env.WRITE_VERSION == 'yes') {
        const dynamicIgnores = [`src/latest.njk`];
        fs.copyFileSync(".eleventyignore", ".eleventyignore.bak");
        let ignore = fs.readFileSync('.eleventyignore');
        ignore += `\n${dynamicIgnores.join('\n')}`;
        fs.writeFileSync(".eleventyignore", ignore);
    }
    else {
        if (fs.existsSync(".eleventyignore.bak")) {
            fs.copyFileSync(".eleventyignore.bak", ".eleventyignore");
        }
    }

    let nunjucksEnv = new nunjucks.Environment(
        new nunjucks.FileSystemLoader("src/_includes")
    );

    eleventyConfig.addFilter("readableDate", dateObj => {
        let retval = DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy", { zone: 'utc'});
        return retval;
    });
    
    eleventyConfig.addFilter("head", (array, n) => {
        if (n < 0) {
            return array.slice(n);
        }
        return array.slice(0, n);
    });

    eleventyConfig.addFilter('dump', obj => {
        return util.inspect(obj)
    });

    eleventyConfig.addFilter('version', () => process.env.VERSION);

    eleventyConfig.addFilter('sortSemver', list => list.sort((a,b) => semverCompare(a,b)));


    // calculate the path to the site, taking version into account
    let getSitePath = version => {
        let sitePath = '';
        if (version != '') {
            sitePath = `/${version}`;
        }
        if (sitejson.rootSubdir != '') {
            sitePath = `/${sitejson.rootSubdir}${sitePath}`;
        }
        return sitePath;
    };
    
    // calculate the path to the docs subdir, taking version into account
    eleventyConfig.addFilter('getDocsPath', version => {
        let sitePath = getSitePath(version);
        let docsPath = `${sitePath}/${sitejson.docsSubdir}`;
        return docsPath;
    });

    eleventyConfig.addFilter('addSiteRootPath', file => 
        `${sitejson.rootSubdir != "" ? `abc` : ''}/${file}`);

    // for when the site is served locally with browsersync (e.g. via eleventy --serve)
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
         ready: function(err, bs) {
           const content_404 = fs.readFileSync(`_site/404.html`);
           bs.addMiddleware("*", (req, res) => {
            // Provides the 404 content without redirect.
            res.write(content_404);
            res.end();
          });
         }
        }
      });
    
    eleventyConfig.setLibrary("njk", nunjucksEnv);
    
    let markdownIt = require("markdown-it");
    let markdownItAnchor = require("markdown-it-anchor");
    let options = {
        html: true,
        breaks: true,
        linkify: true
    };
    let opts = {
        // permalink: true,
        // permalinkClass: "direct-link",
        // permalinkSymbol: "#"
    };

    eleventyConfig.setLibrary("md", markdownIt(options)
        .use(markdownItAnchor, opts)
    );

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.setDataDeepMerge(true);

    if (process.env.WRITE_VERSION) {
        console.log("Writing site to versioned subdirectory");
    }
    else {
        console.log("Writing site to main directory");
    }
    let pathPrefix = process.env.WRITE_VERSION === 'yes' ? getSitePath(process.env.VERSION) : getSitePath('');
    console.log('PATH PREFIX: ', pathPrefix);
    return {
        templateFormats: [
            "md",
            "njk",
            "html",
            "liquid"
        ],
        pathPrefix,
        passthroughFileCopy: true,
        dir: {
            input: "src",
            output: `_site/${process.env.WRITE_VERSION==='yes' ? process.env.VERSION : ''}`
        }
    };
};
