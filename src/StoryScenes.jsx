import React, { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, BookOpen, BrainCircuit, Check, CheckCheck, Clock3, Pause, Play, RotateCcw, Users, X } from 'lucide-react';

export const speakerNotes = [
  { time: '0:00–0:40', cue: 'Comece pelas pessoas.', text: 'Imagine uma equipe que entrega tudo. As demandas aumentam, as mensagens continuam fora do expediente e os sinais se acumulam. Quem percebe antes que alguém precise parar?', bridge: 'Esse problema já aparece nos dados.' },
  { time: '0:40–1:25', cue: 'Dê dimensão ao problema.', text: 'Em 2024, foram registrados mais de 472 mil afastamentos por transtornos mentais e comportamentais no Brasil. Esse total não significa que todos foram causados pelo trabalho. A NR-1 passou a incluir expressamente os fatores psicossociais no gerenciamento de riscos.', bridge: 'Mas coletar respostas ainda deixa uma pergunta: o que fazer depois?' },
  { time: '1:25–2:00', cue: 'Mostre a lacuna.', text: 'Uma pesquisa pode revelar sobrecarga. Uma planilha pode organizar respostas. A dificuldade é conectar a escuta a uma prioridade, escolher uma ação viável e acompanhar sua execução. Alterne as duas visões para mostrar essa passagem.', bridge: 'Foi para conectar esse ciclo que criamos o Sentinel.' },
  { time: '2:00–2:40', cue: 'Apresente o produto em uma frase.', text: 'O Sentinel apoia a gestão de riscos psicossociais: conecta a escuta dos colaboradores, indicadores por setor e planos de ação acompanháveis. Explore os três pilares no diagrama. As telas reais começam na próxima cena.', bridge: 'Vamos percorrer a jornada do gestor.' },
  { time: '2:40–4:00', cue: 'Demonstre decisões, não todos os botões.', text: 'No pitch curto, selecione Empresa, Dashboard, Plano de ação e Kanban. Mostre como o contexto entra, onde o gestor enxerga as prioridades, como revisa uma sugestão e como acompanha a execução. No pitch de dez minutos, explore pesquisas, dossiê e denúncias.', bridge: 'O diferencial está no contexto que chega à IA.' },
  { time: '4:00–4:50', cue: 'Traduza RAG sem jargão.', text: 'A empresa adiciona seus documentos. O sistema recupera trechos relevantes e os entrega como contexto à IA, junto às informações da análise. Isso ajuda a produzir sugestões situadas. A decisão e a revisão continuam com o gestor. Recuperar documentos não garante que toda resposta esteja correta.', bridge: 'Veja essa lógica em um exemplo simples.' },
  { time: '4:50–6:10', cue: 'Um caso do Contábil, do início ao fim.', text: 'O dashboard da pesquisa destaca ritmo de trabalho. Seguimos esse alerta até o plano exibido para o Contábil: pausas fixas, inclusive no fechamento mensal. Mostre como o perfil da empresa e a política mencionada no plano contextualizam a proposta. O gestor revisa, acompanha a execução e pode preparar uma nova aplicação do COPSOQ II. A comparação depende dessa nova coleta.', bridge: 'O ganho é conectar informação, decisão e continuidade.' },
  { time: '6:10–7:00', cue: 'Feche com valor e propósito.', text: 'Para o colaborador, escuta protegida. Para o RH, prioridades e planos acompanháveis. Para a organização, histórico e evidências do processo. O valor demonstrado é operacional; ainda não medimos redução de afastamentos ou retorno financeiro. Sentinel: perceber os sinais, transformar escuta em ação.', bridge: 'Abra espaço para perguntas e retome qualquer capítulo pelo índice.' },
];

function Heading({ number, label, title, children }) {
  return <div className="story-heading"><span className="eyebrow"><span>{number}</span>{label}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

export function GapScene() {
  const [connected, setConnected] = useState(false);
  const nodes = [
    { icon: Users, title: 'Escutar', before: 'Respostas em um formulário.', after: 'Percepções em uma coleta estruturada.' },
    { icon: BarChart3, title: 'Compreender', before: 'Uma planilha para interpretar.', after: 'Indicadores que apontam prioridades.' },
    { icon: BrainCircuit, title: 'Decidir', before: 'E agora, o que fazer?', after: 'Sugestões com o contexto da empresa.' },
    { icon: CheckCheck, title: 'Acompanhar', before: 'A pesquisa acaba aqui.', after: 'Responsáveis, tarefas e nova coleta.' },
  ];
  return <section className={`scene gap-scene ${connected ? 'is-connected' : ''}`} aria-label="Da coleta à gestão">
    <Heading number="03" label="A LACUNA" title={<>Ouvir é o começo.<br /><em>O que acontece depois?</em></>}>O desafio está em transformar percepções em uma decisão que possa ser acompanhada.</Heading>
    <div className="comparison-toggle" role="group" aria-label="Comparar formas de gestão">
      <button aria-pressed={!connected} onClick={() => setConnected(false)}>Processo fragmentado</button>
      <button aria-pressed={connected} onClick={() => setConnected(true)}>Com Sentinel <ArrowRight size={15} /></button>
    </div>
    <div className="decision-chain">{nodes.map((node, i) => <React.Fragment key={node.title}>
      {i > 0 && <div className="chain-connector" aria-hidden="true"><span /><ArrowRight size={20} /></div>}
      <article className={`decision-node node-${i}`}><span className="node-index">0{i + 1}</span><node.icon size={36} strokeWidth={1.3} /><h3>{node.title}</h3><p key={String(connected)}>{connected ? node.after : node.before}</p><span className="node-status">{connected ? <><Check size={13} />Etapa conectada</> : <><span className="broken-dot" />Informação isolada</>}</span></article>
    </React.Fragment>)}</div>
    <div className="gap-takeaway"><span>{connected ? 'UM CICLO DE GESTÃO' : 'O PONTO DE RUPTURA'}</span><b>{connected ? 'Da escuta à ação. Da ação à próxima avaliação.' : 'Dados só ajudam quando chegam a uma decisão.'}</b></div>
    <small className="story-disclosure">Comparação conceitual de processos, sem medição de desempenho.</small>
  </section>;
}

export { CaseScene } from './CaseStudy';

export function PresenterPanel({ scene, onClose }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);
  const note = speakerNotes[scene];
  return <aside className="presenter-panel" aria-label="Roteiro de ensaio"><div className="presenter-head"><span><BookOpen size={17} />Roteiro de ensaio</span><button className="bare-icon" aria-label="Fechar roteiro" onClick={onClose}><X size={18} /></button></div><div className="rehearsal-clock"><Clock3 size={18} /><output aria-label="Tempo de ensaio">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</output><button className="bare-icon" aria-label={running ? 'Pausar cronômetro' : 'Iniciar cronômetro'} onClick={() => setRunning(!running)}>{running ? <Pause size={17} /> : <Play size={17} />}</button><button className="bare-icon" aria-label="Zerar cronômetro" onClick={() => { setSeconds(0); setRunning(false); }}><RotateCcw size={16} /></button></div><div className="presenter-copy" key={scene}><span>ROTEIRO SUGERIDO DE 7 MIN · {note.time}</span><h3>{note.cue}</h3><p>{note.text}</p><div><b>Transição</b><p>{note.bridge}</p></div></div><small>Visível na projeção. Use para ensaiar e feche antes de apresentar. Atalho: N.</small></aside>;
}
