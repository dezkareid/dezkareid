import Script from 'next/script';
import type { Thing, WithContext } from 'schema-dts';

export interface DataSchemaProperties {
  /**
   * The structured data object (JSON-LD).
   */
  schema: WithContext<Thing> | WithContext<Thing>[];
}

/**
 * Renders a JSON-LD structured data script tag using next/script.
 */
export const DataSchema = ({ schema }: DataSchemaProperties) => {
  if (!schema) return;

  return (
    <Script
      id="data-schema"
      type="application/ld+json"
      data-testid="data-schema"
      strategy="afterInteractive"
      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};
