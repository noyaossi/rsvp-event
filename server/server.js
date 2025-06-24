const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // מגיש את index.html

app.post('/submit', (req, res) => {
  const data = req.body;
  console.log('🟢 התקבלה בקשה:', data); // הדפסה לטרמינל
  const line = `${new Date().toISOString()}, ${data.name}, ${data.confirmed}, ${data.numberOfGuests}\n`;

  fs.appendFile('rsvps.csv', line, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('שגיאה בשמירה');
    }
    res.send('תודה על אישורך!');
  });
});

// שליחה של guests.json ל-Frontend
app.get('/api/guests', (req, res) => {
  res.sendFile(path.join(__dirname, 'guests.json'));
});


app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});
