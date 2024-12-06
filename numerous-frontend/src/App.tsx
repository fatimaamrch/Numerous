import React from 'react';
import { Provider } from '@/components/ui/provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
