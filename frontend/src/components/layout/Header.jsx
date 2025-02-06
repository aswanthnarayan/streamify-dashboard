import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, Bell } from "lucide-react"
import { Link } from 'react-router-dom'

export function Header({title}) {
  return (
    <div className="flex justify-between items-center mb-8 p-4 md:p-0">
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      <div className="flex items-center gap-4">
        <div className="md:hidden"> {/* Only show on mobile screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link to="/">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </Link>
              <Link to="/users">
                <DropdownMenuItem>Users</DropdownMenuItem>
              </Link>
              <Link to="/logout">
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
