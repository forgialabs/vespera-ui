import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FrameworkPreview } from './FrameworkPreview';

// Force a known basePath for URL assertions.
beforeEach(() => {
  process.env.NEXT_PUBLIC_BASE_PATH = '/vespera-ui';
});

describe('FrameworkPreview', () => {
  it('renders a tab for each selector framework (React, Angular only)', () => {
    render(<FrameworkPreview component="Primitives/Button" story="Variants" />);
    expect(screen.getByRole('tab', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Angular' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Svelte' })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Vue' })).not.toBeInTheDocument();
  });

  it('enables frameworks that ship the story — Button has React + Angular', () => {
    render(<FrameworkPreview component="Primitives/Button" story="Variants" />);
    expect(screen.getByRole('tab', { name: 'React' })).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Angular' })).toBeEnabled();
  });

  it('disables a framework that lacks the story — Blocks/Orders has no Angular', () => {
    render(<FrameworkPreview component="Blocks" story="Orders" />);
    expect(screen.getByRole('tab', { name: 'React' })).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Angular' })).toBeDisabled();
  });

  it('points the iframe at the React Storybook story by default', () => {
    render(<FrameworkPreview component="Primitives/Button" story="Variants" />);
    const frame = screen.getByTitle('Primitives/Button — react') as HTMLIFrameElement;
    expect(frame.getAttribute('src')).toContain(
      '/vespera-ui/sb/react/iframe.html?id=primitives-button--variants',
    );
  });

  it('renders the Angular iframe when Angular is the selected framework', () => {
    render(
      <FrameworkPreview component="Primitives/Button" story="Variants" defaultFramework="angular" />,
    );
    const frame = screen.getByTitle('Primitives/Button — angular') as HTMLIFrameElement;
    expect(frame.getAttribute('src')).toContain(
      '/vespera-ui/sb/angular/iframe.html?id=primitives-button--variants',
    );
  });

  it('shows a not-available message when the selected framework lacks the story', () => {
    render(<FrameworkPreview component="Blocks" story="Orders" defaultFramework="angular" />);
    expect(screen.getByText(/not yet available in angular/i)).toBeInTheDocument();
    expect(screen.queryByTitle('Blocks — angular')).not.toBeInTheDocument();
  });
});
