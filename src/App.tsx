import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { initializeTheme } from '@/stores/theme';

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return <MainLayout />
}

export default App
