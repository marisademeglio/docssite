// zip up the output
// input: _site
// output: _site/versions/{versions.json.latest}.zip

// also have a local place to store these
// so we can simulate the "downloading" later

const rimraf = require('rimraf');
const fs = require('fs-extra');
const { zip } = require('zip-a-folder');
const path = require('path');
const axios = require('axios');
const unzipper = require('unzipper');

console.log("Version? ", process.env.VERSION);
console.log("Write version? ", process.env.WRITE_VERSION);
console.log("Live history? ", process.env.LIVE_HISTORY);

// get the list of previous versions from src/_data/versions.json
const versions = JSON.parse(fs.readFileSync('src/_data/versions.json'));

(async () => {
    
    // download all the previous zips from the current website
    // save them in _site/history
    let broken = [];
    await Promise.all(versions.releases.map(async v => {
        if (v != versions.latest) {
            try {
                console.log("Downloading zip of ", v);
                let zipfile = v + '.zip';
                let result = await axios.get(`${process.env.LIVE_HISTORY}/${zipfile}`, 
                {
                    responseType: 'arraybuffer'
                });
                const dest = path.join(__dirname, '_site/history/', zipfile);
                console.log("Saving ", dest);
                await fs.writeFile(dest, result.data); 

                // unzip them into _site
                console.log("Inflating to _site: ", dest);
                let unzip = await unzipper.Open.file(dest);
                await unzip.extract({path: path.join(__dirname, '_site/' + v), concurrency: 5});
            }
            catch(err) {
                broken.push(v);
            }
        }       
    }));

    
    // report which versions did not work
    if (broken.length > 0 ) {
        console.log("ERROR: Site version(s) not found or could not be unzipped ", broken.join(", "));
    }

    // save our current version from the versioned subdir output
    let outdir = path.join(__dirname, `/_site/${process.env.VERSION}`);
    console.log("Zipping current folder ", outdir);
    await zip(outdir, path.join(__dirname, `/_site/history/${process.env.VERSION}.zip`));
    // remove the versioned subdir - we don't need it as it was for the latest version of the site
    console.log("Deleting folder ", outdir);
    await rimraf(outdir, err => {
        if (err) {
            console.log(`Error removing ${outdir}`);
        }
    });
    
})();

async function zipAndDelete(dir) {
    return new Promise((resolve, reject) => {
        console.log(dir);
        var outdirZip = zip.folder(dir);
        outdirZip
        .generateNodeStream({type:'nodebuffer',streamFiles:true})
        .pipe(fs.createWriteStream('out.zip'))
        .on('finish', function () {
            // then delete it
            rimraf(dir + 'x', err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    });
}