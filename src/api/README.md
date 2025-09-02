# Solana BetHub API

This directory contains the API integration for the Solana BetHub application. The API allows the frontend to interact with the Solana blockchain and the backend services.

## Overview

The Solana BetHub API is built on top of the following technologies:

- **Solana Web3.js**: For interacting with the Solana blockchain
- **Wallet Adapter**: For connecting to Solana wallets
- **Supabase**: For off-chain data storage and retrieval

## API Structure

The API is organized into the following modules:

### Wallet API

Located in `src/utils/wallet.js`, this module provides functions for:

- Connecting to Solana wallets
- Managing wallet state
- Retrieving wallet balances
- Signing transactions

### Solana API

Located in `src/utils/solana.js`, this module provides functions for:

- Creating Solana connections
- Converting between SOL and lamports
- Getting wallet balances
- Validating Solana addresses
- Generating explorer URLs

### Bet API

Located in `src/hooks/useBetTransaction.js`, this module provides functions for:

- Placing bets on events
- Calculating potential payouts
- Settling bets
- Managing transaction state

### Event API

Located in `src/hooks/useEventOutcome.js`, this module provides functions for:

- Fetching event outcomes
- Submitting event outcomes (for oracles)
- Managing event state

### Supabase API

Located in `src/utils/supabase.js`, this module provides functions for:

- Managing user profiles
- Storing and retrieving events
- Storing and retrieving bets
- Syncing on-chain data with off-chain storage

## Usage

### Wallet Connection

```javascript
import { useWallet } from '../context/WalletContext';

function MyComponent() {
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet();
  
  const handleConnect = async () => {
    try {
      await connectWallet();
      console.log('Wallet connected:', walletAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  
  return (
    <div>
      {isConnected ? (
        <button onClick={disconnectWallet}>Disconnect Wallet</button>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

### Placing a Bet

```javascript
import { useBets } from '../context/BetContext';

function BettingComponent() {
  const { placeBet } = useBets();
  
  const handlePlaceBet = async () => {
    try {
      const result = await placeBet({
        eventId: 1,
        outcome: 'Lakers',
        stakeAmount: 2.5
      });
      
      console.log('Bet placed:', result);
    } catch (error) {
      console.error('Failed to place bet:', error);
    }
  };
  
  return (
    <button onClick={handlePlaceBet}>Place Bet</button>
  );
}
```

### Fetching Bets

```javascript
import { useBets } from '../context/BetContext';

function BetHistoryComponent() {
  const { bets } = useBets();
  
  return (
    <div>
      <h2>Your Bets</h2>
      <ul>
        {bets.map(bet => (
          <li key={bet.id}>
            {bet.eventTitle} - {bet.outcome} - {bet.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Error Handling

All API functions include proper error handling. Errors are propagated to the caller and can be caught using try/catch blocks.

```javascript
try {
  await placeBet({
    eventId: 1,
    outcome: 'Lakers',
    stakeAmount: 2.5
  });
} catch (error) {
  console.error('Error placing bet:', error.message);
  // Handle error appropriately
}
```

## Authentication

Authentication is handled through the Solana wallet. When a user connects their wallet, they are authenticated and can access their data and perform transactions.

## Further Documentation

For more detailed API documentation, please refer to the [API Documentation](../../docs/api.md).

