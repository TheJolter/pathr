export function isGreaterThanZero(str: string) {

  if (str.trim() === "") {
    return false;
  }

  const num = parseFloat(str);

  return num > 0 && !isNaN(num);
}