import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { MSMEApplication, LenderResponse } from './types';
import { BeatLoader } from 'react-spinners';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Box,
  CircularProgress,
  Fade,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './App.css';

const App: React.FC = () => {
  const apiBase = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState<MSMEApplication>({
    average_transactions: 0,
    credit_score: 0,
    documents: [],
    has_bank_statement: false,
    has_financial_report: false,
  });

  const [result, setResult] = useState<LenderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    if (!formData.documents.includes('CR')) {
      setError('Commercial Registration (CR) is mandatory.');
      setLoading(false);
      return;
    }

    if (formData.credit_score < 0 || formData.credit_score > 800) {
      setError('Credit Score must be between 0 and 800.');
      setLoading(false);
      return;
    }
    if (formData.average_transactions <= 0) {
      setError('Average Monthly Transactions must be greater than 0.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post<LenderResponse>(`http://localhost:8055/assign-lender/`, formData);      
      setResult(response.data);
    } catch (err) {
      const error: any = err as AxiosError;
      setError(error.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Madad FinTech - Lender Assignment
      </Typography>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Average Monthly Transactions (QAR)"
                type="number"
                name="average_transactions"
                value={formData.average_transactions}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{ inputProps: { min: 1 } }}
              />
              <TextField
                label="Credit Score (0-800)"
                type="number"
                name="credit_score"
                value={formData.credit_score}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{ inputProps: { min: 0, max: 800 } }}
              />
              <Typography variant="subtitle1">Documents Provided:</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="documents"
                    value="CR"
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Commercial Registration (CR, Mandatory)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="documents"
                    value="Trade License"
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Trade License"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="documents"
                    value="Establishment Certificate"
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Establishment Certificate"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="documents"
                    value="Tax Card"
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Tax Card"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="has_bank_statement"
                    checked={formData.has_bank_statement}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Bank Statement Provided"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="has_financial_report"
                    checked={formData.has_financial_report}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Audited Financial Report Provided"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
              >
                {loading ? 'Assigning...' : 'Assign Lender'}
              </Button>
            </Box>
          </form>

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {result && (
            <Fade in={!!result}>
              <Box sx={{ mt: 3 }}>
                <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CheckCircleIcon />
                      <Typography variant="h6">Success!</Typography>
                    </Box>
                    <Typography variant="body1">
                      <strong>Chosen Lender:</strong> {result.chosen_lender}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Credit Limit:</strong> QAR {result.credit_limit.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default App;