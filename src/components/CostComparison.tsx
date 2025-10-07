import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { CalculatorResults } from "./Calculator";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface CostComparisonProps {
  results: CalculatorResults | null;
}

export const CostComparison = ({ results }: CostComparisonProps) => {
  const chartRef = useRef(null);

  if (!results) {
    return null;
  }

  const data = {
    labels: ["Manual Process", "Automated Process"],
    datasets: [
      {
        label: "Monthly Cost ($)",
        data: [results.manualLaborCost, results.automatedCost],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  const savingsPercentage = ((results.manualLaborCost - results.automatedCost) / results.manualLaborCost * 100).toFixed(1);

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle>Cost Comparison</CardTitle>
        <CardDescription>
          You could save <span className="font-bold text-success">{savingsPercentage}%</span> on monthly invoice processing costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};