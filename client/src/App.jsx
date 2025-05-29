import { useState } from 'react';
import { GratitudeProvider } from './contexts/GratitudeContext';
import InputSection from './components/InputSection';
import HistorySection from './components/HistorySection';
import Header from './components/Header';
import ProxyTest from './components/ProxyTest';
import './styles/App.css';

function App() {
  const [activeView, setActiveView] = useState('input'); // 'input', 'history', or 'test'

  return (
    <GratitudeProvider>
      <div className="app-container">
        <Header 
          activeView={activeView} 
          setActiveView={setActiveView} 
        />
        
        <main className="main-content">
          {activeView === 'input' ? (
            <InputSection />
          ) : activeView === 'history' ? (
            <HistorySection />
          ) : (
            <ProxyTest />
          )}
        </main>
        
        {/* Test Mode Button */}
        <div className="test-mode-toggle">
          <button 
            onClick={() => setActiveView(activeView === 'test' ? 'input' : 'test')}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '10px 15px',
              backgroundColor: activeView === 'test' ? '#f44336' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: 1000
            }}
          >
            {activeView === 'test' ? 'Exit Test Mode' : 'Test Mode'}
          </button>
        </div>
      </div>
    </GratitudeProvider>
  );
}

export default App;
