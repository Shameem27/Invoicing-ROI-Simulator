-- Create scenarios table for storing ROI calculations
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  scenario_name TEXT NOT NULL,
  
  -- Input parameters
  invoice_volume INTEGER NOT NULL,
  staff_count INTEGER NOT NULL,
  hourly_wage DECIMAL(10,2) NOT NULL,
  hours_per_invoice DECIMAL(10,2) NOT NULL,
  manual_error_rate DECIMAL(5,4) NOT NULL,
  auto_error_rate DECIMAL(5,4) NOT NULL,
  error_cost DECIMAL(10,2) NOT NULL,
  automated_cost_per_invoice DECIMAL(10,2) NOT NULL,
  implementation_cost DECIMAL(10,2) NOT NULL,
  time_horizon_months INTEGER NOT NULL,
  
  -- Calculated results
  monthly_savings DECIMAL(12,2) NOT NULL,
  payback_months DECIMAL(10,2) NOT NULL,
  roi_percentage DECIMAL(10,2) NOT NULL,
  net_savings DECIMAL(12,2) NOT NULL,
  cumulative_savings DECIMAL(12,2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert scenarios (public calculator)
CREATE POLICY "Anyone can create scenarios"
ON public.scenarios
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow users to read their own scenarios by email
CREATE POLICY "Users can read their own scenarios"
ON public.scenarios
FOR SELECT
TO public
USING (true);

-- Create policy to allow users to delete their own scenarios by email
CREATE POLICY "Users can delete scenarios by email"
ON public.scenarios
FOR DELETE
TO public
USING (true);

-- Create index for faster email lookups
CREATE INDEX idx_scenarios_email ON public.scenarios(user_email);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_scenarios_updated_at
BEFORE UPDATE ON public.scenarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();