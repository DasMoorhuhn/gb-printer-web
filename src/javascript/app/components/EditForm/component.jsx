import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import EditImageTabs from '../EditImageTabs';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import { load } from '../../../tools/storage';
import Lightbox from '../Lightbox';

const body = document.querySelector('body');

class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
      loaded: false,
      hash: props.hash,
    };

    this.restoreScroll = window.scrollY;
  }

  static getDerivedStateFromProps(props, state) {
    // same image
    if (props.hash === state.hash) {
      return state;
    }

    // image changed or was unloaded
    return {
      tiles: null,
      loaded: false,
      hash: props.hash,
    };
  }

  componentDidMount() {
    if (this.props.hash) {
      this.loadImage();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.hash &&
      (
        (prevProps.hash !== this.props.hash) ||
        (prevProps.frame !== this.props.frame)
      )
    ) {
      this.loadImage();
    }
  }

  loadImage() {
    if (this.props.hashes) {
      Promise.all([
        load(this.props.hashes.r, this.props.frames.r),
        load(this.props.hashes.g, this.props.frames.g),
        load(this.props.hashes.b, this.props.frames.b),
        load(this.props.hashes.n, this.props.frames.n),
      ])
        .then((tiles) => {
          this.setState({
            tiles: RGBNDecoder.rgbnTiles(tiles),
            loaded: true,
          });
        });
    } else {
      load(this.props.hash, this.props.frame)
        .then((tiles) => {
          this.setState({
            tiles,
            loaded: true,
          });
        });
    }
  }

  applyOverlayScrolling() {
    if (!this.state.loaded && body.classList.contains('has-overlay')) {
      body.classList.remove('has-overlay');
      window.scrollTo(0, this.restoreScroll);
    }

    if (this.state.loaded && !body.classList.contains('has-overlay')) {
      this.restoreScroll = window.scrollY;
      body.classList.add('has-overlay');
    }
  }

  render() {

    this.applyOverlayScrolling();

    if (!this.state.loaded) {
      return null;
    }

    const paletteColors = this.props.palette ? this.props.palette.palette : null;

    const willUpdateTags = (
      this.props.batch &&
      !!(
        this.props.tags.add.length ||
        this.props.tags.remove.length
      )
    );

    const willUpdateBatch = (
      this.props.batch &&
      (
        this.props.batch.created ||
        this.props.batch.title ||
        this.props.batch.palette ||
        this.props.batch.invertPalette ||
        this.props.batch.frame ||
        this.props.batch.lockFrame ||
        willUpdateTags
      )
    );

    return (
      <Lightbox
        height={this.props.height}
        className="edit-image"
        confirm={this.props.save}
        deny={this.props.cancel}
      >
        <label className="edit-image__header">
          <input
            className="edit-image__header-edit"
            placeholder="Add a title"
            value={this.props.title}
            onChange={(ev) => {
              this.props.updateTitle(ev.target.value);
            }}
          />
        </label>
        {
          !this.props.batch ? null : (
            <span className="edit-image__title-hint">Use %n to add an index to the image titles</span>
          )
        }
        <GameBoyImage
          tiles={this.state.tiles}
          palette={this.props.palette}
          lockFrame={this.props.lockFrame}
          invertPalette={this.props.invertPalette}
        />
        { this.props.batch && this.props.batch.selection && this.props.batch.selection.length ? (
          <div
            className="edit-image__batch-warn"
            style={paletteColors ? {
              borderLeftColor: paletteColors[1],
              borderTopColor: paletteColors[1],
              backgroundColor: paletteColors[2],
              borderRightColor: paletteColors[3],
              borderBottomColor: paletteColors[3],
              color: paletteColors[0],
            } : null}
          >
            { `You are editing ${this.props.batch.selection.length} images` }
            { willUpdateBatch ? (
              <p className="edit-image__batch-update-list">
                {'Will update: '}
                {
                  [
                    this.props.batch.created ? 'date' : null,
                    this.props.batch.title ? 'title' : null,
                    this.props.batch.palette ? 'palette' : null,
                    this.props.batch.invertPalette ? 'invertPalette' : null,
                    this.props.batch.frame ? 'frame' : null,
                    this.props.batch.lockFrame ? 'framePalette' : null,
                    willUpdateTags ? 'tags' : null,
                  ]
                    .filter(Boolean)
                    .join(', ')
                }
              </p>
            ) : null}
          </div>
        ) : null }
        <EditImageTabs
          created={this.props.created}
          updateCreated={this.props.updateCreated}
          regularImage={this.state.tiles.length === 360}
          lockFrame={this.props.lockFrame}
          hashes={this.props.hashes}
          palette={this.props.palette}
          invertPalette={this.props.invertPalette}
          frame={this.props.frame}
          tags={this.props.tags}
          updatePalette={this.props.updatePalette}
          updateInvertPalette={this.props.updateInvertPalette}
          updateFrame={this.props.updateFrame}
          updateFrameLock={this.props.updateFrameLock}
          updateTags={this.props.updateTags}
        />
      </Lightbox>
    );
  }
}

EditForm.propTypes = {
  batch: PropTypes.object,
  created: PropTypes.string,
  cancel: PropTypes.func.isRequired,
  hash: PropTypes.string,
  hashes: PropTypes.object,
  palette: PropTypes.object,
  invertPalette: PropTypes.bool.isRequired,
  lockFrame: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  frames: PropTypes.object,
  save: PropTypes.func.isRequired,
  tags: PropTypes.shape({
    initial: PropTypes.array.isRequired,
    add: PropTypes.array.isRequired,
    remove: PropTypes.array.isRequired,
  }),
  title: PropTypes.string,
  updateCreated: PropTypes.func.isRequired,
  updatePalette: PropTypes.func.isRequired,
  updateInvertPalette: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  updateFrame: PropTypes.func.isRequired,
  updateFrameLock: PropTypes.func.isRequired,
  updateTags: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
};

EditForm.defaultProps = {
  batch: null,
  created: null,
  title: null,
  hash: null,
  hashes: null,
  palette: null,
  tags: {
    initial: [],
    add: [],
    remove: [],
  },
  frame: null,
  frames: null,
};

export default EditForm;
