const removeEmpty = (obj) => {
  const array = Object.entries(obj);
  var arrayFiltered = []
  array.map((arr) => {
    if (arr[1].location) arrayFiltered.push(arr[1])
  });
  return arrayFiltered;
};

export { removeEmpty };
