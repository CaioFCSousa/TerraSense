import { useState, useRef } from 'react';
import { Camera, Upload, MapPin, CheckCircle, Sprout } from 'lucide-react';
import { analyzeImageWithGemini, AnalysisResult } from '../lib/aiAnalysis';
import { supabase } from '../lib/supabase';
import { useImageCapture } from '../hooks/useImageCapture';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Badge from '../components/Badge';

export default function AnalysisPage() {
  const { image: selectedImage, captureImage, clearImage } = useImageCapture();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [location, setLocation] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      captureImage(file);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    try {
      const result = await analyzeImageWithGemini(selectedImage);
      setAnalysisResult(result);

      await supabase.from('analyses').insert({
        image_url: selectedImage,
        soil_type: result.soilType,
        characteristics: result.characteristics,
        recommendations: result.recommendations,
        location: location || null
      });
    } catch (error) {
      console.error('Error analyzing or saving:', error);
      setAnalysisResult({
        soilType: 'Erro na análise',
        characteristics: ['Não foi possível analisar a imagem'],
        recommendations: ['Tente novamente com uma foto melhor']
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    clearImage();
    setAnalysisResult(null);
    setLocation('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-3 sm:mb-4">
          Análise Simples: É só Tirar a Foto!
        </h1>
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
          Siga os passos abaixo para receber uma análise completa do seu solo
        </p>
      </div>

      {!selectedImage && (
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6">
            Como Tirar a Foto do Solo
          </h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-700 font-bold text-sm">1</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                Limpe a superfície do solo, removendo folhas e galhos
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-700 font-bold text-sm">2</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                Tire a foto de cima, a cerca de 50cm do chão
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-700 font-bold text-sm">3</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                Certifique-se de que a foto está nítida e bem iluminada
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-700 font-bold text-sm">4</span>
              </div>
              <p className="text-stone-700 leading-relaxed">
                Se possível, tire a foto em um dia com boa luz natural
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              capture="environment"
              className="hidden"
              id="camera-input"
            />
            <label
              htmlFor="camera-input"
              className="flex items-center justify-center space-x-3 bg-green-700 hover:bg-green-800 text-white px-6 py-4 rounded-xl font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg"
            >
              <Camera size={24} />
              <span>Tirar Foto</span>
            </label>

            <input
              type="file"
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
              id="upload-input"
            />
            <label
              htmlFor="upload-input"
              className="flex items-center justify-center space-x-3 bg-stone-700 hover:bg-stone-800 text-white px-6 py-4 rounded-xl font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg"
            >
              <Upload size={24} />
              <span>Escolher da Galeria</span>
            </label>
          </div>
        </Card>
      )}

      {selectedImage && !analysisResult && (
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6">
            Foto Selecionada
          </h2>
          <img
            src={selectedImage}
            alt="Solo selecionado"
            className="w-full max-h-96 object-contain rounded-xl mb-6 border border-stone-200"
          />

          <div className="mb-6">
            <Input
              label="Localização (opcional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Sítio São João, Minas Gerais"
              icon={<MapPin size={20} />}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              icon={<Sprout size={24} />}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              {isAnalyzing ? 'Analisando com IA...' : 'Analisar Solo'}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
            >
              Trocar Foto
            </Button>
          </div>
        </Card>
      )}

      {analysisResult && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-stone-50 rounded-2xl shadow-lg border border-green-200 p-6 sm:p-10">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="text-green-700" size={32} />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-900">
                Análise Concluída!
              </h2>
            </div>

            <Card padding="md" className="mb-6 border border-green-100">
              <h3 className="text-lg font-bold text-stone-900 mb-2">Tipo de Solo</h3>
              <Badge variant="primary" size="lg">
                {analysisResult.soilType}
              </Badge>
            </Card>

            <div className="bg-white rounded-xl p-6 mb-6 border border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Características Identificadas</h3>
              <ul className="space-y-3">
                {analysisResult.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-stone-700 leading-relaxed">{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-700 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Recomendações para Seu Plantio</h3>
              <ul className="space-y-3">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Sprout className="flex-shrink-0 mt-1" size={20} />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {location && (
              <div className="bg-white rounded-xl p-4 mt-6 border border-stone-200">
                <div className="flex items-center space-x-2 text-stone-600">
                  <MapPin size={18} />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleReset}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Fazer Nova Análise
          </Button>
        </div>
      )}
    </div>
  );
}
