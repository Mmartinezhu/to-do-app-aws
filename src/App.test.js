import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login form when user is not authenticated', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /to-do app/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
});
