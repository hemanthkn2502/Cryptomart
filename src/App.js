import logo from './logo.svg';
import './App.css';
import Cryptomart from './abis/Cryptomart.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import Navigation from './component/Navigation'
import Section from './component/Section'
import Product from './component/Product'

import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [cryptomart, setCryptomart] = useState(null)

  const [account, setAccount] = useState(null)

  const [electronics, setElectronics] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [toys, setToys] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()

    const cryptomart = new ethers.Contract(config[network.chainId].Cryptomart.address, Cryptomart, provider)
    setCryptomart(cryptomart)

    const items = []

    for (var i = 0; i < 9; i++) {
      const item = await cryptomart.items(i + 1)
      items.push(item)
    }

    const electronics = items.filter((item) => item.category === 'electronics')
    const clothing = items.filter((item) => item.category === 'clothing')
    const toys = items.filter((item) => item.category === 'toys')

    setElectronics(electronics)
    setClothing(clothing)
    setToys(toys)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])
  return (
    <div >
      <Navigation account={account} setAccount={setAccount} />

<h2>Cryptomart Best Sellers</h2>

{electronics && clothing && toys && (
  <>
    <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
    <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
    <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
  </>
)}

{toggle && (
  <Product item={item} provider={provider} account={account} cryptomart={cryptomart} togglePop={togglePop} />
)}
      
    </div>
  );
}

export default App;
