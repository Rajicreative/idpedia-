let currentPhotoData = null;

function showSection(id) {
  ['home-page', 'official-login', 'official-dashboard', 'school-login', 'school-dashboard']
    .forEach(sec => document.getElementById(sec).classList.add('hidden'));

  document.getElementById(id).classList.remove('hidden');
}

// Official Login
function officialLogin() {
  const user = document.getElementById('off-user').value;
  const pass = document.getElementById('off-pass').value;

  if (user === 'Rajeesh' && pass === '9083') {
    showSection('official-dashboard');
  } else {
    document.getElementById('off-err').classList.remove('hidden');
  }
}

// Save School
function saveSchool() {
  localStorage.setItem('schoolUser', document.getElementById('teacher-user').value);
  localStorage.setItem('schoolPass', document.getElementById('teacher-pass').value);

  alert('School saved!');
}

// School Login
function schoolLogin() {
  if (
    document.getElementById('sch-user').value === localStorage.getItem('schoolUser') &&
    document.getElementById('sch-pass').value === localStorage.getItem('schoolPass')
  ) {
    showSection('school-dashboard');
    renderStudents();
  } else {
    document.getElementById('sch-err').classList.remove('hidden');
  }
}

// Photo Upload
function handlePhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => currentPhotoData = e.target.result;
    reader.readAsDataURL(input.files[0]);

    document.getElementById('photo-status').innerText =
      "Photo Selected: " + input.files[0].name;
  }
}

// Save Student
function saveStudent(e) {
  e.preventDefault();

  const student = {
    admn: document.getElementById('std-admn').value,
    name: document.getElementById('std-name').value,
    cls: document.getElementById('std-class').value,
    gender: document.getElementById('std-gender').value,
    guardian: document.getElementById('std-guardian').value,
    house: document.getElementById('std-house').value,
    place: document.getElementById('std-place').value,
    mobile: document.getElementById('std-mobile').value,
    photo: currentPhotoData
  };

  fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById('studentForm').reset();
      renderStudents();
    })
    .catch(() => alert("Error saving data"));
}

// Render Students
function renderStudents() {
  const container = document.getElementById('saved-students');
  container.innerHTML = '<p>Loading...</p>';

  fetch('/api/students')
    .then(res => res.json())
    .then(students => {
      container.innerHTML = '';

      students.forEach(std => {
        container.innerHTML += `
          <div class="p-3 border rounded mb-2 bg-white flex justify-between">
            <div>
              <p class="font-bold">${std.name}</p>
              <p class="text-sm">Admn: ${std.admn}</p>
            </div>
          </div>
        `;
      });
    })
    .catch(() => {
      container.innerHTML = '<p>Error loading data</p>';
    });
}