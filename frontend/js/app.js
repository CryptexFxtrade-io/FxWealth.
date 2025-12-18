// --- DASHBOARD DATA ---
async function loadDashboard() {
  const token = localStorage.getItem('token');
  if(!token) return window.location.href = 'index.html';

  try {
    // Get user info
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const user = await res.json();
    document.getElementById('userName').innerText = user.name;
    document.getElementById('balance').innerText = user.balance;

    // Get user's investments
    const invRes = await fetch(`${API_URL}/invest/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const investments = await invRes.json();
    document.getElementById('investments').innerHTML = investments.length
      ? investments.map(i => `<p>${i.plan}: $${i.amount} (${i.status})</p>`).join('')
      : '<p>No investments yet.</p>';

    // Get user's withdrawals
    const wdRes = await fetch(`${API_URL}/wallet/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const withdrawals = await wdRes.json();
    document.getElementById('withdrawals').innerHTML = withdrawals.length
      ? withdrawals.map(w => `<p>$${w.amount} (${w.status})</p>`).join('')
      : '<p>No withdrawals yet.</p>';

  } catch(err){
    console.error(err);
    alert('Failed to load dashboard');
  }
}

// Load dashboard on page load
if (window.location.pathname.includes('dashboard.html')) {
  loadDashboard();
}

// --- WITHDRAWAL REQUEST ---
document.getElementById('withdrawBtn')?.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const amount = Number(document.getElementById('withdrawAmount').value);
  if(!amount || amount <= 0) return alert('Enter a valid amount');

  try {
    const res = await fetch(`${API_URL}/wallet/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    alert(data.message || 'Withdrawal requested successfully');
    document.getElementById('withdrawAmount').value = '';
    loadDashboard(); // Refresh dashboard
  } catch(err){
    alert('Withdrawal failed');
    console.error(err);
  }
});

// --- LOGOUT ---
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});
