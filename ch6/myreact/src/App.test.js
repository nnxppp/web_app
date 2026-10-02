import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('Todo 1 toggles its button color, changes message text and color, and counts from zero', () => {
  render(<App />);

  const colorButton = screen.getByRole('button', { name: 'Go Blue' });
  expect(screen.getAllByRole('button')).toHaveLength(5);
  expect(colorButton).toHaveStyle({ backgroundColor: 'red' });
  expect(colorButton).toHaveStyle({ color: 'black' });
  fireEvent.click(colorButton);
  expect(colorButton).toHaveStyle({ backgroundColor: 'blue' });
  expect(screen.getByRole('button', { name: 'Go Red' })).toHaveStyle({
    color: 'white',
  });
  fireEvent.click(colorButton);
  expect(screen.getByRole('button', { name: 'Go Blue' })).toHaveStyle({
    backgroundColor: 'red',
    color: 'black',
  });

  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: 'Fresh message' },
  });
  expect(screen.getByText('Fresh message')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Message color'), {
    target: { value: '#008000' },
  });
  expect(screen.getByText('Fresh message')).toHaveStyle({ color: '#008000' });

  expect(screen.getByText('0')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Count Up' }));
  expect(screen.getByText('1')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Count Down' }));
  expect(screen.getByText('0')).toBeInTheDocument();
});

test('Todo 2 shows menu in user mode and supports admin menu management', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Todo 2' }));

  expect(screen.getByText('cake - 35 baht')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Del' })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'New Food' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Switch to admin mode' }));
  expect(screen.getAllByRole('button', { name: 'Del' })).toHaveLength(5);
  expect(screen.getByRole('heading', { name: 'New Food' })).toBeInTheDocument();
  expect(window.localStorage.getItem('menu-management-mode')).toBe('admin');

  fireEvent.change(screen.getByLabelText('name:'), {
    target: { value: '   ' },
  });
  fireEvent.change(screen.getByLabelText('price:'), {
    target: { value: '40' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Add menu' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a food name');
  expect(screen.queryByText(' - 40 baht')).not.toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('name:'), {
    target: { value: 'muffin' },
  });
  fireEvent.change(screen.getByLabelText('Best Seller:'), {
    target: { value: 'false' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Add menu' }));
  expect(screen.getByText('muffin - 40 baht')).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole('button', { name: 'Del' })[0]);
  expect(screen.queryByText('cake - 35 baht')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Switch to user mode' }));
  expect(screen.queryByRole('button', { name: 'Del' })).not.toBeInTheDocument();
  expect(window.localStorage.getItem('menu-management-mode')).toBe('user');
});
