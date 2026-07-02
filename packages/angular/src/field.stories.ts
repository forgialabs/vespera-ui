import type { Meta, StoryObj } from '@storybook/angular';
import { VspNumberStepper, VspCopyButton, VspInlineEdit } from './extras.component';
import { VspOTPInput } from './otp.component';

// Matches the React "More form controls" section (Forms/Field / Controls).
const meta: Meta = { title: 'Forms/Field' };
export default meta;

export const Controls: StoryObj = {
  name: 'Controls',
  render: () => ({
    moduleMetadata: { imports: [VspNumberStepper, VspCopyButton, VspInlineEdit, VspOTPInput] },
    template: `
      <div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">
        <vsp-number-stepper [value]="3" [min]="0" [max]="10" />
        <vsp-inline-edit value="Acme Inc." />
        <vsp-copy-button text="npm i @vespera-ui/angular" label="Copy install" />
        <vsp-otp-input [length]="6" />
      </div>`,
  }),
};
