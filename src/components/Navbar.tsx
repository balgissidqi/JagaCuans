import { Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function Navbar() {
  const isMobile = useIsMobile()

  return (
    <nav className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isMobile && (
          <SidebarTrigger className="mr-2">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        )}
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
          JC
        </div>
        <span className="font-bold text-lg text-foreground">JagaCuan</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}