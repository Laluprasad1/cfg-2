'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Trophy, 
  Target, 
  Zap, 
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Award,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Mock LeetCode data - in real app would fetch from LeetCode API
interface LeetCodeUser {
  username: string;
  ranking: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  recentSubmissions: Array<{
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
    timestamp: string;
  }>;
  badges: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
}

const mockLeetCodeData: LeetCodeUser[] = [
  {
    username: 'admin',
    ranking: 12548,
    totalSolved: 847,
    easySolved: 245,
    mediumSolved: 428,
    hardSolved: 174,
    acceptanceRate: 78.3,
    recentSubmissions: [
      { title: 'Two Sum', difficulty: 'Easy', status: 'Accepted', timestamp: '2 hours ago' },
      { title: 'Binary Tree Traversal', difficulty: 'Medium', status: 'Accepted', timestamp: '5 hours ago' },
      { title: 'Dynamic Programming Problem', difficulty: 'Hard', status: 'Wrong Answer', timestamp: '1 day ago' },
      { title: 'Graph Algorithm', difficulty: 'Medium', status: 'Accepted', timestamp: '2 days ago' },
    ],
    badges: [
      { name: 'Problem Solver', icon: '🏆', description: 'Solved 500+ problems' },
      { name: 'Speed Demon', icon: '⚡', description: 'Fast submission times' },
      { name: 'Consistency', icon: '📅', description: '30-day streak' },
    ]
  },
  {
    username: 'user1',
    ranking: 45821,
    totalSolved: 234,
    easySolved: 156,
    mediumSolved: 67,
    hardSolved: 11,
    acceptanceRate: 65.7,
    recentSubmissions: [
      { title: 'Array Manipulation', difficulty: 'Easy', status: 'Accepted', timestamp: '1 hour ago' },
      { title: 'String Processing', difficulty: 'Medium', status: 'Time Limit Exceeded', timestamp: '3 hours ago' },
      { title: 'Linked List', difficulty: 'Easy', status: 'Accepted', timestamp: '1 day ago' },
    ],
    badges: [
      { name: 'Beginner', icon: '🌱', description: 'Getting started' },
      { name: 'Daily Practice', icon: '💪', description: '7-day streak' },
    ]
  }
];

interface LeetCodeIntegrationProps {
  username?: string;
}

export function LeetCodeIntegration({ username = 'admin' }: LeetCodeIntegrationProps) {
  const [userData, setUserData] = useState<LeetCodeUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  console.log('LeetCodeIntegration: Rendering for user:', username);

  useEffect(() => {
    fetchLeetCodeData();
  }, [username]);

  const fetchLeetCodeData = async () => {
    console.log('LeetCodeIntegration: Fetching data for:', username);
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user = mockLeetCodeData.find(u => u.username === username);
      setUserData(user || null);
      setLastUpdated(new Date().toLocaleTimeString());
      
      if (user) {
        console.log('LeetCodeIntegration: Data loaded for user:', user.username);
        toast.success('LeetCode data updated successfully!');
      } else {
        toast.error('User not found in LeetCode database');
      }
    } catch (error) {
      console.error('LeetCodeIntegration: Error fetching data:', error);
      toast.error('Failed to fetch LeetCode data');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-green';
      case 'Medium': return 'text-warning-amber';
      case 'Hard': return 'text-error-red';
      default: return 'text-text-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'text-success-green';
      case 'Wrong Answer': return 'text-error-red';
      case 'Time Limit Exceeded': return 'text-warning-amber';
      default: return 'text-text-secondary';
    }
  };

  if (!userData && !isLoading) {
    return (
      <div className="text-center py-12">
        <Code className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">No LeetCode Data</h3>
        <p className="text-text-secondary mb-4">User not found in our database</p>
        <Button onClick={fetchLeetCodeData} className="bg-primary-blue hover:bg-primary-blue/90">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold gradient-text">LeetCode Integration</h1>
          <p className="text-text-secondary">
            Real-time programming performance tracking
            {lastUpdated && (
              <span className="ml-2 text-xs">
                • Last updated: {lastUpdated}
              </span>
            )}
          </p>
        </div>
        
        <Button
          onClick={fetchLeetCodeData}
          disabled={isLoading}
          variant="outline"
          className="border-dark-border hover:border-primary-blue"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Syncing...' : 'Sync Data'}
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-dark-border rounded w-3/4"></div>
                  <div className="h-8 bg-dark-border rounded w-1/2"></div>
                  <div className="h-4 bg-dark-border rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : userData && (
        <>
          {/* User Profile & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary-blue">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} />
                    <AvatarFallback className="bg-primary-blue text-white text-lg">
                      {userData.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-text-primary">{userData.username}</CardTitle>
                  <CardDescription className="text-text-secondary">
                    Global Rank: #{userData.ranking.toLocaleString()}
                  </CardDescription>
                  <Badge variant="outline" className="border-primary-blue text-primary-blue mt-2">
                    <Trophy className="w-3 h-3 mr-1" />
                    {userData.acceptanceRate}% Acceptance Rate
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-primary-blue hover:bg-primary-blue/90"
                    onClick={() => window.open(`https://leetcode.com/${userData.username}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on LeetCode
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Problems Solved */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-text-primary">
                    <Target className="w-5 h-5 mr-2 text-success-green" />
                    Problems Solved
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-text-primary">
                      {userData.totalSolved}
                    </div>
                    <div className="text-sm text-text-secondary">Total Problems</div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Easy', solved: userData.easySolved, total: 600, color: 'bg-success-green' },
                      { label: 'Medium', solved: userData.mediumSolved, total: 1400, color: 'bg-warning-amber' },
                      { label: 'Hard', solved: userData.hardSolved, total: 600, color: 'bg-error-red' }
                    ].map((difficulty, index) => (
                      <motion.div
                        key={difficulty.label}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-text-primary">{difficulty.label}</span>
                          <span className="text-text-secondary">
                            {difficulty.solved}/{difficulty.total}
                          </span>
                        </div>
                        <Progress 
                          value={(difficulty.solved / difficulty.total) * 100} 
                          className="h-2"
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-text-primary">
                    <Award className="w-5 h-5 mr-2 text-warning-amber" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userData.badges.map((badge, index) => (
                      <motion.div
                        key={badge.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center space-x-3 p-3 glass-card rounded-lg hover-lift"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-2xl">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-text-primary">
                            {badge.name}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {badge.description}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Code className="w-5 h-5 mr-2 text-primary-blue" />
                  Recent Submissions
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Latest coding activity and problem-solving progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userData.recentSubmissions.map((submission, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 glass-card rounded-lg hover-lift"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-text-primary">
                          {submission.title}
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <span className={getDifficultyColor(submission.difficulty)}>
                            {submission.difficulty}
                          </span>
                          <span className={getStatusColor(submission.status)}>
                            {submission.status}
                          </span>
                          <span className="text-text-secondary">
                            {submission.timestamp}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {submission.status === 'Accepted' ? (
                          <div className="w-8 h-8 bg-success-green/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-success-green" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-error-red/20 rounded-full flex items-center justify-center">
                            <X className="w-4 h-4 text-error-red" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}