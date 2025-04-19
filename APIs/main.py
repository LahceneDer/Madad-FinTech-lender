import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  
from pydantic import BaseModel

app = FastAPI()

REACT_APP_URL = os.getenv("REACT_APP_URL", "http://localhost:3545")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class MSMEApplication(BaseModel):
    average_transactions: float  
    credit_score: int           
    documents: list[str]        
    has_bank_statement: bool    
    has_financial_report: bool  

@app.post("/assign-lender/")
async def assign_lender(application: MSMEApplication):
    # Step 1: Get the input data
    avg_transactions = application.average_transactions
    credit_score = application.credit_score
    documents = application.documents
    has_bank_statement = application.has_bank_statement
    has_financial_report = application.has_financial_report

    if "CR" not in documents:
        raise HTTPException(status_code=400, detail="Commercial Registration (CR) is mandatory")

    # Step 3: Calculate multipliers for each lender
    # Lender 1
    credit_multiplier_1 = 1.5 if credit_score > 700 else 1
    doc_count_1 = len(documents)
    doc_multiplier_1 = 1.2 if doc_count_1 == 4 else 1.1 if doc_count_1 == 3 else 1.05 if doc_count_1 == 2 else 1
    bank_multiplier_1 = 1.2 if has_bank_statement else 1
    financial_multiplier_1 = 1.5 if has_financial_report else 1
    credit_limit_1 = avg_transactions * credit_multiplier_1 * doc_multiplier_1 * bank_multiplier_1 * financial_multiplier_1
    print(f"Credit Limit Lender 1: {credit_limit_1}")

    # Lender 2
    credit_multiplier_2 = 1.5 if credit_score > 700 else 0.9
    doc_count_2 = len(documents)
    doc_multiplier_2 = 1.5 if doc_count_2 == 4 else 1.25 if doc_count_2 == 3 else 1
    bank_multiplier_2 = 1.25 if has_bank_statement else 1
    financial_multiplier_2 = 1.25 if has_financial_report else 1
    credit_limit_2 = avg_transactions * credit_multiplier_2 * doc_multiplier_2 * bank_multiplier_2 * financial_multiplier_2
    print(f"Credit Limit Lender 2: {credit_limit_2}")

    # Lender 3
    credit_multiplier_3 = 1.25 if credit_score > 700 else 1
    doc_count_3 = len(documents)
    doc_multiplier_3 = 1.25 if doc_count_3 == 4 else 1.2 if doc_count_3 == 3 else 1
    bank_multiplier_3 = 1.25 if has_bank_statement else 1
    financial_multiplier_3 = 1.5 if has_financial_report else 1
    credit_limit_3 = avg_transactions * credit_multiplier_3 * doc_multiplier_3 * bank_multiplier_3 * financial_multiplier_3
    print(f"Credit Limit Lender 3: {credit_limit_3}")

    # Step 4: Pick the best lender
    if credit_limit_1 > credit_limit_2 and credit_limit_1 > credit_limit_3:
        best_lender = "Lender 1"
        best_limit = credit_limit_1
    elif credit_limit_2 > credit_limit_1 and credit_limit_2 > credit_limit_3:
        best_lender = "Lender 2"
        best_limit = credit_limit_2
    else:
        best_lender = "Lender 3"
        best_limit = credit_limit_3

    # Step 5: Return the result
    return {"chosen_lender": best_lender, "credit_limit": best_limit}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8011)