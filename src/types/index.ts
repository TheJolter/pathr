import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Attestation = { // eg: https://iris-api.circle.com/v1/messages/1/0x30a284a1856b5ca31ee402691970823d2177d23f3bc996c6543114965f660fcd
  attestation: string,
  message: string,
  eventNonce: string
}

export type AttestationType = {
  messages: Attestation[]
}