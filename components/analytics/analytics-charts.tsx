'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { toast } from 'sonner';

// Mock data for different time periods
const analyticsData = {
  daily: [
    { time: '00:00', performance: 85, users: 120, errors: 2 },
    { time: '04:00', performance: 92, users: 150, errors: 1 },
    { time: '08:00', performance: 78, users: 280, errors: 5 },
    { time: '12:00', performance: 95, users: 450, errors: 3 },
    { time: '16:00', performance: 88, users: 380, errors: 4 },
    { time: '20:00', performance: 96, users: 320, errors: 2 },
  ],
  weekly: [
    { time: 'Mon', performance: 88, users: 1200, errors: 15 },
    { time: 'Tue', performance: 92, users: 1350, errors: 12 },
    { time: 'Wed', performance: 85, users: 1180, errors: 18 },
    { time: 'Thu', performance: 96, users: 1450, errors: 8 },
    { time: 'Fri', performance: 89, users: 1380, errors: 14 },
    { time: 'Sat', performance: 94, users: 980, errors: 6 },
    { time: 'Sun', performance: 91, users: 850, errors: 9 },
  ],
  monthly: [
    { time: 'Jan', performance: 85, users: 12000, errors: 150 },
    { time: 'Feb', performance: 92, users: 15000, errors: 120 },
    { time: 'Mar', performance: 78, users: 18000, errors: 180 },
    { time: 'Apr', performance: 95, users: 22000, errors: 80 },
    { time: 'May', performance: 88, users: 28000, errors: 140 },
    { time: 'Jun', performance: 96, users: 32000, errors: 60 },
  ]
};

const radarData = [
  { subject: 'Performance', A: 120, B: 110, fullMark: 150 },
  { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
  { subject: 'Scalability', A: 86, B: 130, fullMark: 150 },
  { subject: 'Security', A: 99, B: 100, fullMark: 150 },
  { subject: 'Usability', A: 85, B: 90, fullMark: 150 },
  { subject: 'Efficiency', A: 65, B: 85, fullMark: 150 },
];

export function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'users' | 'errors'>('performance');

  console.log('AnalyticsCharts: Rendering with timeRange:', timeRange, 'metric:', selectedMetric);

  const handleRefresh = async () => {
    console.log('AnalyticsCharts: Refreshing data');
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsRefreshing(false);
    toast.success('Analytics data refreshed successfully!');
  };

  const handleExport = () => {
    console.log('AnalyticsCharts: Exporting data');
    toast.success('Analytics report exported to CSV!');
  };

  const currentData = analyticsData[timeRange];
  const metricColor = {
    performance: '#3B82F6',
    users: '#10B981', 
    errors: '#EF4444'
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
      >
        <div>
          <h1 className="text-2xl font-bold gradient-text">Advanced Analytics</h1>
          <p className="text-text-secondary">Deep dive into performance metrics and trends</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[120px] bg-dark-card border-dark-border">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
            <SelectTrigger className="w-[140px] bg-dark-card border-dark-border">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="errors">Errors</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-dark-border hover:border-primary-blue"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={handleExport}
            className="bg-success-green hover:bg-success-green/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-text-primary">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-blue" />
                {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trends
              </div>
              <Badge variant="outline" className="border-primary-blue text-primary-blue">
                {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View
              </Badge>
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Comprehensive {selectedMetric} analysis over {timeRange} periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="time" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #2A2A2A',
                    borderRadius: '8px',
                    color: '#F8FAFC'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke={metricColor[selectedMetric]}
                  strokeWidth={3}
                  dot={{ fill: metricColor[selectedMetric], strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: metricColor[selectedMetric], strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-text-primary">Performance Comparison</CardTitle>
              <CardDescription className="text-text-secondary">
                Side-by-side metric comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="time" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: '1px solid #2A2A2A',
                      borderRadius: '8px',
                      color: '#F8FAFC'
                    }} 
                  />
                  <Bar dataKey="performance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-text-primary">System Health Radar</CardTitle>
              <CardDescription className="text-text-secondary">
                Multi-dimensional performance assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2A2A2A" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <Radar
                    name="Current"
                    dataKey="A"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Target"
                    dataKey="B"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A1A',
                      border: '1px solid #2A2A2A',
                      borderRadius: '8px',
                      color: '#F8FAFC'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Metrics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { 
            title: 'Average Performance', 
            value: '91.2%', 
            change: '+2.3%', 
            icon: TrendingUp,
            color: 'success-green'
          },
          { 
            title: 'Peak Load Handled', 
            value: '450 Users', 
            change: '+15%', 
            icon: TrendingUp,
            color: 'primary-blue'
          },
          { 
            title: 'Error Rate', 
            value: '0.8%', 
            change: '-0.2%', 
            icon: TrendingUp,
            color: 'warning-amber'
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card hover-lift">
              <CardContent className="p-6 text-center">
                <metric.icon className={`w-8 h-8 mx-auto mb-3 text-${metric.color}`} />
                <h3 className="text-lg font-semibold text-text-primary mb-2">{metric.title}</h3>
                <p className="text-2xl font-bold text-text-primary mb-1">{metric.value}</p>
                <Badge variant="outline" className={`border-${metric.color} text-${metric.color}`}>
                  {metric.change} from last period
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}