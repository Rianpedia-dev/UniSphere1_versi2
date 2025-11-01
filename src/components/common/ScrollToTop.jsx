import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Gulir ke atas saat path berubah
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Gunakan 'auto' jika Anda ingin guliran instan
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;