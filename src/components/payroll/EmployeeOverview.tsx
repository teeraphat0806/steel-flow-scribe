import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/payroll';
import { FileText } from 'lucide-react';

interface EmployeeOverviewProps {
  employees: Employee[];
  onGeneratePayslip: (employee: Employee) => void;
}

export const EmployeeOverview = ({ employees, onGeneratePayslip }: EmployeeOverviewProps) => {
  const totalMonthlySalary = employees.reduce((sum, emp) => sum + emp.currentSalary, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Salary Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">
                  ฿{totalMonthlySalary.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Total Monthly Payroll</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-secondary">
                  {employees.length}
                </div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Current Salary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employeeCode}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>฿{employee.currentSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGeneratePayslip(employee)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Generate Payslip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};