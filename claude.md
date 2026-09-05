# AURA - Token Launcher DApp

## Project Overview
AURA is a decentralized token launcher/crowdfunding platform built for Robinhood Chain (Arbitrum Orbit L2). Users can create token presales, contribute ETH, receive NFTs representing their contribution, and participate in governance.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Web3**: wagmi v2 + viem
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Chain**: Robinhood Chain (Chain ID: 4663)

## Design System
- **Primary Color**: Green `#00C805`
- **Background**: Solid black `#000`
- **Text**: White with various opacities (white/60, white/40, etc.)
- **Style**: Minimalist, high contrast, clean typography
- **Borders**: White/10 or green accents
- **Hover Effects**: Green borders, shadows, lift animations

## Project Structure
```
AURA/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page with hero, features, presales
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── explore/page.tsx      # Browse all presales with filters
│   │   ├── create/page.tsx       # Create new token form
│   │   ├── dashboard/page.tsx    # User's NFTs & contributions
│   │   └── token/[address]/page.tsx  # Token detail page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Navigation with green AURA logo
│   │   │   └── Footer.tsx        # Compact footer with links
│   │   ├── web3/
│   │   │   └── ConnectButton.tsx # Wallet connection with dropdown
│   │   └── token/
│   │       └── TokenCard.tsx     # Card with image bg, hover effects
│   ├── hooks/
│   │   ├── useTokenFactory.ts    # Token creation/listing
│   │   ├── usePresale.ts         # Contribute/claim
│   │   └── useGovernance.ts      # Proposals/voting
│   ├── lib/
│   │   ├── wagmi.ts              # Wagmi config for Robinhood Chain
│   │   └── utils.ts              # Helpers (formatETH, etc.)
│   ├── mocks/
│   │   └── data.ts               # Mock tokens, NFTs, messages
│   └── types/
│       └── index.ts              # TypeScript types
├── public/
│   └── graphics/
│       ├── cloudsbackground.png  # Hero section clouds
│       ├── RightHandHero.png     # Left hand (Creation of Adam style)
│       ├── LeftHandHero.png      # Right hand
│       ├── phonestatuegraphic.png # Features section statue
│       ├── pillar.png            # Decorative pillar (unused currently)
│       └── mock/                 # Token images
│           ├── CULTDAO.jpg
│           ├── FLIGHT.jpg
│           ├── RTXGPUINU.png
│           ├── BIZ.png
│           ├── OFFICE.jpg
│           ├── GNOME.jpg
│           ├── JOE.jpg
│           └── LOWFI.jpg
└── package.json
```

## Pages & Features Implemented

### Home Page (`/`)
- **Hero Section**: Full viewport with hands (Creation of Adam style), animated candlestick chart between fingers, clouds background with parallax
- **Stats Bar**: Total raised, tokens launched, active presales
- **Features Section**: "Why Choose AURA?" with phone statue image (scroll animation), numbered feature list (01-04)
- **Featured Presales**: White background section, 5 cards spread out (2 left, 1 center, 2 right), green "FEATURED" tabs
- **Recent Launches**: 6 token cards in 3-column grid
- **CTA Section**: "Ready to Launch?" with Get Started button

### Explore Page (`/explore`)
- **Hero Header**: Gradient background with grid pattern, "Explore Presales" title
- **Search & Filters**: Search input, status filter dropdown, sort dropdown
- **Filter Buttons**: All, Active, Upcoming, Funded, Live (green when active)
- **Token Grid**: 3-column responsive grid of TokenCards

### Token Card Component
- Background image with gradient overlay
- Hover effects: lift up, green shadow, border glow, image zoom
- Progress bar with green fill
- Status badges (Active, Funded, Upcoming, Live)
- Featured variant with green tab above card

### Header
- Green "AURA" logo
- Navigation: Home, Explore, Create, Dashboard
- Gradient fade background
- Connect wallet button with dropdown (Copy Address, Dashboard, Disconnect)

### Footer
- Compact single section
- AURA branding, description, social icons
- Platform links, Resources, Network info
- Copyright and Terms/Privacy inline

## Mock Data
8 tokens with realistic meme coin data:
- CULT DAO, FlightDEX (DEX), RTX GPU INU, BIZ, OFFICE, GNOME, JOE, LOWFI
- ETH targets: 1-8 ETH
- Various statuses: active, funded, upcoming

## Key Styling Details

### TokenCard Hover Effects
```css
group-hover:-translate-y-2
group-hover:shadow-2xl
group-hover:shadow-[#00C805]/30
group-hover:border-[#00C805]
```
Background image: `opacity-50 → opacity-70`, `scale-110` on hover

### Featured Cards Layout
- Middle 3 cards align with Recent Launches grid
- Outer 2 cards positioned outside container with absolute positioning
- Same width calculated as: `calc((100% - 48px) / 3)`

### Phone Statue Animation
```javascript
transform: `translateY(calc(-50% + ${Math.max(350, Math.min(700, 700 - (scrollY - 200) * 0.7))}px)) scale(2.2)`
```
Rises up as user scrolls, with bottom fade mask

## Commands
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
```

## Notes
- Currently using mock data - ready for real contract integration
- Robinhood Chain config in `src/lib/wagmi.ts`
- All images in `/public/graphics/`
- Green accent color: `#00C805` (Robinhood green)

## Future Work
- Smart contract integration
- Real wallet transactions
- On-chain chat functionality
- Governance proposals
- NFT minting for contributions
- Token claiming post-presale
