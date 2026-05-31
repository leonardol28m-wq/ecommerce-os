import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { StoreScannerTab } from './components/scanner/StoreScannerTab';
import { BlueprintTab } from './components/blueprint/BlueprintTab';
import { ProductAnalyzerTab } from './components/product/ProductAnalyzerTab';
import { DatabaseTab } from './components/database/DatabaseTab';
import { ExportTab } from './components/export/ExportTab';
import { ToastContainer } from './components/ui/Toast';
import { useAppStore } from './store/useStore';

export default function App() {
  const { activeTab, setCurrentUrl } = useAppStore();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true })
      .then(([tab]) => { if (tab?.url) setCurrentUrl(tab.url); })
      .catch(() => setCurrentUrl(window.location.href));
  }, [setCurrentUrl]);

  const tabs: Record<string, React.ReactNode> = {
    scanner: <StoreScannerTab />,
    blueprint: <BlueprintTab />,
    product: <ProductAnalyzerTab />,
    database: <DatabaseTab />,
    export: <ExportTab />,
  };

  return (
    <div className="relative flex flex-col w-[420px] h-[600px] bg-bg-primary overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-accent-blue/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent-purple/5 blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <main className="flex-1 overflow-hidden animate-fade-in">{tabs[activeTab]}</main>
        <Navigation />
      </div>
      <ToastContainer />
    </div>
  );
}
