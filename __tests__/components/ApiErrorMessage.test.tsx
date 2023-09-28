import {fireEvent, render, screen} from '@testing-library/react-native';
import ApiErrorMessage from '../../src/components/ApiErrorMessage';

describe('ApiErrorMessage', () => {
  it('should renders default error message', () => {
    render(<ApiErrorMessage />);
    expect(screen.getByText('Error')).toBeOnTheScreen();
    expect(screen.getByText('Unknown Error')).toBeOnTheScreen();
  });

  it('should renders passed title & message', () => {
    const title = 'Error Title';
    const description = 'Error Description';
    render(<ApiErrorMessage title={title} message={description} />);
    expect(screen.getByText(title)).toBeOnTheScreen();
    expect(screen.getByText(description)).toBeOnTheScreen();
  });

  it('should render retry button', () => {
    render(<ApiErrorMessage />);
    expect(screen.getByText('Retry')).toBeOnTheScreen();
  });

  it('should invoke onRetry() on button tap', () => {
    const retryMock = jest.fn();
    render(<ApiErrorMessage onRetry={retryMock} />);
    fireEvent.press(screen.getByText('Retry'));
    expect(retryMock).toBeCalled();
  });
});
