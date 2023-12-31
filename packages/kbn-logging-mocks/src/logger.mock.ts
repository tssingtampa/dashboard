/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { Logger } from '@kbn/logging';

export type MockedLogger = jest.Mocked<Logger> & { context: string[] };

const createLoggerMock = (context: string[] = []) => {
  const mockLog: MockedLogger = {
    context,
    debug: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
    get: jest.fn(),
    isLevelEnabled: jest.fn(),
  };
  mockLog.get.mockImplementation((...ctx) => ({
    ...mockLog,
    context: Array.isArray(context) ? context.concat(ctx) : [context, ...ctx].filter(Boolean),
  }));

  mockLog.isLevelEnabled.mockReturnValue(true);

  return mockLog;
};

const clearLoggerMock = (logger: MockedLogger) => {
  logger.debug.mockClear();
  logger.info.mockClear();
  logger.warn.mockClear();
  logger.error.mockClear();
  logger.trace.mockClear();
  logger.fatal.mockClear();
  logger.log.mockClear();
};

const collectLoggerMock = (logger: MockedLogger) => {
  return {
    debug: logger.debug.mock.calls,
    error: logger.error.mock.calls,
    fatal: logger.fatal.mock.calls,
    info: logger.info.mock.calls,
    log: logger.log.mock.calls,
    trace: logger.trace.mock.calls,
    warn: logger.warn.mock.calls,
  };
};

export const loggerMock = {
  create: createLoggerMock,
  clear: clearLoggerMock,
  collect: collectLoggerMock,
};
