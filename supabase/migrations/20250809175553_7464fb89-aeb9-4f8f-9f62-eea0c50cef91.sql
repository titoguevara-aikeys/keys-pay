-- Fix remaining function search path security issues

-- Fix calculate_spending_insights function
CREATE OR REPLACE FUNCTION public.calculate_spending_insights(user_id_param uuid, period_days integer DEFAULT 30)
 RETURNS TABLE(category text, total_amount numeric, transaction_count integer, avg_transaction numeric, period_start date, period_end date)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    t.category,
    SUM(t.amount) as total_amount,
    COUNT(t.id)::INTEGER as transaction_count,
    AVG(t.amount) as avg_transaction,
    CURRENT_DATE - period_days as period_start,
    CURRENT_DATE as period_end
  FROM transactions t
  JOIN accounts a ON t.account_id = a.id
  WHERE a.user_id = user_id_param
    AND t.created_at >= CURRENT_DATE - period_days
    AND t.transaction_type = 'debit'
    AND t.category IS NOT NULL
  GROUP BY t.category;
END;
$function$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = _role
  );
$function$;

-- Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM profiles WHERE user_id = auth.uid();
$function$;