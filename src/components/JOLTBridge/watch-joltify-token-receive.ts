
const watchJoltifyTokenChange = ({
  denom,
  address,
  timeoutSecond = 120, // 120s
  direction='inc'
}:{
  denom: string,
  address: string,
  timeoutSecond?: number, // seconds
  direction?: 'inc'|'desc'
}): Promise<void> => {
  const fetchUrl = `https://lcd.joltify.io/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`
  return new Promise(async (resolve, reject) => {
    let oldAmount = '0'
    try {
      oldAmount = (await (await fetch(fetchUrl)).json()).balance.amount
    } catch(err) {
      reject(err)
      return
    }
    let counter = 0
    const invervalTime = 6000 // ms
    const intervalId = setInterval(async () => {
      counter ++
      if ( counter*invervalTime > timeoutSecond*1000) {
        clearInterval(intervalId)
        reject({message: `timeout ${timeoutSecond}s`})
      }
      try {
        const newAmount = (await (await fetch(fetchUrl)).json()).balance.amount
        if (
          (direction==='inc' && Number(newAmount) > Number(oldAmount))
          || (direction==='desc' && Number(newAmount) < Number(oldAmount))
        ) {
          clearInterval(intervalId)
          resolve()
        }
      } catch(err) {
        reject(err)
      }
    }, invervalTime)
  })
}

export default watchJoltifyTokenChange;