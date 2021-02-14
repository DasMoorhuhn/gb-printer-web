import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const GALLERY_VIEWS = [
  'list',
  '1x',
  '2x',
  '3x',
  '4x',
];

const GalleryViewSelect = (props) => (
  <ul className="gallery-view-select gallery-button__group">
    {
      GALLERY_VIEWS.map((view) => (
        <li
          key={view}
          className={
            classnames('gallery-button gallery-button--enabled', {
              'gallery-button--selected': props.currentView === view,
            })
          }
        >
          <button
            type="button"
            onClick={() => {
              props.updateView(view);
            }}
          >
            <SVG name={view} />
          </button>
        </li>
      ))
    }
  </ul>
);

GalleryViewSelect.propTypes = {
  currentView: PropTypes.string.isRequired,
  updateView: PropTypes.func.isRequired,
};

GalleryViewSelect.defaultProps = {
};

export default GalleryViewSelect;
