export const queryNumberMinMax = (doc, minParam, maxParam) => {
  const minValue = (minParam && parseInt(minParam, 10)) || undefined;
  const maxValue = (maxParam && parseInt(maxParam, 10)) || undefined;
  const docIsValid = doc && doc !== '';
  if (docIsValid && maxValue && minValue) {
    return {
      [doc]: {
        $gte: minValue,
        $lte: maxValue
      }
    };
  }
  if (docIsValid && maxValue) {
    return {
      [doc]: {
        $lte: maxValue
      }
    };
  }
  if (docIsValid && minValue) {
    return {
      [doc]: {
        $gte: minValue
      }
    };
  }
  return {};
};

export const queryString = (doc, param) => {
  const value = param && param !== '' && param;
  const isString = value && typeof value === 'string' && value.toLocaleLowerCase();
  const docIsValid = doc && doc !== '';
  if (isString && docIsValid) {
    return {
      [doc]: isString
    };
  }
  return {};
};
