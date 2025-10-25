// Supabase configuration
const SUPABASE_URL = 'https://bxaygfvucewpreulcakn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4YXlnZnZ1Y2V3cHJldWxjYWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODM4MDksImV4cCI6MjA3Njk1OTgwOX0.rSGtB9GYWk1OjYyKTje_ZwEoPHjlJ9abidRU7LX6IYQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const form = document.getElementById('pledgeForm');
const pledgeTableBody = document.querySelector('#pledgeTable tbody');

// Scroll to pledge section
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('takePledgeBtn').addEventListener('click', () => {
    const pledgeSection = document.getElementById('pledge');
    if (pledgeSection) {
      pledgeSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Get selected commitments
function getCommitments() {
  return Array.from(form.querySelectorAll('input[name="commitment"]:checked')).map(i => i.value);
}

// Handle form submission
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

    showCertificate(record);
    form.reset();
    loadPledges();
  }
});

// Load all pledges from Supabase
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

// Update KPIs and Pledge Wall
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

// Show certificate
function showCertificate(data) {
  const area = document.getElementById('certificateArea');
  area.hidden = false;
  area.innerHTML = `
    <div id="certCard" style="
        max-width: 500px;
        margin: 20px auto;
        padding: 30px;
        border: 4px solid #0a6;
        border-radius: 20px;
        background: linear-gradient(145deg, #f0fff4, #e6ffed);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        text-align: center;
        font-family: 'Arial', sans-serif;
      ">
      <h2 style="font-size: 28px; color: #0a6; margin-bottom: 10px;">🌿 Climate Action Certificate 🌿</h2>
      <h3 style="font-size: 24px; color: #064; margin-bottom: 5px;">${data.name}</h3>
      <p style="font-size: 16px; color: #064; margin-bottom: 15px;">Successfully completed <strong>${data.commitCount}</strong> climate commitments</p>
      <p style="font-size: 20px; margin-bottom: 20px;">${'⭐'.repeat(Math.min(5, data.commitCount))} ${'💚'.repeat(Math.min(5, data.commitCount))}</p>
      <button id="downloadCert" style="
        padding: 10px 25px;
        font-size: 16px;
        color: #fff;
        background-color: #0a6;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.backgroundColor='#064'" onmouseout="this.style.backgroundColor='#0a6'">Download Certificate</button>
    </div>
  `;
  
  document.getElementById('downloadCert').addEventListener('click', downloadCertificate);
}


// ==========================
// Certificate download
// ==========================
async function downloadCertificate() {
  const node = document.getElementById('certCard');
  const button = document.getElementById('downloadCert');

  if (!node || !window.html2canvas) {
    alert('Certificate download requires html2canvas script');
    return;
  }

  // Hide the button before capture
  button.style.display = 'none';

  // Capture certificate
  const canvas = await html2canvas(node, { backgroundColor: null });
  const dataUrl = canvas.toDataURL('image/png');

  // Restore the button
  button.style.display = 'inline-block';

  // Trigger download
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'certificate.png';
  a.click();
}


// ==========================
// Initialize
// ==========================
loadPledges();
