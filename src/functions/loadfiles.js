const { glob } = require('glob');

const path = require('path');

const deleteCachefiles = async (file) => {
    console.log(file);
    const filepath = path.resolve(file);
    if (require.cache[filepath]) delete require.cache[filepath];
}

const loadFiles = async (dirname) => {
    try {
        const files = await glob(path.join(process.cwd(), dirname, '**/*.js').replace(/\\/g, '/'));
        const jsfiles = files.filter(file => path.extname(file) === '.js');
        await Promise.all(jsfiles.map(deleteCachefiles));
        return jsfiles;
    } catch (error) {
        console.error(`Error loading files from dir ${dirname} : ${error}`)
        throw error;
    }
}
module.exports = { loadFiles };
