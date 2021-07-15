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

export const toEth = async (v) => {
  const r = await fetch(
    "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH"
  )
    .then((res) => res.json())
    .then((x) => x.ETH);

  const n = v * r;
  const factor = Math.pow(10, 4);
  const roundedUp = Math.ceil(n * factor) / factor;

  return parseFloat(roundedUp.toFixed(4));
};

export const toDollars = async (v) => {
  const r = await fetch(
    "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
  )
    .then((res) => res.json())
    .then((x) => x.USD);

  return Math.round(v * r);
};
