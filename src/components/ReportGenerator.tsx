import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CalculatorInputs, CalculatorResults } from "./Calculator";
import jsPDF from "jspdf";

interface ReportGeneratorProps {
  inputs: CalculatorInputs | null;
  results: CalculatorResults | null;
}

export const ReportGenerator = ({ inputs, results }: ReportGeneratorProps) => {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const generatePDFReport = () => {
    if (!inputs || !results || !email || !companyName) {
      toast({
        title: "Missing Information",
        description: "Please provide your email, company name, and calculate ROI first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Header
      doc.setFillColor(0, 123, 167);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("ROI Analysis Report", pageWidth / 2, 25, { align: "center" });

      // Company Info
      yPos = 60;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text(`Company: ${companyName}`, 20, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(`Contact: ${email}`, 20, yPos);
      yPos += 10;
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, yPos);

      // Key Metrics Section
      yPos += 20;
      doc.setFontSize(18);
      doc.setTextColor(0, 123, 167);
      doc.text("Key ROI Metrics", 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const metrics = [
        { label: "Monthly Savings", value: `$${results.monthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { label: "Payback Period", value: `${results.paybackMonths.toFixed(1)} months` },
        { label: "ROI Percentage", value: `${results.roiPercentage.toFixed(1)}%` },
        { label: "Net Savings", value: `$${results.netSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { label: "Cumulative Savings", value: `$${results.cumulativeSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      ];

      metrics.forEach((metric) => {
        doc.setFont(undefined, "bold");
        doc.text(`${metric.label}:`, 20, yPos);
        doc.setFont(undefined, "normal");
        doc.text(metric.value, 100, yPos);
        yPos += 8;
      });

      // Input Parameters Section
      yPos += 15;
      doc.setFontSize(18);
      doc.setTextColor(0, 123, 167);
      doc.text("Input Parameters", 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const parameters = [
        { label: "Monthly Invoice Volume", value: inputs.invoiceVolume.toString() },
        { label: "Staff Count", value: inputs.staffCount.toString() },
        { label: "Hourly Wage", value: `$${inputs.hourlyWage}` },
        { label: "Hours per Invoice", value: inputs.hoursPerInvoice.toString() },
        { label: "Manual Error Rate", value: `${(inputs.manualErrorRate * 100).toFixed(2)}%` },
        { label: "Automated Error Rate", value: `${(inputs.autoErrorRate * 100).toFixed(2)}%` },
        { label: "Cost per Error", value: `$${inputs.errorCost}` },
        { label: "Automated Cost per Invoice", value: `$${inputs.automatedCostPerInvoice}` },
        { label: "Implementation Cost", value: `$${inputs.implementationCost}` },
        { label: "Time Horizon", value: `${inputs.timeHorizonMonths} months` },
      ];

      parameters.forEach((param) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont(undefined, "bold");
        doc.text(`${param.label}:`, 20, yPos);
        doc.setFont(undefined, "normal");
        doc.text(param.value, 100, yPos);
        yPos += 8;
      });

      // Cost Comparison
      yPos += 15;
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(18);
      doc.setTextColor(0, 123, 167);
      doc.text("Cost Comparison", 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text("Manual Monthly Cost:", 20, yPos);
      doc.setFont(undefined, "normal");
      doc.text(`$${results.manualLaborCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 100, yPos);
      yPos += 8;

      doc.setFont(undefined, "bold");
      doc.text("Automated Monthly Cost:", 20, yPos);
      doc.setFont(undefined, "normal");
      doc.text(`$${results.automatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 100, yPos);
      yPos += 8;

      const savingsPercent = ((results.manualLaborCost - results.automatedCost) / results.manualLaborCost * 100);
      doc.setFont(undefined, "bold");
      doc.setTextColor(34, 197, 94);
      doc.text(`Cost Reduction: ${savingsPercent.toFixed(1)}%`, 20, yPos);

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text("Generated by Invoice ROI Simulator", pageWidth / 2, footerY, { align: "center" });

      // Save the PDF
      doc.save(`ROI-Report-${companyName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`);

      toast({
        title: "Success",
        description: "Your ROI report has been generated and downloaded!",
      });

      setDialogOpen(false);
      setEmail("");
      setCompanyName("");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Generate Report
        </CardTitle>
        <CardDescription>Download a detailed PDF report of your ROI analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default" disabled={!inputs || !results}>
              <Download className="mr-2 h-4 w-4" />
              Generate PDF Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate ROI Report</DialogTitle>
              <DialogDescription>
                Enter your details to generate and download a comprehensive ROI report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reportEmail">Email</Label>
                <Input
                  id="reportEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportCompany">Company Name</Label>
                <Input
                  id="reportCompany"
                  placeholder="Your Company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={generatePDFReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};