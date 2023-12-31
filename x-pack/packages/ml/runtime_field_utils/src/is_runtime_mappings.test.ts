/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isRuntimeMappings } from './is_runtime_mappings';

describe('isRuntimeMappings()', () => {
  it('does not allow numbers', () => {
    expect(isRuntimeMappings(1)).toBe(false);
  });
  it('does not allow null', () => {
    expect(isRuntimeMappings(null)).toBe(false);
  });
  it('does not allow arrays', () => {
    expect(isRuntimeMappings([])).toBe(false);
  });
  it('does not allow empty objects', () => {
    expect(isRuntimeMappings({})).toBe(false);
  });
  it('does not allow objects with non-object inner structure', () => {
    expect(isRuntimeMappings({ someAttribute: 'someValue' })).toBe(false);
  });
  it('does not allow objects with objects with unsupported inner structure', () => {
    expect(isRuntimeMappings({ fieldName1: { type: 'keyword' }, fieldName2: 'someValue' })).toBe(
      false
    );
    expect(
      isRuntimeMappings({
        fieldName1: { type: 'keyword' },
        fieldName2: { type: 'keyword', someAttribute: 'some value' },
      })
    ).toBe(false);
    expect(
      isRuntimeMappings({
        fieldName: { type: 'long', script: 1234 },
      })
    ).toBe(false);
    expect(
      isRuntimeMappings({
        fieldName: { type: 'long', script: { someAttribute: 'some value' } },
      })
    ).toBe(false);
    expect(
      isRuntimeMappings({
        fieldName: { type: 'long', script: { source: 1234 } },
      })
    ).toBe(false);
  });

  it('allows object with most basic runtime field', () => {
    expect(isRuntimeMappings({ fieldName: { type: 'keyword' } })).toBe(true);
  });
  it('allows object with multiple most basic runtime fields', () => {
    expect(
      isRuntimeMappings({ fieldName1: { type: 'keyword' }, fieldName2: { type: 'keyword' } })
    ).toBe(true);
  });
  it('allows object with runtime fields including scripts', () => {
    expect(
      isRuntimeMappings({
        fieldName1: { type: 'keyword' },
        fieldName2: { type: 'keyword', script: 'some script as script' },
        fieldName3: {
          type: 'keyword',
          script: {
            source: 'source script',
          },
        },
        fieldName4: {
          type: 'keyword',
          script: {
            source: 'source script',
            params: {},
          },
        },
      })
    ).toBe(true);
    expect(
      isRuntimeMappings({
        fieldName: { type: 'long', script: { source: 'some script as source' } },
      })
    ).toBe(true);
    expect(
      isRuntimeMappings({
        fieldName: {
          type: 'long',
          script: {
            source: 'source script',
            params: {},
            lang: 'lang',
          },
        },
      })
    ).toBe(true);
    expect(
      isRuntimeMappings({
        fieldName: {
          type: 'long',
          script: {
            id: 'a script id',
          },
        },
      })
    ).toBe(true);
  });
});
