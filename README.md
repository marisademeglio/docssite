# TODO

how about keeping versions in /version/ subdir to keep it cleaner


# docssite
Versioned documentation static site generator.

To build:

```
npm run build
```

This runs 11ty twice: once to create `_site`; once to create `_site/${version}`.

It is necessary to build a second copy of the site in a versioned subdirectory, because the links will be different than in the top-level site. We also remove versions.js in this copy, just to reduce confusion, since it should never be called directly (rather, the top-level version should always be used).

`_site/` always has the latest version. 

`_site/history/` always has zipped copies of each version

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

`site.js` is another top-level javascript file. It has functions for calculating paths.

## Tags

Documentation pages must be tagged "docs". This enables differentiating the "you're on an old page" notification - we can say specifically "you're on an old documentation page, go to the latest documentation".

## Exposed to the user

Although top-level pages are published for each version, they are not linked to.

So, while a user could enter http://site.com/0.1.0/about, there is no direct link to this page. All pages' navigation points to top-level `/about`. 

An old page will generate a notificiation: "You're on an old page, go to the latest site", which leads to the start page of the site.

An old documentation page will generate a documentation-specific version of that notification (see above).
