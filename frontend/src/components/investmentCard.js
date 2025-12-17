import React from 'react';

export default function InvestmentCard({ investment }) {
  return (
    <div className="border rounded p-4 m-2 shadow hover:shadow-lg transition">
      <h3 className="font-bold">{investment.plan}</h3>
      <p>Amount: ${investment.amount}</p>
      <p>ROI: {investment.roi}%</p>
      <p>Status: <span className={investment.status === 'active' ? 'text-green-600' : investment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}>{investment.status}</span></p>
    </div>
  );
}
