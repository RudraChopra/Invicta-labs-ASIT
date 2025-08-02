

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Brain, 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  Beaker, 
  Briefcase,
  Home,
  User as UserIcon,
  Settings,
  LogOut,
  CreditCard,
  Rocket,
  Shield
} from "lucide-react";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User } from "@/api/entities";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: UserIcon,
  },
  {
    title: "Curriculum",
    url: createPageUrl("Curriculum"),
    icon: BookOpen,
  },
  {
    title: "Badges",
    url: createPageUrl("Badges"),
    icon: Trophy,
  },
  {
    title: "AI Mentor",
    url: createPageUrl("AIMentor"),
    icon: MessageCircle,
  },
  {
    title: "Demo Lab",
    url: createPageUrl("DemoLab"),
    icon: Beaker,
  },
  {
    title: "Consulting Hub",
    url: createPageUrl("ConsultingHub"),
    icon: Briefcase,
  },
  {
    title: "Subscription",
    url: createPageUrl("Subscription"),
    icon: CreditCard,
  },
];

const tierColors = {
  basic: "text-slate-400",
  pro: "text-cyan-400",
  expert: "text-purple-400"
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    User.me().then(setUserData).catch(() => setUserData(null));
  }, [location.pathname]);

  const tier = userData?.subscription_tier || 'basic';
  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
  const isAdmin = userData?.role === 'admin';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <style>
        {`
          /* ... (existing styles) ... */
        `}
        </style>
        
        <Sidebar className="border-r border-white/20 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl">
          <SidebarHeader className="border-b border-white/10 p-6">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">Invicta Labs</h2>
                <p className="text-xs text-cyan-400 font-medium">ASIT Platform</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-white/10 hover:text-cyan-400 transition-all duration-300 rounded-xl mb-1 group ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-inner' 
                            : 'text-slate-300'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 mt-4">
                  Admin
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-white/10 hover:text-cyan-400 transition-all duration-300 rounded-xl mb-1 group ${
                          location.pathname === createPageUrl("AdminDashboard")
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-inner' 
                            : 'text-slate-300'
                        }`}
                      >
                        <Link to={createPageUrl("AdminDashboard")} className="flex items-center gap-3 px-4 py-3">
                          <Shield className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">Admin Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

          </SidebarContent>

          <SidebarFooter className="border-t border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ring-2 ${
                tier === 'pro' ? 'ring-cyan-500' : tier === 'expert' ? 'ring-purple-500' : 'ring-slate-600'
              }`}>
                <span className="text-white font-bold text-lg">{userData?.full_name?.[0] || 'S'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{userData?.full_name || 'Student'}</p>
                <p className={`text-xs font-bold ${tierColors[tier]} truncate`}>{tierName} Tier</p>
              </div>
              <Settings className="w-4 h-4 text-slate-400 hover:text-white transition-colors cursor-pointer" />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-200/50 p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Invicta Labs
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

