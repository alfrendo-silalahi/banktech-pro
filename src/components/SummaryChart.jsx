// src/components/SummaryChart.jsx
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useFirebaseTransactions } from "../hooks/useFirebaseTransactions.jsx";
import { useAccount } from "../context/AccountProvider";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function SummaryChart() {
    const { activeAccount } = useAccount();
    const { transactions = [], loading } = useFirebaseTransactions(activeAccount?.accountNumber);

    const chartData = useMemo(() => {
        const labels = [];
        const today = new Date();
        for (let i = 4; i >= 0; i--) {
        const d = new Date(today);
        d.setMonth(today.getMonth() - i);
        labels.push(d.toLocaleString('id-ID', { month: 'long', year: 'numeric' }));
        }

        const incomeData = new Array(5).fill(0);
        const expenseData = new Array(5).fill(0);

        transactions.forEach(item => {
        const date = new Date(item.tanggal);
        const monthDiff = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth());

        if (monthDiff >= 0 && monthDiff < 5) {
            const index = 4 - monthDiff;
            if (item.tipeTransaksi === 'Income') {
            incomeData[index] += Number(item.nominal || 0);
            } else {
            expenseData[index] += Number(item.nominal || 0);
            }
        }
        });

        return {
        labels,
        datasets: [
            {
            label: 'Pendapatan (Income)',
            data: incomeData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true,
            tension: 0.4
            },
            {
            label: 'Pengeluaran (Expense)',
            data: expenseData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: true,
            tension: 0.4
            }
        ]
        };
    }, [transactions]);

    const options = {
        responsive: true,
        plugins: {
        legend: { position: 'top' },
        title: {
            display: true,
            text: 'Ringkasan Pendapatan & Pengeluaran 5 Bulan Terakhir',
            font: { size: 18 }
        }
        },
        scales: {
        y: {
            beginAtZero: true,
            ticks: {
            callback: value =>
                new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                notation: 'compact'
                }).format(value)
            }
        }
        }
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md h-full">
        <Line options={options} data={chartData} />
        </div>
    );
}

export default SummaryChart;