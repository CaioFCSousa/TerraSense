# TerraSense

## 🌱 Sistema Inteligente de Análise de Solo

Um sistema completo de análise de solo por imagem utilizando inteligência artificial, que fornece informações detalhadas sobre características físicas e químicas do solo.

## ✨ Funcionalidades

### 🔍 Análise Completa do Solo
- **Classificação de Tipo**: Identifica 9 tipos diferentes de solo
- **Análise de Textura**: Determina se o solo é arenoso, argiloso ou siltoso
- **Avaliação de Umidade**: Analisa níveis de umidade (seco, úmido, encharcado)
- **Fertilidade**: Estima o potencial de fertilidade do solo
- **Matéria Orgânica**: Avalia o conteúdo de matéria orgânica
- **Cor Dominante**: Identifica a cor predominante do solo

### 🎯 Recomendações Inteligentes
- Sugestões personalizadas baseadas nas características do solo
- Orientações para cultivo e manejo
- Recomendações de irrigação e fertilização

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python Flask**: API REST
- **TensorFlow/Keras**: Machine Learning com MobileNetV2
- **OpenCV**: Processamento de imagem
- **Scikit-learn**: Análise de dados
- **NumPy/PIL**: Manipulação de imagens

### Frontend
- **React 18**: Interface moderna
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização responsiva
- **Vite**: Build e desenvolvimento

### Machine Learning
- **MobileNetV2**: Modelo base pré-treinado
- **Transfer Learning**: Fine-tuning para solos
- **Data Augmentation**: Melhoria da generalização
- **Class Weights**: Balanceamento de classes

## 📊 Dataset

O sistema foi treinado com mais de **5.000 imagens** de diferentes tipos de solo:

- **Alluvial soil**: 693 imagens
- **Black Soil**: 1.290 imagens  
- **Red soil**: 1.232 imagens
- **Yellow Soil**: 1.401 imagens
- **Red soil**: 1.232 imagens
- **Arid Soil**: 254 imagens
- **Laterite Soil**: 225 imagens
- **Mountain Soil**: 201 imagens
- **Clay Soil**: 65 imagens
- **Cinder Soil**: 30 imagens
- **Peat Soil**: 30 imagens

## 🚀 Como Executar

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd project
npm install
npm run dev
```

## 📱 Como Usar

1. **Acesse a aplicação** no navegador
2. **Tire uma foto** do solo em boa iluminação
3. **Faça upload** da imagem
4. **Receba a análise completa** com:
   - Tipo de solo identificado
   - Características físicas (textura, umidade)
   - Características químicas (fertilidade, matéria orgânica)
   - Recomendações personalizadas

## 🔬 Algoritmos de Análise

### Análise de Textura
- **Laplacian Variance**: Detecta bordas e texturas
- **Sobel Gradient**: Analisa gradientes de intensidade
- **Classificação**: Arenoso, argiloso ou siltoso

### Análise de Umidade
- **HSV Color Space**: Análise de saturação e brilho
- **Threshold Analysis**: Classificação por níveis de umidade

### Análise de Fertilidade
- **K-means Clustering**: Identificação de cores dominantes
- **Brightness Analysis**: Solos escuros = mais férteis
- **Color-based Classification**: Alto, médio ou baixo

## 🎯 Casos de Uso

- **Agricultores**: Análise rápida de solo para decisões de cultivo
- **Pesquisadores**: Classificação inicial de tipos de solo
- **Estudantes**: Aprendizado sobre características do solo
- **Consultores**: Ferramenta de apoio para recomendações

## 🔮 Próximas Melhorias

- [ ] Histórico de análises
- [ ] Integração com APIs meteorológicas
- [ ] Análise de pH por imagem
- [ ] Recomendações de cultivos específicos
- [ ] Versão mobile nativa
- [ ] Análise de nutrientes específicos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

