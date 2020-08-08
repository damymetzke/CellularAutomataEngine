const fs = require("fs").promises;
const path = require("path");

function Walk(rootDirectory, targetDirectory)
{
    fs.mkdir(targetDirectory, { recursive: true })
        .then(() =>
        {
            return fs.readdir(rootDirectory);
        })
        .then((files) =>
        {
            return Promise.all([
                Promise.all(files.map((file) =>
                {
                    return fs.lstat(path.join(rootDirectory, file));
                })),
                Promise.resolve(files)
            ]);
        })
        .then(([ stats, files ]) =>
        {
            return stats.map((stat, index) =>
            {
                const file = files[ index ];
                const source = path.join(rootDirectory, file);
                const target = path.join(targetDirectory, file);

                if (stat.isDirectory())
                {
                    Walk(source, target);
                    return Promise.resolve(undefined);
                }

                console.log("copying: ", source, " >> ", target);
                return fs.copyFile(source, target);

            });
        })
        .catch((error) =>
        {
            console.error("ERROR: ", error);
        });
}

Walk("./html", "./build");