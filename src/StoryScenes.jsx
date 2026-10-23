import React, { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, BookOpen, BrainCircuit, Check, CheckCheck, Clock3, Pause, Play, RotateCcw, Users, X } from 'lucide-react';

export const speakerNotes = [
  { time: '0:00–0:30', cue: 'Pedrão: apresente a equipe e o problema.', text: 'Apresente o Sentinel e a motivação do projeto. Demandas, prazos e mensagens fora do expediente ajudam a ilustrar os fatores psicossociais. Quem percebe os sinais antes que alguém precise parar?', bridge: 'Esse problema já aparece nos dados.' },
  { time: '0:30–1:20', cue: 'Pedrão: dimensão do problema e NR-1.', text: 'Em 2024, foram registrados mais de 472 mil afastamentos por transtornos mentais e comportamentais. A NR-1 existe desde 1978; a atualização citada está em vigor desde 26 de maio de 2026. Explique identificação dos riscos, medidas, acompanhamento e possibilidade de autuações por descumprimento.', bridge: 'Peep apresenta a dificuldade de manter esse processo conectado.' },
  { time: '1:20–1:40', cue: 'Peep: mostre a lacuna.', text: 'Pesquisas, decisões e tarefas espalhadas dificultam acompanhar as ações e reunir evidências do que foi feito. Alterne as duas visões para mostrar a passagem a um processo conectado.', bridge: 'Foi para conectar esse ciclo que criamos o Sentinel.' },
  { time: '1:40–2:00', cue: 'Peep: a proposta da solução.', text: 'O Sentinel reúne escuta, análise e ação em um ciclo de gestão. A empresa identifica prioridades, organiza medidas e volta a avaliar sua equipe. Mostre os pilares sem aprofundar a implementação.', bridge: 'Gustavo começa na criação da pesquisa base do ciclo.' },
  { time: '2:00–6:00', cue: 'Gustavo → Dust → Gustavo, no fluxo do produto.', text: 'Gustavo (2:00–3:30): Criar pesquisa, Ciclo de pesquisa e Dashboard. Explique formulário, participantes, adesão e dimensões de risco. Dust (3:30–5:15): Base científica, Contexto da empresa, Base de conhecimento + RAG, Plano de ação e RAG na prática. Mostre os prints de justificativa e chat, alternando Documentos consultados e Política e referência. Explique a escolha de modelos separados para planos e chat, equilibrando capacidade e custo de tokens. Às 5:15, Gustavo retoma em Kanban e segue por Reavaliação, Dossiê, Certificado Sentinel e Denúncia anônima. O dossiê reúne os registros; o certificado documenta a aplicação da pesquisa, com empresa, ciclo e adesão. Não reiniciar a página nas trocas de pessoa.', bridge: 'Às 6:00, Fofinho assume o exemplo na página 6, Na prática.' },
  { time: '6:00–6:35', cue: 'Fofinho: um caso do Contábil, do início ao fim.', text: 'O dashboard destaca ritmo de trabalho. Siga Resultado da pesquisa, Contexto da empresa, Plano de ação e Acompanhamento. A proposta prevê pausas no Contábil mesmo durante o fechamento, com coordenador e RH, prazo de um a três meses e estimativa de zero a 540 reais. A execução é simulada; uma nova coleta permite comparar os indicadores.', bridge: 'O ganho é conectar informação, decisão e continuidade.' },
  { time: '6:35–6:50', cue: 'Fofinho: clareza, direção e continuidade.', text: 'Conecte prioridades, planos contextualizados e acompanhamento, com histórico para o RH. O valor demonstrado é operacional; o impacto sobre afastamentos ainda precisa ser avaliado.', bridge: 'Conheça o projeto e converse com a equipe.' },
  { time: '6:50–7:00', cue: 'Fofinho: contato e encerramento.', text: 'Convide o público a acessar o LinkedIn do Sentinel para conhecer a plataforma ou conversar com a equipe. Encerre com Da escuta à ação e deixe o contato visível.', bridge: 'Fim da apresentação.' },
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
