import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Loader from '@views/components/Loader'

import { web3 } from '@lib/web3'
import { BlockHeader, BlockTransactionObject } from 'web3-eth'
// BlockTransationBase

var subscription: any
const Home = () => {
  const [state, setState] = useState<'on' | 'off' | 'loading' | 'error'>(
      'loading'
    ),
    [block, setBlock] = useState<BlockTransactionObject>()

  const subscribeToBlockchain = () => {
    console.log('subscribeToBlockchain')
    setState('loading')
    subscription = web3.eth
      .subscribe('newBlockHeaders')
      .on('changed', (data) => {
        // console.log('changed:newBlockHeaders:id', data)
        console.log('changed')
      })
      .on('data', async (blockHeader) => {
        console.log('data:newBlockHeaders:blockHeader', blockHeader)

        var blockObj: BlockTransactionObject = await web3.eth.getBlock(
          blockHeader.hash,
          true
        )
        setState('on')
        setBlock({
          ...blockObj,
          // difficulty: parseInt(blockObj.difficulty),
          //desc
          transactions: blockObj.transactions.sort(
            (a: any, b: any) => b.value - a.value
          ),
        })
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

  useEffect(() => {
    console.log(block)
  }, [block])

  return (
    <div className="indexPage">
      <Head>
        <title>Block</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>
          Ethereum <span>block explorer</span>
        </h1>
      </header>

      <div className="ctaSection">
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
          {state == 'on' || 'loading' ? 'Pause' : 'Resume'}
        </button>

        <div className="state">
          <div className={'state__dot ' + state} />
          <p className="state__name">{state}</p>
        </div>
      </div>
      {block ? (
        <>
          <section className="dataSection">
            <div className="dataCol">
              <h5>Block number</h5>
              <span>{block.number}</span>
            </div>
            <div className="dataCol">
              <h5>Number of transactions</h5>
              <span>{block.transactions.length}</span>
            </div>
            <div className="dataCol">
              <h5>Miner</h5>
              <span>{block.miner}</span>
            </div>
            <div className="dataCol">
              <h5>Total difficulty</h5>
              <span>{block.difficulty}</span>
            </div>
          </section>

          <h1 className="sectionHeader transactionsHeader">Transactions</h1>
          <section className="dataSection transactionsGrid">
            <div className="listHeaders">
              <div className="dataCol">
                <h2>Hash</h2>
              </div>
              <div className="dataCol">
                <h2>Ammount</h2>
              </div>
              <div className="dataCol">
                <h2>Sender</h2>
              </div>
              <div className="dataCol">
                <h2>Recipient</h2>
              </div>
            </div>

            <ul>
              {block.transactions.map((transactionObj) => (
                <li className="listItemRow">
                  <div className="dataCol">
                    <span>{transactionObj.hash}</span>
                  </div>
                  <div className="dataCol">
                    <span>{web3.utils.fromWei(transactionObj.value)}</span>
                  </div>

                  <div className="dataCol">
                    <span>{transactionObj.from}</span>
                  </div>

                  <div className="dataCol">
                    <span>{transactionObj.to}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : !block && state === 'loading' ? (
        <Loader />
      ) : null}
    </div>
  )
}

export default Home
