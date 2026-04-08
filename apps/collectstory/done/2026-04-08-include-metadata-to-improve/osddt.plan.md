# Plan: SEO and Metadata Improvements

## Architecture Overview
The implementation will leverage Next.js Metadata API for static tags (Open Graph) and a custom React component for structured data (JSON-LD). 

- **Structured Data**: We will use the `schema-dts` library to ensure type safety for all JSON-LD objects. A reusable `DataSchema` component will handle the injection of the `<script type="application/ld+json">` tag using `next/script` and `dangerouslySetInnerHTML`.
- **Dynamic Metadata**: The `generateMetadata` function in Next.js will be used to dynamically set `og:image` based on the collection's content.

## Implementation Phases

### Phase 1: Foundation & Setup
- **Step 1**: Install `schema-dts` as a dev dependency.
- **Step 2**: Create a `DataSchema` component that accepts a `schema` prop and renders it using `next/script`.
  ```tsx
  export const DataSchema = ({ schema = DEFAULT_SCHEMA }: DataSchemaProps) => (
    <Script
      async
      type="application/ld+json"
      data-testid="data-schema"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
  ```

### Phase 2: Collection Page Improvements
- **Step 1**: Update `generateMetadata` in `/[username]/[collectionSlug]/page.tsx` to resolve the `og:image`. 
  - Logic: First item image -> Default brand image.
- **Step 2**: Implement `CollectionPage` schema generation logic in the page component.
- **Step 3**: Integrate the `DataSchema` component to inject the generated schema.

### Phase 3: Item Page Improvements
- **Step 1**: Implement `Product` schema generation logic in `/[username]/[collectionSlug]/[slug]/page.tsx`.
- **Step 2**: Integrate the `DataSchema` component to inject the generated schema.

### Phase 4: Validation
- **Step 1**: Verify Open Graph tags using local testing tools or metadata previews.
- **Step 2**: Validate JSON-LD output using the Schema Markup Validator or Rich Results Test (simulated).

## Technical Dependencies
- `schema-dts`: For structured data type definitions.
- Next.js `Metadata` API: For managing `<head>` tags.
- `next/script`: For injecting JSON-LD script tags.

## Risks & Mitigations
- **Risk**: Large JSON-LD payloads increasing page size.
  - **Mitigation**: Only include essential fields and truncate long descriptions if necessary.
- **Risk**: Invalid schema syntax.
  - **Mitigation**: Use `schema-dts` types to catch errors at compile time and validate output during testing.

## Out of Scope
- Automated SEO performance monitoring.
- Implementation of metadata for non-collection/item pages.
