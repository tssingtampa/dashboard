/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
export * from '../translations';

export const ATTACHMENT_NOT_REGISTERED_ERROR = i18n.translate(
  'xpack.cases.userActions.attachmentNotRegisteredErrorMsg',
  {
    defaultMessage: 'Attachment type is not registered',
  }
);

export const DEFAULT_EVENT_ATTACHMENT_TITLE = i18n.translate(
  'xpack.cases.userActions.defaultEventAttachmentTitle',
  {
    defaultMessage: 'added an attachment of type',
  }
);

export const MULTIPLE_ALERTS = (totalAlerts: number): string =>
  i18n.translate('xpack.cases.caseView.alerts.multipleAlerts', {
    values: { totalAlerts },
    defaultMessage:
      '{totalAlerts, plural, =1 {one} other {{totalAlerts}}} {totalAlerts, plural, =1 {alert} other {alerts}}',
  });

export const ATTACHMENT = i18n.translate('xpack.cases.userActions.attachment', {
  defaultMessage: 'Attachment',
});

export const UNSAVED_DRAFT_COMMENT = i18n.translate(
  'xpack.cases.userActions.comment.unsavedDraftComment',
  {
    defaultMessage: 'You have unsaved edits for this comment',
  }
);

export const DELETE_ALERTS_SUCCESS_TITLE = (totalAlerts: number) =>
  i18n.translate('xpack.cases.userActions.attachments.alerts.successToasterTitle', {
    defaultMessage:
      'Deleted {totalAlerts, plural, =1 {one} other {{totalAlerts}}} {totalAlerts, plural, =1 {alert} other {alerts}}',
    values: { totalAlerts },
  });

export const DELETE_COMMENT_SUCCESS_TITLE = i18n.translate(
  'xpack.cases.userActions.attachments.comment.successToasterTitle',
  {
    defaultMessage: 'Deleted comment',
  }
);

export const DELETE_REGISTERED_ATTACHMENT = i18n.translate(
  'xpack.cases.userActions.attachments.registeredAttachment.successToasterTitle',
  {
    defaultMessage: 'Deleted attachment',
  }
);
