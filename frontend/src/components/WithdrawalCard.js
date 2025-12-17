import React from 'react';

export default function WithdrawalCard({ withdrawal }) {
  return (
    <div className="border rounded p-4 m-2 shadow hover:shadow-lg transition">
      <p>Amount: ${withdrawal.amount}</p>
      <p>Status: <span className={withdrawal.status === 'approved' ? 'text-green-600' : withdrawal.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}>{withdrawal.status}</span></p>
      <p>Requested: {new Date(withdrawal.requestedAt).toLocaleDateString()}</p>
    </div>
  );
}
