# AURA - Token Launcher DApp

## Project Overview
AURA is a decentralized token launcher/crowdfunding platform built for Robinhood Chain (Arbitrum Orbit L2). Users can create token presales, contribute ETH, receive NFTs representing their contribution, and participate in governance.

## Repository
- **GitHub**: https://github.com/swishh-eth/AURA
- **Live Demo**: Deployed on Vercel

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
│       ├── cloudsbackground.png  # Hero section clouds with parallax
│       ├── RightHandHero.png     # Left hand (Creation of Adam style)
│       ├── LeftHandHero.png      # Right hand
│       ├── phonestatuegraphic.png # Features section statue with scroll animation
│       ├── structuresgraphics.png # CTA section architecture graphic
│       ├── angels2.png           # Unused (available for future use)
│       ├── Pillar.png            # Decorative pillar (unused)
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
- **Hero Section**: Full viewport with hands (Creation of Adam style), animated candlestick chart between fingers, clouds background with mouse parallax
- **Stats Bar**: Total raised, tokens launched, active presales
- **Features Section**: "Why Choose AURA?" with phone statue image (smooth scroll parallax), numbered feature list (01-04) on the right
- **Featured Presales**: Green background section, 5 cards spread out (2 outside container, 3 in grid)
- **Recent Launches**: 6 token cards in 3-column grid
- **CTA Section**: "Ready to Launch?" with structure graphic (scroll parallax) on the right

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
- Middle 3 cards in max-w-7xl grid
- Outer 2 cards positioned outside container with absolute positioning
- Card width: `calc((100% - 48px) / 3)`

### Parallax Animations
Phone Statue:
```javascript
transform: `scale(1.2) translateY(${Math.max(0, Math.min(100, 100 - (scrollY - 200) * 0.15))}px)`
transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
```

Structure Graphic:
```javascript
transform: `translateY(${Math.max(0, Math.min(150, 150 - (scrollY - 800) * 0.15))}px)`
```

### Responsive Design
- All decorative graphics (hands, candlesticks, statue, structure) hidden below `lg` breakpoint (1024px)
- Mobile version needs dedicated design work (TODO)
- Cards and content are responsive

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
- Mobile-specific design and layout
- Smart contract integration
- Real wallet transactions
- On-chain chat functionality
- Governance proposals
- NFT minting for contributions
- Token claiming post-presale
