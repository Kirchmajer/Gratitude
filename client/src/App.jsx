import { useState } from 'react';
import { GratitudeProvider } from './contexts/GratitudeContext';
import InputSection from './components/InputSection';
import HistorySection from './components/HistorySection';
import Header from './components/Header';
import ProxyTest from './components/ProxyTest';
import DatabaseTest from './components/DatabaseTest';
import ApiTest from './components/ApiTest';
import './styles/App.css';

function App() {
  const [activeView, setActiveView] = useState('input'); // 'input', 'history', or 'test'
  const [activeTest, setActiveTest] = useState('proxy'); // 'proxy', 'database', or 'api'

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
          ) : activeView === 'test' ? (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '20px',
                gap: '10px'
              }}>
                <button 
                  onClick={() => setActiveTest('proxy')}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: activeTest === 'proxy' ? '#2196F3' : '#e0e0e0',
                    color: activeTest === 'proxy' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Proxy Test
                </button>
                <button 
                  onClick={() => setActiveTest('database')}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: activeTest === 'database' ? '#2196F3' : '#e0e0e0',
                    color: activeTest === 'database' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Database Test
                </button>
                <button 
                  onClick={() => setActiveTest('api')}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: activeTest === 'api' ? '#2196F3' : '#e0e0e0',
                    color: activeTest === 'api' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  API Test
                </button>
              </div>
              
              {activeTest === 'proxy' ? <ProxyTest /> : 
               activeTest === 'database' ? <DatabaseTest /> : <ApiTest />}
            </div>
          ) : (
            <div>Error: Unknown view</div>
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
