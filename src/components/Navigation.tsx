import { Menu, X, Home, Camera, FileText, Info, HelpCircle } from 'lucide-react';
import { useState } from 'react';

type Page = 'home' | 'analysis' | 'my-analyses' | 'about' | 'faq';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home' as Page, label: 'Início', icon: Home },
    { id: 'analysis' as Page, label: 'Analisar Solo', icon: Camera },
    { id: 'my-analyses' as Page, label: 'Minhas Análises', icon: FileText },
    { id: 'about' as Page, label: 'Sobre', icon: Info },
    { id: 'faq' as Page, label: 'FAQ', icon: HelpCircle },
  ];

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-green-800">TerraSense</h1>
                <p className="text-xs text-stone-600">Plante Melhor. Colha Mais.</p>
              </div>
            </button>

            <div className="hidden md:flex space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-green-100 text-green-800'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-full max-w-sm ml-auto h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-green-100 text-green-800'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
