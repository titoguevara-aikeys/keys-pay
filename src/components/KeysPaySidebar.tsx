import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Wallet, 
  CreditCard, 
  ArrowUpDown, 
  TrendingUp, 
  Activity, 
  Settings,
  Building2,
  User,
  Shield,
  HelpCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Wallet },
  { title: "Buy & Sell", url: "/crypto", icon: TrendingUp },
  { title: "Cards", url: "/keyspay/cards", icon: CreditCard, badge: "Beta" },
  { title: "Transfers", url: "/transfers", icon: ArrowUpDown, badge: "UAE" },
  { title: "Activity", url: "/activity", icon: Activity },
];

const accountItems = [
  { title: "Organizations", url: "/organizations", icon: Building2 },
  { title: "Profile Settings", url: "/profile", icon: User },
  { title: "Security", url: "/security", icon: Shield },
  { title: "Settings", url: "/settings", icon: Settings },
];

const supportItems = [
  { title: "Help Center", url: "/help", icon: HelpCircle },
];

export function KeysPaySidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user, userRole } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
    >
      <SidebarContent className="bg-card border-r">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/843ed379-ac78-482c-af6c-58de07f9638c.png" 
              alt="Keys Pay" 
              className="w-8 h-8"
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg">Keys Pay</span>
                <span className="text-xs text-muted-foreground">GCC Financial</span>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {!collapsed && user && (
          <div className="p-4 border-b bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-primary">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    {userRole || 'User'}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    GCC
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out */}
        <div className="mt-auto p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={`w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 ${collapsed ? 'px-2' : ''}`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>

        {/* Trigger at bottom */}
        <div className="p-2">
          <SidebarTrigger className="w-full" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}