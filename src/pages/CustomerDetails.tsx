import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Building2, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  FileText,
  TrendingUp,
  AlertCircle,
  Edit,
  Plus
} from "lucide-react";

interface CustomerOrder {
  id: string;
  poNumber: string;
  status: string;
  totalValue: number;
  createdAt: Date;
  deliveryDate?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: Date;
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  averageOrderValue: number;
  paymentMethod: string;
  creditLimit: number;
  recentOrders: CustomerOrder[];
  notes?: string;
}

const mockCustomer: Customer = {
  id: "CUST-001",
  name: "ABC Manufacturing Ltd.",
  email: "procurement@abc-manufacturing.com",
  phone: "+1 (555) 123-4567",
  address: "123 Industrial Avenue, Manufacturing District, Metro City, State 12345",
  registrationDate: new Date("2023-06-15"),
  totalOrders: 15,
  totalSpent: 45250.00,
  activeOrders: 3,
  averageOrderValue: 3016.67,
  paymentMethod: "Bank Transfer",
  creditLimit: 50000,
  notes: "Preferred customer - automotive parts manufacturer. Requires precision cutting with tight tolerances.",
  recentOrders: [
    {
      id: "JO-001",
      poNumber: "PO-2024-001",
      status: "cutting",
      totalValue: 2450.00,
      createdAt: new Date("2024-01-15"),
      deliveryDate: "2024-01-20"
    },
    {
      id: "JO-015",
      poNumber: "PO-2024-015",
      status: "completed",
      totalValue: 3200.00,
      createdAt: new Date("2024-01-10"),
      deliveryDate: "2024-01-15"
    },
    {
      id: "JO-012",
      poNumber: "PO-2024-012",
      status: "shipped",
      totalValue: 1800.00,
      createdAt: new Date("2024-01-08"),
      deliveryDate: "2024-01-12"
    }
  ]
};

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setCustomer(mockCustomer);
      setLoading(false);
    };

    fetchCustomer();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-warning text-warning-foreground";
      case "cutting": return "bg-primary text-primary-foreground";
      case "weighing": return "bg-steel text-foreground";
      case "ready": return "bg-success text-success-foreground";
      case "shipped": return "bg-primary text-primary-foreground";
      case "completed": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCreditUsagePercentage = () => {
    if (!customer) return 0;
    return (customer.totalSpent / customer.creditLimit) * 100;
  };

  const handleSendEmail = () => {
    toast({
      title: "Email Client Opening",
      description: `Opening email to ${customer?.email}`,
    });
  };

  const handleCall = () => {
    toast({
      title: "Calling Customer",
      description: `Initiating call to ${customer?.phone}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-steel/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-steel/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Customer Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested customer could not be found.</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
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
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">
                  Customer Profile
                </h1>
              </div>
              <p className="text-muted-foreground">
                Detailed information for {customer.name}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCall}>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" size="sm" onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button variant="steel" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Overview */}
            <Card className="shadow-steel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </CardTitle>
                <CardDescription>
                  Customer ID: {customer.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Contact Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{customer.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {customer.address}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Account Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registration Date:</span>
                          <span className="font-medium">{customer.registrationDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Method:</span>
                          <span className="font-medium">{customer.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Credit Limit:</span>
                          <span className="font-medium">${customer.creditLimit.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Credit Usage</h4>
                      <Progress value={getCreditUsagePercentage()} className="mb-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Used: ${customer.totalSpent.toLocaleString()}</span>
                        <span className="text-muted-foreground">{getCreditUsagePercentage().toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {customer.notes && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Customer Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {customer.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="shadow-steel">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Recent Orders
                    </CardTitle>
                    <CardDescription>
                      Latest orders from this customer
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    New Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{order.poNumber}</h4>
                          <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Value:</span>
                          <p className="font-medium">${order.totalValue.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <p className="font-medium">{order.createdAt.toLocaleDateString()}</p>
                        </div>
                        {order.deliveryDate && (
                          <div>
                            <span className="text-muted-foreground">Delivery:</span>
                            <p className="font-medium">{order.deliveryDate}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-3">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/job-order/${order.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Customer Stats */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-steel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{customer.totalOrders}</div>
                  <p className="text-sm text-muted-foreground">Since registration</p>
                </CardContent>
              </Card>

              <Card className="shadow-steel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-success" />
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${customer.totalSpent.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Lifetime value</p>
                </CardContent>
              </Card>

              <Card className="shadow-steel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Average Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${customer.averageOrderValue.toFixed(0)}</div>
                  <p className="text-sm text-muted-foreground">Per order value</p>
                </CardContent>
              </Card>

              <Card className="shadow-steel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Active Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{customer.activeOrders}</div>
                  <p className="text-sm text-muted-foreground">In progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-steel">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/new-job-order")}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={handleSendEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;