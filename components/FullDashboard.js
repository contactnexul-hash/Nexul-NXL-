'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function FullDashboard() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [network, setNetwork] = useState(null)
  const [priceUSD, setPriceUSD] = useState(null)
  const [error, setError] = useState('')
  const [transactions, setTransactions] = useState([])

  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  const tokenDecimals = 18
  const requiredChainId = 137

  const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)"]

  const tokenDistribution = [
    { name: 'Réserve Fondatrice', value: 2550000000 },
    { name: 'Vente Publique', value: 2200000000 },
    { name: 'Marketing & Rewards', value: 250000000 }
  ]
  const COLORS = ['#0ea5e9', '#14b8a6', '#facc15']

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) { setError('MetaMask non détecté !'); return }
    try {
      const [acc] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(acc)
      checkNetwork()
    } catch {
      setError('Connexion refusée')
    }
  }

  // Check network
  const checkNetwork = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const { chainId, name } = await provider.getNetwork()
      setNetwork({ chainId, name })
      if (chainId !== requiredChainId) setError(`Connectez-vous au réseau Polygon (ID ${requiredChainId})`)
      else setError('')
    } catch {
      setError('Impossible de détecter le réseau')
    }
  }

  // Fetch balance
  const fetchBalance = async () => {
    if (!account || network?.chainId !== requiredChainId) return
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
      const rawBalance = await contract.balanceOf(account)
      const formatted = ethers.formatUnits(rawBalance, tokenDecimals)
      setBalance(Number(formatted))
    } catch {
      setError('Impossible de récupérer le solde')
    }
  }

  // Fetch price
  const fetchPrice = async () => {
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=nexulv3&vs_currencies=usd,matic')
      setPriceUSD(res.data.nexulv3?.usd)
    } catch {
      console.warn('Impossible de récupérer le prix')
    }
  }

  // Fetch latest transactions via PolygonScan API
  const fetchTransactions = async () => {
    try {
      const API_KEY = '' // Optionnel: ton API key PolygonScan
      const res = await axios.get(`https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${account}&page=1&offset=5&sort=desc&apikey=${API_KEY}`)
      setTransactions(res.data.result || [])
    } catch {
      console.warn('Impossible de récupérer les transactions')
    }
  }

  useEffect(() => {
    fetchPrice()
    if (account) {
      fetchBalance()
      fetchTransactions()
    }

    window.ethereum?.on('accountsChanged', (accounts) => { setAccount(accounts[0] || null); setBalance(null) })
    window.ethereum?.on('chainChanged', () => window.location.reload())
  }, [account, network])

  const shortAccount = account ? `${account.slice(0,6)}...${account.slice(-4)}` : ''

  return (
    <section id="full-dashboard" className="max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-semibold text-white">Dashboard NexulV3 Ultime</h2>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-col gap-6 md:flex-row">

        {/* Wallet Info & Staking */}
        <div className="flex-1 flex flex-col gap-3 p-4 rounded bg-slate-900">
          {!account ? (
            <button onClick={connectWallet} className="px-4 py-2 bg-primary rounded font-medium hover:bg-sky-600 transition">
              Connect Wallet
            </button>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-200">Wallet: {shortAccount}</div>
                <div className={`text-xs ${network?.chainId === requiredChainId ? 'text-green-400' : 'text-red-500'}`}>
                  {network?.chainId === requiredChainId ? '✅ Polygon' : '⚠ Mauvais réseau'}
                </div>
              </div>
              <div className="text-sm text-slate-100 font-semibold">
                Solde NXL: {balance?.toLocaleString() ?? 'Chargement...'} {priceUSD && `(~$${(balance*priceUSD).toFixed(2)})`}
              </div>

              {/* Staking simulé */}
              <div className="mt-2 text-sm text-slate-300">
                Staking: {balance ? (balance * 0.2).toLocaleString() : '0'} NXL (20%)
              </div>
            </>
          )}
          {error && <div className="text-xs text-red-500">{error}</div>}
        </div>

        {/* Tokenomics Pie Chart */}
        <div className="flex-1 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={tokenDistribution} dataKey="value" nameKey="name" outerRadius={70} fill="#8884d8">
                {tokenDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xs text-slate-400 text-center mt-2">Distribution des tokens</div>
        </div>
      </motion.div>

      {/* Transactions */}
      {account && transactions.length > 0 && (
        <div className="mt-6 p-4 rounded bg-slate-900">
          <h3 className="text-lg font-semibold text-white">Dernières transactions</h3>
          <ul className="mt-2 text-slate-300 text-sm">
            {transactions.map((tx) => (
              <li key={tx.hash} className="py-1 border-b border-slate-800">
                {tx.from.toLowerCase() === account.toLowerCase() ? '🔻 Débit' : '🔺 Crédit'} - {ethers.formatUnits(tx.value, tokenDecimals)} NXL
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gouvernance DAO simulée */}
      {account && (
        <div className="mt-6 p-4 rounded bg-slate-900">
          <h3 className="text-lg font-semibold text-white">Gouvernance DAO</h3>
          <p className="text-slate-300 text-sm mt-1">Votez pour les propositions à venir (simulé)</p>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 transition text-sm">✅ Pour</button>
            <button className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition text-sm">❌ Contre</button>
          </div>
        </div>
      )}
    </section>
  )
}
