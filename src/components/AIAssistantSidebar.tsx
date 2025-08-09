import { useState } from "react";
import { 
  Home, 
  Brain, 
  TrendingUp, 
  Wallet, 
  Crown, 
  MessageCircle,
  BarChart3,
  Settings,
  Sparkles,
  Target,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Transactions", url: "/transactions", icon: BarChart3 },
  { title: "Cards", url: "/cards", icon: Wallet },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
];

const aiAssistantItems = [
  { title: "AI Intelligence", url: "/ai-assistant?tab=intelligence", icon: Brain },
  { title: "Financial Assistant", url: "/ai-assistant?tab=assistant", icon: MessageCircle },
  { title: "Financial Services", url: "/ai-assistant?tab=financial", icon: Sparkles },
  { title: "Wealth Management", url: "/ai-assistant?tab=wealth", icon: Crown },
  { title: "Enhanced Chat", url: "/ai-assistant?tab=enhanced", icon: Zap },
];

interface AIAssistantSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AIAssistantSidebar({ activeTab = 'intelligence', onTabChange }: AIAssistantSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isTabActive = (tab: string) => {
    const urlParams = new URLSearchParams(location.search);
    const currentTab = urlParams.get('tab') || 'intelligence';
    return currentTab === tab;
  };

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const getNavCls = (active: boolean) =>
    `w-full justify-start ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"}`;

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
    >
      <SidebarContent>
        {/* Logo and Brand */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg">AIKEYS AI</h2>
                <p className="text-xs text-muted-foreground">Intelligence Hub</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls(isActive)}
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

        {/* AI Assistant Sections */}
        <SidebarGroup>
          <SidebarGroupLabel>AI Assistant</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiAssistantItems.map((item) => {
                const tabFromUrl = item.url.split('tab=')[1];
                const isTabCurrentlyActive = isTabActive(tabFromUrl);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button 
                        onClick={() => handleTabClick(tabFromUrl)}
                        className={getNavCls(isTabCurrentlyActive)}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 p-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Insights
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Optimize Portfolio
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <div className="mt-auto p-4 border-t">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `flex items-center gap-2 p-2 rounded-lg transition-colors ${
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
            }`}
          >
            <Settings className="h-4 w-4" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}