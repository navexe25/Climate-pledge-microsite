const form = document.getElementById('pledgeForm');
const pledgeTableBody = document.querySelector('#pledgeTable tbody');

// Scroll to pledge section
document.getElementById('takePledgeBtn').addEventListener('click', () => {
  document.getElementById('pledge').scrollIntoView({ behavior: 'smooth' });
});

// Get selected commitments
function getCommitments() {
  return Array.from(form.querySelectorAll('input[name="commitment"]:checked')).map(i => i.value);
}

// Save a pledge to localStorage
function savePledge(record) {
  let pledges = JSON.parse(localStorage.getItem('pledges') || '[]');
  record.id = pledges.length + 1;
  pledges.push(record);
  localStorage.setItem('pledges', JSON.stringify(pledges));
}

// Load all pledges from localStorage
function loadPledges() {
  const pledges = JSON.parse(localStorage.getItem('pledges') || '[]');
  updateKPIsAndWall(pledges);
}

// Update KPIs and Pledge Wall
function updateKPIsAndWall(data) {
  const achieved = data.length;
  document.getElementById('kpi-achieved').innerText = achieved;
  const students = data.filter(r => r.profile === 'Student').length;
  const workers = data.filter(r => r.profile === 'Working Professional').length;
  document.getElementById('kpi-students').innerText = students;
  document.getElementById('kpi-workers').innerText = workers;

  pledgeTableBody.innerHTML = '';
  data.slice().reverse().forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.id}</td><td>${r.name}</td><td>${r.date}</td><td>${r.state}</td><td>${r.profile}</td><td>${'★'.repeat(Math.min(5, r.commitCount))}</td>`;
    pledgeTableBody.appendChild(tr);
  });
}

// Handle form submission
form.addEventListener('submit', function(e){
  e.preventDefault();
  const record = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    mobile: form.mobile.value.trim(),
    state: form.state.value,
    profile: form.profile.value,
    commitments: getCommitments(),
    commitCount: getCommitments().length,
    date: new Date().toLocaleString()
  };

  if (!record.name || !record.email || !record.mobile) {
    alert('Please fill all required fields');
    return;
  }

  savePledge(record);
  showCertificate(record);
  form.reset();
  loadPledges();
});

// Show certificate
function showCertificate(data) {
  const area = document.getElementById('certificateArea');
  area.hidden = false;
  area.innerHTML = `
    <div id="certCard" style="padding:20px;border:2px dashed #0a6;background:#fff;display:inline-block">
      <h2>Cool Enough to Care!</h2>
      <h3>${data.name}</h3>
      <p>${data.commitCount} commitments</p>
      <p>⭐ ${'❤️'.repeat(Math.min(5, data.commitCount))}</p>
      <button id="downloadCert">Download Certificate</button>
    </div>
  `;
  document.getElementById('downloadCert').addEventListener('click', () => {
    downloadCertificate();
  });
}

// Certificate download
async function downloadCertificate() {
  const node = document.getElementById('certCard');
  if (window.html2canvas) {
    const canvas = await html2canvas(node);
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl; 
    a.download = 'certificate.png'; 
    a.click();
  } else {
    alert('Certificate download requires html2canvas script');
  }
}

// Initialize pledge wall
loadPledges();
