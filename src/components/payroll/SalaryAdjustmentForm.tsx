import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee, SalaryAdjustment } from '@/types/payroll';
import { toast } from 'sonner';

interface SalaryAdjustmentFormProps {
  employees: Employee[];
  onAdjustmentSubmit: (adjustment: Omit<SalaryAdjustment, 'id' | 'date' | 'type'>) => void;
}

export const SalaryAdjustmentForm = ({ employees, onAdjustmentSubmit }: SalaryAdjustmentFormProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId || !amount || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    const adjustmentAmount = parseFloat(amount);
    if (isNaN(adjustmentAmount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    onAdjustmentSubmit({
      employeeId: selectedEmployeeId,
      amount: adjustmentAmount,
      reason,
    });

    // Reset form
    setSelectedEmployeeId('');
    setAmount('');
    setReason('');
    
    toast.success(`Salary ${adjustmentAmount >= 0 ? 'increased' : 'decreased'} successfully`);
  };

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Adjustment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Select Employee</Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.employeeCode}) - Current: ฿{employee.currentSalary.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmployee && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Current Salary:</strong> ฿{selectedEmployee.currentSalary.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Position: {selectedEmployee.position}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Adjustment Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount (positive to increase, negative to decrease)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use positive numbers to increase salary, negative numbers to decrease
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Adjustment</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for this salary adjustment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Apply Salary Adjustment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};