export default (tagsString) => {
  const splitArr = tagsString.split(',');
  const cleanArr = splitArr.reduce((result, tag) => {
    if (tag === '' || tag === ' ') {
      return result;
    }
    return [...result, tag.trim().toLowerCase()];
  }, []);
  return cleanArr;
};
