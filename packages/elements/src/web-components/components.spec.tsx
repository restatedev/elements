import '@testing-library/jest-dom';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiElement, JsonSchemaViewerElement } from './components';

const TEST_ELEMENT_NAME = 'elements-api-test';

const apiDescriptionDocument = JSON.stringify({
  swagger: '2.0',
  info: {
    title: 'To-dos',
    version: '1.0',
  },
  host: 'todos.stoplight.io',
  schemes: ['https'],
  tags: [
    {
      name: 'Todos',
    },
  ],
  paths: {
    '/todos': {
      get: {
        operationId: 'GET_todos',
        summary: 'List Todos',
        tags: ['Todos'],
        responses: {
          '200': {
            description: 'OK',
          },
        },
      },
    },
  },
});

describe('ApiElement', () => {
  beforeAll(() => {
    Element.prototype.scrollTo = () => {};

    if (!customElements.get(TEST_ELEMENT_NAME)) {
      customElements.define(TEST_ELEMENT_NAME, ApiElement);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('adds the stoplight host class for scoped stylesheet matching', () => {
    const element = document.createElement(TEST_ELEMENT_NAME) as HTMLElement & {
      apiDescriptionDocument: string;
    };

    element.apiDescriptionDocument = apiDescriptionDocument;

    document.body.appendChild(element);

    expect(element).toHaveClass('stoplight');
  });

  it('uses tryItFetcher when provided as a web-component property', async () => {
    const tryItFetcher = jest.fn().mockResolvedValue(
      new Response('{}', {
        status: 200,
        statusText: 'OK',
        headers: [],
      }),
    );

    const element = document.createElement(TEST_ELEMENT_NAME) as HTMLElement & {
      apiDescriptionDocument: string;
      layout: string;
      router: string;
      tryItFetcher: typeof fetch;
    };

    element.apiDescriptionDocument = apiDescriptionDocument;
    element.layout = 'stacked';
    element.router = 'memory';
    element.tryItFetcher = tryItFetcher;

    document.body.appendChild(element);

    const todosGroup = await screen.findByText('Todos');
    userEvent.click(todosGroup);

    const todosPath = await screen.findByText('/todos');
    userEvent.click(todosPath);

    const tryItTab = await screen.findByRole('tab', { name: 'TryIt' });
    userEvent.click(tryItTab);

    const sendButton = await screen.findByRole('button', { name: /send api request/i });
    userEvent.click(sendButton);

    await waitFor(() => expect(tryItFetcher).toHaveBeenCalled());
    expect(tryItFetcher.mock.calls[0][0]).toBe('https://todos.stoplight.io/todos');
  });
});

describe('JsonSchemaViewerElement', () => {
  const SCHEMA_ELEMENT_NAME = 'elements-json-schema-viewer-test';

  beforeAll(() => {
    if (!customElements.get(SCHEMA_ELEMENT_NAME)) {
      customElements.define(SCHEMA_ELEMENT_NAME, JsonSchemaViewerElement);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a schema passed as a property', async () => {
    const element = document.createElement(SCHEMA_ELEMENT_NAME) as HTMLElement & {
      schema: object;
      renderRootTreeLines: boolean;
    };

    element.schema = {
      type: 'object',
      required: ['amount'],
      properties: {
        amount: { type: 'integer', description: 'How much to add' },
        mode: { type: 'string', enum: ['add', 'reset'] },
      },
    };
    element.renderRootTreeLines = true;

    document.body.appendChild(element);

    expect(await screen.findByText('amount')).toBeInTheDocument();
    expect(screen.getByText('How much to add')).toBeInTheDocument();
    expect(screen.getByText('required')).toBeInTheDocument();
    expect(element).toHaveClass('stoplight');
  });

  it('renders a schema passed as a JSON attribute', async () => {
    const element = document.createElement(SCHEMA_ELEMENT_NAME);
    element.setAttribute('schema', JSON.stringify({ type: 'object', properties: { source: { type: 'string' } } }));

    document.body.appendChild(element);

    expect(await screen.findByText('source')).toBeInTheDocument();
  });

  it('renders nothing without a schema', () => {
    const element = document.createElement(SCHEMA_ELEMENT_NAME);

    document.body.appendChild(element);

    expect(element.textContent).toBe('');
  });
});
