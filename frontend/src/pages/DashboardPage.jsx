import { Header } from '@/components/layout/Header'
import React from 'react'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { Charts } from '@/components/dashboard/Charts'
import { StreamsTable } from '@/components/dashboard/StreamsTable'

const DashboardPage = () => {
  return (
    <div className="md:ml-64 p-4 md:p-8">
    <Header title="Dashboard" />
    <StatsCards />
    <Charts />
    <StreamsTable />
  </div>
  )
}

export default DashboardPage