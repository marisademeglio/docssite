# docssite
Versioned documentation static site generator.

To build:

```
export VERSION=$TRAVIS_TAG
WRITE_VERSION=no
npm run build
WRITE_VERSION=yes
npm run build
```

This puts the contents in `_site/` and, for example, `_site/0.1.0/`. 

Then when `TRAVIS_TAG` is updated, e.g. to `0.2.0`, the directory listing is now:

```
_site/
    css/
    docs/
    index.html
    0.1.0/
        css/
        docs/
        index.html
    0.2.0/
        css/
        docs/
        index.html
```

`_site/` always has the latest version. 

## Settings

### Environment variables

`VERSION`: The current version number

`WRITE_VERSION`: `yes` or `no`, depending on if the site should be written to a version subdirectory.

### `site.json`

`rootSubdir`: The path prefix for the site, not considering the version. We need to store this separately because when we run eleventy to generate the verisoned subdirs, we set its `pathPrefix` setting to `rootSubdir + version`. So we need to know the `rootSubdir` independently of this.

`docsSubdir`: This is a magic string that will always be meaningful across versions as the home of the documentation section (even if it just redirects to elsewhere).

*Do not* use beginning or ending slashes with either of these properties.

### `versions.json`

List all versions to date and mark one as current.

There is an experiment in `prebuild.js` to add to this file each time the site is built with a new version, but that relies on pushing the file back to the repo (and likely Travis would be in charge of this). I don't know how much we want to rely on that - e.g. Travis may not be so great at resolving git conflicts, should they arise. Also, it's a bit opaque to do it this way, although it reduces risk of human error in, say, forgetting to update the file.

## Marking if a page is not current and listing current and previous versions

This depends on `latest.js` existing at the root level of the site (so: `$rootSubdir + /latest.js`). 

`latest.js` is generated from a template `latest.njk` and it gets omitted for versioned subdirectory builds. This process is managed in `.eleventy.js` via modifying the `.eleventyignore` file. 
