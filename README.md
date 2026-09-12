# LI.FI Route Explorer

> A cross-chain swap and bridge route exploration application built on top of the [LI.FI SDK](https://docs.li.fi/).

## Overview

**LI.FI Route Explorer** is an application designed to explore and demonstrate the capabilities of **LI.FI's interoperability infrastructure**.

The application allows users to define a token swap or cross-chain transfer and retrieve an **optimized route** through LI.FI.

The concept of an *optimal route* depends on the parameters and preferences provided to LI.FI. Depending on the use case, an optimal route can prioritize:

- 💰 Lowest cost
- ⚡ Fastest execution
- ⛽ Lower gas costs
- 💱 Better exchange rates
- 🌉 Different bridge or liquidity providers
- ⚖️ A combination of multiple optimization criteria

The main purpose of this project is not only to retrieve a route, but also to **make the complete transaction flow understandable and transparent to the user**.

Instead of hiding the complexity behind a single `Swap` button, the application exposes information such as:

- Source and destination chains
- Source and destination tokens
- Input and expected output amounts
- Bridges involved
- DEXs or other tools involved
- Number of transaction steps
- Estimated execution time
- Gas costs
- Protocol fees
- Transaction information

---

## Motivation

Cross-chain swaps are more complex than a traditional token swap.

A request such as:

```text
Swap 1 ETH on Ethereum
        ↓
Receive USDC on Arbitrum

does not necessarily correspond to a single blockchain transaction.

Depending on the route selected, the operation may involve several components:

Ethereum
   │
   ▼
DEX / Liquidity Provider
   │
   ▼
Bridge
   │
   ▼
Arbitrum
   │
   ▼
Destination Token

For an application to implement this independently, it would need to deal with multiple bridges, DEXs, liquidity sources, transaction formats, fees, gas estimation, and protocol-specific logic.

This project explores how LI.FI can abstract this complexity and provide an application with a unified interface for route discovery.

```

## High-Level Architecture

The application can be represented by the following flow:

```text
┌─────────────────────────────┐
│            User             │
│                             │
│  Source Chain               │
│  Destination Chain          │
│  Source Token               │
│  Destination Token          │
│  Amount                     │
└──────────────┬──────────────┘
               │
               │ User intent
               ▼
┌─────────────────────────────┐
│        Application          │
│                             │
│ Build route request         │
└──────────────┬──────────────┘
               │
               │ SDK request
               ▼
┌─────────────────────────────┐
│          LI.FI SDK          │
│                             │
│ Developer abstraction       │
└──────────────┬──────────────┘
               │
               │ API communication
               ▼
┌─────────────────────────────┐
│          LI.FI API          │
│                             │
│ Route discovery             │
│ Liquidity aggregation       │
│ Bridge aggregation          │
│ DEX aggregation             │
└──────────────┬──────────────┘
               │
               │ Route response
               ▼
┌─────────────────────────────┐
│       Route Explorer        │
│                             │
│ Route details               │
│ Transaction steps           │
│ Fees                        │
│ Gas estimates               │
│ Execution estimates         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│            User             │
│                             │
│ Review route                │
│ Execute transaction         │
│ manually                    │
└─────────────────────────────┘


```

## Application Flow

The application is based on a simple principle:

The user describes what they want to achieve; LI.FI determines how it can be achieved.

The flow can be divided into several stages.

### 1. User Defines the Transaction

The user specifies the desired operation.

For example:

```text
From Chain:        Ethereum
From Token:        ETH
Amount:            1 ETH

To Chain:          Arbitrum
To Token:          USDC

Conceptually:

┌──────────────────┐
│   User Intent    │
├──────────────────┤
│ From Chain       │
│ To Chain         │
│ From Token       │
│ To Token         │
│ Amount           │
└────────┬─────────┘
         │
         ▼


```

### 2. Application Builds the Request

The application converts the user's input into the structure expected by the LI.FI SDK.

For example:

```javascript
const routeRequest = {
  fromChainId: 1,
  toChainId: 42161,
  fromTokenAddress: '0x...',
  toTokenAddress: '0x...',
  fromAmount: '1000000000000000000',
  fromAddress: '0x...',
  toAddress: '0x...'
}

```

### 3. LI.FI SDK Handles the Integration

Instead of manually constructing HTTP requests against the LI.FI API, the application uses the LI.FI SDK.

The interaction can be represented as:

```text
Application
     │
     │ getRoutes(...)
     ▼
LI.FI SDK
     │
     ▼
LI.FI API

The SDK therefore acts as an abstraction layer between the application and the underlying LI.FI API.

```

### 4. LI.FI Discovers Available Routes

LI.FI evaluates possible ways to perform the requested operation.

Conceptually:

```text
                 ┌──────────────┐
                 │ User Request │
                 └───────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │    LI.FI    │
                  └──────┬──────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
           Route A    Route B    Route C
              │          │          │
              ▼          ▼          ▼
           Cheapest    Fastest   Balanced

The returned route contains the information required by the application to understand how the transaction can be performed.


```
### 5. Application Processes the Route

The application receives the route information and transforms it into a format that is useful to the end user.

Instead of exposing a large raw response, the application extracts concepts such as:

```text
Route
├── Source chain
├── Destination chain
├── Source token
├── Destination token
├── Input amount
├── Expected output
│
├── Step 1
│   ├── Tool
│   ├── Action
│   ├── Estimate
│   └── Transaction
│
├── Step 2
│   ├── Tool
│   ├── Action
│   ├── Estimate
│   └── Transaction
│
└── Overall estimate

```

### 6. Route Visualization

The application transforms the route returned by LI.FI into a human-readable transaction flow.

For example:

```text
┌───────────────────┐
│     Ethereum      │
│                   │
│       1 ETH       │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│        DEX        │
│                   │
│    ETH → USDC     │
└─────────┬─────────┘
          │
          │ USDC
          ▼
┌───────────────────┐
│      Bridge       │
│                   │
│ Ethereum →        │
│ Arbitrum          │
└─────────┬─────────┘
          │
          │ USDC
          ▼
┌───────────────────┐
│      Arbitrum     │
│                   │
│       USDC        │
└───────────────────┘

The actual route is determined dynamically by LI.FI and may contain a different number of steps and different tools.

```

## API vs SDK

A key technical aspect of this project is understanding the relationship between the LI.FI API and the LI.FI SDK.

The API represents the underlying HTTP interface.

The SDK provides a higher-level developer abstraction over that interface.

The relationship can be represented as:

```text
┌─────────────────────┐
│     Application     │
└──────────┬──────────┘
           │
           │ SDK
           ▼
┌─────────────────────┐
│      LI.FI SDK      │
│                     │
│  Abstraction Layer  │
└──────────┬──────────┘
           │
           │ HTTP
           ▼
┌─────────────────────┐
│      LI.FI API      │
└─────────────────────┘


```

## Direct API Approach

At the HTTP level, an application can communicate with the LI.FI API by providing the parameters required to describe the requested operation.

A simplified example:

```text
GET /quote

with parameters such as:

fromChain
toChain
fromToken
toToken
fromAmount
fromAddress
toAddress

For example:

GET /quote?
    fromChain=1
    &toChain=42161
    &fromToken=0x...
    &toToken=0x...
    &fromAmount=1000000000000000000
    &fromAddress=0x...
    &toAddress=0x...

A simplified response could look like:

{
  "tool": {
    "name": "Example Bridge",
    "type": "bridge"
  },
  "action": {
    "fromChainId": 1,
    "toChainId": 42161,
    "fromToken": {
      "symbol": "ETH"
    },
    "toToken": {
      "symbol": "USDC"
    },
    "fromAmount": "1000000000000000000",
    "toAmount": "..."
  },
  "estimate": {
    "toAmount": "...",
    "executionDuration": 120,
    "gasCosts": [],
    "feeCosts": []
  }
}

Note: The response above is intentionally simplified to illustrate the concept. The exact response structure depends on the LI.FI API/SDK version and the route being returned.

```

## SDK Approach

With the SDK, the application does not need to manually construct the HTTP request.

Instead, the application works with LI.FI's SDK interface.

A simplified initialization looks like:

```javascript
import { LiFi } from '@lifi/sdk'

const lifi = new LiFi({
  integrator: 'your-integrator-name'
})

```
+
```javascript
const result = await lifi.getRoutes({
  fromChainId: 1,
  toChainId: 42161,
  fromTokenAddress: '0x...',
  toTokenAddress: '0x...',
  fromAmount: '1000000000000000000',
  fromAddress: '0x...',
  toAddress: '0x...'
})

```

The important architectural difference is:

```text
Direct API
Application
     │
     ├── Build URL
     ├── Build query parameters
     ├── Send HTTP request
     ├── Handle HTTP response
     └── Parse response


SDK
Application
     │
     ▼
lifi.getRoutes(...)
     │
     ▼
LI.FI SDK
     │
     ▼
LI.FI API
     │
     ▼
Route response

The SDK therefore allows the application to operate at a higher level of abstraction.

```
## Why Use the SDK?

Using the SDK provides several advantages.

### Abstraction

The application does not need to manually manage the HTTP communication with LI.FI.

Instead of manually constructing requests, the application can work with a domain-specific interface:

```javascript
lifi.getRoutes(...)

```
### Type Safety

Because this project uses TypeScript, working with the SDK provides typed interfaces for LI.FI concepts.

This is particularly useful when working with complex objects such as:

- Routes
- Steps
- Actions
- Estimates
- Transactions
- Tokens
- Tools

### Developer Experience

The SDK allows the application to focus on the actual use case:

> Discover and present the best route for a user's transaction.

The application does not need to implement the underlying routing infrastructure itself.


```
### Maintainability

The LI.FI SDK acts as an integration boundary:

┌────────────────────────┐
│      Application       │
│                        │
│   Business / UI logic  │
└────────────┬───────────┘
             │
             │ LI.FI SDK
             ▼
┌────────────────────────┐
│         LI.FI          │
│      Infrastructure    │
└────────────────────────┘

```
## Separation of Responsibilities

One of the main architectural ideas behind this project is the separation between application responsibilities and LI.FI responsibilities.

| Responsibility | Application | LI.FI |
|---|:---:|:---:|
| Collect user input | ✅ | |
| Validate user input | ✅ | |
| Build route request | ✅ | |
| Route discovery | | ✅ |
| Bridge aggregation | | ✅ |
| DEX aggregation | | ✅ |
| Liquidity discovery | | ✅ |
| Route optimization | | ✅ |
| Cost estimation | | ✅ |
| Execution estimation | | ✅ |
| Route visualization | ✅ | |
| User experience | ✅ | |
| Wallet interaction | 🔜 | |
| Transaction execution | 🔜 | |

This separation allows the application to remain focused on the user experience and presentation of cross-chain operations, while LI.FI provides the underlying routing infrastructure.

```
```

## Current Scope

The current implementation focuses on:

```text
┌─────────────────────┐
│    User Intent      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│   Route Discovery   │
│      LI.FI SDK      │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│   Route Analysis    │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Route Visualization │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Manual Execution    │
│       User          │
└─────────────────────┘

The application currently does not automatically execute the transaction.

The user can inspect the route and its details before manually executing the required transaction.

```
## Current Transaction Flow

The current implementation intentionally separates route discovery from transaction execution.

```text
User
 │
 │ Transaction intent
 ▼
Application
 │
 │ Route request
 ▼
LI.FI SDK
 │
 │ Route
 ▼
Application
 │
 │ Display route
 ▼
User
 │
 │ Review
 ▼
Manual execution

The application does not currently automatically submit the transaction on behalf of the user.

This makes route discovery and route analysis the primary focus of the current implementation.

```
## Future Execution Flow

A future version can extend the application to support transaction execution through the LI.FI SDK.

The desired flow is:

```text
User
 │
 │ Transaction intent
 ▼
Application
 │
 ▼
LI.FI SDK
 │
 ├── Route discovery
 │
 └── Transaction preparation
          │
          ▼
       Wallet
          │
          │ User approval
          ▼
      Blockchain
          │
          ▼
   Bridge / DEX / Protocol
          │
          ▼
 Destination Chain

This would allow the application to provide a complete experience:

```text
Intent
  ↓
Route Discovery
  ↓
Route Selection
  ↓
Transaction Preparation
  ↓
Wallet Approval
  ↓
Execution
  ↓
Transaction Tracking
  ↓
Completion

```
## Project Structure

A possible project structure is:

```text
src/
├── app/
│    ├──App.tsx
│    └──components/
│       ├── Header.tsx
│       ├── HeroSectionBottom.tsx
│       ├── HeroSectionTop.tsx
│       └── StepCard.tsx
│
├── conifg/
│   └── chains.ts
│   
├── services/
│   └── lifi.ts
│
├── types/
│   └── appTypes.ts
│
├── utils/
│   └── helpers.ts
│
└── main.tsx

The exact structure may differ depending on the implementation.

```
## Getting Started

### Prerequisites

Make sure you have:

- Node.js
- npm
- A browser

For future transaction execution, a compatible Web3 wallet will also be required.

### Installation

```bash
git clone <repository-url>

cd <repository-name>

npm install

```

### Run the Application
```bash
npm run dev

```
Interfaces


```
```

## Current Status

```
```

### Implemented

- LI.FI SDK integration
- Route discovery
- Cross-chain route retrieval
- Swap route retrieval
- Route visualization
- Transaction-step visualization
- Fee information
- Gas information
- Execution estimates
- Manual transaction flow

### Planned

- Wallet integration
- Direct transaction execution
- Transaction status tracking
- Transaction history
- Route comparison
- Advanced route filtering
- Execution progress
- Improved error handling


## Engineering Focus

This project demonstrates several software-engineering concepts:

- API and SDK integration
- TypeScript development
- Asynchronous data fetching
- API response modeling
- Domain-oriented application design
- Cross-chain transaction concepts
- Route visualization
- Error handling
- Separation of concerns
- Third-party infrastructure integration

The architecture intentionally keeps the LI.FI integration separate from the presentation layer so that the application can evolve independently.

## Design Principle

The core architectural principle of the project is:

> The application owns the user experience; LI.FI provides the infrastructure for discovering and eventually executing complex cross-chain routes.

In other words:

```text
┌──────────────────────────────┐
│          Application         │
│                              │
│ User experience              │
│ User input                   │
│ Route visualization          │
│ Transaction presentation     │
└──────────────┬───────────────┘
               │
               ▼
        ┌─────────────┐
        │  LI.FI SDK  │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │  LI.FI API  │
        └──────┬──────┘
               │
        ┌──────┼──────┐
        ▼      ▼      ▼
      DEXs   Bridges  Liquidity

This approach allows the project to demonstrate how a software application can consume sophisticated interoperability infrastructure through a developer-friendly SDK without having to implement the underlying routing and protocol integrations itself.

```

## References

- [LI.FI Documentation](https://docs.li.fi/)
- [LI.FI SDK](https://docs.li.fi/sdk/overview)
- [LI.FI API Reference](https://docs.li.fi/api-reference/introduction)
