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

app.get('/api/guest/:id', (req, res) => {
  const guestId = req.params.id;

  fs.readFile(path.join(__dirname, 'guests.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('שגיאה בקריאת קובץ:', err);
      return res.status(500).send('שגיאה בשרת');
    }

    const guests = JSON.parse(data);
    const guest = guests[guestId];

    if (guest) {
      res.json({ name: guest.name });
    } else {
      res.status(404).json({ error: 'מוזמן לא נמצא' });
    }
  });
});



app.listen(PORT, () => {
  console.log(`השרת רץ על http://localhost:${PORT}`);
});
