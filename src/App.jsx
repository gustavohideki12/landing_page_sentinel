import React, { useEffect, useId, useRef, useState } from 'react';
import { CaseScene, GapScene, PresenterPanel } from './StoryScenes';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BookOpen,
  BrainCircuit, CalendarDays, Check, CheckCheck, ChevronRight, CircleHelp,
  ClipboardList, Clock3, Fingerprint, HeartPulse, LockKeyhole, MessageCircle,
  Maximize2, Minimize2, Pause, Play, RotateCcw, Settings2,
  ShieldCheck, Sparkles, Users, Scale, FileText, Database, Home, Award, UploadCloud, X, ZoomIn, ZoomOut,
} from 'lucide-react';

const sources = {
  brasil: 'https://www.inca.gov.br/sites/ufu.sti.inca.local/files/media/document/ata_comite_de_governanca_26.05.2025.pdf#page=21',
  nr28: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-28-nr-28',
  nr1: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1',
  rag: 'https://arxiv.org/abs/2005.11401',
};

const chapters = [
  { title: 'Abertura', icon: HeartPulse }, { title: 'O problema', icon: BarChart3 },
  { title: 'A lacuna', icon: CircleHelp }, { title: 'A solução', icon: ShieldCheck },
  { title: 'Produto', icon: Play }, { title: 'IA + contexto', icon: BrainCircuit },
  { title: 'Na prática', icon: Users }, { title: 'O valor', icon: CheckCheck },
];
const sceneSlugs = ['abertura', 'problema', 'lacuna', 'solucao', 'produto', 'inteligencia', 'na-pratica', 'valor'];
const sceneFromHash = () => Math.max(0, sceneSlugs.indexOf(window.location.hash.slice(1)));

const media = {
  painel: { file: 'dashboard-v2', size: [894, 859], crop: [20, 112, 855, 473] },
  graficos: { file: 'dashboard-v2', size: [894, 859], crop: [20, 604, 855, 255] },
  contexto: { file: 'contexto-v2', size: [1914, 902], crop: [445, 350, 1280, 493] },
  inicio: { file: 'inicio-v2', size: [1917, 905], crop: [445, 94, 1280, 455] },
  ciclos: { file: 'ciclo-v2', size: [1092, 815], crop: [25, 40, 1027, 533] },
  criar: { file: 'criar-ciclo', size: [532, 657], crop: [8, 13, 512, 636] },
  kanban: { file: 'kanban-v2', size: [1353, 758], crop: [40, 177, 1280, 356] },
  plano: { file: 'plano-v2', size: [575, 854], crop: [8, 0, 557, 465] },
  plano5w2h: { file: 'plano-v2', size: [575, 854], crop: [8, 500, 557, 345] },
  referencias: { file: 'metodologia', size: [888, 867], crop: [20, 16, 855, 493] },
  dossie: { file: 'dossie', size: [1113, 783], crop: [50, 118, 1018, 602] },
  denuncias: { file: 'denuncias', size: [902, 748], crop: [21, 9, 855, 721] },
};

const steps = [
  { title: 'Início', group: 'Preparar', heading: 'O ponto de partida do RH.', icon: Home, image: 'inicio', tags: ['Visão do gestor', 'Jornada integrada'], value: 'Tudo conectado', notes: ['Pesquisas, indicadores e ações', 'Um só ambiente para o RH'] },
  { title: 'Empresa', group: 'Preparar', heading: 'A realidade da empresa entra na análise.', icon: Settings2, image: 'contexto', tags: ['Perfil', 'Orçamento', 'Restrições'], value: 'Contexto real', notes: ['Porte e regime de trabalho', 'Recursos disponíveis', 'Limites para as recomendações'] },
  { title: 'Base de conhecimento', group: 'Preparar', heading: 'A IA conhece as regras da empresa.', icon: Database, image: 'knowledge', tags: ['Documentos internos', 'RAG', 'Contexto'], value: 'Recomendações situadas', notes: ['Políticas e procedimentos', 'Padrões e limites internos', 'Trechos relevantes recuperados para a IA'] },
  { title: 'Criar pesquisa', group: 'Escutar', heading: 'Escolher o instrumento. Convidar a equipe.', icon: ClipboardList, image: 'criar', tags: ['Colaboradores', 'Setores', 'Questionários'], value: 'Escuta estruturada', notes: ['COPSOQ II/III, JSS ou OLBI', 'Colaboradores vinculados à pesquisa', 'Respostas anônimas'] },
  { title: 'Acompanhar ciclo', group: 'Escutar', heading: 'Acompanhar hoje. Comparar depois.', icon: RotateCcw, image: 'ciclos', tags: ['Adesão', 'Histórico', 'Reavaliação'], value: 'Evolução comparável', notes: ['Gerenciar respostas e participação', 'Reaplicar o mesmo instrumento', 'Comparar as coletas e verificar a evolução'] },
  { title: 'Dashboard', group: 'Agir', heading: 'Enxergar onde a atenção é mais urgente.', icon: BarChart3, image: 'painel', tags: ['Dimensões', 'Setores', 'Prioridades'], value: 'Riscos visíveis', notes: ['Ritmo de trabalho e exigências', 'Índices e ranking de dimensões', 'Visão agregada para orientar o RH'] },
  { title: 'Plano de ação', group: 'Agir', heading: 'A IA sugere. O gestor decide.', icon: BrainCircuit, image: 'plano', tags: ['IA + RAG', '5W2H', 'Revisão humana'], value: 'Ação viável', notes: ['Aprovar ou rejeitar a recomendação', 'Custos, prazos e capacidade', 'Assistente de IA para esclarecer dúvidas'] },
  { title: 'Kanban', group: 'Agir', heading: 'Do plano à execução acompanhada.', icon: CheckCheck, image: 'kanban', tags: ['Tarefas', 'Responsáveis', 'Etapas'], value: 'Execução visível', notes: ['Desdobrar os planos em tarefas', 'Acompanhar responsáveis e status', 'Registrar o andamento das ações'] },
  { title: 'Dossiê e certificado', group: 'Acompanhar', heading: 'Transformar o processo em evidências.', icon: FileText, image: 'dossie', tags: ['Inventário', 'NR-1', 'Certificado Sentinel'], value: 'Gestão documentada', notes: ['Inventário de riscos e medidas', 'Certificado por nível de evidência', 'Reavaliação e melhora enriquecem o registro'] },
  { title: 'Denúncia anônima', group: 'Acompanhar', heading: 'Ouvir os sinais entre uma pesquisa e outra.', icon: MessageCircle, image: 'denuncias', tags: ['Anonimato', 'Acolhimento', 'Acompanhamento'], value: 'Escuta contínua', notes: ['Relatos de assédio e conflitos', 'Classificar e acompanhar ocorrências', 'Identificar situações que exigem atenção'] },
];

function Brand({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="Sentinel, início"><span className="brand-mark" aria-hidden="true" /><span>Sentinel<span className="brand-dot">.</span></span></button>;
}

function TagRow({ items }) {
  return <div className="tag-row">{items.map((item) => <span key={item}><Check size={12} />{item}</span>)}</div>;
}

function SceneTitle({ index, eyebrow, title, children }) {
  return <div className="scene-heading"><div><span className="eyebrow"><span>{index}</span>{eyebrow}</span><h2>{title}</h2></div>{children}</div>;
}

function Dialog({ title, onClose, children, controls, className = '' }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) onClose(); }}>
    <div className="dialog-content"><div className="dialog-heading"><div><span className="eyebrow">SENTINEL</span><h3 id={titleId}>{title}</h3></div><div className="dialog-controls">{controls}<button className="icon-button" onClick={onClose} aria-label="Fechar" title="Fechar"><X size={20} /></button></div></div>{children}</div>
  </dialog>;
}

function ImageDialog({ selected, onClose }) {
  const [zoom, setZoom] = useState(false);
  return <Dialog title={selected.title} onClose={onClose} className="image-dialog" controls={<button className="icon-button" onClick={() => setZoom(!zoom)} aria-label={zoom ? 'Ajustar à tela' : 'Tamanho original'} title={zoom ? 'Ajustar à tela' : 'Tamanho original'}>{zoom ? <ZoomOut size={20} /> : <ZoomIn size={20} />}</button>}><div className={`original-image ${zoom ? 'zoomed' : ''}`}><img src={`/images/${selected.file}.png`} alt={selected.title} onClick={() => setZoom(!zoom)} /></div></Dialog>;
}

function SourcesDialog({ onClose }) {
  return <Dialog title="Fontes e projeto" onClose={onClose} className="sources-dialog"><div className="source-list">
    <a href={sources.brasil} target="_blank" rel="noreferrer"><span>01</span><div><b>Afastamentos por saúde mental · MPS / INCA</b><p>Série apresentada pelo INCA em maio de 2025: 201.864 em 2022, 283.471 em 2023 e 472.328 em 2024.</p></div><ArrowUpRight size={18} /></a>
    <a href={sources.nr1} target="_blank" rel="noreferrer"><span>02</span><div><b>NR-1 · Ministério do Trabalho e Emprego</b><p>Inclusão expressa dos fatores psicossociais no GRO: vigência em 26 de maio de 2026, após a prorrogação pela Portaria MTE nº 765/2025.</p></div><ArrowUpRight size={18} /></a>
    <a href={sources.nr28} target="_blank" rel="noreferrer"><span>03</span><div><b>NR-28 · Fiscalização e penalidades</b><p>Multas graduadas conforme a infração, o número de empregados e o enquadramento em segurança ou medicina do trabalho. Não existe um valor único de multa para a NR-1.</p></div><ArrowUpRight size={18} /></a>
    <a href={sources.rag} target="_blank" rel="noreferrer"><span>04</span><div><b>RAG · Lewis et al., 2020</b><p>Referência do conceito de geração aumentada por recuperação: recuperar informações externas para contextualizar a geração. Não é uma validação da implementação do Sentinel.</p></div><ArrowUpRight size={18} /></a>
    <p className="source-note">A série representa registros de afastamentos, não pessoas únicas. Abrange transtornos mentais e comportamentais; não apenas burnout e não necessariamente causados pelo trabalho. Dados nacionais de 2022–2024. Série INCA, NR-1 e NR-28 verificadas em 19/10/2026.</p>
    <div className="team-note"><b>Instituto Mauá de Tecnologia · Sistemas de Informação</b><p>Bruno Storti Occhiuto · Gustavo Hideki Arakaki · João Vitor Alvarez Teixeira · Pedro Victor Miyasaki Bertolucci · Pedro Wagner Rocha Silva.</p><p>Projeto acadêmico em desenvolvimento. Prints de ambiente demonstrativo; RAG já integrado conforme informações dos autores. As animações ilustram o fluxo, sem chamada à IA ou ao backend. A comparação depende de duas coletas. Não há validação longitudinal de redução de afastamentos ou rotatividade.</p></div>
  </div></Dialog>;
}

function ImpactScene() {
  return <section className="scene impact-scene" aria-label="Abertura de impacto">
    <div className="impact-heading"><span className="eyebrow"><span>01</span>ANTES DO SENTINEL</span><h1>Os sinais não esperam.</h1><span className="impact-subtitle">Mas podem passar despercebidos.</span></div>
    <div className="overload-story" role="img" aria-label="Ilustração: demandas se acumulam ao redor de uma equipe; cansaço e silêncio aparecem antes de um afastamento.">
      <div className="incoming-work"><span className="story-label">A ROTINA ACELERA</span><div className="incoming-card incoming-one"><CalendarDays size={21} /><div><b>Prazo antecipado</b><span>Entrega para hoje</span></div><Clock3 size={15} /></div><div className="incoming-card incoming-two"><ClipboardList size={21} /><div><b>Mais uma demanda</b><span>A fila continua</span></div><span className="work-lines"><i /><i /><i /></span></div><div className="incoming-card incoming-three"><MessageCircle size={21} /><div><b>Mensagem fora de hora</b><span>Uma última pendência</span></div></div></div>
      <div className="pressure-connectors" aria-hidden="true"><i /><i /><i /><ArrowRight size={20} /></div>
      <div className="team-scene"><div className="team-orbit"><span className="team-member member-one"><Users size={30} /></span><span className="team-member member-center"><Users size={42} /></span><span className="team-member member-three"><Users size={30} /></span></div><b>Uma equipe.</b><span>Muitas demandas.</span><div className="pressure-meter"><span>Pressão acumulada</span><div><i /></div></div></div>
      <div className="signals-connector" aria-hidden="true"><span /><ArrowRight size={20} /></div>
      <div className="ignored-signals"><span className="story-label">OS SINAIS APARECEM</span><div className="signal signal-one"><HeartPulse size={23} /><span>Cansaço</span><i /></div><div className="signal signal-two"><MessageCircle size={23} /><span>Silêncio</span><i /></div><div className="signal signal-three"><Users size={23} /><span>Afastamento</span><i /></div></div>
    </div>
    <div className="impact-question"><span /><h2>Quem percebe antes que alguém precise parar?</h2><span /></div><span className="concept-caption">Ilustração conceitual</span>
  </section>;
}

function ProductScreen({ image, title, onOpen, className = '' }) {
  const container = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [imageFailed, setImageFailed] = useState(false);
  const item = media[image];
  const [naturalWidth, naturalHeight] = item.size;
  const [x, y, width, height] = item.crop;
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  // Limit enlargement so smaller screenshots retain their original sharpness.
  const fittedWidth = Math.min(size.width, size.height * width / height, width * 1.1);
  return <div className={`product-screen ${className}`}>
    <div className="browser-bar"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><span><LockKeyhole size={10} />sentinel / {title}</span><button className="bare-icon" onClick={() => onOpen({ file: item.file, title })} aria-label={`Ampliar ${title}`} title="Ampliar tela"><Maximize2 size={14} /></button></div>
    <div className="screen-fit" ref={container}>
      {imageFailed ? <p className="image-fallback" role="status">Não foi possível carregar a captura de {title}. Recarregue a página para tentar novamente.</p> : <div className="screen-canvas" style={{ width: fittedWidth || '100%', height: fittedWidth ? fittedWidth * height / width : '100%' }}>
        <div className="screen-pixels"><img src={`/images/${item.file}.png`} alt={`Interface real: ${title}`} onError={() => setImageFailed(true)} style={{ width: `${naturalWidth / width * 100}%`, transform: `translate(${-x / naturalWidth * 100}%, ${-y / naturalHeight * 100}%)` }} /></div>
      </div>}
    </div>
  </div>;
}

function KnowledgeFlow() {
  return <div className="knowledge-flow" aria-label="Fluxo conceitual do RAG">
    <span className="knowledge-eyebrow"><UploadCloud size={15} />DOCUMENTOS DA EMPRESA</span>
    <div className="knowledge-documents">{['Políticas internas', 'Procedimentos', 'Padrões e limites'].map((label) => <div key={label}><FileText size={24} /><span>{label}</span><Check size={13} /></div>)}</div>
    <div className="knowledge-path" aria-hidden="true"><span /><ArrowRight size={18} /></div>
    <div className="knowledge-core"><Database size={43} strokeWidth={1.3} /><b>Base de conhecimento</b><span>Recuperação de trechos relevantes</span></div>
    <div className="knowledge-path" aria-hidden="true"><span /><ArrowRight size={18} /></div>
    <div className="knowledge-output"><BrainCircuit size={38} strokeWidth={1.3} /><b>IA com contexto</b><span>Recomendações e assistente</span></div>
    <div className="knowledge-foundation"><BookOpen size={17} /><span>Pesquisas científicas + documentos oficiais</span><ShieldCheck size={17} /></div>
    <span className="knowledge-caption">Esquema do RAG do Sentinel</span>
  </div>;
}

function SolutionScene() {
  const [mode, setMode] = useState(0);
  const modes = [
    { icon: Users, title: 'Escutar', sub: 'Dar espaço à percepção da equipe.', detail: 'Questionários estruturados ajudam a compreender como o trabalho é vivido pelos colaboradores.' },
    { icon: BarChart3, title: 'Compreender', sub: 'Transformar respostas em prioridades.', detail: 'Indicadores por setor ajudam o gestor a enxergar onde investigar e direcionar a atenção.' },
    { icon: BrainCircuit, title: 'Agir', sub: 'Conectar contexto, plano e execução.', detail: 'A IA apoia a sugestão. O gestor revisa, acompanha as ações e retorna à escuta em uma nova coleta.' },
  ];
  return <section className="scene solution-scene" aria-label="Apresentação do Sentinel">
    <SceneTitle index="04" eyebrow="A SOLUÇÃO" title="Da escuta à ação." />
    <div className="solution-layout"><div className="solution-copy"><span className="solution-symbol"><ShieldCheck size={34} strokeWidth={1.4} /></span><h1>Sentinel<span>.</span></h1><p>Um sistema para apoiar a gestão de riscos psicossociais no trabalho.</p><div className="solution-purpose">Pessoas ouvidas.<br />Prioridades compreendidas.<br /><strong>Ações acompanhadas.</strong></div></div>
      <div className="solution-concept"><div className="solution-stages" role="tablist" aria-label="Pilares do Sentinel">{modes.map((item, index) => <button id={`solution-tab-${index}`} role="tab" aria-selected={mode === index} aria-controls="solution-explanation" key={item.title} onClick={() => setMode(index)} className={mode === index ? 'active' : ''}><span className="solution-node"><item.icon size={26} strokeWidth={1.5} /></span><span><b>{item.title}</b><small>{item.sub}</small></span><span className="solution-number">0{index + 1}</span></button>)}</div><div id="solution-explanation" className="solution-insight" role="tabpanel" aria-labelledby={`solution-tab-${mode}`}><span>COMO O SENTINEL AJUDA</span><p key={mode}>{modes[mode].detail}</p></div></div>
    </div><div className="solution-handoff"><span>UM CICLO CONTÍNUO</span><p>Escuta <ArrowRight size={17} /> Análise <ArrowRight size={17} /> Ação <ArrowRight size={17} /> Reavaliação</p><span>Conheça o produto a seguir <ArrowRight size={17} /></span></div>
  </section>;
}

function ProblemScene({ onSources }) {
  return <section className="scene problem-scene"><SceneTitle index="02" eyebrow="O PROBLEMA E SUA RELEVÂNCIA" title="O impacto já é real." />
    <div className="problem-evidence regulation-layout"><div className="absence-evidence"><div className="stat-number"><span className="eyebrow">BRASIL · SAÚDE MENTAL · 2024</span><strong>472 mil</strong><b>afastamentos por transtornos<br />mentais e comportamentais</b></div><div className="absence-chart"><div className="chart-bars">{[{ year: 2022, value: 201864 }, { year: 2023, value: 283471 }, { year: 2024, value: 472328 }].map((item) => <div key={item.year}><span>{item.value.toLocaleString('pt-BR')}</span><i style={{ '--bar-height': `${item.value / 472328 * 82}%` }} /><b>{item.year}</b></div>)}</div></div><a className="text-button source-button" href={sources.brasil} target="_blank" rel="noreferrer">MPS · série apresentada pelo INCA<ArrowUpRight size={14} /></a></div>
    <div className="regulatory-evidence"><div className="regulation-date"><div className="calendar-date"><span>MAIO 2026</span><strong>26</strong></div><div><span className="eyebrow">NR-1 EM VIGOR</span><h3>Riscos psicossociais<br />expressos no GRO</h3><a className="text-button source-button" href={sources.nr1} target="_blank" rel="noreferrer">Vigência oficial · MTE<ArrowUpRight size={14} /></a></div></div><div className="penalty-evidence"><Scale size={29} strokeWidth={1.4} /><div><span className="eyebrow">DESCUMPRIMENTO · NR-28</span><h3>Autuações e multas</h3><p>Infração + gravidade + porte</p><a className="text-button source-button" href={sources.nr28} target="_blank" rel="noreferrer">Fiscalização e penalidades<ArrowUpRight size={14} /></a></div></div><div className="regulation-process"><span>Identificar</span><ArrowRight size={15} /><span>Agir</span><ArrowRight size={15} /><span>Documentar</span></div></div></div>
    <div className="impact-strip"><span><HeartPulse size={19} />Esgotamento</span><span><Users size={19} />Afastamentos</span><span><RotateCcw size={19} />Rotatividade</span><button onClick={onSources}><BookOpen size={17} /><span>Fontes oficiais</span><ArrowUpRight size={14} /></button></div><span className="data-footnote">Registros de afastamentos, não pessoas únicas. Série 2022–2024. Não se restringe a burnout nem a causas relacionadas ao trabalho.</span>
  </section>;
}

function ProductScene({ stepIndex, onStep, onOpen }) {
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [detailStep, setDetailStep] = useState(null);
  const step = steps[stepIndex];
  useEffect(() => {
    setDetailStep(null);
  }, [stepIndex]);
  useEffect(() => {
    if (!playing || !['painel', 'plano'].includes(step.image)) return;
    const timer = setTimeout(() => setDetailStep(stepIndex), 3800);
    return () => clearTimeout(timer);
  }, [stepIndex, playing, step.image]);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (stepIndex === steps.length - 1) setPlaying(false);
      else onStep(stepIndex + 1);
    }, 7500);
    return () => clearTimeout(timer);
  }, [playing, stepIndex, onStep]);
  const image = detailStep === stepIndex ? (step.image === 'painel' ? 'graficos' : 'plano5w2h') : step.image;
  return <section className="scene product-scene"><SceneTitle index="05" eyebrow="DEMONSTRAÇÃO" title="Um sistema. O ciclo completo."><button className="icon-button quiet-playback" aria-label={playing ? 'Pausar percurso' : 'Reproduzir percurso'} title={playing ? 'Pausar percurso' : 'Reproduzir percurso'} onClick={() => { if (stepIndex === steps.length - 1 && !playing) onStep(0); setPlaying(!playing); }}>{playing ? <Pause size={15} /> : <Play size={15} />}</button></SceneTitle>
    <div className="demo-workspace"><nav className="process-rail" aria-label="Etapas do produto">{steps.map((item, index) => <React.Fragment key={item.title}>{(index === 0 || steps[index - 1].group !== item.group) && <span className="process-group">{item.group}</span>}<button className={stepIndex === index ? 'active' : ''} onClick={() => { onStep(index); setPlaying(false); }} aria-current={stepIndex === index ? 'step' : undefined}><item.icon size={17} /><span>{item.title}</span>{index < stepIndex && <Check className="process-done" size={12} />}</button></React.Fragment>)}</nav>
    <div className="demo-stage"><div className="demo-heading"><h3>{step.heading}</h3><span className="step-count">{String(stepIndex + 1).padStart(2, '0')}<i> / {steps.length}</i></span></div>
    <div className={`demo-content ${step.image === 'knowledge' ? 'has-knowledge' : ''}`}><div className="demo-media">{step.image === 'knowledge' ? <KnowledgeFlow /> : <ProductScreen key={image} image={image} title={step.title} onOpen={onOpen} />}</div><aside className="demo-notes" key={step.title}><step.icon size={28} strokeWidth={1.4} /><h4>{step.value}</h4><ul>{step.notes.map((note) => <li key={note}>{note}</li>)}</ul>{step.image === 'dossie' && <div className="certificate-evolution"><Award size={21} /><b>Certificado Sentinel</b><span>Registro → reavaliação → evidências de evolução</span></div>}{step.image === 'ciclos' && <div className="cycle-loop"><span>Pesquisa</span><ArrowRight size={12} /><span>Ação</span><ArrowRight size={12} /><span>Nova coleta</span></div>}</aside></div>
    <div className="demo-bottom"><TagRow items={step.tags} /><div className="step-controls"><button className="icon-button" disabled={stepIndex === 0} onClick={() => { onStep(stepIndex - 1); setPlaying(false); }} aria-label="Etapa anterior" title="Etapa anterior"><ArrowLeft size={17} /></button><button className="icon-button" disabled={stepIndex === steps.length - 1} onClick={() => { onStep(stepIndex + 1); setPlaying(false); }} aria-label="Próxima etapa" title="Próxima etapa"><ArrowRight size={17} /></button></div></div>{playing && <div className="playback-track"><span key={stepIndex} /></div>}</div></div></section>;
}

const ragStages = [
  { title: 'Contexto + RAG', caption: 'Documentos da empresa', icon: Database, image: 'knowledge', points: ['Documentos', 'Políticas', 'Limites'] },
  { title: 'Base científica', caption: 'Pesquisas + guias oficiais', icon: BookOpen, image: 'referencias', points: ['Instrumentos', 'Curadoria', 'Fontes rastreáveis'] },
  { title: 'Plano 5W2H', caption: 'Sugestão para revisão', icon: Sparkles, image: 'plano', points: ['O quê', 'Como', 'Quem e quando'] },
];

function RagScene({ onOpen }) {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (phase === 2) setPlaying(false);
      else setPhase(phase + 1);
    }, 3600);
    return () => clearTimeout(timer);
  }, [phase, playing]);
  const current = ragStages[phase];
  return <section className="scene rag-scene"><SceneTitle index="06" eyebrow="DIFERENCIAIS E FUNCIONAMENTO" title="A IA consulta antes de sugerir."><div className="rag-heading-tools"><span className="status-label"><BrainCircuit size={15} />RAG integrado</span><button className="icon-button quiet-playback" aria-label={playing ? 'Pausar fluxo RAG' : 'Reproduzir fluxo RAG'} title={playing ? 'Pausar fluxo RAG' : 'Reproduzir fluxo RAG'} onClick={() => { if (!playing) setPhase(0); setPlaying(!playing); }}>{playing ? <Pause size={15} /> : <Play size={15} />}</button></div></SceneTitle><p className="rag-plain-language">RAG, em linguagem simples: buscar informações relevantes nos documentos e usá-las como contexto para a resposta.</p>
    <div className={`rag-pipeline ${playing ? 'is-playing' : ''}`} role="tablist" aria-label="Etapas do RAG">{ragStages.map((item, index) => <React.Fragment key={item.title}><button role="tab" aria-selected={phase === index} onClick={() => { setPhase(index); setPlaying(false); }} className={phase === index ? 'active' : ''}><span className="pipeline-icon"><item.icon size={22} /></span><span><b>{item.title}</b><small>{item.caption}</small></span><span className="pipeline-number">0{index + 1}</span></button>{index < 2 && <div className={`pipeline-line ${phase > index ? 'passed' : ''}`}><span /><ArrowRight size={14} /></div>}</React.Fragment>)}</div>
    <div className="rag-workspace"><div className="rag-detail">{current.image === 'knowledge' ? <KnowledgeFlow /> : <ProductScreen key={current.image} image={current.image} title={current.title} onOpen={onOpen} />}<div className="screen-caption"><TagRow items={current.points} /></div></div><aside className="rag-aside"><div className="rag-core"><BrainCircuit size={35} strokeWidth={1.5} /><span>Ciência, contexto e ação.</span><small>Uma base para cada recomendação</small></div><div className="differential-item"><ClipboardList size={19} /><div><b>Instrumentos estruturados</b><span>COPSOQ II/III · JSS · OLBI</span></div></div><div className="differential-item"><Settings2 size={19} /><div><b>Filtros de viabilidade</b><span>Orçamento, RH e histórico</span></div></div><div className="differential-item"><BookOpen size={19} /><div><b>Referências rastreáveis</b><span>Pesquisas e documentos oficiais</span></div></div><div className="differential-item"><LockKeyhole size={19} /><div><b>Controle de acesso</b><span>PostgreSQL / Supabase + RLS</span></div></div><div className="human-decision"><ShieldCheck size={20} /><b>Revisão humana</b></div></aside></div><div className="technical-foundation"><span>Next.js + React + TypeScript</span><span>Respostas anonimizadas</span><span>IA + recuperação de contexto</span></div>
  </section>;
}

const valueItems = [
  { title: 'Clareza', before: 'Sinais dispersos', after: 'Prioridades visíveis', image: 'painel', icon: BarChart3 },
  { title: 'Direção', before: 'Ações desconectadas', after: 'Planos com contexto', image: 'plano', icon: BrainCircuit },
  { title: 'Continuidade', before: 'Uma pesquisa isolada', after: 'Evolução documentada', image: 'ciclos', icon: RotateCcw },
];

function ValueScene({ onOpen }) {
  return <section className="scene value-scene"><SceneTitle index="08" eyebrow="VALOR GERADO" title="Perceber os sinais. Agir com direção." /><div className="value-columns">{valueItems.map((item, index) => <article key={item.title} className="value-column" style={{ '--entry-delay': `${index * 180}ms` }}><div className="value-column-heading"><item.icon size={25} strokeWidth={1.5} /><h3>{item.title}</h3><span>0{index + 1}</span></div><ProductScreen image={item.image} title={item.title} onOpen={onOpen} /><div className="value-change"><span>{item.before}</span><ArrowRight size={17} /><b>{item.after}</b></div></article>)}</div><div className="value-stakeholders"><div><Fingerprint size={22} /><span><b>Colaborador</b><small>Escuta protegida</small></span></div><div><Users size={22} /><span><b>RH</b><small>Decisões orientadas</small></span></div><div><ShieldCheck size={22} /><span><b>Organização</b><small>Histórico e acompanhamento</small></span></div></div><div className="value-close"><span>Sentinel<span>.</span></span><b>Da escuta à ação.</b><small>Valor operacional demonstrado. Impacto sobre afastamentos e retorno financeiro ainda não mensurados.</small></div></section>;
}

export default function App() {
  const [scene, setScene] = useState(sceneFromHash);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const scrollArea = useRef(null);
  const wheelState = useRef({ amount: 0, last: 0, lockedUntil: 0 });
  const navigate = (next) => { setScene(Math.max(0, Math.min(chapters.length - 1, next))); setIndexOpen(false); scrollArea.current?.scrollTo({ top: 0 }); };
  useEffect(() => {
    window.history.replaceState(null, '', `#${sceneSlugs[scene]}`);
    wheelState.current = { amount: 0, last: 0, lockedUntil: performance.now() + 900 };
  }, [scene]);
  useEffect(() => {
    const handler = () => navigate(sceneFromHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  useEffect(() => {
    const handler = (event) => {
      if (selected || sourcesOpen || indexOpen || event.ctrlKey || event.altKey || event.metaKey || ['INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName)) return;
      if (event.key.toLowerCase() === 'n') { event.preventDefault(); setPresenterOpen((value) => !value); return; }
      if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); return; }
      if (event.target.closest('[role="tablist"],.process-rail,.case-stages,.presenter-panel')) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) { event.preventDefault(); navigate(scene + 1); }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); navigate(scene - 1); }
      if (event.key === 'Home') { event.preventDefault(); navigate(0); }
      if (event.key === 'End') { event.preventDefault(); navigate(chapters.length - 1); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [scene, selected, sourcesOpen, indexOpen]);
  useEffect(() => {
    const area = scrollArea.current;
    const handler = (event) => {
      if (selected || sourcesOpen || indexOpen || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      // Let nested rails and long scenes consume their own scrolling first.
      for (let el = event.target; el && el !== area; el = el.parentElement) {
        if (el.scrollHeight > el.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(el).overflowY)) return;
        if (el.scrollWidth > el.clientWidth + 2 && /auto|scroll/.test(getComputedStyle(el).overflowX)) return;
      }
      const direction = Math.sign(event.deltaY);
      if (!direction || (direction > 0 && area.scrollTop + area.clientHeight < area.scrollHeight - 3) || (direction < 0 && area.scrollTop > 3)) return;
      const now = performance.now();
      const wheel = wheelState.current;
      if (now < wheel.lockedUntil) return;
      if (now - wheel.last > 220 || Math.sign(wheel.amount) !== direction) wheel.amount = 0;
      wheel.amount += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? area.clientHeight : 1);
      wheel.last = now;
      if (Math.abs(wheel.amount) >= 90) { wheel.lockedUntil = now + 1000; wheel.amount = 0; navigate(scene + direction); }
    };
    area.addEventListener('wheel', handler, { passive: true });
    return () => area.removeEventListener('wheel', handler);
  }, [scene, selected, sourcesOpen, indexOpen]);
  useEffect(() => {
    const handler = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  const toggleFullscreen = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { setFullscreen(false); }
  };
  const onTabKeys = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;
    const tabs = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (tabs.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault(); event.stopPropagation(); tabs[index].click(); tabs[index].focus();
  };
  const lastScene = scene === chapters.length - 1;
  return <div className={`pitch-app ${scene === 0 ? 'opening-active' : ''}`} onKeyDown={onTabKeys}><a className="skip-link" href="#conteudo" onClick={(event) => { event.preventDefault(); scrollArea.current?.focus(); }}>Pular para a apresentação</a><header className="app-header"><Brand onClick={() => navigate(0)} /><nav className="chapter-nav" aria-label="Cenas do pitch">{chapters.map((item, index) => <button key={item.title} className={scene === index ? 'active' : ''} onClick={() => navigate(index)} aria-current={scene === index ? 'page' : undefined} title={item.title}><span className="chapter-number">0{index + 1}</span><item.icon size={16} /><span className="chapter-name">{item.title}</span></button>)}</nav><div className="header-tools"><button className="icon-button index-button" aria-label="Índice da apresentação" onClick={() => setIndexOpen(true)} title="Índice da apresentação"><ClipboardList size={17} /></button><button className="icon-button fullscreen-button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} title={fullscreen ? 'Sair da tela cheia · F' : 'Tela cheia · F'}>{fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button></div></header>
    <main id="conteudo" tabIndex={-1} ref={scrollArea} className={`scene-area scene-area-${scene}`}><div key={scene} className="scene-transition">{scene === 0 && <ImpactScene />}{scene === 1 && <ProblemScene onSources={() => setSourcesOpen(true)} />}{scene === 2 && <GapScene />}{scene === 3 && <SolutionScene onOpen={setSelected} />}{scene === 4 && <ProductScene stepIndex={step} onStep={setStep} onOpen={setSelected} />}{scene === 5 && <RagScene onOpen={setSelected} />}{scene === 6 && <CaseScene />}{scene === 7 && <ValueScene onOpen={setSelected} />}</div></main>
    <div className="sr-only" aria-live="polite" aria-atomic="true">Cena {scene + 1} de {chapters.length}: {chapters[scene].title}</div>
    <footer className="presentation-footer"><div className="footer-tools"><button className="footer-info" onClick={() => setSourcesOpen(true)}><CircleHelp size={15} /><span>Fontes e projeto</span></button><button className={`footer-info rehearsal-button ${presenterOpen ? 'active' : ''}`} aria-pressed={presenterOpen} onClick={() => setPresenterOpen(!presenterOpen)} title="Roteiro de ensaio · N"><BookOpen size={15} /><span>Ensaiar</span></button></div><div className="scene-pagination" aria-label="Progresso da apresentação">{chapters.map((item, index) => <button key={item.title} className={scene === index ? 'active' : index < scene ? 'visited' : ''} onClick={() => navigate(index)} aria-label={`Cena ${index + 1}: ${item.title}`} title={item.title}><span /></button>)}</div><div className="presentation-controls"><span className="scene-counter">0{scene + 1}<i> / 0{chapters.length}</i></span><button className="icon-button" disabled={scene === 0} onClick={() => navigate(scene - 1)} aria-label="Cena anterior" title="Cena anterior"><ArrowLeft size={17} /></button><button className="button button-blue next-scene" aria-label={lastScene ? 'Reiniciar pitch' : 'Próximo'} title={lastScene ? 'Reiniciar pitch' : 'Próximo'} onClick={() => { if (lastScene) { setStep(0); navigate(0); } else navigate(scene + 1); }}><span>{lastScene ? 'Reiniciar' : 'Próximo'}</span>{lastScene ? <RotateCcw size={16} /> : <ArrowRight size={16} />}</button></div></footer>
    {presenterOpen && <PresenterPanel scene={scene} onClose={() => setPresenterOpen(false)} />}
    {indexOpen && <Dialog title="Escolha um capítulo" onClose={() => setIndexOpen(false)} className="index-dialog"><nav className="chapter-index" aria-label="Índice completo">{chapters.map((item, i) => <button key={item.title} onClick={() => navigate(i)} aria-current={scene === i ? 'page' : undefined}><span>0{i + 1}</span><item.icon size={23} /><b>{item.title}</b><ArrowRight size={18} /></button>)}</nav><p className="index-help">Role ou use as setas para navegar · F: tela cheia · N: roteiro de ensaio · Home / End: início / fim</p></Dialog>}
    {selected && <ImageDialog selected={selected} onClose={() => setSelected(null)} />}{sourcesOpen && <SourcesDialog onClose={() => setSourcesOpen(false)} />}
  </div>;
}
