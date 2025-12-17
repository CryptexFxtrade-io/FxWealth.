import React, { useEffect, useState } from 'react';
import API from '../api/api';
import InvestmentCard from '../components/InvestmentCard';
import WithdrawalCard from '../components/WithdrawalCard';
import Navbar from '../components/Navbar';

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
      <Navbar role="user" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
        <h2 className="text-xl mb-4">Balance: ${user.balance}</h2>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Investments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {investments.map(inv => <InvestmentCard key={inv._id} investment={inv} />)}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Withdrawals</h3>
          <div className="flex mb-4">
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 mr-2 rounded" />
            <button onClick={handleWithdraw} className="bg-blue-600 text-white px-4 py-2 rounded">Request Withdrawal</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {withdrawals.map(wd => <WithdrawalCard key={wd._id} withdrawal={wd} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
