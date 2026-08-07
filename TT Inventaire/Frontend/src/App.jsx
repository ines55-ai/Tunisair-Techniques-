import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, AppThemeProvider } from './context';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </AppThemeProvider>
  );
}

export default App;
