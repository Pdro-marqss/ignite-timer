import { Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { History } from './pages/History';
import { DefaultLayout } from './layouts/Default.layout';

export function Router() {
  return (
    <Routes>
      {/* Aplica pra todas as rotas o layout default e aloca o conteudo no <Outlet /> do componente */}
      <Route path='/' element={<DefaultLayout />} >
        <Route path='/' element={<Home />} />
        <Route path='/history' element={<History />} />
      </Route>
    </Routes>
  );
}