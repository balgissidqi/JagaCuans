import { Home, Wallet, TrendingDown, Target, Trophy, GraduationCap, User, LogOut, X } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"


export function AppSidebar() {
  const { t } = useTranslation()
  const { state, setOpenMobile } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"
  const isMobile = useIsMobile()

  const items = [
    { title: t('common.dashboard'), url: "/dashboard", icon: Home },
    { title: t('common.budget'), url: "/dashboard/budgeting", icon: Wallet },
    { title: t('common.spending'), url: "/dashboard/spending", icon: TrendingDown },
    { title: t('common.goals'), url: "/dashboard/goals", icon: Target },
    { title: t('common.challenge'), url: "/dashboard/challenge", icon: Trophy },
    { title: t('common.education'), url: "/dashboard/education", icon: GraduationCap },
    { title: t('common.profile'), url: "/dashboard/profile", icon: User },
  ]

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success(t('auth.logoutSuccess'))
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error("Failed to logout")
    }
  }

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
      side="left"
    >
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              JC
            </div>
            {(!collapsed || isMobile) && (
              <div>
                <h1 className="font-bold text-lg text-foreground">{t('nav.appName')}</h1>
                <p className="text-xs text-muted-foreground">{t('nav.subtitle')}</p>
              </div>
            )}
          </div>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpenMobile(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            {t('common.home')}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <NavLink 
                       to={item.url} 
                       end 
                       className={({ isActive }) => getNavCls({ isActive })}
                       onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {(!collapsed || isMobile) && <span>{item.title}</span>}
                      </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
       </SidebarContent>

        <SidebarFooter className="p-4 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
                {(!collapsed || isMobile) && <span>{t('common.logout')}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
     </Sidebar>
  )
}