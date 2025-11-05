import dynamic from 'next/dynamic'
const FullDashboard = dynamic(() => import('../../components/FullDashboard'), { ssr: false })

export default function DashboardPage() {
  return <FullDashboard />
}
