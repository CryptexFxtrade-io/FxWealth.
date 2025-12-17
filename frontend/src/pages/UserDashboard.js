import React, { useEffect, useState } from 'react';
import API from '../api/api';
import InvestmentCard from '../components/InvestmentCard';
import WithdrawalCard from '../components/WithdrawalCard';

export default function UserDashboard() {
  const [user, setUser] = useState({});
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await API.get('/auth/me');
      setUser(userData);

      const { data: inv } = await API.get('/invest/my');
      setInvestments(inv);

      const { data: wd } = await API.get('/wallet/my');
      setWithdrawals(wd);
    };
    fetchData();
  }, []);

  const handleWithdraw = async () => {
    try {
      await API.post('/wallet/withdraw', { amount: Number(amount) });
      alert('Withdrawal requested');
      setAmount('');
      const { data: wd } = await API.get('/wallet/my');
      setWithdrawals(wd);
    } catch (err) {
      alert(err.response.data.message || 'Error');
    }
  };

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <h2>Balance: ${user.balance}</h2>

      <h3>Investments</h3>
      {investments.map(inv => <InvestmentCard key={inv._id} investment={inv} />)}

      <h3>Withdrawals</h3>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={handleWithdraw}>Request Withdrawal</button>
      {withdrawals.map(wd => <WithdrawalCard key={wd._id} withdrawal={wd} />)}
    </div>
  );
             }
