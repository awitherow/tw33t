export function chunkArray(arr, perChunk) {
  return arr.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
}

export function sortArrayBy(
  array: Array<any>,
  sortBy: Array<{ prop: string; direction: number }>
) {
  // https://bithacker.dev/javascript-object-multi-property-sort
  // array should be an array type,
  // sortBy should be an array of objects of structure
  if (!sortBy) {
    return array;
  }

  const sorted = array.sort((a, b) => {
    let i = 0,
      result = 0;
    while (i < sortBy.length && result === 0) {
      result =
        sortBy[i].direction *
        (a[sortBy[i].prop]?.toString() < b[sortBy[i].prop]?.toString()
          ? -1
          : a[sortBy[i].prop]?.toString() > b[sortBy[i].prop]?.toString()
          ? 1
          : 0);
      i++;
    }
    return result;
  });
  return sorted;
}
