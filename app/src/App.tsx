import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { MSMEApplication, LenderResponse } from './types';
import './App.css';

const App: React.FC = () => {
  const [formData, setFormData] = useState<MSMEApplication>({
    average_transactions: 0,
    credit_score: 0,
    documents: [],
    has_bank_statement: false,
    has_financial_report: false,
  });

  const [result, setResult] = useState<LenderResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'documents') {
      let updatedDocs = [...formData.documents];
      if (checked) {
        updatedDocs.push(value);
      } else {
        updatedDocs = updatedDocs.filter(doc => doc !== value);
      }
      setFormData({ ...formData, documents: updatedDocs });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); 

    if (!formData.documents.includes('CR')) {
      setError('Commercial Registration (CR) is mandatory.');
      return;
    }

    try {
      const response = await axios.post<LenderResponse>('http://localhost:3545/assign-lender/', formData);
      setResult(response.data);
    } catch (err) {
      const error: any = err as AxiosError;
      setError(error.response?.data?.detail || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Madad FinTech - Lender Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Average Monthly Transactions (QAR):</label>
          <input
            type="number"
            name="average_transactions"
            value={formData.average_transactions}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Credit Score (0-800):</label>
          <input
            type="number"
            name="credit_score"
            value={formData.credit_score}
            onChange={handleChange}
            min="0"
            max="800"
            required
          />
        </div>
        <div>
          <label>Documents Provided:</label><br />
          <input
            type="checkbox"
            name="documents"
            value="CR"
            onChange={handleChange}
          /> Commercial Registration (CR, Mandatory)<br />
          <input
            type="checkbox"
            name="documents"
            value="Trade License"
            onChange={handleChange}
          /> Trade License<br />
          <input
            type="checkbox"
            name="documents"
            value="Establishment Certificate"
            onChange={handleChange}
          /> Establishment Certificate<br />
          <input
            type="checkbox"
            name="documents"
            value="Tax Card"
            onChange={handleChange}
          /> Tax Card<br />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="has_bank_statement"
              checked={formData.has_bank_statement}
              onChange={handleChange}
            /> Bank Statement Provided
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="has_financial_report"
              checked={formData.has_financial_report}
              onChange={handleChange}
            /> Audited Financial Report Provided
          </label>
        </div>
        <button type="submit">Assign Lender</button>
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div>
          <h2>Result</h2>
          <p>Chosen Lender: {result.chosen_lender}</p>
          <p>Credit Limit: QAR {result.credit_limit}</p>
        </div>
      )}
    </div>
  );
};

export default App;