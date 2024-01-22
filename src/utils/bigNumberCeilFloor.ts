import BigNumber from "bignumber.js"
function bigNumberFloor(num: string|number|BigNumber, decimals: number): BigNumber {
  return new BigNumber(num).times(10**decimals).idiv(1).div(10**decimals)
}

function bigNumberCeil(num: string|number|BigNumber, decimals: number): BigNumber {
  return new BigNumber(num).times(10**decimals).integerValue(BigNumber.ROUND_CEIL).div(10**decimals)
}

export {bigNumberFloor, bigNumberCeil}