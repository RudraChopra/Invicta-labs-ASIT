import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, description }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <Icon className="h-5 w-5 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800">{value}</div>
          <p className="text-xs text-slate-500">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}