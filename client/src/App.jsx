import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import ToastContainer from './components/common/ToastContainer';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Chatbot from './components/ai/Chatbot';
import { useToast } from './hooks/useToast';
import './index.css';

const ToastContext = React.createContext(null);
export const useToastContext = () => React.useContext(ToastContext);

function App() {
  const { toasts, addToast } = useToast();

  return (
    <ToastContext.Provider value={addToast}>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-slate-900">
          
          <Sidebar />
          
          <div className="flex-1 flex flex-col relative ml-64 overflow-hidden">
            <Navbar />
            
            <main className="flex-1 overflow-y-auto p-8 relative z-0">
              <div className="max-w-[1600px] mx-auto w-full h-full">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                </Routes>
              </div>
            </main>
          </div>
          
        </div>
        <Chatbot />
        <ToastContainer toasts={toasts} />
      </BrowserRouter>
    </ToastContext.Provider>
  );
}

export default App;
