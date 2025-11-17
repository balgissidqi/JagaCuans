import { Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LanguageSelector } from "@/components/LanguageSelector"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

export function Navbar() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('photo_url')
          .eq('id', user.id)
          .single()
        
        if (data?.photo_url) {
          setPhotoUrl(data.photo_url)
        }
      }
    }

    fetchProfilePhoto()

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.new.photo_url) {
            setPhotoUrl(payload.new.photo_url)
          } else {
            setPhotoUrl(null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

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
        <LanguageSelector />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/dashboard/profile')}>
          <AvatarImage src={photoUrl || undefined} alt="User" />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}