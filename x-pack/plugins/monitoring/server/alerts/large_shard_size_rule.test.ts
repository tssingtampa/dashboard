/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { LargeShardSizeRule } from './large_shard_size_rule';
import { RULE_LARGE_SHARD_SIZE } from '../../common/constants';
import { fetchIndexShardSize } from '../lib/alerts/fetch_index_shard_size';
import { fetchClusters } from '../lib/alerts/fetch_clusters';
import { elasticsearchServiceMock } from '@kbn/core/server/mocks';

type ILargeShardSizeRuleMock = LargeShardSizeRule & {
  defaultParams: {
    threshold: number;
    duration: string;
  };
} & {
  actionVariables: Array<{
    name: string;
    description: string;
  }>;
};

const RealDate = Date;

jest.mock('../lib/alerts/fetch_index_shard_size', () => ({
  fetchIndexShardSize: jest.fn(),
}));
jest.mock('../lib/alerts/fetch_clusters', () => ({
  fetchClusters: jest.fn(),
}));

jest.mock('../static_globals', () => ({
  Globals: {
    app: {
      getLogger: () => ({ debug: jest.fn() }),
      url: 'http://localhost:5601',
      config: {
        ui: {
          ccs: { enabled: true },
          container: { elasticsearch: { enabled: false } },
        },
      },
    },
  },
}));

describe('LargeShardSizeRule', () => {
  it('should have defaults', () => {
    const rule = new LargeShardSizeRule() as ILargeShardSizeRuleMock;
    expect(rule.ruleOptions.id).toBe(RULE_LARGE_SHARD_SIZE);
    expect(rule.ruleOptions.name).toBe('Shard size');
    expect(rule.ruleOptions.throttle).toBe('12h');
    expect(rule.ruleOptions.defaultParams).toStrictEqual({
      threshold: 55,
      indexPattern: '-.*',
    });
    expect(rule.ruleOptions.actionVariables).toStrictEqual([
      { name: 'shardIndex', description: 'The index experiencing large average shard size.' },
      {
        name: 'internalShortMessage',
        description: 'The short internal message generated by Elastic.',
      },
      {
        name: 'internalFullMessage',
        description: 'The full internal message generated by Elastic.',
      },
      { name: 'state', description: 'The current state of the alert.' },
      { name: 'clusterName', description: 'The cluster to which the node(s) belongs.' },
      { name: 'action', description: 'The recommended action for this alert.' },
      {
        name: 'actionPlain',
        description: 'The recommended action for this alert, without any markdown.',
      },
    ]);
  });
  describe('execute', () => {
    const FakeDate = function () {};
    FakeDate.prototype.valueOf = () => 1;

    const shardIndex = 'apm-8.0.0-onboarding-2021.06.30';
    const shardSize = 0;
    const clusterUuid = 'abc123';
    const clusterName = 'testCluster';
    const stat = {
      shardIndex,
      shardSize,
      clusterUuid,
    };

    const replaceState = jest.fn();
    const scheduleActions = jest.fn();
    const getState = jest.fn();
    const executorOptions = {
      services: {
        scopedClusterClient: elasticsearchServiceMock.createScopedClusterClient(),
        alertFactory: {
          create: jest.fn().mockImplementation(() => {
            return {
              replaceState,
              scheduleActions,
              getState,
            };
          }),
        },
      },
      state: {},
    };

    beforeEach(() => {
      Date = FakeDate as DateConstructor;
      (fetchIndexShardSize as jest.Mock).mockImplementation(() => {
        return [stat];
      });
      (fetchClusters as jest.Mock).mockImplementation(() => {
        return [{ clusterUuid, clusterName }];
      });
    });

    afterEach(() => {
      Date = RealDate;
      replaceState.mockReset();
      scheduleActions.mockReset();
      getState.mockReset();
    });

    it('should fire actions', async () => {
      const rule = new LargeShardSizeRule() as ILargeShardSizeRuleMock;
      const type = rule.getRuleType();
      await type.executor({
        ...executorOptions,
        params: rule.ruleOptions.defaultParams,
      } as any);
      expect(scheduleActions).toHaveBeenCalledWith('default', {
        internalFullMessage: `Large shard size alert is firing for the following index: ${shardIndex}. [View index shard size stats](http://localhost:5601/app/monitoring#/elasticsearch/indices/${shardIndex}?_g=(cluster_uuid:${clusterUuid}))`,
        internalShortMessage: `Large shard size alert is firing for the following index: ${shardIndex}. Investigate indices with large shard sizes.`,
        action: `[View index shard size stats](http://localhost:5601/app/monitoring#/elasticsearch/indices/${shardIndex}?_g=(cluster_uuid:${clusterUuid}))`,
        actionPlain: 'Investigate indices with large shard sizes.',
        clusterName,
        state: 'firing',
        shardIndex,
        shardIndices: shardIndex,
      });
    });

    it('should handle ccs', async () => {
      const ccs = 'testCluster';
      (fetchIndexShardSize as jest.Mock).mockImplementation(() => {
        return [
          {
            ...stat,
            ccs,
          },
        ];
      });
      const rule = new LargeShardSizeRule() as ILargeShardSizeRuleMock;
      const type = rule.getRuleType();
      await type.executor({
        ...executorOptions,
        params: rule.ruleOptions.defaultParams,
      } as any);
      expect(scheduleActions).toHaveBeenCalledWith('default', {
        internalFullMessage: `Large shard size alert is firing for the following index: ${shardIndex}. [View index shard size stats](http://localhost:5601/app/monitoring#/elasticsearch/indices/${shardIndex}?_g=(cluster_uuid:${clusterUuid},ccs:testCluster))`,
        internalShortMessage: `Large shard size alert is firing for the following index: ${shardIndex}. Investigate indices with large shard sizes.`,
        action: `[View index shard size stats](http://localhost:5601/app/monitoring#/elasticsearch/indices/${shardIndex}?_g=(cluster_uuid:${clusterUuid},ccs:testCluster))`,
        actionPlain: 'Investigate indices with large shard sizes.',
        clusterName,
        state: 'firing',
        shardIndex,
        shardIndices: shardIndex,
      });
    });
  });
});