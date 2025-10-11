import { useState, useEffect } from 'react';
import { FileText, MapPin, Calendar, Sprout, Loader2, MessageCircle } from 'lucide-react';
import { supabase, Analysis } from '../lib/supabase';
import ChatInterface from '../components/ChatInterface';

export default function MyAnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [chatAnalysis, setChatAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-green-700 mb-4" size={48} />
          <p className="text-stone-600 text-lg">Carregando suas análises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-3 sm:mb-4">
          Minhas Análises
        </h1>
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
          Veja todas as análises que você já fez
        </p>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-10 text-center">
          <FileText className="mx-auto text-stone-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-stone-900 mb-3">
            Nenhuma Análise Ainda
          </h2>
          <p className="text-stone-600 mb-6">
            Você ainda não fez nenhuma análise de solo. Comece agora!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              onClick={() => setSelectedAnalysis(analysis)}
              className="bg-white rounded-xl shadow-md border border-stone-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
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
            </div>
          ))}
        </div>
      )}

      {selectedAnalysis && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAnalysis(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-green-900">Detalhes da Análise</h2>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="text-stone-500 hover:text-stone-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

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

              <button
                onClick={() => {
                  setChatAnalysis(selectedAnalysis);
                  setSelectedAnalysis(null);
                }}
                className="w-full mt-4 bg-green-700 text-white py-3 px-6 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center space-x-2 font-semibold"
              >
                <MessageCircle size={20} />
                <span>Tirar Dúvidas sobre este Solo</span>
              </button>
            </div>
          </div>
        </div>
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
