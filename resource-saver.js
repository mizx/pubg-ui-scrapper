const path = require('path');
const fs = require('fs-extra');

const REGEX = /(.+[a-z]+)(\.[0-9a-f\.]+)(bundle\.[a-z]+)/;

class ResourceSaver {

  constructor() {
    const directory = 'data';

    this.absoluteDirectoryPath = path.resolve(process.cwd(), directory);
    this.loadedResources = [];
  }

  saveResource(resource) {
    const text = resource.getText();
    let filename = resource.getFilename();

    if (filename.match(REGEX)) {
      // if filename is hashed, remove the hash
      filename = filename.replace(REGEX, `$1.$3`);
    }

    const absoluteFilename = path.join(this.absoluteDirectoryPath, filename);

    return fs.outputFile(absoluteFilename, text, { encoding: 'binary' })
      .then(() => {
        this.loadedResources.push(resource);
      });
  }

  errorCleanup(error) {
    console.error(error);
  }

}

module.exports = ResourceSaver;
