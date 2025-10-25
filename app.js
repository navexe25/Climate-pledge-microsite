// assets/js/app.js

// Use your working Apps Script URL directly
const XLS_API = "https://script.google.com/macros/s/AKfycbw-M6hFZ68L4yIsE5eU3gUYm_0xt0rreKtRlScCdgOeW6q3tIj3iquM9hyxwnn-PrqJ/exec";

document.getElementById('takePledgeBtn').addEventListener('click', () => {
  document.getElementById('pledge').scrollIntoView({ behavior: 'smooth' });
});

// helper to get checked commitments
function getCommitments(form) {
  return Array.from(form.querySelectorAll('input[name="commitment"]:checked')).map(n => n.value);
}

// fetch all pledges from Google Sheet
async function fetchPledges() {
  if (!XLS_API) return;
  try {
    const res = await fetch(XLS_API + '?action=get');
    const data = await res.json();
    updateKPIsAndWall(data);
  } catch (e) {
    console.error('Could not fetch pledges', e);
  }
}

// update KPIs and pledge wall
function updateKPIsAndWall(data) {
  const achieved = data.length;
  document.getElementById('kpi-achieved').innerText = achieved;
  const students = data.filter(r => r.profile === 'Student').length;
  const workers = data.filter(r => r.profile === 'Working Professional').length;
  document.getElementById('kpi-students').innerText = students;
  document.getElementById('kpi-workers').innerText = workers;

  const tbody = document.querySelector('#pledgeTable tbody');
  tbody.innerHTML = '';
  data.slice().reverse().forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.id}</td><td>${r.name}</td><td>${r.date}</td><td>${r.state}</td><td>${r.profile}</td><td>${'★'.repeat(Math.min(5, r.commitCount))}</td>`;
    tbody.appendChild(tr);
  });
}

// form submission
document.getElementById('pledgeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const mobile = form.mobile.value.trim();
  const state = form.state.value;
  const profile = form.profile.value;
  const commitments = getCommitments(form);

  if (!name || !email || !mobile) {
    alert('Please fill required fields');
    return;
  }

  const payload = {
    name, email, mobile, state, profile,
    commitments, commitCount: commitments.length,
    date: new Date().toLocaleString()
  };

  try {
    const res = await fetch(XLS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', record: payload })
    });
    const result = await res.json();
    if (result.success) {
      showCertificate(payload);
      fetchPledges();
      form.reset();
    } else {
      throw new Error(result.message || 'Unknown error');
    }
  } catch (err) {
    console.error(err);
    alert('Submission failed, try again.');
  }
});

// show certificate
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

// certificate download
async function downloadCertificate() {
  const node = document.getElementById('certCard');
  if (window.html2canvas) {
    const canvas = await html2canvas(node);
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl; a.download = 'certificate.png'; a.click();
  } else {
    alert('Certificate download requires html2canvas script (include it).');
  }
}

// initialize
fetchPledges();

