import { useState } from 'react';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import MyAnalysesPage from './pages/MyAnalysesPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import Navigation from './components/Navigation';

type Page = 'home' | 'analysis' | 'my-analyses' | 'about' | 'faq';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onAnalyzeClick={() => setCurrentPage('analysis')} />;
      case 'analysis':
        return <AnalysisPage />;
      case 'my-analyses':
        return <MyAnalysesPage />;
      case 'about':
        return <AboutPage />;
      case 'faq':
        return <FAQPage />;
      default:
        return <HomePage onAnalyzeClick={() => setCurrentPage('analysis')} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pb-20">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
