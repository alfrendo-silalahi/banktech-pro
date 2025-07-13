// src/SummaryChart.js
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
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

// Registrasi komponen-komponen Chart.js yang akan digunakan
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

function SummaryChart({ data }) {
    // Gunakan useMemo untuk memproses data hanya saat data berubah
    const chartData = useMemo(() => {
        // 1. Siapkan label untuk 5 bulan terakhir
        const labels = [];
        const today = new Date();
        for (let i = 4; i >= 0; i--) {
        const d = new Date(today);
        d.setMonth(today.getMonth() - i);
        labels.push(d.toLocaleString('id-ID', { month: 'long', year: 'numeric' }));
        }

        // 2. Siapkan wadah untuk data income & expense per bulan
        const incomeData = new Array(5).fill(0);
        const expenseData = new Array(5).fill(0);
        
        // 3. Proses data transaksi
        data.forEach(item => {
        const transactionDate = new Date(item.tanggal);
        const monthDiff = (today.getFullYear() - transactionDate.getFullYear()) * 12 + (today.getMonth() - transactionDate.getMonth());

        if (monthDiff >= 0 && monthDiff < 5) {
            const index = 4 - monthDiff; // Index di array (0=4 bln lalu, 4=bln ini)
            if (item.tipeTransaksi === 'Income') {
            incomeData[index] += item.nominal;
            } else { // 'Transfer' dianggap sebagai expense
            expenseData[index] += item.nominal;
            }
        }
        });

        return {
        labels,
        datasets: [
            {
            label: 'Pendapatan (Income)',
            data: incomeData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Hijau
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true,
            tension: 0.4
            },
            {
            label: 'Pengeluaran (Expense)',
            data: expenseData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Merah
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: true,
            tension: 0.4
            },
        ],
        };
    }, [data]);

    // Konfigurasi untuk tampilan chart
    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Ringkasan Pendapatan & Pengeluaran 5 Bulan Terakhir',
            font: {
            size: 18,
            }
        },
        },
        scales: {
        y: {
            beginAtZero: true,
            ticks: {
            // Format label sumbu Y menjadi Rupiah
            callback: function(value) {
                return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact' }).format(value);
            }
            }
        },
        },
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <Line options={options} data={chartData} />
        </div>
    );
}

export default SummaryChart;