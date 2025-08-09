import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Play, 
  CheckCircle, 
  Lock,
  Award,
  Target,
  TrendingUp,
  Coins,
  PiggyBank,
  CreditCard,
  Calculator,
  Users,
  Globe
} from 'lucide-react';

export const FinancialEducationHub = () => {
  const [selectedAge, setSelectedAge] = useState('all');

  // Mock data - replace with actual data hooks
  const educationModules = [
    {
      id: '1',
      title: 'What is Money?',
      description: 'Learn about the basics of money and why we use it',
      ageGroup: 'elementary',
      type: 'lesson',
      duration: '10 min',
      difficulty: 'beginner',
      isCompleted: true,
      score: 95,
      icon: <Coins className="h-6 w-6" />,
      topics: ['Basic concepts', 'History of money', 'Different types of money']
    },
    {
      id: '2',
      title: 'Saving vs Spending',
      description: 'Understand the difference between saving and spending money',
      ageGroup: 'elementary',
      type: 'interactive',
      duration: '15 min',
      difficulty: 'beginner',
      isCompleted: true,
      score: 88,
      icon: <PiggyBank className="h-6 w-6" />,
      topics: ['Smart choices', 'Needs vs wants', 'Saving strategies']
    },
    {
      id: '3',
      title: 'Banking Basics',
      description: 'How banks work and why we use them',
      ageGroup: 'middle',
      type: 'lesson',
      duration: '20 min',
      difficulty: 'intermediate',
      isCompleted: false,
      isLocked: false,
      icon: <CreditCard className="h-6 w-6" />,
      topics: ['What is a bank', 'Deposits and withdrawals', 'Interest']
    },
    {
      id: '4',
      title: 'Budgeting Game',
      description: 'Practice creating and managing a simple budget',
      ageGroup: 'middle',
      type: 'game',
      duration: '25 min',
      difficulty: 'intermediate',
      isCompleted: false,
      isLocked: false,
      icon: <Calculator className="h-6 w-6" />,
      topics: ['Budget creation', 'Tracking expenses', 'Goal setting']
    },
    {
      id: '5',
      title: 'Investment Basics',
      description: 'Introduction to investing and growing money',
      ageGroup: 'high',
      type: 'lesson',
      duration: '30 min',
      difficulty: 'advanced',
      isCompleted: false,
      isLocked: true,
      icon: <TrendingUp className="h-6 w-6" />,
      topics: ['What is investing', 'Risk and return', 'Different investment types']
    },
    {
      id: '6',
      title: 'Entrepreneurship Challenge',
      description: 'Learn about starting and running a business',
      ageGroup: 'high',
      type: 'challenge',
      duration: '45 min',
      difficulty: 'advanced',
      isCompleted: false,
      isLocked: true,
      icon: <Target className="h-6 w-6" />,
      topics: ['Business planning', 'Customer service', 'Profit and loss']
    }
  ];

  const childrenProgress = [
    {
      id: '1',
      name: 'Emma',
      age: 12,
      level: 'Intermediate',
      totalModules: 6,
      completedModules: 4,
      currentStreak: 7,
      totalPoints: 420,
      achievements: ['First Saver', 'Budget Master', 'Quiz Champion'],
      recentActivity: 'Completed "Banking Basics" - 92% score'
    },
    {
      id: '2',
      name: 'Jake',
      age: 10,
      level: 'Beginner',
      totalModules: 4,
      completedModules: 2,
      currentStreak: 3,
      totalPoints: 180,
      achievements: ['First Steps', 'Saving Star'],
      recentActivity: 'Started "Budgeting Game"'
    },
    {
      id: '3',
      name: 'Sophie',
      age: 8,
      level: 'Beginner',
      totalModules: 3,
      completedModules: 1,
      currentStreak: 1,
      totalPoints: 95,
      achievements: ['Money Explorer'],
      recentActivity: 'Completed "What is Money?" - 95% score'
    }
  ];

  const achievements = [
    { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', rarity: 'common' },
    { id: '2', name: 'Saving Star', description: 'Learn about saving money', icon: '⭐', rarity: 'common' },
    { id: '3', name: 'Budget Master', description: 'Master budgeting concepts', icon: '🏆', rarity: 'rare' },
    { id: '4', name: 'Quiz Champion', description: 'Score 90%+ on 5 quizzes', icon: '👑', rarity: 'epic' },
    { id: '5', name: 'Entrepreneur', description: 'Complete business challenge', icon: '💼', rarity: 'legendary' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-100 text-blue-800';
      case 'interactive':
        return 'bg-green-100 text-green-800';
      case 'game':
        return 'bg-purple-100 text-purple-800';
      case 'challenge':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'border-green-200 bg-green-50';
      case 'intermediate':
        return 'border-yellow-200 bg-yellow-50';
      case 'advanced':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300';
      case 'rare':
        return 'border-blue-300';
      case 'epic':
        return 'border-purple-300';
      case 'legendary':
        return 'border-yellow-300';
      default:
        return 'border-gray-300';
    }
  };

  const filteredModules = selectedAge === 'all' 
    ? educationModules 
    : educationModules.filter(module => module.ageGroup === selectedAge);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Education Hub</h2>
          <p className="text-muted-foreground">Interactive learning modules for financial literacy</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">3 Active Learners</Badge>
          <Button variant="outline">
            <Award className="h-4 w-4 mr-2" />
            View Certificates
          </Button>
        </div>
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Family Board</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Filter by Age Group:</label>
            <div className="flex space-x-2">
              <Button 
                variant={selectedAge === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedAge('all')}
              >
                All Ages
              </Button>
              <Button 
                variant={selectedAge === 'elementary' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedAge('elementary')}
              >
                Elementary (6-10)
              </Button>
              <Button 
                variant={selectedAge === 'middle' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedAge('middle')}
              >
                Middle (11-13)
              </Button>
              <Button 
                variant={selectedAge === 'high' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedAge('high')}
              >
                High School (14+)
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <Card key={module.id} className={`border-2 ${getDifficultyColor(module.difficulty)} ${module.isLocked ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {module.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{module.duration}</span>
                          <span>•</span>
                          <Badge variant="outline" className={getTypeColor(module.type)}>
                            {module.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {module.isCompleted && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">{module.score}%</span>
                      </div>
                    )}
                    {module.isLocked && (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Topics Covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {module.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline" className="capitalize">
                      {module.difficulty}
                    </Badge>
                    <Button 
                      size="sm" 
                      disabled={module.isLocked}
                      className={module.isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {module.isLocked ? (
                        <Lock className="h-4 w-4 mr-1" />
                      ) : module.isCompleted ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      {module.isLocked ? 'Locked' : module.isCompleted ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6">
            {childrenProgress.map((child) => (
              <Card key={child.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>{child.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Age {child.age} • {child.level} Level
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{child.totalPoints} pts</p>
                      <p className="text-sm text-muted-foreground">
                        {child.currentStreak} day streak 🔥
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Learning Progress</span>
                      <span>{child.completedModules}/{child.totalModules} modules</span>
                    </div>
                    <Progress 
                      value={(child.completedModules / child.totalModules) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Recent Activity</p>
                      <p className="text-sm text-muted-foreground">{child.recentActivity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Achievements</p>
                      <div className="flex flex-wrap gap-1">
                        {child.achievements.map((achievement, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`border-2 ${getRarityColor(achievement.rarity)}`}>
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  <Badge variant="outline" className={`capitalize ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Family Learning Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childrenProgress
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .map((child, index) => (
                    <div key={child.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{child.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {child.completedModules} modules • {child.currentStreak} day streak
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{child.totalPoints} pts</p>
                        <p className="text-sm text-muted-foreground">{child.level}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};