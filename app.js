// ==========================
// Supabase configuration
// ==========================
const SUPABASE_URL = 'https://bxaygfvucewpreulcakn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4YXlnZnZ1Y2V3cHJldWxjYWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODM4MDksImV4cCI6MjA3Njk1OTgwOX0.rSGtB9GYWk1OjYyKTje_ZwEoPHjlJ9abidRU7LX6IYQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================
// DOM Elements
// ==========================
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

// ==========================
// Handle form submission
// ==========================
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const record = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    mobile: form.mobile.value.trim(),
    state: form.state.value,
    profile: form.profile.value,
    commitments: getCommitments().join('|'),
    commitCount: getCommitments().length,
    date: new Date().toLocaleString()
  };

  if (!record.name || !record.email || !record.mobile) {
    alert('Please fill all required fields');
    return;
  }

  // Insert into Supabase
  const { data, error } = await supabase.from('pledges').insert([record]);

  if (error) {
    console.error('Error inserting pledge:', error);
    alert('Submission failed: ' + error.message);
  } else {
    alert('Pledge submitted successfully!');
    showCertificate(record);
    form.reset();
    loadPledges();
  }
});

// ==========================
// Load all pledges from Supabase
// ==========================
async function loadPledges() {
  const { data, error } = await supabase
    .from('pledges')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error loading pledges:', error);
    return;
  }
  updateKPIsAndWall(data);
}

// ==========================
// Update KPIs and Pledge Wall
// ==========================
function updateKPIsAndWall(data) {
  const achieved = data.length;
  document.getElementById('kpi-achieved').innerText = achieved;

  const students = data.filter(r => r.profile === 'Student').length;
  const workers = data.filter(r => r.profile === 'Working Professional').length;

  document.getElementById('kpi-students').innerText = students;
  document.getElementById('kpi-workers').innerText = workers;

  pledgeTableBody.innerHTML = '';
  data.forEach((r, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${r.name}</td>
      <td>${r.date}</td>
      <td>${r.state}</td>
      <td>${r.profile}</td>
      <td>${'❤️'.repeat(Math.min(5, r.commitCount))}</td>
    `;
    pledgeTableBody.appendChild(tr);
  });
}

// ==========================
// Show certificate
// ==========================
function showCertificate(data) {
  const area = document.getElementById('certificateArea');
  area.hidden = false;
  area.innerHTML = `
    <div id="certCard" style="padding:20px;border:2px dashed #0a6;background:#fff;display:inline-block;text-align:center;">
      <h2>Cool Enough to Care!</h2>
      <h3>${data.name}</h3>
      <p>${data.commitCount} commitments made</p>
      <p>⭐ ${'❤️'.repeat(Math.min(5, data.commitCount))}</p>
      <button id="downloadCert">Download Certificate</button>
    </div>
  `;
  
  document.getElementById('downloadCert').addEventListener('click', downloadCertificate);
}

// ==========================
// Certificate download
// ==========================
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

// ==========================
// Initialize
// ==========================
loadPledges();
