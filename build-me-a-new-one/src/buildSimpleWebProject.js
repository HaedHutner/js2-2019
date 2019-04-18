const fs = require("fs");
const path = require("path");

const simpleWebProjectKey = "simple_web_project";
const configFileName = "build-me.json"
const simpleWebProjectDirectory = "simple-web-project";

fs.readFile(path.resolve(process.cwd(), configFileName), "utf8", (err, data) => {
    // If there's an error, log it and return
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

    Object.keys(configuration[simpleWebProjectKey]).forEach(key => {
        var folder = key;
        const contents = configuration[simpleWebProjectKey][key];

        if (key == "_") {
            // Create path from the simple web project folder ( This is the root directory for the project )
            folder = path.resolve(process.cwd(), simpleWebProjectDirectory);
        } else {
            // Create empty path
            var stringPath = "";

            // Push the current working directory
            stringPath += process.cwd() + "/";

            // Push the simple web project folder name
            stringPath += simpleWebProjectDirectory + "/";

            // Push the rest of the folders described in the path
            key.split("/").forEach(part => {
                stringPath += part + "/";
            });

            // Create the path
            folder = path.resolve(stringPath);
        }

        // Check if folder exists already
        // If it doesn't, create it and then create the contents,
        // otherwise, just create the contents
        if (!fs.existsSync(folder)) {
            fs.mkdir(folder, (err) => {
                // If an error occured while creating the folder, log it
                if (err) {
                    console.log(err);
                } else {
                    createContents(folder, contents);
                }
            });
        } else {
            createContents(folder, contents);
        }
    });
}

function createContents(folder, contents) {
    contents.forEach(file => {
        if (file.endsWith(".html")) {
            createHTML(file, folder.toString());
        }

        if (file.endsWith(".css")) {
            createCSS(file, folder.toString());
        }

        if (file.endsWith(".js")) {
            createJS(file, folder.toString());
        }
    });
}

function copyTemplate(templateName, pathToFolder, targetFileName) {
    // Copy the specified template from the template file, to the target file. If an error occurs, log it.
    fs.copyFile(path.resolve(__dirname, "templates", templateName), path.resolve(pathToFolder, targetFileName), (err) => {
        if (err) {
            console.log("Error while creating file " + targetFileName + " in folder " + pathToFolder + ": " + err);
        }
    });
}

function createHTML(fileName, pathToFolder) {
    // Create an html template at the target
    copyTemplate("template.html", pathToFolder, fileName);
}

function createCSS(fileName, pathToFolder) {
    // Create a css template at the target
    copyTemplate("template.css", pathToFolder, fileName);
}

function createJS(fileName, pathToFolder) {
    // Create a javascript template at the target
    copyTemplate("template.js", pathToFolder, fileName);
}