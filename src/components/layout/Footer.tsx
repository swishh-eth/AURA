import Link from 'next/link';
import { Github, Twitter, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="w-full px-10 lg:px-16 py-10">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* Left Side - Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block mb-3">
              <span className="text-2xl font-bold text-[#00C805]">AURA</span>
            </Link>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs mb-4">
              The decentralized token launcher on Robinhood Chain.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#00C805] hover:text-[#00C805] text-white/50 transition-all duration-300"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#00C805] hover:text-[#00C805] text-white/50 transition-all duration-300"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-white/25">
              <span>&copy; 2024 AURA Protocol</span>
              <span>·</span>
              <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
              <span>·</span>
              <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            </div>
          </div>

          {/* Right Side - Links */}
          <div className="flex flex-wrap gap-16">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/explore" className="text-white/40 hover:text-[#00C805] transition-colors">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="text-white/40 hover:text-[#00C805] transition-colors">
                    Create Token
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-white/40 hover:text-[#00C805] transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-3">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="text-white/40 hover:text-[#00C805] transition-colors inline-flex items-center gap-1">
                    Documentation
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/40 hover:text-[#00C805] transition-colors inline-flex items-center gap-1">
                    Contracts
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/40 hover:text-[#00C805] transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-3">Network</h4>
              <p className="text-white/40 text-xs mb-1">Powered by</p>
              <p className="text-sm font-semibold text-white">Robinhood Chain</p>
              <p className="text-white/30 text-xs">Arbitrum Orbit L2</p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
