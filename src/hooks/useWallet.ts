import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export interface Coupon {
  id: number;
  nft_token_id: number;
  code: string;
  discount_value: number;
  discount_type: string;
  valid_until: string;
}

export function useWalletCoupons() {
  const [walletAddress, setWalletAddress] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      await loadUserCoupons(address);

      // listen for account changes so we stay in sync with MetaMask
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // user disconnected from MetaMask
          disconnectWallet();
        } else {
          const newAddr = accounts[0];
          setWalletAddress(newAddr);
          loadUserCoupons(newAddr);
        }
      });

      return address;
    } else {
      alert('Please install MetaMask');
      return null;
    }
  };

  const loadUserCoupons = async (address: string) => {
    try {
      const response = await fetch(`/api/user/coupons?walletAddress=${address}`);
      const data = await response.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setCoupons([]);
  };

  // if the signed‑in user changes, wipe the connected wallet state
  useEffect(() => {
    const onUserChange = () => {
      disconnectWallet();
    };
    window.addEventListener('userChanged', onUserChange);
    return () => window.removeEventListener('userChanged', onUserChange);
  }, []);

  return {
    walletAddress,
    coupons,
    connectWallet,
    loadUserCoupons,
    setWalletAddress,
    setCoupons,
    disconnectWallet,
  };
}
