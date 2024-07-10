import { typeList } from '../constants/contacts-constants.js';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;
  if (!['true', 'false'].includes(value)) return;

  // return value === 'true';

  // const parsedValue = Boolean(value);
  // return parsedValue;

  const parsedValue = value.toLowerCase() === 'true';

  return parsedValue;
};

const parseContactFilterParams = ({ type, isFavourite }) => {
  const parsedType = typeList.includes(type) ? type : null;
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};

export default parseContactFilterParams;
