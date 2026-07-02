import type { Meta, StoryObj } from '@storybook/angular';
import { VspSparkline, VspDonut, VspStatCard } from './charts.component';
import { VspAreaChart, VspBarChart } from './area-bar.component';

// Title + story names mirror packages/react/src/Charts.stories.tsx.
const meta: Meta = { title: 'Charts' };
export default meta;

export const Sparklines: StoryObj = {
  name: 'Sparklines',
  render: () => ({
    moduleMetadata: { imports: [VspSparkline] },
    props: { a: [4, 8, 5, 10, 7, 12, 9, 14], b: [12, 9, 11, 7, 8, 6, 5, 4] },
    template: `<vsp-sparkline [data]="a" /> <vsp-sparkline [data]="b" color="var(--accent-2)" />`,
  }),
};

export const Area: StoryObj = {
  name: 'Area',
  render: () => ({
    moduleMetadata: { imports: [VspAreaChart] },
    props: { series: [[12, 28, 20, 34, 30, 42, 38, 48]] },
    template: `<div style="width:100%;max-width:760px"><vsp-area-chart [series]="series" /></div>`,
  }),
};

export const Bars: StoryObj = {
  name: 'Bars',
  render: () => ({
    moduleMetadata: { imports: [VspBarChart] },
    props: {
      data: [12, 19, 7, 15, 22, 9],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    template: `<div style="width:100%;max-width:620px"><vsp-bar-chart [data]="data" [labels]="labels" /></div>`,
  }),
};

export const DonutChart: StoryObj = {
  name: 'Donut Chart',
  render: () => ({
    moduleMetadata: { imports: [VspDonut] },
    props: {
      data: [
        { label: 'Direct', value: 52, color: 'var(--accent)' },
        { label: 'Referral', value: 30, color: 'var(--accent-2)' },
        { label: 'Organic', value: 18, color: '#10b981' },
      ],
    },
    template: `<vsp-donut [data]="data" centerLabel="Traffic" />`,
  }),
};

export const Stat: StoryObj = {
  name: 'Stat',
  render: () => ({
    moduleMetadata: { imports: [VspStatCard] },
    props: { spark: [3, 5, 4, 7, 6, 9, 8, 11] },
    template: `<vsp-stat-card label="Revenue" value="$48.2k" delta="+12%" [spark]="spark" />`,
  }),
};
