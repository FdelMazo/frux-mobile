export const toggler = (arr, setArr, item) => {
  let newArr = [];
  if (arr.includes(item)) {
    newArr = arr.filter((i) => i !== item);
  } else {
    newArr = [...arr, item];
  }
  setArr(newArr);
};
