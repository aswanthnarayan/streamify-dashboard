import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useEffect, useContext } from "react"
import Context from '../../context/Context'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function Charts() {
  const { 
    state: { userGrowthData, topSongs, revenueData },
    updateUserGrowthData,
    updateTopSongs,
    updateRevenueData
  } = useContext(Context)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db/db.json')
        const data = await response.json()
        
        // User growth data - last 6 months
        const userGrowth = data.monthlyUserGrowth.slice(-6).map(item => ({
          month: `${item.month.split('-')[1]}-${item.month.split('-')[0]}`, // Format as MM-YYYY
          total: item.totalUsers,
          active: item.activeUsers
        }))
        updateUserGrowthData(userGrowth)

        // Top songs data
        const topSongsData = data.songs.topStreamed.map(song => ({
          name: song.name,
          streams: song.streams.total
        }))
        updateTopSongs(topSongsData.slice(0, 5))

        //Revenue distribution
        const currentRevenue = data.revenue.currentDistribution
        const revenueDistribution = [
          { name: 'Subscriptions', value: currentRevenue.subscriptions },
          { name: 'Advertisements', value: currentRevenue.advertisements },
          { name: 'In-App Purchases', value: currentRevenue.inAppPurchases },
          { name: 'Merchandise', value: currentRevenue.merchandise }
        ]
        updateRevenueData(revenueDistribution)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [updateUserGrowthData, updateTopSongs, updateRevenueData])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">User Growth</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Users" />
              <Line type="monotone" dataKey="active" stroke="#82ca9d" name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Top 5 Streamed Songs</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSongs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="streams" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name} ($${(value/1000).toFixed(1)}K)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(value/1000).toFixed(1)}K`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
