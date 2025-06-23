const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // מגיש את index.html

app.post('/submit', (req, res) => {
  const data = req.body;
  const line = `${new Date().toISOString()}, ${data.name}, ${data.confirmed}, ${data.numberOfGuests}\n`;

  fs.appendFile('rsvps.csv', line, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('שגיאה בשמירה');
    }
    res.send('תודה על אישורך!');
  });
});

app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});
