import { Route, Routes } from 'react-router';

import Background from './components/background/Background.tsx';
import { ModalProvider } from './components/modal/ModalProvider.tsx';
import Mainpage from './pages/mainpage/Mainpage.tsx';

function App() {
  return (
    <ModalProvider>
      <Routes>
        <Route path='/' element={<Mainpage />}>
          <Route path='/signup' />
          <Route path='/signin' />
        </Route>
        <Route path='/background' element={<Background />} />
      </Routes>
    </ModalProvider>
  );
}

export default App;
