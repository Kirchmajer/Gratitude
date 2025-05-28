import { useGratitude } from '../contexts/GratitudeContext';
import '../styles/Header.css';

const Header = ({ activeView, setActiveView }) => {
  const { resetInputState } = useGratitude();

  const handleViewChange = (view) => {
    if (view === 'input' && activeView !== 'input') {
      resetInputState(); // Reset input state when switching to input view
    }
    setActiveView(view);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Gratitude</h1>
        <p className="tagline">Cultivate happiness through daily appreciation</p>
      </div>
      
      <nav className="nav">
        <button 
          className={`nav-button ${activeView === 'input' ? 'active' : ''}`}
          onClick={() => handleViewChange('input')}
        >
          New Entry
        </button>
        <button 
          className={`nav-button ${activeView === 'history' ? 'active' : ''}`}
          onClick={() => handleViewChange('history')}
        >
          History
        </button>
      </nav>
    </header>
  );
};

export default Header;
