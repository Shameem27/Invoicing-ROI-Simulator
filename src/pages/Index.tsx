import { useState } from "react";
import { Calculator, CalculatorInputs, CalculatorResults } from "@/components/Calculator";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { CostComparison } from "@/components/CostComparison";
import { ScenarioManager } from "@/components/ScenarioManager";
import { ReportGenerator } from "@/components/ReportGenerator";
import { TrendingUp } from "lucide-react";

const Index = () => {
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleCalculate = (newInputs: CalculatorInputs, newResults: CalculatorResults) => {
    setInputs(newInputs);
    setResults(newResults);
  };

  const handleLoadScenario = (loadedInputs: CalculatorInputs, loadedResults: CalculatorResults) => {
    setInputs(loadedInputs);
    setResults(loadedResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Invoicing ROI Simulator
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover your automation savings potential
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Calculate Your{" "}
              <span className="bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                Return on Investment
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how much time and money you can save by automating your invoice processing.
              Get instant calculations and actionable insights.
            </p>
          </div>

          {/* Calculator Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Calculator onCalculate={handleCalculate} />
            </div>
            <div className="space-y-6">
              <ScenarioManager
                inputs={inputs}
                results={results}
                onLoadScenario={handleLoadScenario}
              />
              <ReportGenerator inputs={inputs} results={results} />
            </div>
          </div>

          {/* Results Section */}
          <ResultsDashboard results={results} />

          {/* Chart Section */}
          {results && (
            <div className="animate-fade-in">
              <CostComparison results={results} />
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Real-Time Calculations</h3>
              <p className="text-sm text-muted-foreground">
                Get instant ROI results as you adjust parameters. No waiting, no complexity.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Save Scenarios</h3>
              <p className="text-sm text-muted-foreground">
                Store multiple scenarios and compare different automation strategies.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Detailed Reports</h3>
              <p className="text-sm text-muted-foreground">
                Generate professional PDF reports to share with stakeholders.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Invoicing ROI Simulator | Built by Shameem Mohamed S</p>
          <p className="mt-2">
            <a
              href="https://github.com/Shameem27/Invoicing-ROI-Simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;