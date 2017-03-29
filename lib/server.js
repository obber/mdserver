import express from 'express';
import jade from 'pug';
import path from 'path';
import bluebird from 'bluebird';
import removeExt from 'remove-ext';
import fs from 'fs';
import Promise from 'bluebird';
import {
  hasMdExtension,
  sendFile,
  sendError
} from './utils';

Promise.promisifyAll(require('fs'));

const init = (port, directory) => {
  const app = express();
  app.set('view engine', 'pug');
  app.set('views', path.resolve(__dirname, 'views'));

  console.log('dir = ', directory);

  app.get('*', async (req, res) => {
    try {
      if (req.url === '/') {
        req.url = '/index.md';
      }

      // remove trailing slash
      if (req.url[req.url.length - 1] === '/') {
        req.url = req.url.slice(0, req.url.length - 1);
      }

      if (!hasMdExtension(req.url)) {
        const accessible = await fs.accessAsync(path.resolve(directory + req.url));
        if (accessible) {
          const content = await fs.readFileAsync(path.resolve(directory + req.url + '.md'), 'utf8');
          sendFile(content, res);
        } else {
          sendError(404, 'page not found', res);
        }
      } else {
        const content = await fs.readFileAsync(path.resolve(directory + req.url), 'utf8');
        sendFile(content, res);
      }
    } catch(e) {
      console.log('e = ', e);
      sendError(500, 'internal server error', res);
    }

  });

  app.listen(port)
  console.log(`Markdown server running on port ${port}`);
}

module.exports = init;
