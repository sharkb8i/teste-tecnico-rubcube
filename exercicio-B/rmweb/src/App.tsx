import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import { FavoritesProvider } from './contexts/FavoritesContext';
import { SearchCategoryProvider } from './contexts/SearchCategoryContext';

function App() {
  return (
    <SearchCategoryProvider>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </FavoritesProvider>
    </SearchCategoryProvider>
  );
}

export default App;