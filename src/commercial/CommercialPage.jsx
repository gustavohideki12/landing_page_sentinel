import React, { useEffect, useId, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Award, BarChart3, BookOpen, BrainCircuit,
  Check, CheckCheck, ChevronDown, ChevronRight, ClipboardList, FileText,
  Fingerprint, HeartHandshake, History, LayoutDashboard, Linkedin, ListChecks,
  Maximize2, Menu, MessageCircle, RotateCcw, ShieldCheck, Sparkles, Users, X,
  ZoomIn, ZoomOut,
} from 'lucide-react';

const LINKEDIN = 'https://www.linkedin.com/company/sentinel-gestao-de-seguranca';
const NR1 = 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1';

const captures = {
  attention: { file: '/images/dashboard-v2.png', size: [894, 859], crop: [454, 280, 421, 303], title: 'Prioridades no dashboard' },
  survey: { file: '/images/criar-ciclo.png', size: [532, 657], crop: [8, 13, 512, 636], title: 'Criação da pesquisa' },
  dashboard: { file: '/images/dashboard-v2.png', size: [894, 859], crop: [20, 175, 855, 410], title: 'Dashboard da pesquisa' },
  plan: { file: '/images/plano-pausas.png', size: [1916, 912], crop: [518, 228, 1112, 606], title: 'Plano de ação com IA' },
  cycle: { file: '/images/ciclos-v3.png', size: [1915, 920], crop: [1076, 154, 582, 404], title: 'Pesquisa base e reavaliações' },
  comparison: { file: '/comercial/comparacao-ciclo.png', size: [1912, 872], crop: [360, 201, 1514, 467], title: 'Comparação entre pesquisa e reavaliação', detail: 'Esta captura mostra um ciclo demonstrativo da Vértice Logística. O painel coloca a pesquisa base e a primeira reavaliação lado a lado para acompanhar a variação dos indicadores.' },
  checklist: { file: '/comercial/checklist-ciclo.png', size: [837, 752], crop: [17, 58, 801, 659], title: 'Checklist de acompanhamento do ciclo', detail: 'O checklist reúne registros da pesquisa, das ações e da reavaliação. O percentual da tela indica o preenchimento dos itens acompanhados pela plataforma.' },
  knowledge: { file: '/images/base-conhecimento.png', size: [1912, 922], crop: [494, 158, 1158, 680], title: 'Base de conhecimento da empresa' },
  kanban: { file: '/images/kanban-v2.png', size: [1353, 758], crop: [40, 177, 1280, 356], title: 'Acompanhamento pelo Kanban' },
  dossier: { file: '/images/dossie-pdf-p2.png', size: [2020, 1428], crop: [88, 885, 1844, 420], title: 'Dossiê de riscos psicossociais' },
  certificate: { file: '/comercial/certificado.png', size: [1047, 740], crop: [0, 0, 1047, 740], title: 'Certificado Sentinel' },
  reports: { file: '/images/denuncias.png', size: [902, 748], crop: [21, 9, 855, 721], title: 'Gestão de denúncias' },
};

const journey = [
  { name: 'Escutar', icon: ClipboardList, label: '01 · A VOZ DA EQUIPE', title: 'Primeiro, abrir espaço para ouvir.', body: 'O RH abre o ciclo com a pesquisa base: escolhe o questionário, os setores e os colaboradores. Cada pessoa recebe um convite para responder. O sistema acompanha a participação e mantém as respostas separadas da identificação.', capture: 'survey', takeaway: 'Instrumentos estruturados, como COPSOQ II e III.', tone: 'indigo' },
  { name: 'Entender', icon: BarChart3, label: '02 · PRIORIDADES MAIS CLARAS', title: 'Das respostas ao que merece atenção.', body: 'As respostas viram indicadores por dimensão: temas como ritmo de trabalho e apoio da liderança. No dashboard, o painel de resultados, o RH identifica os temas e setores que precisam de atenção.', capture: 'dashboard', takeaway: 'O RH vê resultados da equipe, sem respostas individuais.', tone: 'amber' },
  { name: 'Agir', icon: Sparkles, label: '03 · UM PRÓXIMO PASSO', title: 'Um plano que considera a empresa.', body: 'A IA combina os indicadores com documentos, histórico e referências. O RAG busca trechos da base de conhecimento para dar contexto às sugestões. O gestor revisa as propostas e acompanha as ações aprovadas, com responsáveis e prazos.', capture: 'plan', takeaway: 'O que fazer, por quê, quem participa e quando.', tone: 'green' },
  { name: 'Reavaliar', icon: RotateCcw, label: '04 · COMPARAR PARA ACOMPANHAR', title: 'O que mudou desde a primeira pesquisa?', body: 'Depois das ações, o RH reaplica o mesmo questionário no mesmo ciclo. A comparação coloca a pesquisa base e a reavaliação lado a lado: participação, índice de saúde e dimensões em atenção.', capture: 'comparison', takeaway: 'Duas coletas ajudam a avaliar a evolução e decidir os próximos passos.', tone: 'indigo' },
];

const riskExamples = [
  { name: 'Sobrecarga', icon: ListChecks, text: 'Quando as demandas não cabem na jornada, o ritmo de trabalho merece atenção.', bridge: 'A pesquisa ajuda a tornar essa percepção visível.' },
  { name: 'Falta de apoio', icon: HeartHandshake, text: 'Ter com quem contar na equipe e na liderança faz parte das condições de trabalho.', bridge: 'Os indicadores ajudam a entender como esse apoio é percebido.' },
  { name: 'Conflitos', icon: MessageCircle, text: 'Relações difíceis e situações de assédio também precisam de espaço para serem ouvidas.', bridge: 'Pesquisa e canal de relatos ampliam os caminhos de escuta.' },
];

const extras = [
  { icon: CheckCheck, title: 'Planos em movimento', body: 'Um quadro de tarefas (Kanban) com responsáveis, prazos e andamento.', capture: 'kanban', detail: 'Após a aprovação do plano, a equipe acompanha as tarefas e registra o andamento da execução em um quadro compartilhado da empresa.' },
  { icon: FileText, title: 'Evidências organizadas', body: 'Dossiê para apoiar a documentação dos riscos.', capture: 'dossier', detail: 'O dossiê reúne critérios, inventário e registros para a empresa revisar, complementar e integrar ao seu Programa de Gerenciamento de Riscos.' },
  { icon: Award, title: 'O processo registrado', body: 'Certificado com validação por QR code.', capture: 'certificate', detail: 'O certificado Sentinel registra as etapas alcançadas pelo ciclo e pode ser validado por um código ou QR code. É uma declaração da plataforma baseada nos registros do processo.' },
  { icon: MessageCircle, title: 'Denúncia anônima', body: 'Um canal para relatar situações e acompanhar o atendimento por protocolo.', capture: 'reports', detail: 'O colaborador pode relatar situações como assédio ou conflitos, com opção de anonimato. Após o envio, recebe um protocolo para acompanhar o atendimento. O email utilizado para liberar o acesso não é salvo junto ao relato.' },
];

function Brand({ footer = false }) {
  return <a className={`c-brand${footer ? ' c-brand-footer' : ''}`} href="#inicio" aria-label="Sentinel, início"><img src="/comercial/sentinel-logo.png" width="40" height="40" alt="" /><span>Sentinel<span className="c-brand-dot">.</span></span></a>;
}

function LinkedInLink({ children = 'Conheça a equipe', className = '', source = 'site' }) {
  return <a className={`c-linkedin ${className}`} href={`${LINKEDIN}?utm_source=sentinel&utm_medium=site&utm_campaign=${source}`} target="_blank" rel="noopener noreferrer"><Linkedin size={18} aria-hidden="true" /><span>{children}</span><ArrowUpRight size={18} aria-hidden="true" /></a>;
}

function Capture({ name, onOpen, className = '', eager = false }) {
  const item = captures[name];
  const [failed, setFailed] = useState(false);
  const [naturalWidth, naturalHeight] = item.size;
  const [x, y, width, height] = item.crop;
  return <button className={`c-capture ${className}`} onClick={() => onOpen({ ...item })} aria-label={`Ampliar: ${item.title}`}>
    <span className="c-capture-image" style={{ aspectRatio: `${width} / ${height}` }}>{failed ? <span className="c-capture-fallback">Veja a explicação desta etapa abaixo.</span> : <img src={item.file} width={naturalWidth} height={naturalHeight} alt={`${item.title} no ambiente demonstrativo do Sentinel`} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} onError={() => setFailed(true)} style={{ width: `${naturalWidth / width * 100}%`, transform: `translate(${-x / naturalWidth * 100}%, ${-y / naturalHeight * 100}%)` }} />}</span>
    <span className="c-capture-open"><span><span className="c-live-dot" />Tela do sistema · exemplo</span><Maximize2 size={15} aria-hidden="true" /><span className="c-open-word">Ampliar</span></span>
  </button>;
}

function CaptureDialog({ selected, onClose }) {
  const ref = useRef(null);
  const id = useId();
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && document.contains(previousFocus)) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return <dialog className="c-dialog" ref={ref} aria-labelledby={id} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) onClose(); }}>
    <header><div><span>POR DENTRO DO SENTINEL</span><h2 id={id}>{selected.title}</h2></div><button className="c-icon-button" onClick={onClose} aria-label="Fechar imagem"><X size={22} /></button></header>
    <div className="c-dialog-body"><div className={`c-dialog-image${zoom ? ' is-zoomed' : ''}`}><img src={selected.file} width={selected.size[0]} height={selected.size[1]} alt={selected.title} /></div>
      {selected.detail && <p className="c-dialog-detail">{selected.detail}</p>}
    </div>
    <footer><span>Captura do ambiente demonstrativo.</span><button onClick={() => setZoom(!zoom)}>{zoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}{zoom ? 'Ajustar à tela' : 'Ver em tamanho original'}</button></footer>
  </dialog>;
}

function CycleExplainer({ onOpen }) {
  return <div className="c-cycle-explainer" role="region" aria-labelledby="cycle-explainer-title">
    <span className="c-cycle-icon"><RotateCcw size={24} strokeWidth={1.6} aria-hidden="true" /></span>
    <div><h3 id="cycle-explainer-title">Um ciclo, várias medições.</h3><p>Um ciclo reúne o acompanhamento da mesma equipe. A primeira aplicação é a <strong>pesquisa base</strong>. As próximas são <strong>reavaliações</strong>: novas aplicações do mesmo questionário, conectadas ao histórico para comparar os resultados.</p>
      <ol className="c-cycle-sequence" aria-label="Resumo do ciclo"><li>Pesquisa base</li><li>Ações</li><li>Reavaliação</li></ol>
      <button className="c-inline-link" onClick={() => onOpen(captures.checklist)}>Ver checklist do ciclo<ArrowUpRight size={16} /></button>
    </div>
  </div>;
}

function ComparisonPreview({ onOpen }) {
  return <div className="c-comparison-preview">
    <div className="c-comparison-summary"><span className="c-kicker">UM CICLO · DOIS MOMENTOS</span><table aria-label="Exemplo de comparação da pesquisa base com a primeira reavaliação"><thead><tr><th scope="col">Indicador</th><th scope="col">Pesquisa<br />base</th><th scope="col">1ª<br />reavaliação</th></tr></thead><tbody>
      <tr><th scope="row">Índice de saúde<small>De 0 a 100</small></th><td><strong>48</strong></td><td><strong>79</strong><span>+31 pontos</span></td></tr>
      <tr><th scope="row">Dimensões em atenção<small>Temas avaliados</small></th><td><strong>28</strong></td><td><strong>12</strong><span>16 a menos</span></td></tr>
    </tbody></table><p>Um índice maior e menos dimensões em atenção indicam uma evolução favorável nos indicadores.</p><span className="c-comparison-example">Exemplo do ciclo demonstrativo da Vértice Logística.</span></div>
    <Capture name="comparison" onOpen={onOpen} />
  </div>;
}

function Journey({ onOpen }) {
  const [active, setActive] = useState(0);
  const step = journey[active];
  const id = useId();
  const selectWithKeyboard = (event, index) => {
    const keys = { ArrowRight: (index + 1) % journey.length, ArrowLeft: (index - 1 + journey.length) % journey.length, Home: 0, End: journey.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    setActive(next);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
  };
  return <section className="c-section c-journey" id="como-funciona" aria-labelledby="journey-title">
    <div className="c-section-heading"><span className="c-kicker">DA ESCUTA À AÇÃO</span><h2 id="journey-title">Ouvir é o começo.<br /><span>Veja o que vem depois.</span></h2><p>Explore como o RH cria a pesquisa, acompanha as ações e volta a avaliar a equipe.</p></div>
    <CycleExplainer onOpen={onOpen} />
    <div className="c-journey-shell"><div className="c-step-tabs" role="tablist" aria-label="Explore o Sentinel">{journey.map((item, index) => <button key={item.name} id={`${id}-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => selectWithKeyboard(event, index)}><span className="c-step-node"><item.icon size={20} aria-hidden="true" /></span><b>{item.name}</b><span className="c-step-number">0{index + 1}</span></button>)}</div>
      <div className={`c-journey-panel c-tone-${step.tone}`} id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
        <div className="c-journey-copy" key={`copy-${active}`}><span className="c-kicker">{step.label}</span><h3>{step.title}</h3><p>{step.body}</p><div className="c-step-takeaway"><Check size={17} aria-hidden="true" /><span>{step.takeaway}</span></div></div>
        <div className="c-journey-screen" key={step.capture}><div className="c-screen-chrome"><span className="c-window-dots"><i /><i /><i /></span><span>Sentinel / {step.name}</span><ShieldCheck size={13} /></div>{step.capture === 'comparison' ? <ComparisonPreview onOpen={onOpen} /> : <Capture name={step.capture} onOpen={onOpen} className={step.capture === 'survey' ? 'c-survey-capture' : ''} />}</div>
      </div>
      <div className="c-journey-bottom"><span>0{active + 1}<i> / 04</i></span>{active < journey.length - 1 ? <button onClick={() => setActive(active + 1)}>Próximo: {journey[active + 1].name}<ArrowRight size={17} /></button> : <button onClick={() => setActive(0)}>Rever o caminho<RotateCcw size={17} /></button>}</div>
    </div>
  </section>;
}

function RagExplainer({ onOpen }) {
  return <div className="c-rag-workflow" role="region" aria-labelledby="rag-workflow-title">
    <div className="c-rag-title"><span className="c-kicker">CONHECIMENTO APLICADO AO TRABALHO</span><h3 id="rag-workflow-title">Do documento à recomendação.</h3><p><strong>RAG, em linguagem simples:</strong> buscar trechos relevantes nos documentos e usá-los como contexto para a IA responder.</p></div>
    <ol className="c-rag-steps">
      <li><span>01</span><div><h4>Você reúne o conhecimento</h4><p>O RH adiciona documentos internos à base da empresa.</p></div></li>
      <li><span>02</span><div><h4>O Sentinel busca os trechos</h4><p>O sistema recupera informações relacionadas ao tema do plano ou à pergunta.</p></div></li>
      <li><span>03</span><div><h4>A IA usa e cita as fontes</h4><p>Os trechos contextualizam os planos e as conversas, com referências para consultar.</p></div></li>
    </ol>
    <details className="c-rag-example"><summary><span><BookOpen size={18} aria-hidden="true" />Veja como um documento entra no plano</span><ChevronDown size={18} aria-hidden="true" /></summary>
      <div className="c-rag-example-content"><span className="c-rag-example-label">ÁPICE CONTABILIDADE · AMBIENTE DEMONSTRATIVO</span><div className="c-rag-example-source"><FileText size={20} aria-hidden="true" /><div><b>Política de jornada · item 5</b><p>A política da empresa não prevê pausas programadas além do almoço.</p></div></div>
        <div className="c-rag-example-result"><span><ArrowDown size={16} aria-hidden="true" />Trecho considerado junto à pesquisa e às referências</span><h4>Proposta: pausas fixas no Contábil, inclusive no fechamento mensal.</h4><p>A regra interna ajuda a explicar por que o plano propõe essa mudança. A decisão de aprovar e executar continua com o gestor.</p><button className="c-inline-link" onClick={() => onOpen({ ...captures.plan, detail: 'Plano gerado no ambiente demonstrativo da Ápice Contabilidade, pendente de revisão do gestor. A proposta considera a política de jornada, os resultados da pesquisa e as referências consultadas.' })}>Ver este plano no sistema<ArrowUpRight size={16} /></button></div>
      </div>
    </details>
  </div>;
}

function Audience() {
  const [audience, setAudience] = useState('rh');
  const id = useId();
  const content = audience === 'rh' ? { icon: LayoutDashboard, title: 'Menos etapas soltas. Mais clareza para agir.', text: 'Pesquisa, prioridades, planos e acompanhamento no mesmo lugar. Uma visão do processo para apoiar as decisões do RH.', points: ['Indicadores por dimensão e setor', 'Comparação da pesquisa base com as reavaliações', 'Histórico das decisões e ações'] } : { icon: Users, title: 'Ser ouvido faz parte de um trabalho melhor.', text: 'Um espaço para compartilhar percepções sobre o trabalho, com resultados apresentados de forma agregada e proteção para grupos pequenos.', points: ['Respostas separadas da identificação', 'Resultados por setor só a partir de 5 respostas', 'Canal de denúncia anônima com protocolo'] };
  return <section className="c-section c-audience" id="para-quem" aria-labelledby="audience-title"><span className="c-kicker">TECNOLOGIA QUE CONECTA PESSOAS</span><h2 id="audience-title">Bom para a gestão.<br />Essencial para a escuta.</h2><div className="c-audience-tabs" role="group" aria-label="Escolha uma perspectiva"><button aria-pressed={audience === 'rh'} aria-controls={`${id}-content`} onClick={() => setAudience('rh')}><LayoutDashboard size={17} />Para o RH</button><button aria-pressed={audience === 'equipe'} aria-controls={`${id}-content`} onClick={() => setAudience('equipe')}><Users size={17} />Para a equipe</button></div><div className="c-audience-content" id={`${id}-content`} aria-live="polite"><span className="c-audience-symbol"><content.icon size={30} strokeWidth={1.5} /></span><div><h3>{content.title}</h3><p>{content.text}</p><ul>{content.points.map((point) => <li key={point}><Check size={16} />{point}</li>)}</ul></div></div></section>;
}

function Questions() {
  return <section className="c-section c-questions" id="perguntas" aria-labelledby="questions-title"><div className="c-section-heading"><span className="c-kicker">PODE PERGUNTAR</span><h2 id="questions-title">Sem complicar.</h2></div><div className="c-faq-list">
    <details><summary>O que são riscos psicossociais?<ChevronDown size={19} /></summary><p>São fatores ligados à organização e às relações de trabalho, como excesso de demandas, falta de apoio ou conflitos. O Sentinel ajuda a ouvir a equipe e organizar informações para a empresa investigar e agir.</p></details>
    <details><summary>As respostas são anônimas?<ChevronDown size={19} /></summary><p>As respostas da pesquisa ficam separadas da identificação do participante. O RH vê resultados agregados; setores com menos de cinco respostas não têm seus resultados detalhados exibidos.</p></details>
    <details><summary>Qual a diferença entre pesquisa e ciclo?<ChevronDown size={19} /></summary><p>A pesquisa é uma aplicação do questionário. O ciclo organiza a pesquisa inicial e suas reavaliações no mesmo histórico. Ao aplicar novamente o mesmo questionário à equipe, o RH pode comparar os indicadores e acompanhar mudanças.</p></details>
    <details><summary>A IA decide o que a empresa deve fazer?<ChevronDown size={19} /></summary><p>A IA sugere planos considerando os resultados, documentos e histórico da empresa. A revisão, aprovação e decisão de executar ficam com o gestor. Também é possível discutir o plano no chat.</p></details>
    <details><summary>O que é RAG e como os documentos são usados?<ChevronDown size={19} /></summary><p>RAG é a busca de informações relevantes para contextualizar uma resposta da IA. No Sentinel, o RH adiciona documentos à base de conhecimento. O sistema recupera trechos relacionados ao assunto e os fornece à IA na geração de planos e nas conversas do assistente. As referências permitem consultar o material usado. Assim, o conhecimento da empresa participa das recomendações.</p></details>
    <details><summary>A empresa pode escolher a IA?<ChevronDown size={19} /></summary><p>Sim. É possível escolher modelos diferentes para gerar planos e conversar no chat. Há opções de Claude, GPT e Gemini, além da configuração de outros modelos compatíveis com os provedores integrados. A escolha permite considerar a capacidade do modelo e o consumo.</p></details>
    <details><summary>Como funciona a denúncia anônima?<ChevronDown size={19} /></summary><p>O colaborador acessa o canal da empresa, descreve a situação e pode optar pelo anonimato no relato. Depois do envio, recebe um protocolo para acompanhar o atendimento. Esse canal mantém a escuta aberta entre uma pesquisa e outra.</p></details>
    <details><summary>Como o Sentinel apoia a NR-1?<ChevronDown size={19} /></summary><p>Ele organiza pesquisas, indicadores, ações e registros, incluindo um dossiê para apoiar o PGR. A empresa precisa revisar e complementar a documentação e executar as medidas. O certificado da plataforma registra o processo e não é uma certificação governamental. <a href={NR1} target="_blank" rel="noopener noreferrer">Consulte as orientações do MTE<ArrowUpRight size={13} /></a></p></details>
    <details><summary>Como conhecer melhor o projeto?<ChevronDown size={19} /></summary><p>Converse com a equipe pelo LinkedIn do Sentinel. Podemos apresentar o sistema e entender como essa jornada se conecta à sua organização.</p></details>
  </div></section>;
}

export default function CommercialPage() {
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [risk, setRisk] = useState(0);
  const [showDock, setShowDock] = useState(false);
  const hero = useRef(null);
  const contact = useRef(null);
  useEffect(() => {
    let heroVisible = true;
    let contactVisible = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero.current) heroVisible = entry.isIntersecting;
        if (entry.target === contact.current) contactVisible = entry.isIntersecting;
      });
      setShowDock(!heroVisible && !contactVisible);
    }, { threshold: 0 });
    observer.observe(hero.current);
    observer.observe(contact.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);
  const riskExample = riskExamples[risk];
  return <div className="c-page">
    <a className="c-skip" href="#conteudo">Pular para o conteúdo</a>
    <header className="c-header"><div className="c-header-inner"><Brand /><nav className="c-desktop-nav" aria-label="Navegação principal"><a href="#como-funciona">Como funciona</a><a href="#diferenciais">Por que Sentinel</a><a href="#perguntas">Perguntas</a></nav><div className="c-header-actions"><a className="c-header-social" href={LINKEDIN} aria-label="Sentinel no LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin size={17} /><span>LinkedIn</span></a><button className="c-icon-button c-menu-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="commercial-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button></div></div><nav className="c-mobile-menu" id="commercial-menu" aria-label="Navegação do celular" hidden={!menuOpen}>{[['#como-funciona','Como funciona'],['#diferenciais','Por que Sentinel'],['#perguntas','Perguntas'],['#contato','Conheça a equipe']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={19} /></a>)}</nav></header>
    <main id="conteudo">
      <div className="c-campaign-wrap"><section className="c-hero c-section" id="inicio" ref={hero} aria-labelledby="hero-title"><div className="c-hero-copy"><span className="c-intro-pill"><span />EUREKA 2026 <i>·</i> STAND 26</span><h1 id="hero-title">Por trás de<br />cada meta,<br />existe <span>uma pessoa.</span></h1><p className="c-hero-question">Como a sua empresa cuida delas?</p><p>Uma plataforma para o RH ouvir a equipe, identificar riscos psicossociais e acompanhar ações na empresa.</p><div className="c-hero-actions"><LinkedInLink className="c-primary-button c-hero-contact" source="abertura">Fale com a gente no LinkedIn</LinkedInLink><a className="c-hero-explore" href="#como-funciona">Conheça na prática<ArrowDown size={17} /></a></div><span className="c-hero-note"><Fingerprint size={16} />Pessoas preservadas. Decisões com contexto.</span></div>
        <div className="c-hero-art"><div className="c-orbit c-orbit-one" aria-hidden="true" /><div className="c-orbit c-orbit-two" aria-hidden="true" /><span className="c-floating-note"><Fingerprint size={17} />A voz da equipe importa.</span><div className="c-hero-product"><div className="c-hero-product-title"><span className="c-mini-icon"><BarChart3 size={20} /></span><div><span>DO SISTEMA PARA A GESTÃO</span><h2>O que merece atenção?</h2></div><span className="c-demo-label">Exemplo</span></div><Capture name="attention" onOpen={setSelected} eager /><div className="c-hero-process"><span><MessageCircle size={15} />Escutar</span><ArrowRight size={13} /><span><BarChart3 size={15} />Entender</span><ArrowRight size={13} /><span><Sparkles size={15} />Agir</span></div></div><div className="c-hero-caption"><span className="c-small-star">✳</span>Um caminho entre ouvir e fazer.</div></div>
      </section></div>

      <section className="c-problem-wrap"><div className="c-section c-problem" aria-labelledby="problem-title"><div><span className="c-kicker">ANTES DE UM PLANO, UMA PERCEPÇÃO</span><h2 id="problem-title">O trabalho deixa sinais.<br /><span>É preciso escutar.</span></h2><p>Algumas situações fazem parte da rotina. Isso não significa que devam passar despercebidas.</p></div><div className="c-risk-example"><div className="c-risk-tabs" role="group" aria-label="Explore situações no trabalho">{riskExamples.map((item, index) => <button key={item.name} aria-pressed={risk === index} onClick={() => setRisk(index)}>{item.name}</button>)}</div><div className="c-risk-copy" aria-live="polite"><riskExample.icon size={29} strokeWidth={1.5} /><p>{riskExample.text}</p><span>{riskExample.bridge}</span></div></div></div></section>

      <Journey onOpen={setSelected} />

      <section className="c-ai-wrap" id="diferenciais"><div className="c-section c-ai" aria-labelledby="ai-title">
        <div className="c-ai-heading"><span className="c-kicker"><Sparkles size={14} />RAG · INTELIGÊNCIA COM CONTEXTO</span><h2 id="ai-title">Antes de sugerir,<br /><span>a IA consulta.</span></h2><p>O conhecimento da empresa faz parte do trabalho: documentos internos, histórico de ações e referências ajudam a construir planos e respostas conectados à sua realidade.</p><a className="c-inline-link c-rag-anchor" href="#rag-no-trabalho">Entenda como o RAG funciona<ArrowDown size={17} /></a></div>
        <div className="c-ai-inputs"><div><span className="c-input-icon"><FileText size={21} /></span><section><h3>Documentos da sua empresa</h3><p>Políticas de jornada, atas da CIPA, PGR e regras internas na base de conhecimento.</p></section></div><div><span className="c-input-icon"><History size={21} /></span><section><h3>Memória das ações</h3><p>O histórico ajuda a considerar o que funcionou e evitar repetir abordagens que falharam.</p></section></div><div><span className="c-input-icon"><BookOpen size={21} /></span><section><h3>Referências para fundamentar</h3><p>Normas, guias e pesquisas apoiam a elaboração das propostas e suas justificativas.</p></section></div><button className="c-inline-link" onClick={() => setSelected(captures.knowledge)}>Veja a base de conhecimento<ArrowUpRight size={17} /></button></div>
        <div className="c-rag-container" id="rag-no-trabalho"><RagExplainer onOpen={setSelected} /></div>
        <div className="c-model-choice" role="region" aria-labelledby="model-choice-title"><BrainCircuit size={25} strokeWidth={1.6} aria-hidden="true" /><div><h3 id="model-choice-title">A IA também é uma escolha da empresa.</h3><p>Escolha modelos diferentes para gerar planos e conversar no chat, conforme a capacidade e o consumo desejados.</p><ul aria-label="Opções de modelos de IA"><li>Claude</li><li>GPT</li><li>Gemini</li><li>Outros modelos compatíveis</li></ul></div></div>
        <div className="c-human-decision"><span><BrainCircuit size={24} /><ArrowRight size={17} /><Users size={24} /></span><p>A IA sugere.<br /><strong>As pessoas decidem.</strong></p><ShieldCheck size={23} /></div>
      </div></section>

      <section className="c-section c-beyond" aria-labelledby="beyond-title"><div className="c-section-heading"><span className="c-kicker">DA DECISÃO AO ACOMPANHAMENTO</span><h2 id="beyond-title">Não termina<br />no relatório.</h2><p>Ferramentas para dar continuidade ao que foi ouvido.</p></div><div className="c-extra-grid">{extras.map((item) => <button key={item.title} className="c-extra-card" onClick={() => setSelected({ ...captures[item.capture], title: item.title, detail: item.detail })}><span className="c-extra-icon"><item.icon size={23} strokeWidth={1.6} /></span><h3>{item.title}</h3><p>{item.body}</p><span className="c-extra-more">Ver no sistema<ArrowUpRight size={16} /></span></button>)}</div></section>

      <Audience />
      <Questions />

      <section className="c-contact" id="contato" ref={contact} aria-labelledby="contact-title"><div className="c-contact-inner"><span className="c-contact-emblem"><img src="/comercial/sentinel-logo.png" width="72" height="72" alt="" loading="lazy" /></span><span className="c-kicker">VAMOS CONTINUAR ESSA CONVERSA?</span><h2 id="contact-title">O cuidado começa<br />com uma conexão.</h2><p>Conheça a equipe, acompanhe o projeto e descubra mais sobre o Sentinel.</p><LinkedInLink className="c-contact-link" source="estande">Vamos conversar no LinkedIn</LinkedInLink><span className="c-contact-signature">Da escuta à ação.<HeartHandshake size={19} /></span></div></section>
    </main>
    <footer className="c-footer"><div><Brand footer /><p>Tecnologia para apoiar o cuidado<br />com as pessoas no trabalho.</p></div><span>Projeto desenvolvido por alunos de Sistemas de Informação<br /><b>Instituto Mauá de Tecnologia</b></span><div className="c-footer-bottom"><span>© {new Date().getFullYear()} Sentinel · Projeto em desenvolvimento.</span><a href="#inicio">Voltar ao início<ArrowUpRight size={15} /></a></div></footer>
    <aside className={`c-contact-dock${showDock ? ' is-visible' : ''}`} aria-label="Contato rápido" inert={!showDock}><span>Fale com<br /><b>a equipe.</b></span><LinkedInLink source="contato_rapido">Contato no LinkedIn</LinkedInLink></aside>
    {selected && <CaptureDialog selected={selected} onClose={() => setSelected(null)} />}
  </div>;
}
