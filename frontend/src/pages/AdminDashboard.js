import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await API.get('/admin/users');
      setUsers(usersData);

      const { data: inv } = await API.get('/invest');
      setInvestments(inv);

      const { data: wd } = await API.get('/wallet');
      setWithdrawals(wd);
    };
    fetchData();
  }, []);

  const toggleBlock = async (id) => {
    await API.put(`/admin/user/${id}/block`);
    const { data: usersData } = await API.get('/admin/users');
    setUsers(usersData);
  };

  const approveInvestment = async (id) => {
    await API.put(`/invest/approve/${id}`);
    const { data: inv } = await API.get('/invest');
    setInvestments(inv);
  };

  const rejectInvestment = async (id) => {
    await API.put(`/invest/reject/${id}`);
    const { data: inv } = await API.get('/invest');
    setInvestments(inv);
  };

  const approveWithdrawal = async (id) => {
    await API.put(`/wallet/approve/${id}`);
    const { data: wd } = await API.get('/wallet');
    setWithdrawals(wd);
  };

  const rejectWithdrawal = async (id) => {
    await API.put(`/wallet/reject/${id}`);
    const { data: wd } = await API.get('/wallet');
    setWithdrawals(wd);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>
      {users.map(u => (
        <div key={u._id}>
          {u.name} ({u.email}) - {u.role} - {u.isBlocked ? 'Blocked' : 'Active'}
          <button onClick={() => toggleBlock(u._id)}>
            {u.isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      ))}

      <h2>Investments</h2>
      {investments.map(inv => (
        <div key={inv._id}>
          {inv.user.name} - {inv.plan} - ${inv.amount} - {inv.status}
          {inv.status === 'pending' && (
            <>
              <button onClick={() => approveInvestment(inv._id)}>Approve</button>
              <button onClick={() => rejectInvestment(inv._id)}>Reject</button>
            </>
          )}
        </div>
      ))}

      <h2>Withdrawals</h2>
      {withdrawals.map(wd => (
        <div key={wd._id}>
          {wd.user.name} - ${wd.amount} - {wd.status}
          {wd.status === 'pending' && (
            <>
              <button onClick={() => approveWithdrawal(wd._id)}>Approve</button>
              <button onClick={() => rejectWithdrawal(wd._id)}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
      }
