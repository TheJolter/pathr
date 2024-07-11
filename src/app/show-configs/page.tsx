'use client';

import { CHAINS } from "@/configs/cctp/configs";

export default function ShowConfigs() {
  return (
<div>
{JSON.stringify(CHAINS, null, 2)}
</div>
  )
}