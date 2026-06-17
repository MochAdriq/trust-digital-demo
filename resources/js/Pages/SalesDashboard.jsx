import React from 'react';
import { Head } from '@inertiajs/react';
import { SalesDashboard } from '@/Components/ui/live-sales-dashboard';

export default function SalesDashboardPage() {
  return (
    <>
      <Head title="Sales Dashboard" />
      <SalesDashboard />
    </>
  );
}
