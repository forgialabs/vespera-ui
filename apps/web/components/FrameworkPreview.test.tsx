import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FrameworkPreview } from './FrameworkPreview';

// Force a known basePath for URL assertions.
beforeEach(() => {
  process.env.NEXT_PUBLIC_BASE_PATH = '/vespera-ui';
});

describe('FrameworkPreview', () => {
  it('renders a tab per framework', () => {
    render(<FrameworkPreview component="Primitives/Button" story="Variants" />);
    for (const label of ['React', 'Angular', 'Svelte', 'Vue']) {
      expect(screen.getByRole('tab', { name: label })).toBeInTheDocument();
    }
  });

  it('disables frameworks with no story and enables ones that have it', () => {
    render(<FrameworkPreview component="Primitives/Button" story="Variants" />);
    expect(screen.getByRole('tab', { name: 'React' })).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Vue' })).toBeDisabled();
  });

  it('points the iframe at the React Storybook story by default', () => {
    render(<FrameworkPreview component="Primitives/Button" story="Variants" />);
    const frame = screen.getByTitle('Primitives/Button — react') as HTMLIFrameElement;
    expect(frame.getAttribute('src')).toContain(
      '/vespera-ui/sb/react/iframe.html?id=primitives-button--variants',
    );
  });

  it('shows a not-available message when the selected framework lacks the story', () => {
    render(
      <FrameworkPreview component="Primitives/Button" story="Variants" defaultFramework="angular" />,
    );
    expect(screen.getByText(/not yet available in angular/i)).toBeInTheDocument();
    expect(screen.queryByTitle('Primitives/Button — angular')).not.toBeInTheDocument();
  });
});
