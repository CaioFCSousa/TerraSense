import { Sprout, Camera, TrendingUp, Heart } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

interface HomePageProps {
  onAnalyzeClick: () => void;
}

export default function HomePage({ onAnalyzeClick }: HomePageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <section className="text-center mb-16 sm:mb-20">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-6">
          <Sprout className="text-green-700" size={36} />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-900 mb-4 sm:mb-6">
          Entenda Sua Terra
        </h1>
        <p className="text-lg sm:text-xl text-stone-700 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
          Análise instantânea do seu solo com Inteligência Artificial. Tire uma foto e receba
          recomendações personalizadas para sua plantação.
        </p>
        <Button
          onClick={onAnalyzeClick}
          variant="primary"
          size="lg"
          icon={<Camera size={24} />}
          className="mx-auto"
        >
          Tire uma Foto e Analise Seu Solo!
        </Button>
      </section>

      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
        <Card padding="lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Camera className="text-green-700" size={24} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">Simples e Rápido</h3>
          <p className="text-stone-600 leading-relaxed">
            Tire uma foto do seu solo e receba a análise em segundos. Não precisa de equipamentos caros.
          </p>
        </Card>

        <Card padding="lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="text-green-700" size={24} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">Recomendações Práticas</h3>
          <p className="text-stone-600 leading-relaxed">
            Receba dicas específicas sobre o que plantar e como melhorar sua colheita.
          </p>
        </Card>

        <Card padding="lg" className="sm:col-span-2 md:col-span-1">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Heart className="text-green-700" size={24} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">Feito para Você</h3>
          <p className="text-stone-600 leading-relaxed">
            Criado pensando na agricultura familiar, com linguagem simples e amigável.
          </p>
        </Card>
      </section>

      <section className="bg-gradient-to-br from-green-50 to-stone-50 rounded-3xl p-8 sm:p-12 border border-green-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-8 sm:mb-10 text-center">
          O Que Nossos Agricultores Dizem
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <Card padding="md">
            <p className="text-stone-700 mb-4 italic leading-relaxed">
              "Nunca pensei que seria tão fácil. Tirei a foto e em minutos já sabia o que
              plantar na minha terra. A colheita melhorou muito!"
            </p>
            <p className="font-semibold text-green-800">— João Silva, Minas Gerais</p>
          </Card>
          <Card padding="md">
            <p className="text-stone-700 mb-4 italic leading-relaxed">
              "Agora eu entendo minha terra. As dicas são claras e funcionam mesmo.
              Recomendo para todos os agricultores!"
            </p>
            <p className="font-semibold text-green-800">— Maria Santos, São Paulo</p>
          </Card>
        </div>
      </section>

      <section className="text-center mt-16 sm:mt-20">
        <Button
          onClick={onAnalyzeClick}
          variant="secondary"
          size="lg"
        >
          Começar Agora
        </Button>
      </section>
    </div>
  );
}
