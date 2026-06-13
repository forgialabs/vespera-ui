import manifest from '@manifest/react.json';

interface Prop {
  name: string;
  type?: string;
  values?: string[];
  required?: boolean;
  defaultValue?: string;
  description?: string;
}
interface Component {
  name: string;
  category: string;
  description?: string;
  props: Prop[];
}

const components = manifest.components as Component[];

/** Prop tables for one category's components (each H2 → its own anchor). */
export function ReactApi({ category }: { category?: string }) {
  const items = category ? components.filter((c) => c.category === category) : components;
  return (
    <>
      <p>
        <strong>
          {items.length} {items.length === 1 ? 'component' : 'components'}
        </strong>{' '}
        in <code>{manifest.package}</code>. Generated from the TypeScript source — props marked{' '}
        <code>*</code> are required.
      </p>
      {items.map((c) => (
        <section key={c.name}>
          <h2 id={c.name}>{c.name}</h2>
          {c.description ? <p>{c.description}</p> : null}
          {c.props.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                {c.props.map((p) => (
                  <tr key={p.name}>
                    <td>
                      <code>
                        {p.name}
                        {p.required ? ' *' : ''}
                      </code>
                    </td>
                    <td>
                      <code>{p.values && p.values.length ? p.values.join(' | ') : (p.type ?? '—')}</code>
                    </td>
                    <td>{p.defaultValue ? <code>{p.defaultValue}</code> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              <em>No public props.</em>
            </p>
          )}
        </section>
      ))}
    </>
  );
}
