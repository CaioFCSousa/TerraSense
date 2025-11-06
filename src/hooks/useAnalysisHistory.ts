import { useState, useEffect } from 'react';
import { supabase, Analysis } from '../lib/supabase';

export function useAnalysisHistory() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalyses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAnalyses(data || []);
    } catch (err) {
      console.error('Error loading analyses:', err);
      setError('Erro ao carregar análises');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, []);

  const refresh = () => {
    loadAnalyses();
  };

  return {
    analyses,
    isLoading,
    error,
    refresh
  };
}
