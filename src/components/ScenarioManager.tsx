import { useState, useEffect } from "react";
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
import { Save, Trash2, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalculatorInputs, CalculatorResults } from "./Calculator";

interface ScenarioManagerProps {
  inputs: CalculatorInputs | null;
  results: CalculatorResults | null;
  onLoadScenario: (inputs: CalculatorInputs, results: CalculatorResults) => void;
}

interface Scenario {
  id: string;
  scenario_name: string;
  user_email: string;
  created_at: string;
  monthly_savings: number;
  roi_percentage: number;
}

export const ScenarioManager = ({ inputs, results, onLoadScenario }: ScenarioManagerProps) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioName, setScenarioName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScenarios(data || []);
    } catch (error: any) {
      console.error("Error loading scenarios:", error);
    }
  };

  const saveScenario = async () => {
    if (!inputs || !results || !scenarioName || !userEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide a scenario name and email, and calculate ROI first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("scenarios").insert({
        scenario_name: scenarioName,
        user_email: userEmail,
        invoice_volume: inputs.invoiceVolume,
        staff_count: inputs.staffCount,
        hourly_wage: inputs.hourlyWage,
        hours_per_invoice: inputs.hoursPerInvoice,
        manual_error_rate: inputs.manualErrorRate,
        auto_error_rate: inputs.autoErrorRate,
        error_cost: inputs.errorCost,
        automated_cost_per_invoice: inputs.automatedCostPerInvoice,
        implementation_cost: inputs.implementationCost,
        time_horizon_months: inputs.timeHorizonMonths,
        monthly_savings: results.monthlySavings,
        payback_months: results.paybackMonths,
        roi_percentage: results.roiPercentage,
        net_savings: results.netSavings,
        cumulative_savings: results.cumulativeSavings,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scenario saved successfully!",
      });

      setScenarioName("");
      setSaveDialogOpen(false);
      loadScenarios();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save scenario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScenario = async (id: string) => {
    try {
      const { error } = await supabase.from("scenarios").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scenario deleted successfully!",
      });

      loadScenarios();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete scenario",
        variant: "destructive",
      });
    }
  };

  const loadScenario = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const loadedInputs: CalculatorInputs = {
        invoiceVolume: data.invoice_volume,
        staffCount: data.staff_count,
        hourlyWage: Number(data.hourly_wage),
        hoursPerInvoice: Number(data.hours_per_invoice),
        manualErrorRate: Number(data.manual_error_rate),
        autoErrorRate: Number(data.auto_error_rate),
        errorCost: Number(data.error_cost),
        automatedCostPerInvoice: Number(data.automated_cost_per_invoice),
        implementationCost: Number(data.implementation_cost),
        timeHorizonMonths: data.time_horizon_months,
      };

      const loadedResults: CalculatorResults = {
        monthlySavings: Number(data.monthly_savings),
        paybackMonths: Number(data.payback_months),
        roiPercentage: Number(data.roi_percentage),
        netSavings: Number(data.net_savings),
        cumulativeSavings: Number(data.cumulative_savings),
        manualLaborCost: 0,
        automatedCost: 0,
      };

      onLoadScenario(loadedInputs, loadedResults);

      toast({
        title: "Success",
        description: "Scenario loaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load scenario",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          Saved Scenarios
        </CardTitle>
        <CardDescription>Save and manage your ROI calculations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline" disabled={!inputs || !results}>
              <Save className="mr-2 h-4 w-4" />
              Save Current Scenario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Scenario</DialogTitle>
              <DialogDescription>
                Give your scenario a name and provide your email to save it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="scenarioName">Scenario Name</Label>
                <Input
                  id="scenarioName"
                  placeholder="e.g., Q4 2024 Projection"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={saveScenario} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Scenario"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          {scenarios.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved scenarios yet. Calculate and save your first scenario!
            </p>
          ) : (
            scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1 cursor-pointer" onClick={() => loadScenario(scenario.id)}>
                  <p className="font-medium">{scenario.scenario_name}</p>
                  <p className="text-sm text-muted-foreground">
                    ROI: {scenario.roi_percentage.toFixed(1)}% | Savings: $
                    {scenario.monthly_savings.toFixed(0)}/mo
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteScenario(scenario.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};