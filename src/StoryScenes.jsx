import React, { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, BookOpen, BrainCircuit, Check, CheckCheck, ChevronRight, ClipboardList, Clock3, FileText, LockKeyhole, Pause, Play, RotateCcw, Users, X } from 'lucide-react';

export const speakerNotes = [
  { time: '0:00–0:40', cue: 'Comece pelas pessoas.', text: 'Imagine uma equipe que entrega tudo. As demandas aumentam, as mensagens continuam fora do expediente e os sinais se acumulam. Quem percebe antes que alguém precise parar?', bridge: 'Esse problema já aparece nos dados.' },
  { time: '0:40–1:25', cue: 'Dê dimensão ao problema.', text: 'Em 2024, foram registrados mais de 472 mil afastamentos por transtornos mentais e comportamentais no Brasil. Esse total não significa que todos foram causados pelo trabalho. A NR-1 passou a incluir expressamente os fatores psicossociais no gerenciamento de riscos.', bridge: 'Mas coletar respostas ainda deixa uma pergunta: o que fazer depois?' },
  { time: '1:25–2:00', cue: 'Mostre a lacuna.', text: 'Uma pesquisa pode revelar sobrecarga. Uma planilha pode organizar respostas. A dificuldade é conectar a escuta a uma prioridade, escolher uma ação viável e acompanhar sua execução. Alterne as duas visões para mostrar essa passagem.', bridge: 'Foi para conectar esse ciclo que criamos o Sentinel.' },
  { time: '2:00–2:40', cue: 'Apresente o produto em uma frase.', text: 'O Sentinel apoia a gestão de riscos psicossociais: conecta a escuta dos colaboradores, indicadores por setor e planos de ação acompanháveis. Explore os três pilares no diagrama. As telas reais começam na próxima cena.', bridge: 'Vamos percorrer a jornada do gestor.' },
  { time: '2:40–4:00', cue: 'Demonstre decisões, não todos os botões.', text: 'No pitch curto, selecione Empresa, Dashboard, Plano de ação e Kanban. Mostre como o contexto entra, onde o gestor enxerga as prioridades, como revisa uma sugestão e como acompanha a execução. No pitch de dez minutos, explore pesquisas, dossiê e denúncias.', bridge: 'O diferencial está no contexto que chega à IA.' },
  { time: '4:00–4:50', cue: 'Traduza RAG sem jargão.', text: 'A empresa adiciona seus documentos. O sistema recupera trechos relevantes e os entrega como contexto à IA, junto às informações da análise. Isso ajuda a produzir sugestões situadas. A decisão e a revisão continuam com o gestor. Recuperar documentos não garante que toda resposta esteja correta.', bridge: 'Veja essa lógica em um exemplo simples.' },
  { time: '4:50–6:10', cue: 'Conte um caso completo.', text: 'Este cenário é fictício. Em Operações, a sobrecarga chama atenção. Com o contexto da empresa, a sugestão é revisar a distribuição de demandas, definir responsável e prazo. Marque uma tarefa como concluída. Concluir a ação não prova melhora: uma nova coleta ajuda a avaliar sua evolução.', bridge: 'O ganho é conectar informação, decisão e continuidade.' },
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

const caseStages = [
  { title: 'Sinal', icon: BarChart3, heading: 'Onde olhar primeiro?', text: 'No exemplo, a sobrecarga em Operações pede atenção. O indicador orienta uma investigação sobre a organização do trabalho.', takeaway: 'Enxergar uma prioridade, sem expor respostas individuais.' },
  { title: 'Contexto', icon: BookOpen, heading: 'O que a IA precisa saber?', text: 'A recuperação de documentos traz trechos relacionados ao problema. O contexto ajuda a formular uma sugestão compatível com a realidade da empresa.', takeaway: 'Contextualizar a sugestão com informações relevantes.' },
  { title: 'Plano', icon: ClipboardList, heading: 'Qual é o próximo passo?', text: 'Uma sugestão vira um plano apenas depois da revisão do gestor: o que fazer, quem acompanha e quando verificar.', takeaway: 'Transformar a prioridade em uma ação concreta.' },
  { title: 'Acompanhamento', icon: RotateCcw, heading: 'Executar resolveu o problema?', text: 'O registro acompanha a execução. Uma nova coleta ajuda a verificar a evolução; uma tarefa concluída, sozinha, não demonstra redução do risco.', takeaway: 'Fechar a tarefa. Reabrir a escuta.' },
];
const documentExamples = [
  { title: 'Política de jornada', fragment: 'Demandas não urgentes devem ser planejadas dentro da jornada da equipe.', context: 'Revisar a distribuição das demandas e combinar critérios para urgências.' },
  { title: 'Guia de liderança', fragment: 'A liderança deve revisar prioridades e capacidade da equipe nas reuniões de planejamento.', context: 'Incluir uma revisão de capacidade no planejamento semanal com a liderança.' },
  { title: 'Contexto operacional', fragment: 'A equipe possui recursos limitados para novas contratações neste ciclo.', context: 'Priorizar ajustes de processo antes de sugerir ampliação da equipe.' },
];

export function CaseScene() {
  const [stage, setStage] = useState(0);
  const [doc, setDoc] = useState(0);
  const [done, setDone] = useState(false);
  const current = caseStages[stage];
  return <section className="scene case-scene" aria-label="Caso interativo ilustrativo">
    <div className="case-top"><Heading number="07" label="NA PRÁTICA" title={<>Um sinal. Um contexto.<br /><em>Um próximo passo.</em></>} /><span className="demo-badge"><span />CENÁRIO FICTÍCIO</span></div>
    <nav className="case-stages" aria-label="Etapas do caso">{caseStages.map((item, i) => <button key={item.title} aria-current={stage === i ? 'step' : undefined} onClick={() => setStage(i)}><span>0{i + 1}</span><item.icon size={18} />{item.title}{i < 3 && <ChevronRight className="case-chevron" size={17} />}</button>)}</nav>
    <div className="case-workspace"><div className="case-visual" key={stage}>
      {stage === 0 && <div className="example-heatmap"><div className="visual-label"><BarChart3 size={16} />MAPA DE ATENÇÃO <span>Exemplo qualitativo</span></div><div className="heatmap-grid"><span>SETOR / DIMENSÃO</span><b>Sobrecarga</b><b>Apoio</b><b>Autonomia</b>{[
        ['Operações', 'Priorizar', 'Observar', 'Observar'], ['Comercial', 'Observar', 'Acompanhar', 'Observar'], ['Administrativo', 'Acompanhar', 'Observar', 'Acompanhar'],
      ].map((row) => <React.Fragment key={row[0]}><strong>{row[0]}</strong>{row.slice(1).map((label, i) => <span key={i} className={`heat-cell heat-${label.toLowerCase()}`}>{label}</span>)}</React.Fragment>)}</div><div className="heatmap-callout"><span /><p><b>Operações → sobrecarga</b>Um ponto de partida para investigar demandas, prazos e capacidade.</p></div><small>Classificações inventadas para a narrativa. Não representam escores ou critérios clínicos.</small></div>}
      {stage === 1 && <div className="context-example"><div className="visual-label"><FileText size={16} />DOCUMENTOS DO EXEMPLO</div><div className="example-docs" role="group" aria-label="Selecionar documento de contexto">{documentExamples.map((item, i) => <button key={item.title} aria-pressed={doc === i} onClick={() => setDoc(i)}><FileText size={18} />{item.title}</button>)}</div><div className="retrieved-fragment" key={doc}><span>TRECHO RELEVANTE · FICTÍCIO</span><blockquote>“{documentExamples[doc].fragment}”</blockquote></div><div className="context-arrow"><ArrowRight size={17} /><span>Contexto para a sugestão</span></div><div className="context-suggestion"><BrainCircuit size={24} /><p>{documentExamples[doc].context}</p></div><small>Simulação didática de recuperação; sem upload ou chamada a um modelo de IA.</small></div>}
      {stage === 2 && <div className="example-plan"><div className="visual-label"><ClipboardList size={16} />SUGESTÃO PARA REVISÃO <span>Plano ilustrativo</span></div><h3>Revisar a distribuição<br />de demandas.</h3><div className="plan-grid">{[['O quê', 'Revisar prioridades e capacidade'], ['Por quê', 'Investigar o sinal de sobrecarga'], ['Quem', 'Liderança de Operações + RH'], ['Quando', 'Próximas duas semanas'], ['Como', 'Mapear demandas e pactuar limites'], ['Custo', 'A estimar pelo gestor']].map(([label, text]) => <div key={label}><span>{label}</span><b>{text}</b></div>)}</div><div className="review-seal"><Users size={17} />Revisão humana antes da execução</div></div>}
      {stage === 3 && <div className="example-followup"><div className="visual-label"><CheckCheck size={16} />EXECUÇÃO E NOVA ESCUTA <span>Interaja abaixo</span></div><button className={`example-task ${done ? 'is-done' : ''}`} aria-pressed={done} onClick={() => setDone(!done)}><span className="task-checkbox">{done && <Check size={17} />}</span><span><b>Realizar revisão de capacidade</b><small>Liderança + RH · tarefa ilustrativa</small></span><span className="task-state">{done ? 'Concluída' : 'A fazer'}</span></button><div className="followup-line"><span className="followup-dot active" /><i /><span className={`followup-dot ${done ? 'active' : ''}`} /><i /><span className="followup-dot" /></div><div className="followup-labels"><span>Plano revisado</span><span>{done ? 'Execução registrada' : 'Executar a ação'}</span><span>Nova avaliação</span></div><div className="next-measure"><RotateCcw size={28} /><div><b>{done ? 'A ação foi registrada. E o risco?' : 'Acompanhar vai além do status.'}</b><p>{done ? 'Reaplique o instrumento e compare as coletas. O resultado ainda precisa ser observado.' : 'Conclua a tarefa do exemplo para visualizar o próximo passo do ciclo.'}</p></div></div></div>}
    </div><aside className="case-explanation"><span className="case-step-label">A DECISÃO {String(stage + 1).padStart(2, '0')}</span><h3>{current.heading}</h3><p>{current.text}</p><div className="case-takeaway"><current.icon size={22} /><b>{current.takeaway}</b></div><button className="text-button" onClick={() => setStage((stage + 1) % caseStages.length)}>{stage === 3 ? 'Recomeçar o caso' : 'Continuar o caso'}<ArrowRight size={17} /></button></aside></div>
    <small className="story-disclosure">Demonstração local com dados fictícios. O exemplo explica o fluxo; não constitui resultado de uma empresa ou análise real da IA.</small>
  </section>;
}

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
