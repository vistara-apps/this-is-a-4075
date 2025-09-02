# Solana BetHub API Documentation

This document provides comprehensive documentation for the Solana BetHub API, including endpoints, parameters, response formats, and error codes.

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Endpoints](#endpoints)
   - [Wallet](#wallet)
   - [Events](#events)
   - [Bets](#bets)
   - [Settlement](#settlement)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)

## Introduction

The Solana BetHub API allows developers to interact with the Solana BetHub platform programmatically. This API enables:

- Wallet connection and management
- Viewing and filtering betting events
- Placing and managing bets
- Retrieving bet history and statistics
- Automated bet settlement

## Authentication

Authentication is handled through Solana wallet signatures. To authenticate:

1. Generate a message to sign
2. Sign the message with the user's Solana wallet
3. Include the signature and public key in the request headers

```
X-Wallet-Public-Key: {wallet_public_key}
X-Wallet-Signature: {signature}
X-Wallet-Message: {message}
```

## Base URL

- **Production**: `https://api.solanabethub.com/v1`
- **Development**: `https://dev-api.solanabethub.com/v1`

## Endpoints

### Wallet

#### Get Wallet Balance

```
GET /wallet/balance
```

Returns the SOL balance for the authenticated wallet.

**Response:**

```json
{
  "success": true,
  "data": {
    "balance": 10.5,
    "currency": "SOL"
  }
}
```

#### Get Wallet Statistics

```
GET /wallet/stats
```

Returns betting statistics for the authenticated wallet.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalStaked": 25.5,
    "totalWinnings": 42.8,
    "activeBets": 3,
    "winRate": 65.2
  }
}
```

### Events

#### List Events

```
GET /events
```

Returns a list of betting events.

**Query Parameters:**

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| status    | string | Filter by event status (active, settled, all)    |
| limit     | number | Number of events to return (default: 10, max: 50)|
| offset    | number | Offset for pagination                            |

**Response:**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "title": "NBA Finals Game 7",
        "description": "Lakers vs Celtics - Who will win?",
        "options": ["Lakers", "Celtics"],
        "totalPool": 150.5,
        "participants": 234,
        "endTime": "2024-01-20T20:00:00Z",
        "status": "active"
      },
      // More events...
    ],
    "pagination": {
      "total": 42,
      "limit": 10,
      "offset": 0
    }
  }
}
```

#### Get Event Details

```
GET /events/{eventId}
```

Returns details for a specific event.

**Path Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| eventId   | number | Event ID    |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "NBA Finals Game 7",
    "description": "Lakers vs Celtics - Who will win?",
    "options": ["Lakers", "Celtics"],
    "totalPool": 150.5,
    "participants": 234,
    "endTime": "2024-01-20T20:00:00Z",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "outcome": null
  }
}
```

### Bets

#### Place Bet

```
POST /bets
```

Places a new bet on an event.

**Request Body:**

```json
{
  "eventId": 1,
  "outcome": "Lakers",
  "stakeAmount": 2.5
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "eventId": 1,
    "outcome": "Lakers",
    "stakeAmount": 2.5,
    "potentialPayout": 4.75,
    "status": "pending",
    "creationTimestamp": "2024-01-16T14:20:00Z",
    "signature": "2ULucf36n8gXVZ6hRKpbmwXnVTtFUxWkfn3cUxWP4HrZHRMwhfpRKSiGAMHJsC9tFsqZJnPDLEVMkTzWBPpFNT4K"
  }
}
```

#### List Bets

```
GET /bets
```

Returns a list of bets for the authenticated wallet.

**Query Parameters:**

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| status    | string | Filter by bet status (pending, won, lost, all)   |
| limit     | number | Number of bets to return (default: 10, max: 50)  |
| offset    | number | Offset for pagination                            |

**Response:**

```json
{
  "success": true,
  "data": {
    "bets": [
      {
        "id": 123,
        "eventId": 1,
        "eventTitle": "NBA Finals Game 7",
        "eventDescription": "Lakers vs Celtics - Who will win?",
        "outcome": "Lakers",
        "stakeAmount": 2.5,
        "potentialPayout": 4.75,
        "actualPayout": null,
        "status": "pending",
        "creationTimestamp": "2024-01-16T14:20:00Z",
        "settlementTimestamp": null,
        "signature": "2ULucf36n8gXVZ6hRKpbmwXnVTtFUxWkfn3cUxWP4HrZHRMwhfpRKSiGAMHJsC9tFsqZJnPDLEVMkTzWBPpFNT4K"
      },
      // More bets...
    ],
    "pagination": {
      "total": 15,
      "limit": 10,
      "offset": 0
    }
  }
}
```

#### Get Bet Details

```
GET /bets/{betId}
```

Returns details for a specific bet.

**Path Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| betId     | number | Bet ID      |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "eventId": 1,
    "eventTitle": "NBA Finals Game 7",
    "eventDescription": "Lakers vs Celtics - Who will win?",
    "outcome": "Lakers",
    "stakeAmount": 2.5,
    "potentialPayout": 4.75,
    "actualPayout": null,
    "status": "pending",
    "creationTimestamp": "2024-01-16T14:20:00Z",
    "settlementTimestamp": null,
    "signature": "2ULucf36n8gXVZ6hRKpbmwXnVTtFUxWkfn3cUxWP4HrZHRMwhfpRKSiGAMHJsC9tFsqZJnPDLEVMkTzWBPpFNT4K"
  }
}
```

### Settlement

#### Settle Bet

```
POST /bets/{betId}/settle
```

Settles a specific bet. This endpoint is typically used by the platform or authorized oracles.

**Path Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| betId     | number | Bet ID      |

**Request Body:**

```json
{
  "outcome": "Lakers"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "won",
    "actualPayout": 4.75,
    "settlementTimestamp": "2024-01-20T22:30:00Z",
    "signature": "4zLucf36n8gXVZ6hRKpbmwXnVTtFUxWkfn3cUxWP4HrZHRMwhfpRKSiGAMHJsC9tFsqZJnPDLEVMkTzWBPpFNT4K"
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request. In case of an error, the response will include an error message and code.

**Error Response Format:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid bet amount. Minimum bet amount is 0.1 SOL."
  }
}
```

**Common Error Codes:**

| Code                  | Description                                      |
|-----------------------|--------------------------------------------------|
| UNAUTHORIZED          | Authentication failed or token expired            |
| INVALID_PARAMETERS    | Invalid request parameters                       |
| INSUFFICIENT_BALANCE  | Wallet balance is insufficient for the operation |
| EVENT_NOT_FOUND       | The requested event does not exist               |
| BET_NOT_FOUND         | The requested bet does not exist                 |
| INVALID_OPERATION     | The requested operation is not valid             |
| INTERNAL_ERROR        | An internal server error occurred                |

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limits are applied on a per-IP and per-wallet basis.

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

If you exceed the rate limit, you will receive a `429 Too Many Requests` response.

## Examples

### Example 1: Placing a Bet

**Request:**

```bash
curl -X POST https://api.solanabethub.com/v1/bets \
  -H "Content-Type: application/json" \
  -H "X-Wallet-Public-Key: 4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy" \
  -H "X-Wallet-Signature: 2ULucf36n8gXVZ6hRKpbmwXnVTtFUxWkfn3cUxWP4HrZHRMwhfpRKSiGAMHJsC9tFsqZJnPDLEVMkTzWBPpFNT4K" \
  -H "X-Wallet-Message: Place bet on event 1 with outcome Lakers and stake 2.5 SOL" \
  -d '{
    "eventId": 1,
    "outcome": "Lakers",
    "stakeAmount": 2.5
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "eventId": 1,
    "outcome": "Lakers",
    "stakeAmount": 2.5,
    "potentialPayout": 4.75,
    "status": "pending",
    "creationTimestamp": "2024-01-16T14:20:00Z",
    "signature": "2ULucf36n8gXVZ6hRKpbmwXnVTtFUxWkfn3cUxWP4HrZHRMwhfpRKSiGAMHJsC9tFsqZJnPDLEVMkTzWBPpFNT4K"
  }
}
```

### Example 2: Getting Bet History

**Request:**

```bash
curl -X GET https://api.solanabethub.com/v1/bets?status=won \
  -H "X-Wallet-Public-Key: 4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy" \
  -H "X-Wallet-Signature: 3VLucf36n8gXVZ6hRKpbmwXnVTtFUxWkfn3cUxWP4HrZHRMwhfpRKSiGAMHJsC9tFsqZJnPDLEVMkTzWBPpFNT4K" \
  -H "X-Wallet-Message: Get won bets"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bets": [
      {
        "id": 120,
        "eventId": 1,
        "eventTitle": "NBA Finals Game 6",
        "eventDescription": "Lakers vs Celtics - Who will win?",
        "outcome": "Lakers",
        "stakeAmount": 1.5,
        "potentialPayout": 2.85,
        "actualPayout": 2.85,
        "status": "won",
        "creationTimestamp": "2024-01-15T10:30:00Z",
        "settlementTimestamp": "2024-01-15T22:00:00Z",
        "signature": "1ULucf36n8gXVZ6hRKpbmwXnVTtFUxWkfn3cUxWP4HrZHRMwhfpRKSiGAMHJsC9tFsqZJnPDLEVMkTzWBPpFNT4K"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 10,
      "offset": 0
    }
  }
}
```

