import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FrameworkShowcase } from './FrameworkShowcase';

beforeEach(() => {
  process.env.NEXT_PUBLIC_BASE_PATH = '/vespera-ui';
});

describe('FrameworkShowcase', () => {
  it('renders the React children by default', () => {
    render(
      <FrameworkShowcase story="showcase--playground">
        <div data-testid="island">react island</div>
      </FrameworkShowcase>,
    );
    expect(screen.getByTestId('island')).toBeInTheDocument();
    expect(screen.queryByTitle('showcase--playground — angular')).not.toBeInTheDocument();
  });

  it('swaps to the Angular showcase iframe when Angular is selected', () => {
    render(
      <FrameworkShowcase story="showcase--playground">
        <div data-testid="island">react island</div>
      </FrameworkShowcase>,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Angular' }));
    const frame = screen.getByTitle('showcase--playground — angular') as HTMLIFrameElement;
    expect(frame.getAttribute('src')).toContain(
      '/vespera-ui/sb/angular/iframe.html?id=showcase--playground',
    );
    expect(screen.queryByTestId('island')).not.toBeInTheDocument();
  });
});
