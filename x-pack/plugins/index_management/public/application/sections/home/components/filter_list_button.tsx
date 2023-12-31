/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState } from 'react';
import { FormattedMessage } from '@kbn/i18n-react';
import {
  EuiFilterButton,
  EuiFilterGroup,
  EuiPopover,
  EuiFilterSelectItem,
  useEuiTheme,
} from '@elastic/eui';

interface Filter {
  name: string;
  checked: 'on' | 'off';
}

interface Props<T extends string> {
  filters: Filters<T>;
  onChange(filters: Filters<T>): void;
}

export type Filters<T extends string> = {
  [key in T]: Filter;
};

export function FilterListButton<T extends string>({ onChange, filters }: Props<T>) {
  const { euiTheme } = useEuiTheme();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const activeFilters = Object.values(filters).filter((v) => (v as Filter).checked === 'on');

  const onButtonClick = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const toggleFilter = (filter: T) => {
    const previousValue = filters[filter].checked;
    onChange({
      ...filters,
      [filter]: {
        ...filters[filter],
        checked: previousValue === 'on' ? 'off' : 'on',
      },
    });
  };

  const button = (
    <EuiFilterButton
      iconType="arrowDown"
      onClick={onButtonClick}
      isSelected={isPopoverOpen}
      numFilters={Object.keys(filters).length}
      hasActiveFilters={activeFilters.length > 0}
      numActiveFilters={activeFilters.length}
      data-test-subj="viewButton"
    >
      <FormattedMessage
        id="xpack.idxMgmt.indexTemplatesList.viewButtonLabel"
        defaultMessage="View"
      />
    </EuiFilterButton>
  );

  return (
    <EuiFilterGroup>
      <EuiPopover
        ownFocus
        button={button}
        isOpen={isPopoverOpen}
        closePopover={closePopover}
        panelPaddingSize="none"
        data-test-subj="filterList"
      >
        {/* EUI NOTE: Please use EuiSelectable (which already has height/scrolling built in)
            instead of EuiFilterSelectItem (which is pending deprecation).
            @see https://elastic.github.io/eui/#/forms/filter-group#multi-select */}
        <div className="eui-yScroll" css={{ maxHeight: euiTheme.base * 30 }}>
          {Object.entries(filters).map(([filter, item], index) => (
            <EuiFilterSelectItem
              checked={(item as Filter).checked}
              key={index}
              onClick={() => toggleFilter(filter as T)}
              data-test-subj="filterItem"
            >
              {(item as Filter).name}
            </EuiFilterSelectItem>
          ))}
        </div>
      </EuiPopover>
    </EuiFilterGroup>
  );
}
