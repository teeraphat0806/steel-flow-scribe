import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Scissors, 
  Users, 
  Clock,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  BarChart3,
  Calendar,
  User,
  PlayCircle,
  PauseCircle,
  StopCircle
} from "lucide-react";

interface ProductionJob {
  id: string;
  poNumber: string;
  customerName: string;
  steelType: string;
  quantity: number;
  completedQuantity: number;
  assignedCutter: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "queued" | "cutting" | "paused" | "completed";
  startTime?: Date;
  estimatedCompletion?: Date;
  actualTime?: number;
  estimatedTime: number;
}

interface Cutter {
  id: string;
  name: string;
  status: "active" | "idle" | "offline";
  currentJob?: string;
  todayCompleted: number;
  efficiency: number;
  totalExperience: number;
}

const mockProductionJobs: ProductionJob[] = [
  {
    id: "JO-001",
    poNumber: "PO-2024-001",
    customerName: "ABC Manufacturing",
    steelType: "Carbon Steel",
    quantity: 50,
    completedQuantity: 25,
    assignedCutter: "John Smith",
    priority: "high",
    status: "cutting",
    startTime: new Date("2024-01-15T08:30:00"),
    estimatedCompletion: new Date("2024-01-15T14:30:00"),
    estimatedTime: 360
  },
  {
    id: "JO-002",
    poNumber: "PO-2024-002",
    customerName: "XYZ Industries",
    steelType: "Stainless Steel",
    quantity: 25,
    completedQuantity: 0,
    assignedCutter: "Mike Johnson",
    priority: "normal",
    status: "queued",
    estimatedTime: 180
  },
  {
    id: "JO-003",
    poNumber: "PO-2024-003",
    customerName: "Steel Works Ltd",
    steelType: "Aluminum",
    quantity: 100,
    completedQuantity: 100,
    assignedCutter: "Sarah Wilson",
    priority: "urgent",
    status: "completed",
    startTime: new Date("2024-01-14T09:00:00"),
    actualTime: 240,
    estimatedTime: 300
  }
];

const mockCutters: Cutter[] = [
  {
    id: "CUT-001",
    name: "John Smith",
    status: "active",
    currentJob: "JO-001",
    todayCompleted: 3,
    efficiency: 95,
    totalExperience: 8
  },
  {
    id: "CUT-002",
    name: "Mike Johnson",
    status: "idle",
    todayCompleted: 2,
    efficiency: 87,
    totalExperience: 5
  },
  {
    id: "CUT-003",
    name: "Sarah Wilson",
    status: "active",
    currentJob: "JO-004",
    todayCompleted: 4,
    efficiency: 98,
    totalExperience: 12
  },
  {
    id: "CUT-004",
    name: "David Brown",
    status: "offline",
    todayCompleted: 0,
    efficiency: 82,
    totalExperience: 3
  }
];

const ProductionDetails = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ProductionJob[]>(mockProductionJobs);
  const [cutters, setCutters] = useState<Cutter[]>(mockCutters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "queued": return "bg-warning text-warning-foreground";
      case "cutting": return "bg-primary text-primary-foreground";
      case "paused": return "bg-muted text-muted-foreground";
      case "completed": return "bg-success text-success-foreground";
      case "active": return "bg-success text-success-foreground";
      case "idle": return "bg-warning text-warning-foreground";
      case "offline": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "normal": return "bg-primary text-primary-foreground";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getJobProgress = (job: ProductionJob) => {
    return (job.completedQuantity / job.quantity) * 100;
  };

  const getTotalProductionStats = () => {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(job => job.status === "completed").length;
    const activeJobs = jobs.filter(job => job.status === "cutting").length;
    const queuedJobs = jobs.filter(job => job.status === "queued").length;
    
    return { totalJobs, completedJobs, activeJobs, queuedJobs };
  };

  const handleJobAction = (jobId: string, action: "start" | "pause" | "complete") => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        switch (action) {
          case "start":
            return { ...job, status: "cutting", startTime: new Date() };
          case "pause":
            return { ...job, status: "paused" };
          case "complete":
            return { ...job, status: "completed", completedQuantity: job.quantity };
          default:
            return job;
        }
      }
      return job;
    }));

    toast({
      title: "Job Status Updated",
      description: `Job ${jobId} has been ${action}ed`,
    });
  };

  const stats = getTotalProductionStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-steel/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading production details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-steel/20">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Scissors className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Production Overview
            </h1>
          </div>
          <p className="text-muted-foreground">
            Real-time production monitoring and management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-steel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Currently cutting</p>
            </CardContent>
          </Card>

          <Card className="shadow-steel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queued Jobs</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.queuedJobs}</div>
              <p className="text-xs text-muted-foreground">Waiting to start</p>
            </CardContent>
          </Card>

          <Card className="shadow-steel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <p className="text-xs text-muted-foreground">Jobs finished</p>
            </CardContent>
          </Card>

          <Card className="shadow-steel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cutters</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cutters.filter(c => c.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-steel">
              <Tabs defaultValue="jobs" className="w-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="jobs">Production Jobs</TabsTrigger>
                    <TabsTrigger value="cutters">Steel Cutters</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent>
                  <TabsContent value="jobs" className="space-y-4">
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-4 bg-card">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{job.poNumber}</h3>
                              <p className="text-sm text-muted-foreground">{job.customerName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(job.priority)}>
                                {job.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                            <div>
                              <span className="text-muted-foreground">Steel:</span>
                              <p className="font-medium">{job.steelType}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Assigned to:</span>
                              <p className="font-medium">{job.assignedCutter}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Progress:</span>
                              <p className="font-medium">{job.completedQuantity}/{job.quantity}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Est. Time:</span>
                              <p className="font-medium">{job.estimatedTime} min</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{getJobProgress(job).toFixed(1)}%</span>
                            </div>
                            <Progress value={getJobProgress(job)} />
                          </div>

                          <div className="flex justify-between items-center">
                            {job.startTime && (
                              <span className="text-xs text-muted-foreground">
                                Started: {job.startTime.toLocaleTimeString()}
                              </span>
                            )}
                            
                            <div className="flex gap-2">
                              {job.status === "queued" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleJobAction(job.id, "start")}
                                >
                                  <PlayCircle className="mr-1 h-3 w-3" />
                                  Start
                                </Button>
                              )}
                              {job.status === "cutting" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleJobAction(job.id, "pause")}
                                  >
                                    <PauseCircle className="mr-1 h-3 w-3" />
                                    Pause
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleJobAction(job.id, "complete")}
                                  >
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Complete
                                  </Button>
                                </>
                              )}
                              {job.status === "paused" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleJobAction(job.id, "start")}
                                >
                                  <PlayCircle className="mr-1 h-3 w-3" />
                                  Resume
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/job-order/${job.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="cutters" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cutters.map((cutter) => (
                        <div key={cutter.id} className="border rounded-lg p-4 bg-card">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <User className="h-8 w-8 text-muted-foreground" />
                              <div>
                                <h3 className="font-semibold">{cutter.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {cutter.totalExperience} years experience
                                </p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(cutter.status)}>
                              {cutter.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Today's Completed:</span>
                              <span className="font-medium">{cutter.todayCompleted}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Efficiency:</span>
                              <span className="font-medium">{cutter.efficiency}%</span>
                            </div>
                            {cutter.currentJob && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Current Job:</span>
                                <span className="font-medium">{cutter.currentJob}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Efficiency</span>
                              <span>{cutter.efficiency}%</span>
                            </div>
                            <Progress value={cutter.efficiency} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Today's Performance */}
            <Card className="shadow-steel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Today's Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Jobs Completed:</span>
                  <span className="font-bold">{stats.completedJobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Efficiency:</span>
                  <span className="font-bold">
                    {Math.round(cutters.reduce((sum, c) => sum + c.efficiency, 0) / cutters.length)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">On-time Delivery:</span>
                  <span className="font-bold">92%</span>
                </div>
              </CardContent>
            </Card>

            {/* Priority Queue */}
            <Card className="shadow-steel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Priority Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobs
                    .filter(job => job.priority === "urgent" || job.priority === "high")
                    .slice(0, 3)
                    .map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <p className="text-sm font-medium">{job.poNumber}</p>
                          <p className="text-xs text-muted-foreground">{job.customerName}</p>
                        </div>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-steel">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Target className="mr-2 h-4 w-4" />
                  Assign Jobs
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Production
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionDetails;