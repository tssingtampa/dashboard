/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { mockHttpValues } from '../../../__mocks__/kea_logic';

import { nextTick } from '@kbn/test-jest-helpers';

import { fetchIndices } from './fetch_indices_api_logic';

describe('FetchIndicesApiLogic', () => {
  const { http } = mockHttpValues;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('fetchIndicesApiLogic', () => {
    it('calls correct api', async () => {
      const promise = Promise.resolve({ result: 'result' });
      http.get.mockReturnValue(promise);
      const result = fetchIndices({
        from: 0,
        onlyShowSearchOptimizedIndices: false,
        returnHiddenIndices: false,
        size: 20,
      });
      await nextTick();
      expect(http.get).toHaveBeenCalledWith('/internal/enterprise_search/indices', {
        query: {
          from: 0,
          only_show_search_optimized_indices: false,
          return_hidden_indices: false,
          search_query: null,
          size: 20,
        },
      });
      await expect(result).resolves.toEqual({
        isInitialRequest: true,
        onlyShowSearchOptimizedIndices: false,
        result: 'result',
        returnHiddenIndices: false,
        searchQuery: undefined,
      });
    });
    it('sets initialRequest to false if page is not the first page', async () => {
      const promise = Promise.resolve({ result: 'result' });
      http.get.mockReturnValue(promise);
      const result = fetchIndices({
        from: 1,
        onlyShowSearchOptimizedIndices: false,
        returnHiddenIndices: false,
        size: 20,
      });
      await nextTick();
      expect(http.get).toHaveBeenCalledWith('/internal/enterprise_search/indices', {
        query: {
          from: 1,
          only_show_search_optimized_indices: false,
          return_hidden_indices: false,
          search_query: null,
          size: 20,
        },
      });
      await expect(result).resolves.toEqual({
        isInitialRequest: false,
        onlyShowSearchOptimizedIndices: false,
        result: 'result',
        returnHiddenIndices: false,
        searchQuery: undefined,
      });
    });
    it('sets initialRequest to false if searchQuery is not empty', async () => {
      const promise = Promise.resolve({ result: 'result' });
      http.get.mockReturnValue(promise);
      const result = fetchIndices({
        from: 0,
        onlyShowSearchOptimizedIndices: false,
        returnHiddenIndices: false,
        searchQuery: 'a',
        size: 20,
      });
      await nextTick();
      expect(http.get).toHaveBeenCalledWith('/internal/enterprise_search/indices', {
        query: {
          from: 0,
          only_show_search_optimized_indices: false,
          return_hidden_indices: false,
          search_query: 'a',
          size: 20,
        },
      });
      await expect(result).resolves.toEqual({
        isInitialRequest: false,
        onlyShowSearchOptimizedIndices: false,
        result: 'result',
        returnHiddenIndices: false,
        searchQuery: 'a',
      });
    });
  });
});
