// src/RingkasanCard.js
import React from 'react';
import formatRupiah from '../hooks/formatRupiah';

function SummaryTransactionCard({ title, total, perbedaan, tipe }) {
    const isIncome = tipe === 'Income';
    const isPositive = perbedaan >= 0;

    // Menentukan warna dan ikon berdasarkan tipe dan nilai perbedaan
    const borderColor = isIncome ? 'border-green-500' : 'border-red-500';
    const textColor = isPositive ? 'text-green-600' : 'text-red-600';
    const icon = isPositive ? '↑' : '↓';
    
    return (
        <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${borderColor}`}>
        <h4 className="text-sm font-medium text-gray-500 uppercase">{title}</h4>
        <p className="text-3xl font-bold text-gray-800 mt-2">
            {formatRupiah(total)}
        </p>
        <div className={`flex items-center mt-2 ${perbedaan === 0 ? 'text-gray-500' : textColor}`}>
            <span className="font-bold text-lg">{icon}</span>
            <p className="text-sm ml-1">
            {formatRupiah(Math.abs(perbedaan))} than last month
            </p>
        </div>
        </div>
    );
}

export default SummaryTransactionCard;