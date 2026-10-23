import React, { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, BookOpen, BrainCircuit, Check, CheckCheck, Clock3, Pause, Play, RotateCcw, Users, X } from 'lucide-react';

export const speakerNotes = [
  { time: '0:00–0:30', cue: 'Comece pelas pessoas.', text: 'Imagine uma equipe que entrega tudo. As demandas aumentam, as mensagens continuam fora do expediente e os sinais se acumulam. Quem percebe antes que alguém precise parar?', bridge: 'Esse problema já aparece nos dados.' },
  { time: '0:30–1:20', cue: 'Dê dimensão ao problema.', text: 'Em 2024, foram registrados mais de 472 mil afastamentos por transtornos mentais e comportamentais no Brasil. Esse total não significa que todos foram causados pelo trabalho. A NR-1 passou a incluir expressamente os fatores psicossociais no gerenciamento de riscos.', bridge: 'Mas coletar respostas ainda deixa uma pergunta: o que fazer depois?' },
  { time: '1:20–1:40', cue: 'Mostre a lacuna.', text: 'Uma pesquisa pode revelar sobrecarga. Uma planilha pode organizar respostas. A dificuldade é conectar a escuta a uma prioridade, escolher uma ação viável e acompanhar sua execução. Alterne as duas visões para mostrar essa passagem.', bridge: 'Foi para conectar esse ciclo que criamos o Sentinel.' },
  { time: '1:40–2:00', cue: 'Apresente o produto em uma frase.', text: 'O Sentinel apoia a gestão de riscos psicossociais: escuta os colaboradores, transforma respostas em prioridades e acompanha as ações. Explore os três pilares. As telas reais começam na próxima cena.', bridge: 'Tudo começa por um ciclo.' },
  { time: '2:00–3:20', cue: 'Escutar: ciclo, questionários, dimensões, dashboard, dossiê.', text: 'Um ciclo acompanha o mesmo grupo: pesquisa base e reavaliações com o mesmo instrumento. O RH escolhe entre questionários validados, como COPSOQ II e III, JSS e OLBI. As respostas viram dimensões com semáforo, e setores com menos de cinco respostas ficam ocultos. No dashboard, o RH vê onde agir primeiro: na Ápice, ritmo de trabalho e exigências cognitivas em risco. Ao encerrar, o dossiê NR-1 sai pronto. Repare: ainda não falamos de plano.', bridge: 'Antes de sugerir qualquer ação, a IA precisa conhecer a empresa.' },
  { time: '3:20–4:20', cue: 'Mostre a base antes do plano.', text: 'Não é um prompt. O perfil da empresa vira filtro em código. Os documentos da empresa, como a política de jornada e a ata da CIPA, entram na busca. O histórico de ações diz o que já falhou. A base científica traz normas e evidências. Mostre no pipeline qual etapa cada fonte alimenta e feche com a regra: a IA só pode citar o que recebeu.', bridge: 'Agora veja o plano que sai dessa base.' },
  { time: '4:20–5:30', cue: 'Um plano real, com fontes e memória.', text: 'Pausas fixas no Contábil, inclusive no fechamento. Abra as fontes: dois trechos da política da própria empresa, guia do MTE, OMS, JD-R e NR-1, inclusive a evidência contrária da OMS. Em Memória, mostre que o plano evita o erro do PAE e o risco de repetir a palestra que não funcionou. No chat, a pergunta real: por que não repetir a palestra?', bridge: 'E depois que o RH aprova?' },
  { time: '5:30–6:20', cue: 'Execução, reavaliação e aprendizado.', text: 'Aprove o plano do exemplo: o roteiro vira tarefas no Kanban. Ao concluir, o RH diz se funcionou, e isso entra no histórico que a IA consulta. Em Medir e aprender, mostre a captura de comparação entre pesquisas: da base de 26/09 à reavaliação de 20/10, o índice de saúde vai de 60 para 78, ganho de 18 pontos, e as dimensões em atenção caem de 21 para 11. As duas coletas têm adesão de 86%. Reaplicar permite acompanhar se os indicadores melhoraram, pioraram ou ficaram estáveis.', bridge: 'Esse ciclo é o valor do Sentinel.' },
  { time: '6:20–6:45', cue: 'Feche com valor e propósito.', text: 'Clareza, direção, continuidade e conformidade. Para o colaborador, escuta protegida. Para o RH, decisões com base. Para a organização, histórico e evidências. O valor demonstrado é operacional; ainda não medimos redução de afastamentos ou retorno financeiro.', bridge: 'Conecte-se com a gente e acompanhe o projeto.' },
  { time: '6:45–7:00', cue: 'Contato e encerramento.', text: 'Convide a banca e os parceiros a se conectarem à página do Sentinel no LinkedIn. Disponibilize o canal direto para dúvidas, parcerias e contato institucional.', bridge: 'Fim da apresentação.' },
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
