import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Employee, Payslip, PayslipItem } from '@/types/payroll';
import { format } from 'date-fns';
import { Printer, Download } from 'lucide-react';

interface PayslipGeneratorProps {
  employee: Employee;
  onClose: () => void;
}

export const PayslipGenerator = ({ employee, onClose }: PayslipGeneratorProps) => {
  const currentDate = new Date();
  const currentMonth = format(currentDate, 'MMMM');
  const currentYear = format(currentDate, 'yyyy');
  const dueDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), 'dd/MM/yyyy');

  // Generate mock payslip data
  const generatePayslipData = (): Payslip => {
    const baseSalary = employee.currentSalary;
    const overtime = Math.floor(Math.random() * 5000);
    const bonus = Math.floor(Math.random() * 3000);
    
    const income: PayslipItem[] = [
      { description: 'เงินเดือนประจำ (Base Salary)', amount: baseSalary },
      { description: 'ค่าล่วงเวลา (Overtime)', amount: overtime },
      { description: 'โบนัส (Bonus)', amount: bonus },
    ];

    const grossIncome = income.reduce((sum, item) => sum + item.amount, 0);
    
    const socialSecurity = Math.min(grossIncome * 0.05, 750); // 5% capped at 750
    const tax = grossIncome * 0.05; // Simplified tax calculation
    const absence = Math.floor(Math.random() * 1000);
    
    const deductions: PayslipItem[] = [
      { description: 'ประกันสังคม (Social Security)', amount: socialSecurity },
      { description: 'ภาษี (Tax)', amount: tax },
      { description: 'หักขาดงาน (Absence)', amount: absence },
    ];

    const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = grossIncome - totalDeductions;

    return {
      employee,
      month: currentMonth,
      year: currentYear,
      dueDate,
      income,
      deductions,
      netIncome,
      accumulatedSalary: netIncome * 12, // Mock accumulated data
      accumulatedTax: tax * 12,
      accumulatedSocialSecurity: socialSecurity * 12,
      accumulatedProvidentFund: grossIncome * 0.03 * 12,
    };
  };

  const payslip = generatePayslipData();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <Button variant="outline" onClick={onClose}>
          Back to Overview
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8">
          {/* Company Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">บริษัท เอสเอสดับเบิลยู จำกัด</h1>
            <h2 className="text-xl font-semibold mb-1">SSW Company Limited</h2>
            <p className="text-sm text-muted-foreground">
              123 Technology Street, Bangkok 10110, Thailand
            </p>
            <p className="text-sm text-muted-foreground">Tel: 02-123-4567</p>
          </div>

          <Separator className="mb-6" />

          {/* Payslip Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">ใบจ่ายเงินเดือน (PAYSLIP)</h3>
            <p className="text-sm text-muted-foreground">
              For the month of {payslip.month} {payslip.year}
            </p>
          </div>

          {/* Employee Information */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">ชื่อพนักงาน (Employee Name):</span>
                <span>{payslip.employee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ตำแหน่ง (Position):</span>
                <span>{payslip.employee.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">รหัสพนักงาน (Employee Code):</span>
                <span>{payslip.employee.employeeCode}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">วันที่เริ่มงาน (Start Date):</span>
                <span>{format(new Date(payslip.employee.startDate), 'dd/MM/yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">เลขที่บัญชี (Account No.):</span>
                <span>{payslip.employee.bankAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ธนาคาร (Bank):</span>
                <span>{payslip.employee.bankName}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <span className="font-medium">วันที่จ่าย (Due Date): {payslip.dueDate}</span>
          </div>

          <Separator className="mb-6" />

          {/* Income and Deductions */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Income Section */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-center bg-muted p-2 rounded">
                รายได้ (INCOME)
              </h4>
              <div className="space-y-2">
                {payslip.income.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.description}</span>
                    <span>฿{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>รวมรายได้ (Total Income)</span>
                  <span>฿{payslip.income.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-center bg-muted p-2 rounded">
                รายการหัก (DEDUCTIONS)
              </h4>
              <div className="space-y-2">
                {payslip.deductions.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.description}</span>
                    <span>฿{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>รวมรายการหัก (Total Deductions)</span>
                  <span>฿{payslip.deductions.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Net Income */}
          <div className="text-center bg-primary/10 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-xl mb-2">รายได้สุทธิ (NET INCOME)</h4>
            <p className="text-3xl font-bold text-primary">฿{payslip.netIncome.toLocaleString()}</p>
          </div>

          {/* Accumulated Information */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-bold text-lg mb-4">ข้อมูลสะสม (ACCUMULATED)</h4>
              <div className="flex justify-between">
                <span>เงินได้สะสม (Accumulated Salary):</span>
                <span>฿{payslip.accumulatedSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ภาษีสะสม (Accumulated Tax):</span>
                <span>฿{payslip.accumulatedTax.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-lg mb-4">&nbsp;</h4>
              <div className="flex justify-between">
                <span>ประกันสังคมสะสม (Accumulated Social Security):</span>
                <span>฿{payslip.accumulatedSocialSecurity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>กองทุนสำรองเลียงชีพสะสม (Accumulated Provident Fund):</span>
                <span>฿{payslip.accumulatedProvidentFund.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>This is a computer-generated payslip and does not require a signature.</p>
            <p>Generated on {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};