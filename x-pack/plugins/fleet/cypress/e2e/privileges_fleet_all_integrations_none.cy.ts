/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FLEET } from '../tasks/navigation';
import {
  createUsersAndRoles,
  FleetAllIntegrNoneRole,
  FleetAllIntegrNoneUser,
  deleteUsersAndRoles,
} from '../tasks/privileges';
import { login, loginWithUserAndWaitForPage, logout } from '../tasks/login';

import { MISSING_PRIVILEGES } from '../screens/fleet';
const rolesToCreate = [FleetAllIntegrNoneRole];
const usersToCreate = [FleetAllIntegrNoneUser];

describe('When the user has All privilege for Fleet but None for integrations', () => {
  before(() => {
    createUsersAndRoles(usersToCreate, rolesToCreate);
  });

  beforeEach(() => {
    login();
  });

  afterEach(() => {
    logout();
  });

  after(() => {
    deleteUsersAndRoles(usersToCreate, rolesToCreate);
  });

  it('Fleet access is blocked with a callout', () => {
    loginWithUserAndWaitForPage(FLEET, FleetAllIntegrNoneUser);
    cy.getBySel(MISSING_PRIVILEGES.TITLE).should('have.text', 'Permission denied');
    cy.getBySel(MISSING_PRIVILEGES.MESSAGE).should(
      'contain',
      'You are not authorized to access Fleet.'
    );
  });
});
