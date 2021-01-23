import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';
import supportsWebmWriter from '../../../tools/supportsWebmWriter';

const BATCH_ACTIONS = [
  'download',
  'delete',
  'edit',
];

if (supportsWebmWriter()) {
  BATCH_ACTIONS.push('animate');
}

const BatchButtons = (props) => (
  <ul className="batch-buttons">
    <li
      className="batch-buttons__action batch-buttons__action--enabled"
    >
      <button
        type="button"
        onClick={props.filter}
      >
        <SVG name="filter" />
        { props.activeFilters === 0 ? null : (
          <span className="batch-buttons__bubble">{props.activeFilters}</span>
        )}
      </button>
    </li>
    <li
      className={
        classnames('batch-buttons__action batch-buttons__action--enabled', {
          'batch-buttons__action--has-unselected': props.hasUnselected,
        })
      }
    >
      <button
        type="button"
        onClick={() => props.batchTask(props.hasUnselected ? 'checkall' : 'uncheckall', props.page)}
      >
        <SVG name="checkmark" />
        { props.selectedImages === 0 ? null : (
          <span className="batch-buttons__bubble">{props.selectedImages}</span>
        )}
      </button>
    </li>
    <li
      className="batch-buttons__action batch-buttons__action--enabled"
    >
      <button
        type="button"
        onClick={props.showSortOptions}
      >
        <SVG name="sort" />
      </button>
    </li>
    {
      BATCH_ACTIONS.map((action) => (
        <li
          key={action}
          className={
            classnames('batch-buttons__action', {
              'batch-buttons__action--disabled': !props.enabled,
              'batch-buttons__action--enabled': props.enabled,
            })
          }
        >
          <button
            disabled={!props.enabled}
            type="button"
            onClick={() => props.batchTask(action, props.page)}
          >
            <SVG name={action} />
          </button>
        </li>
      ))
    }
  </ul>
);

BatchButtons.propTypes = {
  batchTask: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired,
  activeFilters: PropTypes.number.isRequired,
  selectedImages: PropTypes.number.isRequired,
  filter: PropTypes.func.isRequired,
  showSortOptions: PropTypes.func.isRequired,
  hasUnselected: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
};

BatchButtons.defaultProps = {
};

export default BatchButtons;
