// experiment that would require Travis to re-commit the source code
// not sure if we want this
/* 
Add TRAVIS_TAG to versions.json and mark as latest
These versions are for the software that the website is for, NOT the version in the website's package.json
So, the version number comes from process.env.TRAVIS_TAG
*/
/*const fs = require('fs-extra');
let versionsJsonPath = 'src/_data/versions.json';
let file = fs.readFileSync(versionsJsonPath);
let versions = JSON.parse(file);

let tag = process.env.TRAVIS_TAG;
// add if does not exist
if (versions.releases.indexOf(tag) == -1) {
    versions.releases.push(tag);
}
versions.latest = tag;

fs.writeFileSync(versionsJsonPath, JSON.stringify(versions));
*/
