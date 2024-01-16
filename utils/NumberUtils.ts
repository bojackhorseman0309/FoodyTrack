function isNumeric(str: string) {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

function getBooleanAsNumber(bool: boolean) {
  return bool ? 1 : 0;
}

export { isNumeric, getBooleanAsNumber };
