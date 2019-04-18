const fs = require("fs");
const path = require("path");

const simpleWebProjectKey = "simple_web_project";
const configFileName = "build-me.json"
const simpleWebProjectDirectory = "simple-web-project";

fs.readFile(path.resolve(process.cwd(), configFileName), "utf8", (err, data) => {

    if (err) {
        console.log(err);
        return;
    }
    
    const configuration = JSON.parse(data);

    if (configuration) {
        createProject(configuration);
    } else {
        console.log("Configuration file could not be loaded from contents: " + configuration);
    }
});

function createProject(configuration) {
    fs.mkdir(path.resolve(process.cwd(), simpleWebProjectDirectory), (err) => console.log(err));

    Object.keys(configuration).forEach(key => {
        var folder = key;
        const contents = configuration[key];

        if (key == "_") {
            folder = path.resolve(process.cwd(), simpleWebProjectDirectory);
        } else {
            var stringPath = process.cwd() + "/" + simpleWebProjectDirectory;
            key.split("/").forEach(part => stringPath += (part + "/"));
            console.log(typeof stringPath);
            folder = path.resolve(path)
        }

        fs.mkdir(folder);

        for (file in contents) {
            if (file.endsWith(".html")) {
                createHTML(file, folder.toString());
            }

            if (file.endsWith(".css")) {
                createCSS(file, folder.toString());
            }

            if (file.endsWith(".js")) {
                createJS(file, folder.toString());
            }
        }
    });
}

function copyTemplate(templateName, pathToFolder, targetFileName) {
    fs.copyFile(path.resolve(__dirname, "templates", templateName), path.resolve(pathToFolder, targetFileName), (err) => {
        console.log("Error while creating file " + targetFileName + " in folder " + pathToFolder + ": " + err);
    });
}

function createHTML(fileName, pathToFolder) {
    copyTemplate("template.html", pathToFolder, fileName);
}

function createCSS(fileName, pathToFolder) {
    copyTemplate("template.css", pathToFolder, fileName);
}

function createJS(fileName, pathToFolder) {
    copyTemplate("template.js", pathToFolder, fileName);
}