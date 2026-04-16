const subjectInput = document.getElementById('subject');
const durationSelect = document.getElementById('duration');
const fileInput = document.getElementById('quizfile');
const fileNameDisplay = document.getElementById('fileName');
const startBtn = document.querySelector('.start-btn');   // Make sure your green button has class="start-btn"


 // Show selected file name
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = fileInput.files[0].name;
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
});

// Start Test Button - Main Logic
startBtn.addEventListener('click', () => {
  const subject = subjectInput.value.trim();
  const duration = durationSelect.value;

  // Validation
  if (!subject) {
    alert('Please enter a subject name!');
    return;
  }
  if (!duration) {
    alert('Please select test duration!');
    return;
  }
  if (!fileInput.files.length) {
    alert('Please choose a PDF or JPG file first!');
    return;
  }

  const file = fileInput.files[0];
  const fileURL = URL.createObjectURL(file);

  // Open new tab with timer + viewer
  const newWindow = window.open('', '_blank');

  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject} - ${duration} min Quiz</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f0f2f5;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }
        #timer {
          position: fixed;
          top: 15px;
          right: 20px;
          font-size: 28px;
          font-weight: bold;
          color: #e74c3c;
          background: white;
          padding: 10px 20px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          z-index: 1000;
        }
        #viewer {
          width: 100%;
          height: 100vh;
          border: none;
        }
        #done {
          display: none;
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.85);
          color: white;
          font-size: 50px;
          font-weight: bold;
          text-align: center;
          padding-top: 35vh;
          z-index: 2000;
        }
      </style>
    </head>
    <body>
      <div id="timer">Time Left: ${duration}:00</div>
      
      ${file.type.includes('image') 
        ? `<img id="viewer" src="${fileURL}" alt="Quiz Paper">` 
        : `<iframe id="viewer" src="${fileURL}"></iframe>`}
      
      <div id="done">Your test is completed!</div>

      <script>
        let timeLeft = ${duration} * 60;
        const timerEl = document.getElementById('timer');
        const doneEl = document.getElementById('done');
        const viewer = document.getElementById('viewer');

        const countdown = setInterval(() => {
          timeLeft--;
          const min = Math.floor(timeLeft / 60);
          const sec = timeLeft % 60;
          timerEl.textContent = \`Time Left: \${min}:\${sec < 10 ? '0' : ''}\${sec}\`;

          if (timeLeft <= 0) {
            clearInterval(countdown);
            viewer.style.display = 'none';
            doneEl.style.display = 'block';
          }
        }, 1000);
      <\/script>
    </body>
    </html>
  `);

  newWindow.document.close();
});
