export const toggler = (arr, setArr, item) => {
  let newArr = [];
  if (arr.includes(item)) {
    newArr = arr.filter((i) => !!i && i !== item);
  } else {
    newArr = [...arr, item];
  }
  setArr(newArr);
};

export const formatDateInput = (date) => {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
};

export const dateRepresentation = (d) => {
  let date = new Date(d);
  return date.toLocaleDateString("es-AR");
};
