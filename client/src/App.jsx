import { useState } from 'react';
import { GratitudeProvider } from './contexts/GratitudeContext';
import InputSection from './components/InputSection';
import HistorySection from './components/HistorySection';
import Header from './components/Header';
import './styles/App.css';

function App() {
  const [activeView, setActiveView] = useState('input'); // 'input' or 'history'

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
          ) : (
            <HistorySection />
          )}
        </main>
      </div>
    </GratitudeProvider>
  );
}

export default App;
