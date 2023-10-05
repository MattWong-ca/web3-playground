import { Mumbai, Chain } from '@thirdweb-dev/chains'

// your token bound factory address
export const factoryAddress: string = '0x02101dfB77FDE026414827Fdc604ddAF224F0921'
export const implementation: string = '0xf5df23e81cfD6c5FB25A1dDE9a4a80c03B7e7F39'

// Your thirdweb api key - you can get one at https://thirdweb.com/dashboard/api-keys
export const TWApiKey: string = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || ''
export const activeChain: Chain = Mumbai

export const nftDropAddress: string = '0xE0EDdB4df871a023c3e72E72185c3ccbF6F2E58F'
export const tokenAddress: string = '0x006eF094e2DF803074Ef7Bce35994771a87a6fca'
