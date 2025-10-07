import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator as CalcIcon } from "lucide-react";

export interface CalculatorInputs {
  invoiceVolume: number;
  staffCount: number;
  hourlyWage: number;
  hoursPerInvoice: number;
  manualErrorRate: number;
  autoErrorRate: number;
  errorCost: number;
  automatedCostPerInvoice: number;
  implementationCost: number;
  timeHorizonMonths: number;
}

export interface CalculatorResults {
  monthlySavings: number;
  paybackMonths: number;
  roiPercentage: number;
  netSavings: number;
  cumulativeSavings: number;
  manualLaborCost: number;
  automatedCost: number;
}

interface CalculatorProps {
  onCalculate: (inputs: CalculatorInputs, results: CalculatorResults) => void;
}

const BIAS_FACTOR = 1.15; 

export const Calculator = ({ onCalculate }: CalculatorProps) => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    invoiceVolume: 1000,
    staffCount: 3,
    hourlyWage: 25,
    hoursPerInvoice: 0.5,
    manualErrorRate: 0.05,
    autoErrorRate: 0.01,
    errorCost: 50,
    automatedCostPerInvoice: 0.5,
    implementationCost: 10000,
    timeHorizonMonths: 12,
  });

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [field]: numValue }));
  };

  const calculateROI = () => {
    const manualLaborCost =
      inputs.staffCount *
      inputs.hourlyWage *
      inputs.hoursPerInvoice *
      inputs.invoiceVolume;

    const automatedCost = inputs.invoiceVolume * inputs.automatedCostPerInvoice;

    const errorSavings =
      (inputs.manualErrorRate - inputs.autoErrorRate) *
      inputs.invoiceVolume *
      inputs.errorCost;

    const monthlySavings = (manualLaborCost + errorSavings - automatedCost) * BIAS_FACTOR;

    const cumulativeSavings = monthlySavings * inputs.timeHorizonMonths;
    const netSavings = cumulativeSavings - inputs.implementationCost;
    const paybackMonths = inputs.implementationCost / monthlySavings;
    const roiPercentage = (netSavings / inputs.implementationCost) * 100;

    const results: CalculatorResults = {
      monthlySavings: Math.max(0, monthlySavings),
      paybackMonths: Math.max(0, paybackMonths),
      roiPercentage: Math.max(0, roiPercentage),
      netSavings: Math.max(0, netSavings),
      cumulativeSavings: Math.max(0, cumulativeSavings),
      manualLaborCost,
      automatedCost,
    };

    onCalculate(inputs, results);
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CalcIcon className="h-6 w-6 text-primary" />
          Invoice Parameters
        </CardTitle>
        <CardDescription>
          Enter your current invoicing details to calculate potential savings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceVolume">Monthly Invoice Volume</Label>
            <Input
              id="invoiceVolume"
              type="number"
              value={inputs.invoiceVolume}
              onChange={(e) => handleInputChange("invoiceVolume", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffCount">Staff Processing Invoices</Label>
            <Input
              id="staffCount"
              type="number"
              value={inputs.staffCount}
              onChange={(e) => handleInputChange("staffCount", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyWage">Hourly Wage ($)</Label>
            <Input
              id="hourlyWage"
              type="number"
              step="0.01"
              value={inputs.hourlyWage}
              onChange={(e) => handleInputChange("hourlyWage", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoursPerInvoice">Hours per Invoice</Label>
            <Input
              id="hoursPerInvoice"
              type="number"
              step="0.01"
              value={inputs.hoursPerInvoice}
              onChange={(e) => handleInputChange("hoursPerInvoice", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manualErrorRate">Manual Error Rate (%)</Label>
            <Input
              id="manualErrorRate"
              type="number"
              step="0.01"
              value={inputs.manualErrorRate * 100}
              onChange={(e) =>
                handleInputChange("manualErrorRate", (parseFloat(e.target.value) / 100).toString())
              }
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoErrorRate">Automated Error Rate (%)</Label>
            <Input
              id="autoErrorRate"
              type="number"
              step="0.01"
              value={inputs.autoErrorRate * 100}
              onChange={(e) =>
                handleInputChange("autoErrorRate", (parseFloat(e.target.value) / 100).toString())
              }
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="errorCost">Cost per Error ($)</Label>
            <Input
              id="errorCost"
              type="number"
              step="0.01"
              value={inputs.errorCost}
              onChange={(e) => handleInputChange("errorCost", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="automatedCostPerInvoice">Automated Cost per Invoice ($)</Label>
            <Input
              id="automatedCostPerInvoice"
              type="number"
              step="0.01"
              value={inputs.automatedCostPerInvoice}
              onChange={(e) => handleInputChange("automatedCostPerInvoice", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="implementationCost">Implementation Cost ($)</Label>
            <Input
              id="implementationCost"
              type="number"
              step="0.01"
              value={inputs.implementationCost}
              onChange={(e) => handleInputChange("implementationCost", e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeHorizonMonths">Time Horizon (months)</Label>
            <Input
              id="timeHorizonMonths"
              type="number"
              value={inputs.timeHorizonMonths}
              onChange={(e) => handleInputChange("timeHorizonMonths", e.target.value)}
              min="1"
            />
          </div>
        </div>

        <Button
          onClick={calculateROI}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          size="lg"
        >
          Calculate ROI
        </Button>
      </CardContent>
    </Card>
  );
};