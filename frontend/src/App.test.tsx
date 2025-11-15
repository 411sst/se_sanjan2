import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import App from './App';
import { store } from './store';
import theme from './theme';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {component}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

test('renders without crashing', () => {
  renderWithProviders(<App />);
  expect(screen.getAllByText(/Couponify/i).length).toBeGreaterThan(0);
});
