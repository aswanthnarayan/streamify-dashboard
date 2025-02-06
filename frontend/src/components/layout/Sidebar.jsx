import { Button } from "@/components/ui/button"
import { Activity, Users, LogOut, Music2 } from "lucide-react"
import { Link } from 'react-router-dom';

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r p-4 hidden md:block">
      <div className="flex items-center gap-2 mb-8">
        <Music2 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Streamify</h1>
      </div>
      
      <nav className="space-y-2">
        <Link to="/">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Activity className="h-4 w-4" /> Dashboard
        </Button>
      </Link>
      <Link to="/users" style={{ textDecoration: 'none' }}>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Users className="h-4 w-4" /> Users
        </Button>
      </Link>
      <Link to="/logout" style={{ textDecoration: 'none' }}>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </Link>
      </nav>
    </div>
  )
}
