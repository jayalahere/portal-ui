import React from 'react';
import {
  compose,
  setDisplayName,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { connect } from 'react-redux';
import {
  get,
  isEmpty,
  isEqual,
  reduce,
} from 'lodash';

import { makeFilter } from '@ncigdc/utils/filters';
import { setModal } from '@ncigdc/dux/modal';
import { humanify } from '@ncigdc/utils/string';
import { IS_CDAVE_DEV } from '@ncigdc/utils/constants';
import { withTheme } from '@ncigdc/theme';
import CategoricalCustomBinsModal from './modals/CategoricalCustomBinsModal';

import RecomposeUtils, {
  dataDimensions,
  filterSurvivalData,
  getBinData,
  getCountLink,
  getRawQueryData,
} from './helpers';
import EnhancedClinicalVariableCard from './EnhancedClinicalVariableCard';

export default compose(
  setDisplayName('EnhancedCategoricalVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  RecomposeUtils,
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName }) => {
      const sanitisedId = fieldName.split('.').pop();
      const rawQueryData = getRawQueryData(data, fieldName);

      return Object.assign(
        {
          dataBuckets: get(rawQueryData, 'buckets', []),
          totalDocs: get(data, 'hits.total', 0),
          wrapperId: `${sanitisedId}-chart`,
        },
        dataDimensions[sanitisedId] && {
          axisTitle: dataDimensions[sanitisedId].axisTitle,
          dataDimension: dataDimensions[sanitisedId].unit,
        },
      );
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.dataBuckets, nextProps.dataBuckets) ||
      props.setId !== nextProps.setId,
    ({
      dataBuckets,
      dispatchUpdateClinicalVariable,
      variable,
    }) => {
      dispatchUpdateClinicalVariable({
        value: Object.assign(
          {},
          reduce(variable.bins, (acc, bin, key) => Object.assign(
            {},
            acc,
            bin.groupName && bin.groupName !== key
              ? {
                [key]: {
                  doc_count: 0,
                  groupName: bin.groupName,
                  key,
                },
              }
              : {}
          ), {}),
          dataBuckets.reduce((acc, bucket) => Object.assign(
            {},
            acc,
            {
              [bucket.key]: Object.assign(
                {},
                bucket,
                {
                  groupName:
                  typeof get(variable, `bins.${bucket.key}.groupName`, undefined) === 'string'
                    // hidden value have groupName '', so check if it is string
                    ? get(variable, `bins.${bucket.key}.groupName`, undefined)
                    : bucket.key,
                },
              ),
            }
          ), {}),
        ),
        variableKey: 'bins',
      });
    }
  ),
  withProps(
    ({
      dataBuckets,
      variable: { bins },
    }) => getBinData(bins, dataBuckets)
  ),
  withPropsOnChange((props, nextProps) =>
    nextProps.variable.active_chart === 'survival' &&
    (!isEqual(props.binData, nextProps.binData) ||
    props.variable.active_chart !== nextProps.variable.active_chart),
    ({
      binData,
      variable: { savedSurvivalBins },
    }) => {
      const newSurvivalBins = binData.filter(bin => {
        const sortKeyArray = bin.keyArray.sort();
        return savedSurvivalBins.some(savedBin => 
          savedBin.name === bin.key &&
            isEqual(savedBin.values.sort(), sortKeyArray)
        );
      }).map(bin => ({
        ...bin, 
        index: savedSurvivalBins.filter(savedBin => 
          savedBin.name === bin.key)[0].index,
      }));

      const canUseSavedBins = newSurvivalBins.length === savedSurvivalBins.length;

      const nextSurvivalBins = canUseSavedBins ? newSurvivalBins : binData;

      const survivalBins = filterSurvivalData(
        nextSurvivalBins
          .map(bin => ({
            ...bin,
            chart_doc_count: bin.doc_count,
          }))
      )
        .slice();

        const survivalPlotValues = survivalBins.map(bin => bin.keyArray);
        const survivalTableValues = survivalBins.map((bin, index) => ({ 
          name: bin.key, 
          index: typeof bin.index === 'undefined' ? index : bin.index,
        }));

      return {
        survivalPlotValues,
        survivalTableValues,
      };
    }
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.variable.bins, nextProps.variable.bins),
    ({ variable: { bins } }) => ({
      binsAreCustom: Object.keys(bins)
        .some(bin => bins[bin].key !== bins[bin].groupName ||
          typeof bins[bin].index === 'number'),
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      props.binsAreCustom !== nextProps.binsAreCustom ||
      !isEqual(props.dataBuckets, nextProps.dataBuckets),
    ({
      binsAreCustom,
      dataBuckets,
      dispatchUpdateClinicalVariable,
    }) => ({
      resetBins: () => {
        if (binsAreCustom) {
          dispatchUpdateClinicalVariable({
            value: dataBuckets
              .reduce((acc, bucket) => Object.assign(
                {},
                acc,
                {
                  [bucket.key]: Object.assign(
                    {},
                    bucket,
                    { groupName: bucket.key }
                  ),
                }
              ), {}),
            variableKey: 'bins',
          });
        }
      },
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.binData, nextProps.binData),
    ({
      binData, fieldName, setId, totalDocs,
    }) => ({
      displayData: isEmpty(binData)
        ? []
        : binData
          .filter(bucket => (
          IS_CDAVE_DEV
            ? bucket.key
            : bucket.key !== '_missing'
          ))
          .sort((a, b) => b.doc_count - a.doc_count)
          .map(bin => Object.assign(
            {},
            bin,
            {
              chart_doc_count: bin.doc_count,
              doc_count: getCountLink({
                doc_count: bin.doc_count,
                filters:
                bin.key === '_missing'
                  ? {
                    content: [
                      {
                        content: {
                          field: fieldName,
                          value: bin.keyArray,
                        },
                        op: 'IS',
                      },
                      {
                        content: {
                          field: 'cases.case_id',
                          value: `set_id:${setId}`,
                        },
                        op: 'in',
                      },
                    ],
                    op: 'AND',
                  }
                  : makeFilter([
                    {
                      field: 'cases.case_id',
                      value: `set_id:${setId}`,
                    },
                    {
                      field: fieldName,
                      value: bin.keyArray,
                    },
                  ]),
                totalDocs,
              }),
              key: bin.key,
            }
          )),
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      !isEqual(props.variable.bins, nextProps.variable.bins) ||
      !isEqual(props.dataBuckets, nextProps.dataBuckets),
    ({
      dataBuckets,
      dispatch,
      dispatchUpdateClinicalVariable,
      fieldName,
      variable: { bins },
    }) => ({
      openCustomBinModal: () => dispatch(setModal(
        <CategoricalCustomBinsModal
          bins={bins}
          dataBuckets={dataBuckets}
          fieldName={humanify({ term: fieldName })}
          modalStyle={{
            maxWidth: '720px',
            width: '90%',
          }}
          onClose={() => dispatch(setModal(null))}
          onUpdate={(newBins) => {
            dispatchUpdateClinicalVariable({
              value: newBins,
              variableKey: 'bins',
            });
            dispatch(setModal(null));
          }}
          />
      )),
    })
  )
)(EnhancedClinicalVariableCard);
