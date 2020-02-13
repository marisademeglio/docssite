# TODO

travis build error re  `history` folder

travis LIVE_HISTORY undefined

don't link to latest e.g. 0.3.0 from docs page

how about keeping versions in /version/ subdir to keep it cleaner


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

It is necessary to build a second copy of the site in a versioned subdirectory, because the links will be different than in the top-level site. We also remove versions.js in this copy, just to reduce confusion, since it should never be called directly (rather, the top-level version should always be used).

## example

```
export TRAVIS_TAG=0.1.0
export VERSION=$TRAVIS_TAG
WRITE_VERSION=no
npm run build
WRITE_VERSION=yes
npm run build
```

This puts the contents in `_site/` and also creates `_site/history/0.1.0.zip`. 

Then when `TRAVIS_TAG` is updated, e.g. to `0.2.0`, the directory listing becomes:

```
_site/
    css/
    docs/
    index.html
    0.1.0/
        css/
        docs/
        index.html
    history/
        0.1.0.zip
        0.2.0.zip
```

The `0.1.0/` directory was created from `history/0.1.0.zip`, saved from the first build and downloaded from the site specified in `LIVE_HISTORY` for the second build to use.

`_site/` always has the latest version. 

`_site/history/` always has a zipped copy of each version

## Test locally

run `test.sh`

## Settings

### Environment variables

`VERSION`: The current version number

`WRITE_VERSION`: `yes` or `no`, depending on if the site should be written to a version subdirectory.

`LIVE_HISTORY`: Where to download `/history/*.zip` files from

### `site.json`

`rootSubdir`: The path prefix for the site, not considering the version. We need to store this separately because when we run eleventy to generate the verisoned subdirs, we set its `pathPrefix` setting to `rootSubdir + version`. So we need to know the `rootSubdir` independently of this.

`docsSubdir`: This is a magic string that will always be meaningful across versions as the home of the documentation section (even if it just redirects to elsewhere).

*Do not* use beginning or ending slashes with either of these properties.

### `versions.json`

List all versions to date and mark one as current.

There is an experiment, not currently in use, in `prebuild.js` to add to this file each time the site is built with a new version, but that relies on pushing the file back to the repo (and likely Travis would be in charge of this). I don't know how much we want to rely on that - e.g. Travis may not be so great at resolving git conflicts, should they arise. Also, it's a bit opaque to do it this way, although it reduces risk of human error in, say, forgetting to update the file.

## Marking if a page is not current and listing current and previous versions

This depends on `versions.js` existing at the root level of the site (so: `$rootSubdir + /versions.js`). 

`versions.js` is generated from a template `versions.njk` and it gets omitted for versioned subdirectory builds. This process is managed in `.eleventy.js` via modifying the `.eleventyignore` file. 

# To decide

Should the top-level navigation links in, for example, `/0.1.0/docs` point to the latest pages or the pages that go with that version? E.g. "About", "Home page". 

In this experiment, the whole site is versioned, so the site-wide navigation links are restricted to that version.

A banner appears on each older page saying that it is not the latest.


