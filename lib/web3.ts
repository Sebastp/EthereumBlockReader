import Web3 from 'web3'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { NEXT_PUBLIC_INFURA_KEY = '' } = publicRuntimeConfig

let provider

if (
  typeof window !== 'undefined' &&
  window.web3 &&
  window.web3.currentProvider
) {
  provider = window.web3.currentProvider
} else {
  provider = new Web3.providers.WebsocketProvider(
    'wss://mainnet.infura.io/ws/v3/' + NEXT_PUBLIC_INFURA_KEY
  )
}

export const web3 = new Web3(provider)
