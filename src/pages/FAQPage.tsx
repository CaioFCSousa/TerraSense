import { useState } from 'react';
import { ChevronDown, BookOpen, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface GlossaryItem {
  term: string;
  definition: string;
}

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [openGlossary, setOpenGlossary] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'Como funciona a análise do solo?',
      answer: 'Nossa tecnologia usa Inteligência Artificial para analisar a foto do seu solo. A IA identifica características como cor, textura e composição, e compara com um banco de dados de diferentes tipos de solo para oferecer recomendações personalizadas.'
    },
    {
      question: 'Preciso de equipamentos especiais?',
      answer: 'Não! Você só precisa de um celular com câmera. Tire uma foto clara e bem iluminada do seu solo, e nossa IA faz o resto. É simples e rápido.'
    },
    {
      question: 'As recomendações funcionam para qualquer região?',
      answer: 'Sim! Nossa IA foi treinada com informações de solos de diversas regiões do Brasil. As recomendações levam em conta o tipo de solo identificado e são aplicáveis em diferentes climas e localizações.'
    },
    {
      question: 'Posso guardar minhas análises antigas?',
      answer: 'Sim! Todas as suas análises ficam salvas na página "Minhas Análises". Você pode voltar e consultar sempre que quiser, comparar resultados e acompanhar a evolução do seu solo.'
    },
    {
      question: 'O serviço é pago?',
      answer: 'O TerraSense foi criado para ajudar agricultores familiares. Entre em contato conosco para saber mais sobre como acessar a plataforma.'
    },
    {
      question: 'E se eu não souber usar o celular muito bem?',
      answer: 'Não se preocupe! Fizemos tudo o mais simples possível. São apenas três passos: tirar a foto, enviar, e receber o resultado. Se tiver dúvidas, peça ajuda a algum familiar ou vizinho na primeira vez.'
    },
    {
      question: 'A análise substitui um agrônomo?',
      answer: 'Não. Nossa ferramenta é um apoio para você tomar decisões melhores, mas não substitui a consulta com um profissional especializado. Para questões complexas, sempre procure orientação técnica.'
    },
    {
      question: 'Qual o melhor horário para tirar a foto?',
      answer: 'O ideal é tirar a foto durante o dia, com boa luz natural. Evite horários com sombras muito fortes ou quando estiver muito escuro. Uma foto clara ajuda a IA a fazer uma análise mais precisa.'
    }
  ];

  const glossary: GlossaryItem[] = [
    {
      term: 'Solo Argiloso',
      definition: 'Solo que tem muita argila na composição. É mais pesado, gruda quando molhado e retém bastante água. Geralmente é fértil e bom para várias culturas.'
    },
    {
      term: 'Solo Arenoso',
      definition: 'Solo com muita areia, mais leve e solto. A água passa fácil por ele, então seca mais rápido. Precisa de mais adubo e irrigação frequente.'
    },
    {
      term: 'Solo Humoso',
      definition: 'Solo rico em matéria orgânica (restos de plantas e animais decompostos). É bem escuro, fofo e muito fértil. Excelente para plantação.'
    },
    {
      term: 'Matéria Orgânica',
      definition: 'Restos de plantas, folhas, esterco e outros materiais naturais que se decompõem e enriquecem o solo com nutrientes.'
    },
    {
      term: 'Drenagem',
      definition: 'Capacidade do solo de deixar a água passar. Boa drenagem significa que a água não fica empoçada. Drenagem ruim pode afogar as raízes das plantas.'
    },
    {
      term: 'pH do Solo',
      definition: 'Medida que indica se o solo é ácido, neutro ou alcalino. Cada planta prefere um tipo de pH. O pH ideal para a maioria das plantas fica entre 6 e 7.'
    },
    {
      term: 'Adubação',
      definition: 'Processo de adicionar nutrientes ao solo para deixá-lo mais fértil. Pode ser feita com adubo orgânico (natural) ou químico (industrializado).'
    },
    {
      term: 'Rotação de Culturas',
      definition: 'Prática de plantar diferentes culturas no mesmo local em épocas diferentes. Ajuda a manter o solo saudável e evita pragas.'
    },
    {
      term: 'Cobertura Morta',
      definition: 'Camada de palha, folhas secas ou outro material colocado sobre o solo. Ajuda a manter a umidade, controlar ervas daninhas e proteger o solo.'
    },
    {
      term: 'Composto Orgânico',
      definition: 'Adubo natural feito da decomposição de restos vegetais e outros materiais orgânicos. Rico em nutrientes e melhora a estrutura do solo.'
    },
    {
      term: 'Erosão',
      definition: 'Desgaste do solo causado pela água da chuva ou vento. Leva embora a camada fértil da terra. Pode ser evitada com cobertura vegetal e práticas corretas.'
    },
    {
      term: 'Textura do Solo',
      definition: 'Característica relacionada ao tamanho das partículas do solo (areia, silte, argila). Influencia como o solo retém água e nutrientes.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">
          Perguntas Frequentes e Glossário
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Tire suas dúvidas e aprenda termos importantes sobre solo e agricultura
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 sm:p-8 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="text-green-700" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-stone-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-stone-50 transition-colors"
              >
                <span className="font-semibold text-stone-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`flex-shrink-0 text-green-700 transition-transform ${
                    openFAQ === index ? 'transform rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              {openFAQ === index && (
                <div className="px-4 sm:px-5 pb-5 text-stone-700 leading-relaxed border-t border-stone-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BookOpen className="text-green-700" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">Glossário</h2>
        </div>

        <p className="text-stone-600 mb-6">
          Termos agrícolas explicados de forma simples
        </p>

        <div className="space-y-3">
          {glossary.map((item, index) => (
            <div
              key={index}
              className="border border-stone-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenGlossary(openGlossary === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-stone-50 transition-colors"
              >
                <span className="font-semibold text-green-800 pr-4">{item.term}</span>
                <ChevronDown
                  className={`flex-shrink-0 text-green-700 transition-transform ${
                    openGlossary === index ? 'transform rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              {openGlossary === index && (
                <div className="px-4 sm:px-5 pb-5 text-stone-700 leading-relaxed border-t border-stone-100 pt-4">
                  {item.definition}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-6 sm:p-8 mt-8 border border-green-200">
        <h3 className="text-xl font-bold text-green-900 mb-3">Ainda tem dúvidas?</h3>
        <p className="text-stone-700 leading-relaxed">
          Estamos aqui para ajudar! Se você não encontrou a resposta que procurava,
          sinta-se à vontade para fazer uma nova análise e experimentar nossa ferramenta.
          Quanto mais você usa, mais fácil fica!
        </p>
      </div>
    </div>
  );
}
