import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

/**
 * Error Boundary pour capturer les erreurs React
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              textAlign: 'center',
            }}
          >
            <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Une erreur est survenue
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Désolé, quelque chose s'est mal passé. Essayez de recharger la page.
            </Typography>
            {this.state.error && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'error.lighter',
                  borderRadius: 1,
                  mb: 3,
                  textAlign: 'left',
                }}
              >
                <Typography variant="body2" fontFamily="monospace">
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button variant="contained" onClick={this.handleReset} size="large">
              Recharger la page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
