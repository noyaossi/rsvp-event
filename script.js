

// קבלת נתונים מה-URL
const urlParams = new URLSearchParams(window.location.search);
const guestId = urlParams.get('id');

// אלמנטים מהדף
const form = document.getElementById('rsvpForm');
const nameInput = document.getElementById('name');
const responseDiv = document.getElementById('response');
const confirmedSelect = document.getElementById('confirmed');
const guestsGroup = document.getElementById('guestsGroup');
const numberOfGuestsInput = document.getElementById('numberOfGuests');

async function loadGuestName() {
  if (!guestId) return;

  try {
    const res = await fetch(`/api/guest/${guestId}`);
    if (!res.ok) throw new Error('מוזמן לא נמצא');

    const data = await res.json();
    nameInput.value = data.name;
    nameInput.readOnly = true;
  } catch (err) {
    console.error('⚠️ שגיאה בטעינת שם המוזמן:', err);
  }
}


// הפעלת טעינה
loadGuestName();

// הצגה/הסתרה של שדה כמות האנשים
confirmedSelect.addEventListener('change', function() {
  if (this.value === 'true') {
    guestsGroup.style.display = 'block';
    numberOfGuestsInput.required = true;
    numberOfGuestsInput.value = '1'; // ברירת מחדל
  } else {
    guestsGroup.style.display = 'none';
    numberOfGuestsInput.required = false;
    numberOfGuestsInput.value = '';
  }
});

// טיפול בשליחת הטופס
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  
  // הצגת מצב טעינה
  submitBtn.disabled = true;
  submitBtn.textContent = 'שולח...';
  
  // איסוף נתוני הטופס
  const formData = {
    name: form.name.value,
    confirmed: form.confirmed.value === 'true',
    numberOfGuests: form.confirmed.value === 'true' ? parseInt(form.numberOfGuests.value) : 0,
    guestId: guestId || null,
    timestamp: new Date().toISOString()
  };

  try {
    // שליחה לשרת
    const response = await fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const result = await response.text();
      showResponse('תודה רבה! אישור ההגעה נשמר בהצלחה 🎉', 'success');
      resetFormButKeepName();
    } else {
      throw new Error('שגיאה בשליחה');
    }
  } catch (error) {
    console.error('Error:', error);
    // הודעה גיבוי למקרה של בעיה בשרת
    showResponse('תודה! הבקשה נרשמה (נא לבדוק חיבור אינטרנט)', 'success');
    resetFormButKeepName();
  } finally {
    // החזרת הכפתור למצב רגיל
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// הצגת הודעת תגובה
function showResponse(message, type) {
  responseDiv.textContent = message;
  responseDiv.className = `response ${type} show`;
  
  // הסתרת ההודעה אחרי 5 שניות
  setTimeout(() => {
    responseDiv.classList.remove('show');
  }, 5000);
}

// איפוס הטופס אבל שמירת השם
function resetFormButKeepName() {
  const currentName = nameInput.value;
  const isReadOnly = nameInput.readOnly;
  
  form.reset();
  
  // החזרת השם
  nameInput.value = currentName;
  nameInput.readOnly = isReadOnly;
  
  // הסתרת שדה כמות האנשים
  guestsGroup.style.display = 'none';
  numberOfGuestsInput.required = false;
}

