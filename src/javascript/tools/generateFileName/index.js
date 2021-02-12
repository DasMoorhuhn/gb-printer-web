import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dateFormat, dateFormatFilename } from '../../app/defaults';

dayjs.extend(customParseFormat);

const rgbnPaletteName = ({ r, g, b, n }) => {

  const hex = (val) => (val.toString(16)).padStart(2, '0');

  return (
    [
      r.map(hex).join(''),
      g.map(hex).join(''),
      b.map(hex).join(''),
      n.map(hex).join(''),
    ].join('')
  );
};

const generateFileName = ({
  image = false,
  palette = false,
  exportScaleFactor = false,
  frameRate = false,
  altTitle = false,
  useCurrentDate = false,
  frameName = false,
  paletteShort = false,
}) => {
  const date = useCurrentDate ? dayjs() : dayjs(image.created, dateFormat);
  const formattedDate = date.isValid() ? date.format(dateFormatFilename) : false;
  const paletteName = paletteShort || (palette ? (palette.shortName || rgbnPaletteName(palette)) : false);

  return [
    formattedDate,
    image && image.title ? image.title : altTitle,
    exportScaleFactor ? `${exportScaleFactor}x` : null,
    frameRate ? `${frameRate}fps` : null,
    frameName,
    paletteName,
  ]
    .filter(Boolean)
    .join('-');
};

export default generateFileName;
