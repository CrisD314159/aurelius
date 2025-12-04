import ReactDOM from 'react-dom/client';
import RootPage from './pages/Main/RootPage';
import {Routes, Route  } from 'react-router';
import MainPage from './pages/Main/MainPage';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import CallPage from './pages/call/CallPage';
import SetupPage from './pages/setup/SetupPage';
import '@fontsource/inter';
import { HashRouter } from 'react-router-dom';


const root = document.getElementById('root');

const queryClient = new QueryClient()

if (!root) {
  throw new Error("Root container not found");
}

ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <Toaster/>
    <HashRouter>
      <Routes>
        <Route element={<RootPage/>}>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/call' element={<CallPage/>}/>
          <Route path='/setup' element={<SetupPage/>}/>
        </Route>
      </Routes>
    </HashRouter>
  </QueryClientProvider>
)
