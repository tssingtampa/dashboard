/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { useMonitorId } from '../../hooks';
import { monitorStatusSelector } from '../../state/selectors';
import { Ping } from '../../../../common/runtime_types/ping';
import { useBreadcrumbs } from '../../hooks/use_breadcrumbs';

const isAutogeneratedId = (id: string) => {
  const autoGeneratedId = /^auto-(icmp|http|tcp|browser)-0X[A-F0-9]{16}.*/;
  return autoGeneratedId.test(id);
};

// For monitors with no explicit ID, we display the URL instead of the
// auto-generated ID because it is difficult to derive meaning from a
// generated id like `auto-http-0X8D6082B94BBE3B8A`.
// We may deprecate this behavior in the next major release, because
// the heartbeat config will require an explicit ID.
const getPageTitle = (monitorId: string, selectedMonitor: Ping | null) => {
  if (isAutogeneratedId(monitorId)) {
    return selectedMonitor?.url?.full || monitorId;
  }
  return monitorId;
};

export const MonitorPageTitle: React.FC = () => {
  const monitorId = useMonitorId();

  const selectedMonitor = useSelector(monitorStatusSelector);

  const nameOrId = selectedMonitor?.monitor?.name || getPageTitle(monitorId, selectedMonitor);

  useBreadcrumbs([{ text: nameOrId }]);

  return <span className="eui-textNoWrap">{nameOrId}</span>;
};