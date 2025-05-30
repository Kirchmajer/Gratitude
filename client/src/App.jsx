import { useState } from 'react';
import { GratitudeProvider } from './contexts/GratitudeContext';
import InputSection from './components/InputSection';
import HistorySection from './components/HistorySection';
import Header from './components/Header';
import ProxyTest from './components/ProxyTest';
import DatabaseTest from './components/DatabaseTest';
import ApiTest from './components/ApiTest';
import TestTargetedQuestion from './components/TestTargetedQuestion';
import TestGratitudeStatements from './components/TestGratitudeStatements';
import TestInputAnalysis from './components/TestInputAnalysis';
import './styles/App.css';

function App() {
  const [activeView, setActiveView] = useState('input'); // 'input', 'history', or 'test'
  const [activeTest, setActiveTest] = useState('proxy'); // 'proxy', 'database', 'api', 'targeted-question', 'gratitude-statements', or 'input-analysis'

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
                gap: '10px',
                flexWrap: 'wrap'
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
                <button 
                  onClick={() => setActiveTest('targeted-question')}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: activeTest === 'targeted-question' ? '#2196F3' : '#e0e0e0',
                    color: activeTest === 'targeted-question' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Targeted Question Test
                </button>
                <button 
                  onClick={() => setActiveTest('gratitude-statements')}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: activeTest === 'gratitude-statements' ? '#2196F3' : '#e0e0e0',
                    color: activeTest === 'gratitude-statements' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Gratitude Statements Test
                </button>
                <button 
                  onClick={() => setActiveTest('input-analysis')}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: activeTest === 'input-analysis' ? '#2196F3' : '#e0e0e0',
                    color: activeTest === 'input-analysis' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Input Analysis Test
                </button>
              </div>
              
              {activeTest === 'proxy' ? <ProxyTest /> : 
               activeTest === 'database' ? <DatabaseTest /> : 
               activeTest === 'api' ? <ApiTest /> :
               activeTest === 'targeted-question' ? <TestTargetedQuestion /> :
               activeTest === 'gratitude-statements' ? <TestGratitudeStatements /> :
               <TestInputAnalysis />}
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
