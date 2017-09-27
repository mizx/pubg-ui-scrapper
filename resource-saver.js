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
    const body = resource.getText();
    const filename = resource.getFilename();

    if (filename.match(REGEX)) {
      // if filename is hashed, remove the hash
      const unhashedFilename = filename.replace(REGEX, `$1.$3`);

      this.writeFile(unhashedFilename, body)
        .then(() => {
          this.loadedResources.push(resource);
        });
    }

    return this.writeFile(filename, body)
      .then(() => {
        this.loadedResources.push(resource);
      });
  }

  absoluteFilename(filename) {
    return path.join(this.absoluteDirectoryPath, filename);
  }

  writeFile(filename, body) {
    filename = this.absoluteFilename(filename);

    return fs.outputFile(filename, body, { encoding: 'binary' });
  }

  errorCleanup(error) {
    console.error(error);
  }

}

module.exports = ResourceSaver;
