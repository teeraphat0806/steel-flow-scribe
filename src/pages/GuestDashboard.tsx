import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Shield, User, LogOut } from 'lucide-react';

export default function GuestDashboard() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Steel Works System</h1>
              <p className="text-muted-foreground">Guest Access</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-dashed border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl text-center">
                Waiting for Role Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Your account has been created successfully, but you currently have guest access only.
              </p>
              <p className="text-muted-foreground">
                Please wait for a Superadmin to assign you a specific role to access the system features.
              </p>
              
              {profile && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center justify-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Account Information</span>
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Name:</strong> {profile.full_name || 'Not provided'}</p>
                    <p><strong>Current Role:</strong> {profile.role}</p>
                    <p><strong>Account Created:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 text-xs text-muted-foreground">
                <p>If you believe this is an error, please contact your system administrator.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}