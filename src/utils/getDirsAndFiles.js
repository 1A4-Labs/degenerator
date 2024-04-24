const fs = require("fs");

function getDirs (source) {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}
function getFiles (path, dirName){
    let source = path + "/" + dirName
    return {
        dir: dirName,
        files: fs.readdirSync(source, { withFileTypes: true })
        .filter(file => file.isFile())
        .map(file => file.name)
    }
}

module.exports = function getDirsAndFiles (path){
    let final = []
    getDirs(path).forEach(element => {
        if(element != '.DS_Store')
            final.push(getFiles(path, element))
    })   
    return final
}