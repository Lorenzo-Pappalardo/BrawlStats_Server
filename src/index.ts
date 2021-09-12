import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

const port = 3000;
const TOKEN = process.env.TOKEN;

app.get('/players/:tag', (req, res) => {
  console.log(`From: ${req.ip}\t\t\tPath: ${req.url}`);

  const before = new Date().getTime();

  axios
    .get(`https://api.brawlstars.com/v1/players/${encodeURIComponent('#' + req.params.tag)}`, {
      headers: { accept: 'application/json', authorization: `Bearer ${TOKEN}` },
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });

  const after = new Date().getTime();

  console.log(`Duration: ${after - before} ms\n`);
});

app.listen(port, () => {
  console.log('Server started!\nTOKEN: ' + TOKEN + '\n');
});
