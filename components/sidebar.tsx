"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  CloudSun,
  User,
  LogOut,
  Route,
  AlertCircle,
  Bell,
  Languages,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { logout, getUser } from "@/lib/auth"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: string }>>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const userData = getUser()
    setUser(userData)
  }, [])

  useEffect(() => {
    if (!user) return

    const mockNotifications = []
    const aqi = Math.floor(Math.random() * 150) + 50

    if (aqi > 100) {
      mockNotifications.push({
        id: "1",
        message: "Attention ! La qualité de l'air sera dangereuse demain à Casablanca",
        type: "warning",
      })
    }

    if (aqi > 150) {
      mockNotifications.push({
        id: "2",
        message: "Alerte pollution : Évitez les activités extérieures",
        type: "danger",
      })
    }

    if (user?.healthConditions?.asthma && aqi > 80) {
      mockNotifications.push({
        id: "3",
        message: "Risque élevé pour l'asthme. Restez à l'intérieur",
        type: "health",
      })
    }

    setNotifications(mockNotifications)
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems = [
    {
      label: t("dashboard"),
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: t("forecasts"),
      icon: CloudSun,
      href: "/forecast",
      active: pathname === "/forecast",
    },
    {
      label: t("safeTrajectory"),
      icon: Route,
      href: "/safe-trajectory",
      active: pathname === "/safe-trajectory",
    },
    {
      label: t("complaint"),
      icon: AlertCircle,
      href: "/complaint",
      active: pathname === "/complaint",
    },
    {
      label: t("chatbot"),
      icon: MessageCircle,
      href: "/chatbot",
      active: pathname === "/chatbot",
    },
  ]

  return (
    <aside
      className={cn(
        "border-r bg-card/50 backdrop-blur-sm flex flex-col h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo Section */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
            {isCollapsed ? (
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-S2COqwFKawKRv1DRqURRh8VzVn9Uiq.png"
                  alt="Respera"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            ) : (
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-S2COqwFKawKRv1DRqURRh8VzVn9Uiq.png"
                alt="Respera"
                width={140}
                height={50}
                className="object-contain"
              />
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-1">
              {/* Language Switcher Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10">
                    <Languages className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("fr")} className={cn(language === "fr" && "bg-accent")}>
                    <span className="mr-2">🇫🇷</span>
                    Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ar")} className={cn(language === "ar" && "bg-accent")}>
                    <span className="mr-2">🇲🇦</span>
                    الدارجة
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("en")} className={cn(language === "en" && "bg-accent")}>
                    <span className="mr-2">🇬🇧</span>
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-primary/10">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notifications.length} {notifications.length === 1 ? "alerte" : "alertes"}
                    </p>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">Aucune notification</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {notifications.map((notif) => (
                        <DropdownMenuItem
                          key={notif.id}
                          className="flex items-start gap-3 p-4 cursor-pointer focus:bg-accent/50"
                        >
                          <AlertCircle
                            className={cn(
                              "w-5 h-5 flex-shrink-0 mt-0.5",
                              notif.type === "danger" && "text-destructive",
                              notif.type === "warning" && "text-chart-3",
                              notif.type === "health" && "text-chart-4",
                            )}
                          />
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">Il y a quelques minutes</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-2 border-b">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full hover:bg-primary/10", isCollapsed && "justify-center")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-xs">Réduire</span>
            </>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={item.active ? "secondary" : "ghost"}
            className={cn(
              "w-full h-11",
              isCollapsed ? "justify-center px-0" : "justify-start gap-3",
              item.active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className={cn("w-full h-11", isCollapsed ? "justify-center px-0" : "justify-start gap-3")}
          onClick={() => router.push("/profile")}
        >
          <User className="w-5 h-5" />
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none">{user?.name || "Utilisateur"}</p>
              <p className="text-xs text-muted-foreground mt-1">{user?.age ? `${user.age} ans` : t("profile")}</p>
            </div>
          )}
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full h-11 text-destructive", isCollapsed ? "justify-center px-0" : "justify-start gap-3")}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">{t("logout")}</span>}
        </Button>
      </div>
    </aside>
  )
}
