/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40309

import type { MovementMode, DraggableId } from '@hello-pangea/dnd';

export interface BeforeCapture {
  draggableId: DraggableId;
  mode: MovementMode;
}
