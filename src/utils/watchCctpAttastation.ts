import { AttestationType } from "@/types";

const sleepSecond = 6

export default function watchCctpAttastation({
  domain,
  txHash,
  timeoutSecond = 600
}:{
  domain: number,
  txHash: string,
  timeoutSecond?: number
}): Promise<AttestationType> {
  return new Promise((resolve, reject) => {
    let count = 0
    getAttastation()
    async function getAttastation() {
      if ( count*sleepSecond >= timeoutSecond ) {
        reject(new Error(`Timeout after ${timeoutSecond} seconds`))
        return
      }
      await new Promise(resolve => setTimeout(resolve, sleepSecond*1000))
      fetch(`https://iris-api.circle.com/v1/messages/${domain}/${txHash}`).then(async res => {
        if (res.status === 200) {
          const attestation = await res.json() as AttestationType
          if (!attestation.messages || attestation.messages[0]?.attestation==='PENDING') {
            setTimeout(()=>{
              getAttastation()
            }, sleepSecond*1000)
            return
          }
          resolve(attestation)
        } else {
          count += 1
          setTimeout(getAttastation, sleepSecond*1000)
        }
      }).catch(() => {
        count += 1
        setTimeout(getAttastation, sleepSecond*1000)
      })
    }
  })
}