import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Nav from '@views/components/Nav'

import { web3 } from '@lib/web3'
import { BlockHeader } from 'web3-eth'

interface BlockHeaderExtended extends BlockHeader {
  difficulty?: string
  transactionCount: number
}

var subscription: any
const Home = () => {
  const [state, setState] = useState<'on' | 'off' | 'loading' | 'error'>(
      'loading'
    ),
    [block, setBlock] = useState<BlockHeaderExtended>()

  const subscribeToBlockchain = () => {
    console.log('subscribeToBlockchain')
    subscription = web3.eth
      .subscribe('newBlockHeaders')
      .on('changed', (data) => {
        // console.log('changed:newBlockHeaders:id', data)
        console.log('changed')
      })
      .on('data', async (blockHeader) => {
        console.log('data:newBlockHeaders:blockHeader', blockHeader)

        const count: number = await web3.eth.getBlockTransactionCount(
          blockHeader.hash
        )
        var transaction = web3.eth
          .getTransactionFromBlock(blockHeader.hash)
          .then(console.log)
        setState('on')
        setBlock({ ...blockHeader, transactionCount: count })
      })
      .on('error', (error) => {
        console.error('error:newBlockHeaders', error)
        alert(`Something went wrong :( ${error.name} ${error.message}`)
        setState('error')
      })
  }

  useEffect(() => {
    subscribeToBlockchain()

    return () => {
      subscription.unsubscribe()
    }
  }, [web3])

  return (
    <div className="indexPage">
      <Head>
        <title>Block</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="hero">
        <h1>Ethereum block explorer</h1>
      </div>

      <section className="dataSection">
        <div className="dataCol">
          <h5>Block number</h5>
          <span>{block ? block.number : ''}</span>
        </div>
        <div className="dataCol">
          <h5>Number of transactions</h5>
          <span>{block ? block.transactionCount : ''}</span>
        </div>
        <div className="dataCol">
          <h5>Miner</h5>
          <span>{block ? block.miner : ''}</span>
        </div>
        <div className="dataCol">
          <h5>Total difficulty</h5>
          <span>{block ? block.difficulty : ''}</span>
        </div>
      </section>

      <div className="bottomCta">
        <button
          onClick={() => {
            if (state == 'on') {
              subscription.unsubscribe()
              setState('off')
            } else {
              subscribeToBlockchain()
              setState('on')
            }
          }}
          disabled={!['on', 'off'].includes(state)}
          className="ctaButton"
        >
          {state == 'on' ? 'Pause' : 'Resume'}
        </button>

        <div className="state">
          <div className={'state__dot ' + state} />
          <p className="state__name">{state}</p>
        </div>
      </div>
    </div>
  )
}

export default Home
