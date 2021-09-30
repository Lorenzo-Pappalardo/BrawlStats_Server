import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { writeFileSync } from 'fs';

const app = express();
app.use(cors());

const port = 3000;
const TOKEN = process.env.TOKEN;
const logging: string = process.env.LOGGING || 'false';

function logToFile(data: string, path?: string) {
  const realPath: string = path !== undefined ? path : 'log.json';
  writeFileSync(realPath, JSON.stringify(data));
  console.log('Logged request to ' + realPath);
}

app.get('/players/:tag', (req, res) => {
  console.log(`From: ${req.ip}\t\t\tPath: ${req.url}`);

  const before = new Date().getTime();

  axios
    .get(`https://api.brawlstars.com/v1/players/${encodeURIComponent('#' + req.params.tag)}`, {
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    })
    .then((response) => {
      res.send(response.data);
      return response;
    })
    .catch((err) => {
      res.send(err);
      return err;
    })
    .then((response) => {
      if (logging === 'true') {
        logToFile(response.data);
      }

      const after = new Date().getTime();

      console.log(`Duration: ${after - before} ms\n`);
    });
});

app.listen(port, () => {
  console.log('Server started!\nTOKEN: ' + TOKEN + '\n');
});
