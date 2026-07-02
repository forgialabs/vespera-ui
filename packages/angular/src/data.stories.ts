import type { Meta, StoryObj } from '@storybook/angular';
import { VspStat, VspTimeline, VspDescriptionList, VspCircularProgress } from './data.component';
import { VspAvatar, VspAvatarGroup } from './media.component';

// Title + story names mirror packages/react/src/DataDisplay.stories.tsx.
const meta: Meta = { title: 'Data display' };
export default meta;

export const Stats: StoryObj = {
  name: 'Stats',
  render: () => ({
    moduleMetadata: { imports: [VspStat] },
    template: `
      <vsp-stat label="MRR" value="$48.2k" delta="+12%" />
      <vsp-stat label="Active users" value="8,241" delta="+4.1%" />
      <vsp-stat label="Churn" value="1.8%" delta="-0.3%" deltaDir="down" />`,
  }),
};

export const Timelines: StoryObj = {
  name: 'Timelines',
  render: () => ({
    moduleMetadata: { imports: [VspTimeline] },
    props: {
      items: [
        { title: 'Deployed v2.1', time: '2h ago', body: 'Rolled out to all regions.', tone: 'pos' },
        { title: 'Merged #482', time: '5h ago', body: 'Framework selector.', active: true },
        { title: 'Opened incident', time: '1d ago', body: 'Elevated latency.', tone: 'warn' },
      ],
    },
    template: `<div style="width:100%;max-width:520px"><vsp-timeline [items]="items" /></div>`,
  }),
};

export const Descriptions: StoryObj = {
  name: 'Descriptions',
  render: () => ({
    moduleMetadata: { imports: [VspDescriptionList] },
    props: {
      items: [
        ['Plan', 'Pro'],
        ['Seats', '12 of 20'],
        ['Renews', 'Jul 1, 2026'],
      ],
    },
    template: `<div style="width:100%;max-width:420px"><vsp-description-list [items]="items" /></div>`,
  }),
};

export const Circular: StoryObj = {
  name: 'Circular',
  render: () => ({
    moduleMetadata: { imports: [VspCircularProgress] },
    template: `<vsp-circular-progress [value]="72" label="Storage" />`,
  }),
};

export const Avatars: StoryObj = {
  name: 'Avatars',
  render: () => ({
    moduleMetadata: { imports: [VspAvatar, VspAvatarGroup] },
    props: {
      people: [
        { name: 'Ada Lovelace', hue: 210 },
        { name: 'Alan Turing', hue: 140 },
        { name: 'Grace Hopper', hue: 20 },
        { name: 'Katherine Johnson', hue: 300 },
      ],
    },
    template: `
      <vsp-avatar name="Ada Lovelace" [hue]="210" status="online" />
      <vsp-avatar name="Alan Turing" [hue]="140" shape="square" />
      <vsp-avatar-group [people]="people" [max]="3" />`,
  }),
};
