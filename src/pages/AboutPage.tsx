import { Heart, Users, Lightbulb, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">
          Sobre o TerraSense --
        </h1>
        <p className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
          Tecnologia simples para quem cuida da terra
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-stone-50 rounded-3xl p-8 sm:p-12 border border-green-100 mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center">
            <Heart className="text-white" size={32} />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-green-900 text-center mb-6">
          Nossa Missão
        </h2>
        <p className="text-lg text-stone-700 leading-relaxed text-center max-w-3xl mx-auto">
          Queremos ajudar agricultores familiares a entenderem melhor sua terra e melhorarem
          suas colheitas. Acreditamos que a tecnologia deve ser simples, acessível e feita
          para quem realmente trabalha no campo.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-8">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
            <Users className="text-green-700" size={28} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-4">Para Quem É</h3>
          <p className="text-stone-700 leading-relaxed">
            Criamos o TerraSense pensando em você, agricultor familiar que cuida da terra
            com dedicação. Nossa ferramenta usa linguagem simples e é fácil de usar,
            mesmo se você não tem experiência com tecnologia.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-8">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
            <Lightbulb className="text-green-700" size={28} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-4">Como Funciona</h3>
          <p className="text-stone-700 leading-relaxed">
            Usamos tecnologia de visão computacional, um tipo de Inteligência Artificial
            que analisa fotos. Você tira uma foto do seu solo, nossa IA identifica as
            características e oferece recomendações práticas para o seu plantio.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 sm:p-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
            <Target className="text-green-700" size={28} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 text-center mb-6">
          Nossos Valores
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-700 mb-2">Simplicidade</div>
            <p className="text-stone-600">
              Tecnologia que qualquer um pode usar, sem complicação
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-700 mb-2">Respeito</div>
            <p className="text-stone-600">
              Valorizamos o conhecimento e a experiência de quem trabalha na terra
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-700 mb-2">Resultado</div>
            <p className="text-stone-600">
              Focamos em soluções práticas que realmente fazem diferença
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl p-8 sm:p-10 mt-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Cultivando o Futuro, Respeitando a Tradição
        </h2>
        <p className="text-lg opacity-95 max-w-3xl mx-auto leading-relaxed">
          Sabemos que ninguém conhece a terra melhor do que quem trabalha nela todo dia.
          Nossa tecnologia está aqui para apoiar você, não para substituir sua experiência.
          Juntos, podemos fazer sua colheita ser ainda melhor.
        </p>
      </div>
    </div>
  );
}
