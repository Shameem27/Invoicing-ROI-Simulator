import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, DollarSign, PiggyBank } from "lucide-react";
import { CalculatorResults } from "./Calculator";

interface ResultsDashboardProps {
  results: CalculatorResults | null;
}

export const ResultsDashboard = ({ results }: ResultsDashboardProps) => {
  if (!results) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">
            Enter your parameters and click "Calculate ROI" to see results
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatMonths = (value: number) => {
    return `${value.toFixed(1)} months`;
  };

  const metrics = [
    {
      title: "Monthly Savings",
      value: formatCurrency(results.monthlySavings),
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success-light",
      description: "Savings per month after automation",
    },
    {
      title: "Payback Period",
      value: formatMonths(results.paybackMonths),
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Time to recover implementation cost",
    },
    {
      title: "ROI Percentage",
      value: formatPercent(results.roiPercentage),
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Return on investment over time horizon",
    },
    {
      title: "Net Savings",
      value: formatCurrency(results.netSavings),
      icon: PiggyBank,
      color: "text-success",
      bgColor: "bg-success-light",
      description: "Total savings after implementation cost",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-elevated)] border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-2xl">Your ROI Results</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {metric.title}
                  </h3>
                  <p className="text-2xl font-bold mb-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Cumulative Savings: </span>
                <span className="font-semibold">{formatCurrency(results.cumulativeSavings)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Monthly Automated Cost: </span>
                <span className="font-semibold">{formatCurrency(results.automatedCost)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};