
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface WalletConnectionProps {
  isConnected: boolean;
  walletAddress: string;
  onConnectionChange: (connected: boolean, address: string) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  isConnected,
  walletAddress,
  onConnectionChange
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed! Please install MetaMask extension first.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Store connection status
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', address);
        
        onConnectionChange(true, address);
        
        console.log('Wallet connected successfully:', address);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    onConnectionChange(false, '');
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <Badge 
          variant="outline" 
          className="bg-green-500/20 border-green-500/30 text-green-400 px-3 py-1"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Connected
        </Badge>
        
        <div className="text-sm text-white">
          {formatAddress(walletAddress)}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold"
    >
      {isConnecting ? (
        <div className="flex items-center">
          <Wallet className="animate-pulse h-4 w-4 mr-2" />
          Connecting...
        </div>
      ) : (
        <div className="flex items-center">
          <Wallet className="h-4 w-4 mr-2" />
          Connect MetaMask
        </div>
      )}
    </Button>
  );
};

export default WalletConnection;
