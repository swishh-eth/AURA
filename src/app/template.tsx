'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Check if transitioning between home and other pages
  const [shouldAnimate] = useState(() => {
    if (typeof window !== 'undefined') {
      const prevPath = sessionStorage.getItem('prevPath');
      // Animate when: home -> other page OR other page -> home
      const leavingHome = prevPath === '/' && pathname !== '/';
      const goingToHome = prevPath !== '/' && prevPath !== null && pathname === '/';
      return leavingHome || goingToHome;
    }
    return false;
  });

  // Update the stored path after render
  useEffect(() => {
    sessionStorage.setItem('prevPath', pathname);
  }, [pathname]);

  return (
    <>
      {/* Content - fade in when transitioning between home and other pages */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: shouldAnimate ? 0.15 : 0 }}
      >
        {children}
      </motion.div>

      {/* Black slide-up overlay - when leaving home */}
      {shouldAnimate && !isHome && (
        <motion.div
          className="fixed inset-x-0 top-0 bg-black pointer-events-none"
          style={{ height: '100vh', zIndex: -1 }}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      )}

    </>
  );
}
