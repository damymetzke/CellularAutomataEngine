const sass = require("sass");
const fs = require("fs").promises;
const path = require("path");

const SOURCE = "./style/index.scss";
const TARGET = "./build/style/style.css";
const MAP_TARGET = `${TARGET}.map`;

const styleData = sass.renderSync({
    file: SOURCE,
    sourceMap: true,
    outFile: TARGET
});

fs.mkdir(path.dirname(TARGET), { recursive: true })
    .then(() =>
    {
        return Promise.all([
            fs.writeFile(TARGET, styleData.css),
            fs.writeFile(MAP_TARGET, styleData.map)
        ]);
    })
    .catch((error) =>
    {
        console.error("ERROR: ", error);
    });