import { Card } from "@/components/ui/card"
import { Users, PlayCircle, DollarSign, Music } from "lucide-react"
import { useEffect, useState } from "react"

export function StatsCards() {
  const [stats, setStats] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db/db.json')
        const data = await response.json()
        
        // Current month data
        const latestMonthData = data.monthlyUserGrowth[data.monthlyUserGrowth.length - 1]
        
        // Total revenue
        const currentRevenue = Object.values(data.revenue.currentDistribution).reduce((acc, curr) => acc + curr, 0)
        
        // Top artist in last 30 days
        const artists = Object.entries(data.songs.artistStats)
        const topArtist = artists.reduce((max, [artist, stats]) => 
          stats.last30DaysStreams > max.streams ? { name: artist, streams: stats.last30DaysStreams } : max,
          { name: '', streams: 0 }
        )

        // Total streams
        const totalStreams = data.songs.topStreamed.reduce((acc, song) => acc + song.streams.total, 0)

        setStats([
          {
            title: "Total Users",
            value: latestMonthData.totalUsers.toLocaleString(),
            change: `+${latestMonthData.newUsers.toLocaleString()}`,
            icon: Users,
            bgColor: "bg-blue-100 ",
            textColor: "text-blue-600 "
          },
          {
            title: "Active Users",
            value: latestMonthData.activeUsers.toLocaleString(),
            change: "Last 30 days",
            icon: PlayCircle,
            bgColor: "bg-green-100 ",
            textColor: "text-green-600 "
          },
          {
            title: "Total Streams",
            value: totalStreams.toLocaleString(),
            change: "All Time",
            icon: Music,
            bgColor: "bg-purple-100 ",
            textColor: "text-purple-600"
          },
          {
            title: "Revenue",
            value: `$${(currentRevenue / 1000).toFixed(1)}K`,
            change: "Current Month",
            icon: DollarSign,
            bgColor: "bg-yellow-100 ",
            textColor: "text-yellow-600 "
          },
          {
            title: "Top Artist",
            value: topArtist.name,
            change: `${topArtist.streams.toLocaleString()} streams`,
            icon: Music,
            bgColor: "bg-pink-100 ",
            textColor: "text-pink-600"
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card 
            className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-105" 
            key={stat.title}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`h-7 w-7 ${stat.textColor}`} />
                </div>
                <div className="flex-1 flex justify-end">
                  <span className={`text-sm font-medium ${stat.textColor}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
