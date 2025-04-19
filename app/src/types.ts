export interface MSMEApplication {
    average_transactions: number; 
    credit_score: number;         
    documents: string[];          
    has_bank_statement: boolean;  
    has_financial_report: boolean; 
  }
  
  // Define the response from the backend
  export interface LenderResponse {
    chosen_lender: string; 
    credit_limit: number;  
  }