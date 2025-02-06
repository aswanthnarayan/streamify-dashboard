import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useMemo, useEffect } from "react"
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StreamsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: 'streamCount',
    direction: 'desc'
  })
  const [recentStreams, setRecentStreams] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [filterType, setFilterType] = useState("all")
  const [filterValue, setFilterValue] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db/db.json')
        const data = await response.json()
        
        // Process songs data and combine with user data
        const processedStreams = data.songs.topStreamed.map((song, index) => {
          //  random user
          const randomUser = data.users[Math.floor(Math.random() * data.users.length)]
          
          return {
            id: index + 1,
            songName: song.name,
            artist: song.artist,
            dateStreamed: randomUser.lastStreamDate.split('T')[0],
            streamCount: song.streams.total,
            userId: randomUser.id
          }
        })

        setRecentStreams(processedStreams)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Unique artists and songs for filters
  const uniqueArtists = useMemo(() => {
    const artists = [...new Set(recentStreams.map(stream => stream.artist))]
    return artists.sort()
  }, [recentStreams])

  const uniqueSongs = useMemo(() => {
    const songs = [...new Set(recentStreams.map(stream => stream.songName))]
    return songs.sort()
  }, [recentStreams])

  // Sorting function
  const sortData = (data, config) => {
    return [...data].sort((a, b) => {
      if (a[config.key] < b[config.key]) {
        return config.direction === 'asc' ? -1 : 1
      }
      if (a[config.key] > b[config.key]) {
        return config.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  // Sort handler
  const requestSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  // Format number to K, M format
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = recentStreams

    // Apply filter
    if (filterType !== "all" && filterValue) {
      filtered = filtered.filter(stream => 
        stream[filterType === "artist" ? "artist" : "songName"] === filterValue
      )
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(stream => 
        stream.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stream.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stream.userId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return sortData(filtered, sortConfig)
  }, [searchTerm, sortConfig, recentStreams, filterType, filterValue])

  // Reset filters
  const resetFilters = () => {
    setFilterType("all")
    setFilterValue("")
    setSearchTerm("")
    setCurrentPage(1)
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h3 className="text-xl font-semibold">Recent Streams</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-auto min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search songs, artists, or users..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value)
                setFilterValue("")
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="songName">Song</SelectItem>
              </SelectContent>
            </Select>

            {filterType !== "all" && (
              <Select
                value={filterValue}
                onValueChange={(value) => {
                  setFilterValue(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={`Select ${filterType === "artist" ? "artist" : "song"}`} />
                </SelectTrigger>
                <SelectContent>
                  {(filterType === "artist" ? uniqueArtists : uniqueSongs).map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {(filterType !== "all" || searchTerm) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
              >
                Reset
              </Button>
            )}
          </div>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="5 items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 items</SelectItem>
              <SelectItem value="10">10 items</SelectItem>
              <SelectItem value="15">15 items</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('songName')} className="h-8 flex items-center gap-1">
                  Song Name
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('artist')} className="h-8 flex items-center gap-1">
                  Artist
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('dateStreamed')} className="h-8 flex items-center gap-1">
                  Date Streamed
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('streamCount')} className="h-8 flex items-center gap-1">
                  Stream Count
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('userId')} className="h-8 flex items-center gap-1">
                  User ID
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((stream) => (
              <TableRow key={stream.id}>
                <TableCell className="font-medium">{stream.songName}</TableCell>
                <TableCell>{stream.artist}</TableCell>
                <TableCell>{stream.dateStreamed}</TableCell>
                <TableCell>{formatNumber(stream.streamCount)}</TableCell>
                <TableCell>{stream.userId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
