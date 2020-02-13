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

const versions = JSON.parse(fs.readFileSync('src/_data/versions.json'));

console.log("Version? ", process.env.DOCSSITE_VERSION);
console.log("Write version? ", process.env.DOCSSITE_WRITE_VERSION);
console.log("Live history? ", process.env.DOCSSITE_HISTORY_URL);


(async () => {
    
    // download all the previous zips from the current website
    // save them in _site/history
    let broken = [];
    let historyFolder = path.join(__dirname, '_site/history/');
    if (!fs.existsSync(historyFolder)) {
        console.log("Creating ", historyFolder);
        fs.mkdirSync(historyFolder);
    }
    if (!fs.existsSync("_site/version/")) {
        console.log("Creating _site/version/");
        fs.mkdirSync("_site/version/");
    }
    
    await Promise.all(versions.map(async v => {
        if (v != process.env.DOCSSITE_VERSION) {
            try {
                let zipfile = `${process.env.DOCSSITE_HISTORY_URL}/${v}.zip`;
                console.log("Downloading ", zipfile);

                let result = await axios.get(zipfile, {
                    responseType: 'arraybuffer'
                });
                const dest = path.join(historyFolder, v + '.zip');
                console.log("Saving ", dest);
                await fs.writeFile(dest, result.data); 

                // unzip them into _site
                console.log("Inflating to _site: ", dest);
                let unzip = await unzipper.Open.file(dest);
                await unzip.extract({path: path.join(__dirname, '_site/version/' + v), concurrency: 5});
            }
            catch(err) {
                console.log(err);
                broken.push(v);
            }
        }       
    }));

    
    // report which versions did not work
    if (broken.length > 0 ) {
        console.log("ERROR: Site version(s) not found or could not be unzipped ", broken.join(", "));
    }

    // save our current version from the versioned subdir output
    let outdir = path.join(__dirname, `/_site/version/${process.env.DOCSSITE_VERSION}`);
    console.log("Zipping current folder ", outdir);
    await zip(outdir, path.join(historyFolder, `${process.env.DOCSSITE_VERSION}.zip`));
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