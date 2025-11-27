import { useState } from 'react';
import { FileText, MapPin, Calendar, Sprout, MessageCircle } from 'lucide-react';
import { Analysis } from '../lib/supabase';
import { useAnalysisHistory } from '../hooks/useAnalysisHistory';
import { useDebounce } from '../hooks/useDebounce';
import ChatInterface from '../components/ChatInterface';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';

export default function MyAnalysesPage() {
  const { analyses: allAnalyses, isLoading } = useAnalysisHistory();
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [chatAnalysis, setChatAnalysis] = useState<Analysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const analyses = allAnalyses.filter(analysis =>
    analysis.soil_type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (analysis.location && analysis.location.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <LoadingSpinner size="xl" text="Carregando suas análises..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-3 sm:mb-4">
          Minhas Análises
        </h1>
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-6">
          Veja todas as análises que você já fez
        </p>
        {allAnalyses.length > 0 && (
          <div className="max-w-md mx-auto">
            <SearchBar
              placeholder="Buscar por tipo de solo ou localização..."
              onSearch={setSearchQuery}
            />
          </div>
        )}
      </div>

      {analyses.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<FileText size={64} />}
            title={allAnalyses.length === 0 ? "Nenhuma Análise Ainda" : "Nenhum resultado encontrado"}
            description={allAnalyses.length === 0
              ? "Você ainda não fez nenhuma análise de solo. Comece agora!"
              : "Tente buscar por outro termo"}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((analysis) => (
            <Card
              key={analysis.id}
              onClick={() => setSelectedAnalysis(analysis)}
              padding="none"
              hoverable
            >
              <img
                src={analysis.image_url}
                alt="Solo analisado"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-green-800 mb-3">
                  {analysis.soil_type}
                </h3>
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="flex-shrink-0" />
                    <span className="truncate">{formatDate(analysis.created_at)}</span>
                  </div>
                  {analysis.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span className="truncate">{analysis.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedAnalysis && (
        <Modal
          isOpen={!!selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
          title="Detalhes da Análise"
          size="lg"
        >
          <div className="p-6 space-y-6">
              <img
                src={selectedAnalysis.image_url}
                alt="Solo analisado"
                className="w-full max-h-96 object-contain rounded-xl border border-stone-200"
              />

              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="text-lg font-bold text-stone-900 mb-2">Tipo de Solo</h3>
                <p className="text-2xl font-bold text-green-800">{selectedAnalysis.soil_type}</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-stone-200">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Características</h3>
                <ul className="space-y-3">
                  {selectedAnalysis.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-stone-700 leading-relaxed">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-700 text-white rounded-xl p-5">
                <h3 className="text-lg font-bold mb-4">Recomendações</h3>
                <ul className="space-y-3">
                  {selectedAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Sprout className="flex-shrink-0 mt-1" size={20} />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-sm text-stone-600 border-t border-stone-200 pt-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{formatDate(selectedAnalysis.created_at)}</span>
                </div>
                {selectedAnalysis.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{selectedAnalysis.location}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => {
                  setChatAnalysis(selectedAnalysis);
                  setSelectedAnalysis(null);
                }}
                variant="primary"
                size="lg"
                icon={<MessageCircle size={20} />}
                className="w-full mt-4"
              >
                Tirar Dúvidas sobre este Solo
              </Button>
            </div>
        </Modal>
      )}

      {chatAnalysis && (
        <ChatInterface
          analysisId={chatAnalysis.id}
          soilType={chatAnalysis.soil_type}
          characteristics={chatAnalysis.characteristics}
          recommendations={chatAnalysis.recommendations}
          onClose={() => setChatAnalysis(null)}
        />
      )}
    </div>
  );
}
