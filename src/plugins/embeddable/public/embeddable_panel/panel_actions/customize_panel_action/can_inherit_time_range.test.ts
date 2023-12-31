/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { canInheritTimeRange } from './can_inherit_time_range';
import {
  HelloWorldContainer,
  TimeRangeContainer,
  TimeRangeEmbeddable,
} from '../../../lib/test_samples';
import { HelloWorldEmbeddable } from '../../../tests/fixtures';

test('canInheritTimeRange returns false if embeddable is inside container without a time range', () => {
  const embeddable = new TimeRangeEmbeddable(
    { id: '1234', timeRange: { from: 'noxw-15m', to: 'now' } },
    new HelloWorldContainer({ id: '123', panels: {} }, {})
  );

  expect(canInheritTimeRange(embeddable)).toBe(false);
});

test('canInheritTimeRange returns false if embeddable is without a time range', () => {
  const embeddable = new HelloWorldEmbeddable(
    { id: '1234' },
    new HelloWorldContainer({ id: '123', panels: {} }, {})
  );
  // @ts-ignore
  expect(canInheritTimeRange(embeddable)).toBe(false);
});

test('canInheritTimeRange returns true if embeddable is inside a container with a time range', () => {
  const embeddable = new TimeRangeEmbeddable(
    { id: '1234', timeRange: { from: 'noxw-15m', to: 'now' } },
    new TimeRangeContainer(
      { id: '123', panels: {}, timeRange: { from: 'noxw-15m', to: 'now' } },
      () => undefined
    )
  );
  expect(canInheritTimeRange(embeddable)).toBe(true);
});
