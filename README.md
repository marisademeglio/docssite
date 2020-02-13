# TODO

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

`EPUBCHECK_SITE_WRITE_VERSION`: `yes` or `no`, depending on if the site should be written to a version subdirectory.

`EPUBCHECK_SITE_LIVE_HISTORY`: Where to download `/history/*.zip` files from, e.g. `http://localhost:8181/history`.

`EPUBCHECK_SITE_ROOT_SUBDIR`: The subdirectory that the site is deployed to, e.g. for `http://localhost:8080/SUBDIR`, the value should be `SUBDIR`. We need to store this separately because when we run eleventy to generate the verisoned subdirs, we set its `pathPrefix` setting to `EPUBCHECK_SITE_ROOT_SUBDIR + version`. So we need to know the root subdirectory independently of this.

*Do not* use beginning or ending slashes with any of these properties.

### `site.json`

`docsSubdir`: This is a magic string that will always be meaningful across versions as the home of the documentation section (even if it just redirects to elsewhere).

*Do not* use beginning or ending slashes with this property.

### `versions.json`

List all versions to date and mark one as current.

## Marking if a page is not current and listing current and previous versions

This depends on `versions.js` existing at the root level of the site (so: `EPUBCHECK_SITE_ROOT_SUBDIR + /versions.js`). 

`versions.js` is generated from a template `versions.njk` and it gets omitted for versioned subdirectory builds. This process is managed in `.eleventy.js` via modifying the `.eleventyignore` file. 

# To decide

Should the top-level navigation links in, for example, `/0.1.0/docs` point to the latest pages or the pages that go with that version? E.g. "About", "Home page". 

In this experiment, the whole site is versioned, so the site-wide navigation links are restricted to that version.

A banner appears on each older page saying that it is not the latest.


