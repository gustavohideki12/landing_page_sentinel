import React, { useEffect, useId, useRef, useState } from 'react';
import { GapScene, PresenterPanel } from './StoryScenes';
import { CycleScene, FoundationScene, LearningScene, PlanScene } from './FlowScenes';
import { SceneTitle } from './shared';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BookOpen,
  BrainCircuit, CalendarDays, CheckCheck, CircleHelp,
  ClipboardList, Clock3, Database, FileText, Fingerprint, HeartPulse, MessageCircle,
  Maximize2, Minimize2, RotateCcw, ShieldCheck, Sparkles, Users, Scale, X, ZoomIn, ZoomOut,
  Linkedin, Type,
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
  { title: 'O ciclo', icon: RotateCcw }, { title: 'A base', icon: Database },
  { title: 'O plano', icon: Sparkles }, { title: 'Aprendizado', icon: CheckCheck },
  { title: 'O valor', icon: BrainCircuit }, { title: 'Contato', icon: Linkedin },
];
const sceneSlugs = ['abertura', 'problema', 'lacuna', 'solucao', 'ciclo', 'base', 'plano', 'aprendizado', 'valor', 'contato'];
const pad = (value) => String(value).padStart(2, '0');
const sceneFromHash = () => Math.max(0, sceneSlugs.indexOf(window.location.hash.slice(1)));

function Brand({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="Sentinel, início"><span className="brand-mark" aria-hidden="true" /><span>Sentinel<span className="brand-dot">.</span></span></button>;
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
  const linkedinUrl = 'https://www.linkedin.com/company/sentinel-gestao-de-seguranca';
  return <section className="scene impact-scene" aria-label="Abertura de impacto">
    <div className="impact-heading">
      <div className="impact-header-top">
        <span className="eyebrow"><span>01</span>ANTES DO SENTINEL</span>
        <a 
          href={linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="linkedin-fast-button"
          title="Visitar página do LinkedIn da Sentinel"
        >
          <Linkedin size={15} />
          <span>LinkedIn Sentinel</span>
          <ArrowUpRight size={13} />
        </a>
      </div>
      <h1>Os sinais não esperam.</h1>
      <span className="impact-subtitle">Mas podem passar despercebidos.</span>
    </div>
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

const valueItems = [
  { icon: BarChart3, title: 'Clareza', before: 'Sinais dispersos', after: 'Riscos por dimensão e setor', detail: 'Questionários validados, anônimos e comparáveis entre ciclos.' },
  { icon: BrainCircuit, title: 'Direção', before: 'Ações genéricas', after: 'Planos fundamentados', detail: 'Contexto, documentos, histórico e ciência antes de cada sugestão.' },
  { icon: RotateCcw, title: 'Continuidade', before: 'Uma pesquisa isolada', after: 'Um ciclo que aprende', detail: 'Execução no Kanban e resultados que orientam o próximo plano.' },
  { icon: FileText, title: 'Conformidade', before: 'Gestão sem registro', after: 'Evidências para a NR-1', detail: 'Dossiê com inventário de riscos e planos com responsáveis e prazos.' },
];

function ValueScene() {
  return <section className="scene value-scene" aria-label="Valor gerado"><SceneTitle index="09" eyebrow="VALOR GERADO" title="Perceber os sinais. Agir com direção." />
    <div className="value-grid">{valueItems.map((item, index) => <article key={item.title} className="value-card" style={{ '--entry-delay': `${index * 140}ms` }}><div className="value-card-heading"><item.icon size={24} strokeWidth={1.5} /><h3>{item.title}</h3><span>{pad(index + 1)}</span></div><div className="value-change"><span>{item.before}</span><ArrowRight size={16} /><b>{item.after}</b></div><p>{item.detail}</p></article>)}</div>
    <div className="value-stakeholders"><div><Fingerprint size={22} /><span><b>Colaborador</b><small>Escuta protegida pelo anonimato</small></span></div><div><Users size={22} /><span><b>RH</b><small>Decide com base, não no achismo</small></span></div><div><ShieldCheck size={22} /><span><b>Organização</b><small>Histórico, evidências e evolução</small></span></div></div>
    <div className="value-close"><span>Sentinel<span>.</span></span><b>Da escuta à ação.</b><small>Valor operacional demonstrado. Impacto sobre afastamentos e retorno financeiro ainda não mensurados.</small></div>
  </section>;
}

function ContactScene() {
  const linkedinUrl = 'https://www.linkedin.com/company/sentinel-gestao-de-seguranca';
  return (
    <section className="scene contact-scene" aria-label="Contato e Conexão">
      <SceneTitle index="10" eyebrow="CONECTE-SE AO SENTINEL" title="Vamos transformar a segurança psicológica juntos." />
      <div className="contact-container">
        <a 
          href={linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="linkedin-preview-card"
          aria-label="Abrir perfil da Sentinel no LinkedIn"
        >
          <div className="card-banner-wrapper">
            <img 
              src="/images/sentinel-linkedin-banner.png" 
              alt="Sentinel no LinkedIn - Inteligência contextual para a segurança psicológica corporativa" 
              className="card-banner-img"
            />
            <div className="card-badge">
              <Linkedin size={18} />
              <span>LinkedIn Oficial</span>
            </div>
          </div>
          <div className="card-body">
            <div className="card-header-row">
              <div>
                <h3 className="card-company-name">Sentinel</h3>
                <p className="card-headline">Segurança psicológica, gestão de riscos psicossociais e conformidade com a NR-1.</p>
                <span className="card-subtext">Desenvolvimento de software · São Paulo, Brasil</span>
              </div>
            </div>
            <div className="card-footer-action">
              <span className="card-link-text">
                <Linkedin size={20} />
                <b>Seguir e contatar no LinkedIn</b>
              </span>
              <span className="card-btn-action">
                <span>Acessar perfil</span>
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>
        </a>

        <aside className="contact-side-info contact-mobile-card" aria-labelledby="contact-mobile-title">
          <div className="contact-mobile-heading"><span className="eyebrow">CONTINUE PELO CELULAR</span><h3 id="contact-mobile-title">Conheça o Sentinel</h3><p>Aponte a câmera e descubra como transformar escuta em ação.</p></div>
            <div className="contact-scan-code">
              <span className="contact-scan-step"><span>1</span> Escaneie com o celular</span>
              <a className="contact-qr-link" href="/conheca/" target="_blank" rel="noopener noreferrer" aria-label="Abrir o site do Sentinel para celular">
                <span className="contact-qr-frame"><img src="/images/qrcode-sentinel.png" width="208" height="208" alt="QR code para acessar o site do Sentinel no celular" /></span>
                <span className="contact-mobile-link">Acessar o site<ArrowUpRight size={15} aria-hidden="true" /></span>
              </a>
            </div>
        </aside>
          <aside className="contact-scan-guide" aria-labelledby="contact-guide-title">
            <span className="contact-scan-step"><span>2</span> Depois de escanear</span>
            <h3 id="contact-guide-title">Continue no navegador.</h3>
            <p>Se aparecer esta tela, toque em <strong>“Sem o aplicativo, continue no navegador”</strong>, logo abaixo do anúncio.</p>
            <figure className="contact-scan-example">
              <div className="contact-scan-capture">
                <svg viewBox="150 1180 1020 380" role="img" aria-label="Exemplo da tela do celular, com a opção Sem o aplicativo, continue no navegador circulada em vermelho." focusable="false">
                  <image href="/images/qr-instrucao-navegador.png" width="1320" height="1702" />
                  <ellipse cx="660" cy="1430" rx="475" ry="61" />
                </svg>
              </div>
              <figcaption><ArrowUpRight size={18} aria-hidden="true" /> Toque na área circulada em vermelho.</figcaption>
            </figure>
          </aside>
      </div>
      <div className="value-close">
        <span>Sentinel<span>.</span></span>
        <b>Da escuta à ação.</b>
        <small>Instituto Mauá de Tecnologia · Sistemas de Informação · 2026</small>
      </div>
    </section>
  );
}

function AccessibilityDialog({ fontSize, onFontSizeChange, onClose }) {
  return (
    <Dialog title="Acessibilidade" onClose={onClose} className="a11y-dialog">
      <div className="a11y-modal-content">
        <div className="a11y-section">
          <span className="a11y-section-title"><Type size={16} />Tamanho da fonte</span>
          <div className="a11y-buttons-group">
            <button 
              className={`a11y-option-btn ${fontSize === 'normal' ? 'active' : ''}`}
              onClick={() => onFontSizeChange('normal')}
            >
              Normal (100%)
            </button>
            <button 
              className={`a11y-option-btn ${fontSize === 'large' ? 'active' : ''}`}
              onClick={() => onFontSizeChange('large')}
            >
              Grande (+15%)
            </button>
            <button 
              className={`a11y-option-btn ${fontSize === 'xlarge' ? 'active' : ''}`}
              onClick={() => onFontSizeChange('xlarge')}
            >
              Muito Grande (+30%)
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default function App() {
  const [scene, setScene] = useState(sceneFromHash);
  const [selected, setSelected] = useState(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
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
      if (selected || sourcesOpen || indexOpen || a11yOpen || event.ctrlKey || event.altKey || event.metaKey || ['INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName)) return;
      if (event.key.toLowerCase() === 'n') { event.preventDefault(); setPresenterOpen((value) => !value); return; }
      if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); return; }
      if (event.target.closest('[role="tablist"],.presenter-panel')) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) { event.preventDefault(); navigate(scene + 1); }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); navigate(scene - 1); }
      if (event.key === 'Home') { event.preventDefault(); navigate(0); }
      if (event.key === 'End') { event.preventDefault(); navigate(chapters.length - 1); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [scene, selected, sourcesOpen, indexOpen, a11yOpen]);
  useEffect(() => {
    const area = scrollArea.current;
    const handler = (event) => {
      if (selected || sourcesOpen || indexOpen || a11yOpen || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
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
  }, [scene, selected, sourcesOpen, indexOpen, a11yOpen]);
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
  return <div className={`pitch-app ${scene === 0 ? 'opening-active' : ''} a11y-font-${fontSize}`} onKeyDown={onTabKeys}><a className="skip-link" href="#conteudo" onClick={(event) => { event.preventDefault(); scrollArea.current?.focus(); }}>Pular para a apresentação</a><header className="app-header"><Brand onClick={() => navigate(0)} /><nav className="chapter-nav" aria-label="Cenas do pitch">{chapters.map((item, index) => <button key={item.title} className={scene === index ? 'active' : ''} onClick={() => navigate(index)} aria-current={scene === index ? 'page' : undefined} title={item.title}><span className="chapter-number">{pad(index + 1)}</span><item.icon size={16} /><span className="chapter-name">{item.title}</span></button>)}</nav><div className="header-tools"><button className="icon-button a11y-button" aria-label="Opções de acessibilidade" onClick={() => setA11yOpen(true)} title="Acessibilidade (tamanho da fonte)"><Type size={17} /></button><button className="icon-button index-button" aria-label="Índice da apresentação" onClick={() => setIndexOpen(true)} title="Índice da apresentação"><ClipboardList size={17} /></button><button className="icon-button fullscreen-button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} title={fullscreen ? 'Sair da tela cheia · F' : 'Tela cheia · F'}>{fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button></div></header>
    <main id="conteudo" tabIndex={-1} ref={scrollArea} className={`scene-area scene-area-${scene}`}><div key={scene} className="scene-transition">{scene === 0 && <ImpactScene />}{scene === 1 && <ProblemScene onSources={() => setSourcesOpen(true)} />}{scene === 2 && <GapScene />}{scene === 3 && <SolutionScene onOpen={setSelected} />}{scene === 4 && <CycleScene onOpen={setSelected} />}{scene === 5 && <FoundationScene onOpen={setSelected} />}{scene === 6 && <PlanScene onOpen={setSelected} />}{scene === 7 && <LearningScene onOpen={setSelected} />}{scene === 8 && <ValueScene />}{scene === 9 && <ContactScene />}</div></main>
    <div className="sr-only" aria-live="polite" aria-atomic="true">Cena {scene + 1} de {chapters.length}: {chapters[scene].title}</div>
    <footer className="presentation-footer"><div className="footer-tools"><button className="footer-info" onClick={() => setSourcesOpen(true)}><CircleHelp size={15} /><span>Fontes e projeto</span></button><button className="footer-info" onClick={() => setA11yOpen(true)} title="Acessibilidade"><Type size={15} /><span>Acessibilidade</span></button><button className={`footer-info rehearsal-button ${presenterOpen ? 'active' : ''}`} aria-pressed={presenterOpen} onClick={() => setPresenterOpen(!presenterOpen)} title="Roteiro de ensaio · N"><BookOpen size={15} /><span>Ensaiar</span></button></div><div className="scene-pagination" aria-label="Progresso da apresentação">{chapters.map((item, index) => <button key={item.title} className={scene === index ? 'active' : index < scene ? 'visited' : ''} onClick={() => navigate(index)} aria-label={`Cena ${index + 1}: ${item.title}`} title={item.title}><span /></button>)}</div><div className="presentation-controls"><span className="scene-counter">{pad(scene + 1)}<i> / {pad(chapters.length)}</i></span><button className="icon-button" disabled={scene === 0} onClick={() => navigate(scene - 1)} aria-label="Cena anterior" title="Cena anterior"><ArrowLeft size={17} /></button><button className="button button-blue next-scene" aria-label={lastScene ? 'Reiniciar pitch' : 'Próximo'} title={lastScene ? 'Reiniciar pitch' : 'Próximo'} onClick={() => { if (lastScene) navigate(0); else navigate(scene + 1); }}><span>{lastScene ? 'Reiniciar' : 'Próximo'}</span>{lastScene ? <RotateCcw size={16} /> : <ArrowRight size={16} />}</button></div></footer>
    {presenterOpen && <PresenterPanel scene={scene} onClose={() => setPresenterOpen(false)} />}
    {indexOpen && <Dialog title="Escolha um capítulo" onClose={() => setIndexOpen(false)} className="index-dialog"><nav className="chapter-index" aria-label="Índice completo">{chapters.map((item, i) => <button key={item.title} onClick={() => navigate(i)} aria-current={scene === i ? 'page' : undefined}><span>{pad(i + 1)}</span><item.icon size={23} /><b>{item.title}</b><ArrowRight size={18} /></button>)}</nav><p className="index-help">Role ou use as setas para navegar · F: tela cheia · N: roteiro de ensaio · Home / End: início / fim</p></Dialog>}
    {a11yOpen && <AccessibilityDialog fontSize={fontSize} onFontSizeChange={setFontSize} onClose={() => setA11yOpen(false)} />}
    {selected && <ImageDialog selected={selected} onClose={() => setSelected(null)} />}{sourcesOpen && <SourcesDialog onClose={() => setSourcesOpen(false)} />}
  </div>;
}
