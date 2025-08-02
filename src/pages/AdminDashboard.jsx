import React, { useState, useEffect } from "react";
import { User, Module, Lesson } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Users, BarChart, DollarSign, BookOpen, Layers, Activity } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/admin/StatCard";
import UserList from "../components/admin/UserList";
import TierDistributionChart from "../components/admin/TierDistributionChart";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const currentUser = await User.me();
        if (currentUser.role !== 'admin') {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        setIsAdmin(true);

        const [allUsers, allModules, allLessons] = await Promise.all([
          User.list(),
          Module.list(),
          Lesson.list()
        ]);
        
        setUsers(allUsers);
        
        // Calculate stats
        const proUsers = allUsers.filter(u => u.subscription_tier === 'pro').length;
        const expertUsers = allUsers.filter(u => u.subscription_tier === 'expert').length;
        const monthlyRevenue = (proUsers * 50) + (expertUsers * 200);

        setStats({
          totalUsers: allUsers.length,
          totalModules: allModules.length,
          totalLessons: allLessons.length,
          monthlyRevenue: monthlyRevenue,
          tierDistribution: [
            { name: 'Basic', value: allUsers.length - proUsers - expertUsers },
            { name: 'Pro', value: proUsers },
            { name: 'Expert', value: expertUsers }
          ]
        });

      } catch (error) {
        console.error("Error loading admin data:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAdminData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Activity className="w-12 h-12 mx-auto animate-spin text-blue-600 mb-4" />
        <p className="text-lg font-semibold">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-slate-800">Access Denied</h1>
        <p className="text-slate-600 mt-2 mb-6">You do not have permission to view this page.</p>
        <Link to={createPageUrl("Dashboard")}>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
            Return to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600">Platform overview and management.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="All registered users"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="Estimated monthly income"
          />
          <StatCard
            title="Total Modules"
            value={stats.totalModules}
            icon={Layers}
            description="Published learning modules"
          />
          <StatCard
            title="Total Lessons"
            value={stats.totalLessons}
            icon={BookOpen}
            description="Across all modules"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UserList users={users} />
          </div>
          <div>
            <TierDistributionChart data={stats.tierDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}