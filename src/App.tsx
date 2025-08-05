import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { initializeAppearance } from '@/stores/appearance';

function App() {
  useEffect(() => {
    initializeAppearance();
  }, []);

  return <MainLayout />
}

export default App
