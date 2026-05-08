import { Route, Routes } from 'react-router';

import Background from './components/background/Background.tsx';
import { ModalProvider } from './components/modal/ModalProvider.tsx';
import { useTheme } from './hooks/useTheme.ts';
import Mainpage from './pages/mainpage/Mainpage.tsx';

function App() {
  useTheme();

  return (
    <ModalProvider>
      <Background />
      <Routes>
        <Route path='/' element={<Mainpage />}>
          <Route path='/signup' />
          <Route path='/signin' />
        </Route>
      </Routes>
    </ModalProvider>
  );
}

export default App;
