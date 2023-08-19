const { glob } = require('glob');

const path = require('path');

async function deleteCachefiles(file) {
    const filepath = path.resolve(file);
    if (require.cache[filepath]) delete require.cache[filepath];
}

async function loadFiles(dirname) {
    let jsFiles = [];

    // Get the contents of `dir`
    try {
        const files = await glob(path.join(process.cwd(), dirname, '**/*.js').replace(/\\/g, '/'));
        const jsFiles = files.filter(file => path.extname(file) === '.js');
        await Promise.all(jsFiles.map(deleteCachefiles));
        return jsFiles;
    } catch (error) {
        console.error(`Error loading files from directory  ${dirname} : ${error}`)
    }
    return jsFiles;
}
module.exports = { loadFiles };
