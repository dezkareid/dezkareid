import Script from 'next/script';
import type { Thing, WithContext } from 'schema-dts';

export interface DataSchemaProperties {
  /**
   * The structured data object (JSON-LD).
   */
  schema: WithContext<Thing> | WithContext<Thing>[];
  /**
   * Unique id for the script tag. Required when rendering multiple DataSchema
   * instances on the same page so Next.js Script can deduplicate correctly.
   * Defaults to "data-schema" for backwards compatibility.
   */
  id?: string;
}

/**
 * Renders a JSON-LD structured data script tag using next/script.
 */
export const DataSchema = ({ schema, id = 'data-schema' }: DataSchemaProperties) => {
  if (!schema) return;

  return (
    <Script
      id={id}
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
