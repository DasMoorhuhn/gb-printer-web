import dayjs from 'dayjs';
import { dateFormat, defaultPalette } from '../../defaults';

const saveRGBNImage = (store) => (next) => (action) => {

  if (action.type === 'SAVE_RGBN_IMAGE') {

    const state = store.getState();

    import(/* webpackChunkName: "obh" */ 'object-hash')
      .then(({ default: hash }) => {
        const image = {
          palette: defaultPalette,
          hashes: { ...state.rgbnImages },
          hash: hash(state.rgbnImages),
          created: dayjs().format(dateFormat),
          title: '',
          tags: [],
        };

        store.dispatch({
          type: 'ADD_IMAGE',
          payload: image,
        });
      });

  }

  next(action);
};

export default saveRGBNImage;
