import { JsonSchemaViewer } from '@stoplight/json-schema-viewer';
import type { JSONSchema7 } from 'json-schema';
import * as React from 'react';

export type JsonSchemaViewerElementProps = {
  schema?: JSONSchema7;
  defaultExpandedDepth?: number;
  maxRefDepth?: number;
  disableCrumbs?: boolean;
  renderRootTreeLines?: boolean;
  hideExamples?: boolean;
};

export const JsonSchemaViewerElementContent = ({ schema, ...props }: JsonSchemaViewerElementProps) => {
  if (!schema) {
    return null;
  }

  return <JsonSchemaViewer schema={schema} {...props} />;
};
