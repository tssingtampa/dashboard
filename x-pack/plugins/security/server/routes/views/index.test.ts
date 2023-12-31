/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { defineViewRoutes } from '.';
import { routeDefinitionParamsMock } from '../index.mock';

describe('View routes', () => {
  it('does not register Login routes if both `basic` and `token` providers are disabled', () => {
    const routeParamsMock = routeDefinitionParamsMock.create({
      authc: { providers: { pki: { pki1: { order: 0 } } } },
      accessAgreement: { message: 'some-message' },
    });

    defineViewRoutes(routeParamsMock);

    expect(routeParamsMock.httpResources.register.mock.calls.map(([{ path }]) => path))
      .toMatchInlineSnapshot(`
      Array [
        "/security/account",
        "/internal/security/capture-url",
        "/security/logged_out",
        "/logout",
        "/security/overwritten_session",
        "/security/access_agreement",
      ]
    `);
    expect(routeParamsMock.router.get.mock.calls.map(([{ path }]) => path)).toMatchInlineSnapshot(`
      Array [
        "/internal/security/access_agreement/state",
      ]
    `);
  });

  it('registers Login routes if `basic` provider is enabled', () => {
    const routeParamsMock = routeDefinitionParamsMock.create({
      authc: { providers: { basic: { basic1: { order: 0 } } } },
      accessAgreement: { message: 'some-message' },
    });

    defineViewRoutes(routeParamsMock);

    expect(routeParamsMock.httpResources.register.mock.calls.map(([{ path }]) => path))
      .toMatchInlineSnapshot(`
      Array [
        "/security/account",
        "/internal/security/capture-url",
        "/security/logged_out",
        "/logout",
        "/security/overwritten_session",
        "/security/access_agreement",
        "/login",
      ]
    `);
    expect(routeParamsMock.router.get.mock.calls.map(([{ path }]) => path)).toMatchInlineSnapshot(`
      Array [
        "/internal/security/access_agreement/state",
        "/internal/security/login_state",
      ]
    `);
  });

  it('registers Login routes if `token` provider is enabled', () => {
    const routeParamsMock = routeDefinitionParamsMock.create({
      authc: { providers: { token: { token1: { order: 0 } } } },
      accessAgreement: { message: 'some-message' },
    });

    defineViewRoutes(routeParamsMock);

    expect(routeParamsMock.httpResources.register.mock.calls.map(([{ path }]) => path))
      .toMatchInlineSnapshot(`
      Array [
        "/security/account",
        "/internal/security/capture-url",
        "/security/logged_out",
        "/logout",
        "/security/overwritten_session",
        "/security/access_agreement",
        "/login",
      ]
    `);
    expect(routeParamsMock.router.get.mock.calls.map(([{ path }]) => path)).toMatchInlineSnapshot(`
      Array [
        "/internal/security/access_agreement/state",
        "/internal/security/login_state",
      ]
    `);
  });

  it('registers Login routes if Login Selector is enabled even if both `token` and `basic` providers are not enabled', () => {
    const routeParamsMock = routeDefinitionParamsMock.create({
      authc: { selector: { enabled: true }, providers: { pki: { pki1: { order: 0 } } } },
      accessAgreement: { message: 'some-message' },
    });

    defineViewRoutes(routeParamsMock);

    expect(routeParamsMock.httpResources.register.mock.calls.map(([{ path }]) => path))
      .toMatchInlineSnapshot(`
      Array [
        "/security/account",
        "/internal/security/capture-url",
        "/security/logged_out",
        "/logout",
        "/security/overwritten_session",
        "/security/access_agreement",
        "/login",
      ]
    `);
    expect(routeParamsMock.router.get.mock.calls.map(([{ path }]) => path)).toMatchInlineSnapshot(`
      Array [
        "/internal/security/access_agreement/state",
        "/internal/security/login_state",
      ]
    `);
  });

  it('does not register access agreement routes if access agreement is not enabled', () => {
    const routeParamsMock = routeDefinitionParamsMock.create({
      authc: { providers: { basic: { basic1: { order: 0 } } } },
    });

    defineViewRoutes(routeParamsMock);

    expect(routeParamsMock.httpResources.register.mock.calls.map(([{ path }]) => path))
      .toMatchInlineSnapshot(`
      Array [
        "/security/account",
        "/internal/security/capture-url",
        "/security/logged_out",
        "/logout",
        "/security/overwritten_session",
        "/login",
      ]
    `);
    expect(routeParamsMock.router.get.mock.calls.map(([{ path }]) => path)).toMatchInlineSnapshot(`
      Array [
        "/internal/security/login_state",
      ]
    `);
  });
});
