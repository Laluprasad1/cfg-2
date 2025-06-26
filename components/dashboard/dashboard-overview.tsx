'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Target,
  Award,
  Activity,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const performanceData = [
  { name: 'Jan', value: 85, users: 120 },
  { name: 'Feb', value: 92, users: 150 },
  { name: 'Mar', value: 78, users: 180 },
  { name: 'Apr', value: 95, users: 220 },
  { name: 'May', value: 88, users: 280 },
  { name: 'Jun', value: 96, users: 320 },
];

const leetcodeData = [
  { difficulty: 'Easy', solved: 45, total: 60 },
  { difficulty: 'Medium', solved: 28, total: 50 },
  { difficulty: 'Hard', solved: 12, total: 30 },
];

const activityData = [
  { name: 'Active', value: 68, color: '#10B981' },
  { name: 'Idle', value: 22, color: '#F59E0B' },
  { name: 'Offline', value: 10, color: '#EF4444' },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'down';
  color: string;
}

function MetricCard({ title, value, change, icon: Icon, trend, color }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{title}</p>
              <p className="text-2xl font-bold text-text-primary">{value}</p>
              <div className="flex items-center mt-2">
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success-green mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-error-red mr-1" />
                )}
                <span className={`text-sm font-medium ${trend === 'up' ? 'text-success-green' : 'text-error-red'}`}>
                  {change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg bg-${color}/20`}>
              <Icon className={`w-6 h-6 text-${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardOverview() {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    console.log('DashboardOverview: Component mounted');
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Metrics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="2,847"
          change="+12.5%"
          icon={Users}
          trend="up"
          color="primary-blue"
        />
        <MetricCard
          title="Performance Score"
          value="94.2%"
          change="+3.1%"
          icon={Target}
          trend="up"
          color="success-green"
        />
        <MetricCard
          title="Average Response"
          value="1.2s"
          change="-0.3s"
          icon={Clock}
          trend="up"
          color="warning-amber"
        />
        <MetricCard
          title="Active Sessions"
          value="1,234"
          change="+5.7%"
          icon={Activity}
          trend="up"
          color="primary-blue"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center text-text-primary">
                <TrendingUp className="w-5 h-5 mr-2 text-success-green" />
                Performance Trends
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Monthly performance metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: '1px solid #2A2A2A',
                      borderRadius: '8px',
                      color: '#F8FAFC'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorPerformance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Activity */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center text-text-primary">
                <Activity className="w-5 h-5 mr-2 text-primary-blue" />
                User Activity
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Current user status distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #2A2A2A',
                        borderRadius: '8px',
                        color: '#F8FAFC'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {activityData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-text-secondary">{item.name}</span>
                    </div>
                    <p className="text-lg font-bold text-text-primary">{item.value}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* LeetCode Progress */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-text-primary">
              <Award className="w-5 h-5 mr-2 text-warning-amber" />
              LeetCode Progress
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Problem-solving statistics by difficulty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leetcodeData.map((item, index) => (
                <motion.div
                  key={item.difficulty}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{item.difficulty}</span>
                    <Badge variant={
                      item.difficulty === 'Easy' ? 'default' : 
                      item.difficulty === 'Medium' ? 'secondary' : 'destructive'
                    }>
                      {item.solved}/{item.total}
                    </Badge>
                  </div>
                  <Progress 
                    value={(item.solved / item.total) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-text-secondary">
                    {Math.round((item.solved / item.total) * 100)}% completed
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-text-primary">
              <Zap className="w-5 h-5 mr-2 text-primary-blue" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Upload Assessment', icon: '📊' },
                { label: 'Generate Report', icon: '📈' },
                { label: 'View Analytics', icon: '🔍' },
                { label: 'Manage Users', icon: '👥' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 text-center glass-card border border-dark-border hover:border-primary-blue/50 transition-all duration-200 rounded-lg"
                  onClick={() => console.log('Quick action:', action.label)}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-sm font-medium text-text-primary">{action.label}</p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}