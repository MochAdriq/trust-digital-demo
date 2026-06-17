import { useState, useEffect, useRef, useCallback } from 'react';

// Product names and customer names for realistic mock data
const PRODUCTS = [
  'Digital ID Basic', 'Digital ID Pro', 'Digital ID Enterprise',
  'SSL Certificate', 'Code Signing Cert', 'Email Security',
  'Identity Verification', 'Document Signing', 'KYC Package',
  'Trust Seal Badge',
];

const CUSTOMERS = [
  'PT Maju Jaya', 'CV Berkah Abadi', 'Toko Online Sejahtera',
  'PT Teknologi Nusantara', 'Startup Inovasi', 'PT Digital Karya',
  'CV Sukses Mandiri', 'PT Solusi Aman', 'Budi Santoso', 'Rina Wijaya',
  'Ahmad Fauzi', 'Siti Nurhaliza', 'PT Global Trust', 'CV Prima Data',
  'PT Aman Sentosa',
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generatePayment(id) {
  const now = new Date();
  return {
    id: id,
    amount: parseFloat(randomBetween(15, 500).toFixed(2)),
    product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
    customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
    time: now.toLocaleTimeString('en-US', { hour12: false }),
  };
}

function getTimeString() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false });
}

export function useRealtimeSalesData() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [averageSale, setAverageSale] = useState(0);
  const [salesChartData, setSalesChartData] = useState([]);
  const [cumulativeRevenueData, setCumulativeRevenueData] = useState([]);
  const [latestPayments, setLatestPayments] = useState([]);

  const cumulativeRef = useRef(0);
  const countRef = useRef(0);
  const paymentIdRef = useRef(0);

  const tick = useCallback(() => {
    // Generate 1-3 sales per tick
    const numSales = Math.floor(randomBetween(1, 4));
    let tickTotal = 0;
    const newPayments = [];

    for (let i = 0; i < numSales; i++) {
      paymentIdRef.current += 1;
      const payment = generatePayment(paymentIdRef.current);
      tickTotal += payment.amount;
      newPayments.push(payment);
    }

    countRef.current += numSales;
    cumulativeRef.current += tickTotal;

    const timeStr = getTimeString();

    setTotalRevenue(cumulativeRef.current);
    setSalesCount(countRef.current);
    setAverageSale(countRef.current > 0 ? cumulativeRef.current / countRef.current : 0);

    setSalesChartData((prev) => {
      const next = [...prev, { time: timeStr, sales: parseFloat(tickTotal.toFixed(2)) }];
      // Keep last 60 data points
      return next.length > 60 ? next.slice(-60) : next;
    });

    setCumulativeRevenueData((prev) => {
      const next = [...prev, { time: timeStr, sales: parseFloat(cumulativeRef.current.toFixed(2)) }];
      return next.length > 60 ? next.slice(-60) : next;
    });

    setLatestPayments((prev) => {
      const combined = [...newPayments, ...prev];
      // Keep only the latest 10
      return combined.slice(0, 10);
    });
  }, []);

  useEffect(() => {
    // Generate initial data burst
    for (let i = 0; i < 5; i++) {
      tick();
    }

    // Then update every 1.5 seconds
    const interval = setInterval(tick, 1500);
    return () => clearInterval(interval);
  }, [tick]);

  return {
    totalRevenue,
    cumulativeRevenueData,
    salesCount,
    averageSale,
    salesChartData,
    latestPayments,
  };
}
