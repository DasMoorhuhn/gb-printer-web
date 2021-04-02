import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  imageCount: state.videoParams.imageSelection ? state.videoParams.imageSelection.length : 0,
  scaleFactor: state.videoParams.scaleFactor || [...state.exportScaleFactors].pop() || 4,
  frameRate: state.videoParams.frameRate || 12,
  yoyo: state.videoParams.yoyo || false,
  lockFrame: state.videoParams.lockFrame || false,
  invertPalette: state.videoParams.invertPalette || false,
  frame: state.videoParams.frame || '',
  exportFrameMode: state.videoParams.exportFrameMode || 'keep',
  palette: state.videoParams.palette || '',
});

const mapDispatchToProps = (dispatch) => ({
  update: (changedValue) => {
    dispatch({
      type: 'SET_VIDEO_PARAMS',
      payload: changedValue,
    });
  },
  cancel: () => {
    dispatch({
      type: 'CANCEL_ANIMATE_IMAGES',
    });
  },
  animate: () => {
    dispatch({
      type: 'ANIMATE_IMAGES',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
