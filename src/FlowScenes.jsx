import React, { useState } from 'react';
import {
  ArrowRight, BarChart3, BookOpen, BrainCircuit, Check, CheckCheck, ClipboardCheck, ClipboardList, Database,
  FileText, Fingerprint, History, Maximize2, MessageCircle, RotateCcw, Settings2,
  ShieldCheck, Sparkles, TrendingUp, Award, Users,
} from 'lucide-react';
import { ProductScreen, SceneTitle, TagRow, media } from './shared';

function FlowStages({ stages, active, onSelect, label }) {
  return <div className="flow-stages" role="tablist" aria-label={label} style={{ '--stage-count': stages.length }}>{stages.map((item, index) => <button key={item.title} role="tab" aria-selected={active === index} className={active === index ? 'active' : ''} onClick={() => onSelect(index)}><span className="flow-stage-icon"><item.icon size={19} /></span><span><b>{item.title}</b><small>{item.caption}</small></span><span className="flow-stage-number">0{index + 1}</span></button>)}</div>;
}

function EvidenceButton({ image, title, onOpen, children }) {
  return <button className="flow-evidence" onClick={() => onOpen({ file: media[image].file, title })}><Maximize2 size={13} />{children}</button>;
}

function FlowAside({ stage, children }) {
  return <aside className="flow-aside" key={stage.title}><stage.icon size={28} strokeWidth={1.4} /><h3>{stage.heading}</h3><p>{stage.text}</p>{stage.points && <ul>{stage.points.map((point) => <li key={point}>{point}</li>)}</ul>}{children}</aside>;
}

/* 05 · O ciclo ------------------------------------------------------------ */

const cycleStages = [
  { title: 'O ciclo', caption: 'Base e reavaliações', icon: RotateCcw, image: 'ciclos', heading: 'Um ciclo acompanha o mesmo grupo ao longo do tempo.', text: 'Tudo começa com uma pesquisa base. As reavaliações usam o mesmo instrumento e permitem comparar se os riscos diminuíram.', points: ['Pesquisa base + reavaliações', 'Adesão acompanhada durante a coleta', 'Ciclo 2026 da Ápice: 84 respostas de 98 convidados'] },
  { title: 'Os questionários', caption: 'Instrumentos validados', icon: ClipboardList, image: 'instrumentos', heading: 'Instrumentos validados, não perguntas improvisadas.', text: 'O RH escolhe o questionário ao abrir a pesquisa. Cada um tem escala, pontos de corte e manual próprios.', points: ['COPSOQ II · 41, 76 ou 119 perguntas', 'COPSOQ III · 85 perguntas, 31 dimensões', 'JSS · satisfação em 9 facetas', 'OLBI · exaustão e desengajamento'] },
  { title: 'Dimensões', caption: 'Semáforo e anonimato', icon: Fingerprint, heading: 'As respostas viram dimensões, nunca pessoas.', text: 'As perguntas se agrupam em dimensões, como ritmo de trabalho, apoio da liderança e burnout. Cada dimensão recebe um escore e uma cor de risco.', points: ['Escore de 0 a 100 por dimensão', 'Comparação por setor', 'Setores com menos de 5 respostas ficam ocultos'] },
  { title: 'Dashboard', caption: 'Onde agir primeiro', icon: BarChart3, image: 'dashboard', heading: 'O RH enxerga onde a atenção é mais urgente.', text: 'O dashboard da pesquisa reúne adesão, índice de saúde psicossocial e as dimensões que pedem atenção, em ordem de prioridade.', points: ['Ápice: índice 60 de 100 (Atenção)', 'Ritmo de trabalho 69 e exigências cognitivas 67 em risco', '42 respostas de 49 convidados (86%)'] },
  { title: 'Dossiê', caption: 'Ao encerrar a pesquisa', icon: FileText, image: 'dossie', heading: 'Pesquisa encerrada, dossiê NR-1 pronto.', text: 'O Sentinel gera o inventário de riscos psicossociais com a matriz de severidade e probabilidade, para a empresa revisar e integrar ao PGR.', points: ['Inventário de riscos (NR-1, 1.5.7.3.2)', 'Matriz severidade × probabilidade', 'Prioridade e prazo por nível de risco'] },
];

const dimensionGroups = [
  { title: 'Exigências no trabalho', items: 'Ritmo · cognitivas · emocionais', tone: 'risk' },
  { title: 'Organização e conteúdo', items: 'Influência · desenvolvimento · significado', tone: 'good' },
  { title: 'Relações sociais e liderança', items: 'Previsibilidade · liderança · apoio', tone: 'mid' },
  { title: 'Interface trabalho-indivíduo', items: 'Insegurança · trabalho/família', tone: 'risk' },
  { title: 'Valores no local de trabalho', items: 'Confiança · justiça e respeito', tone: 'good' },
  { title: 'Saúde e bem-estar', items: 'Burnout · stress · sintomas depressivos', tone: 'mid' },
  { title: 'Comportamentos ofensivos', items: 'Assédio · violência · ameaças', tone: 'good' },
  { title: 'Personalidade', items: 'Autoeficácia · apenas contexto', tone: 'neutral' },
];

function DimensionsVisual({ onOpen }) {
  return <div className="dimensions-visual">
    <div className="visual-label"><ClipboardList size={16} />COPSOQ II · CATEGORIAS DE DIMENSÕES<span>Exemplo de semáforo</span></div>
    <div className="dimension-grid">{dimensionGroups.map((group) => <div className={`dimension-card tone-${group.tone}`} key={group.title}><i aria-hidden="true" /><b>{group.title}</b><span>{group.items}</span></div>)}</div>
    <div className="dimension-legend"><span className="tone-good"><i />Favorável</span><span className="tone-mid"><i />Intermédio</span><span className="tone-risk"><i />Risco</span></div>
    <div className="anonymity-strip"><Fingerprint size={22} /><div><b>Regra dos 5</b><span>Setores com menos de 5 respostas não têm resultados exibidos. O dossiê registra o motivo.</span></div><EvidenceButton image="anonimato" title="Dossiê NR-1 — participação e setores ocultos" onOpen={onOpen}>Ver no dossiê</EvidenceButton></div>
  </div>;
}

export function CycleScene({ onOpen }) {
  const [stage, setStage] = useState(0);
  const current = cycleStages[stage];
  return <section className="scene flow-scene cycle-scene" aria-label="O ciclo de pesquisas">
    <SceneTitle index="05" eyebrow="COMO FUNCIONA · ESCUTAR" title="Tudo começa por um ciclo." />
    <FlowStages stages={cycleStages} active={stage} onSelect={setStage} label="Etapas do ciclo" />
    <div className="flow-workspace">
      <div className="flow-visual" key={stage}>{current.image ? <ProductScreen image={current.image} title={current.title} onOpen={onOpen} /> : <DimensionsVisual onOpen={onOpen} />}</div>
      <FlowAside stage={current}>{stage === 3 && <EvidenceButton image="dashboard" title="Dashboard da pesquisa — captura do sistema" onOpen={onOpen}>Ver gráficos e ranking</EvidenceButton>}{stage === 4 && <div className="flow-extras"><span><Award size={17} />Certificado Sentinel por nível de evidência</span><span><MessageCircle size={17} />Denúncia anônima entre uma pesquisa e outra</span></div>}</FlowAside>
    </div>
    <div className="flow-handoff"><span>ATÉ AQUI, NENHUM PLANO</span><p>Antes de sugerir qualquer ação, a IA precisa conhecer a empresa.</p><ArrowRight size={18} /></div>
  </section>;
}

/* 06 · A base ------------------------------------------------------------- */

const pipelineSteps = [
  { title: 'Análise', text: 'Dimensões em risco, adesão e tendência entre ciclos.' },
  { title: 'Curadoria', text: 'Filtros em código descartam o que não cabe na empresa ou já falhou nela.' },
  { title: 'Busca (RAG)', text: 'Trechos de normas, ciência e documentos da empresa.' },
  { title: 'Redação', text: 'Cada plano cita trechos numerados (F1, F2…).' },
  { title: 'Aprendizado', text: 'A próxima pesquisa mede o efeito dos planos implantados.' },
];

const foundationStages = [
  { title: 'Perfil da empresa', caption: 'Configurações', icon: Settings2, image: 'perfil', feeds: [1], heading: 'A realidade da empresa vira regra.', text: 'Porte, regime, orçamento, estrutura do RH e restrições entram no pipeline antes da IA escrever qualquer coisa.', points: ['Ápice: 49 colaboradores, trabalho presencial', 'Orçamento e estrutura do RH', 'Restrições e modalidades a evitar'] },
  { title: 'Documentos', caption: 'RAG da empresa', icon: Database, image: 'documentos', feeds: [2, 3], heading: 'Os documentos da empresa entram na busca.', text: 'Políticas, atas e contratos são divididos em trechos. Na hora de gerar o plano, o sistema recupera os trechos relevantes e os entrega à IA.', points: ['Política de jornada e banco de horas', 'Programa de Apoio ao Empregado (PAE)', 'Orçamento de pessoas 2026', 'Ata da CIPA de agosto de 2026'] },
  { title: 'Histórico de ações', caption: 'Memória da IA', icon: History, image: 'historico', feeds: [1, 4], heading: 'O que já foi tentado, e como terminou.', text: 'Intervenções anteriores ficam registradas com o resultado. A IA consulta esse histórico para não repetir o que já falhou.', points: ['PAE: adesão de 4%, divulgado uma única vez', 'Palestra sobre estresse: não funcionou', 'Planos concluídos no Kanban entram aqui'] },
  { title: 'Base científica', caption: 'Normas e evidências', icon: BookOpen, image: 'pipeline', feeds: [2, 3], heading: 'Ciência e normas, com as mesmas regras.', text: 'Uma base global curada pela equipe: NR-1, guias do MTE, diretrizes da OMS, meta-análises e manuais dos questionários.', points: ['32 referências curadas', '11 fontes brasileiras', '7 meta-análises · 8 diretrizes'] },
];

export function FoundationScene({ onOpen }) {
  const [stage, setStage] = useState(0);
  const current = foundationStages[stage];
  return <section className="scene flow-scene foundation-scene" aria-label="A base por trás dos planos">
    <SceneTitle index="06" eyebrow="COMO FUNCIONA · COMPREENDER" title={<>Não é um prompt. <em>É uma base.</em></>}><span className="status-label"><BrainCircuit size={15} />Antes de gerar qualquer plano</span></SceneTitle>
    <FlowStages stages={foundationStages} active={stage} onSelect={setStage} label="Fontes da IA" />
    <div className="flow-workspace foundation-workspace">
      <div className="flow-visual" key={stage}><ProductScreen image={current.image} title={current.title} onOpen={onOpen} /></div>
      <aside className="pipeline-aside" aria-label="Pipeline de geração">
        <span className="pipeline-label">PIPELINE DE GERAÇÃO</span>
        <ol>{pipelineSteps.map((step, index) => <li key={step.title} className={current.feeds.includes(index) ? 'fed' : ''}><span>{index + 1}</span><div><b>{step.title}</b><small>{step.text}</small></div></li>)}</ol>
        <div className="pipeline-current"><current.icon size={17} /><p><b>{current.title}</b> alimenta as etapas destacadas.</p></div>
      </aside>
    </div>
    <div className="flow-handoff guardrail"><ShieldCheck size={19} /><p>Os números vêm do banco e de cálculos no código. A IA escreve o texto e só pode citar as fontes que recebeu: <b>fonte não fornecida é descartada pelo servidor.</b></p></div>
  </section>;
}

/* 07 · O plano ------------------------------------------------------------ */

const planSources = [
  { ref: 'F1', type: 'Documento da empresa', title: 'Política de jornada — item 5', excerpt: 'Não há pausas programadas além do almoço.' },
  { ref: 'F2', type: 'Documento da empresa', title: 'Política de jornada — item 2', excerpt: 'No fechamento (dias 1 a 10) não há limite diário de horas extras.' },
  { ref: 'F3', type: 'Guia oficial', title: 'Guia do MTE sobre riscos psicossociais', excerpt: 'Pausas regulares ajudam a criar uma cultura favorável ao intervalo.' },
  { ref: 'F4', type: 'Referência científica', title: 'OMS · Guidelines on mental health at work', excerpt: 'Para pausas, baixa certeza e ausência de efeito em sintomas.' },
  { ref: 'F5', type: 'Referência científica', title: 'Teoria JD-R (Bakker et al., 2023)', excerpt: 'Oportunidades de recuperação mitigam o impacto da carga.' },
  { ref: 'F6', type: 'Norma', title: 'NR-1, 1.5.5.2 · Planos de ação', excerpt: 'Cronograma com responsáveis, acompanhamento e aferição.' },
];

const planMemory = [
  { from: 'PAE com clínica local', status: 'Parcialmente bem-sucedida', note: 'Adesão de 4%; divulgado uma única vez, por e-mail.', to: 'Plano de comunicação', effect: 'Lançamento presencial e reforço antes de todo dia 1, para evitar o erro do PAE.' },
  { from: 'Palestra anual sobre estresse', status: 'Não funcionou', note: 'Realizada durante o fechamento; sem mudança percebida.', to: 'Riscos de implantação', effect: 'Equipe ver a medida como mais uma ação sem efeito → horários definidos com a própria equipe e resultados mostrados todo mês.' },
];

const planStages = [
  { title: 'O plano', caption: 'Pausas no Contábil', icon: Sparkles, heading: 'Uma ação concreta, do tamanho da empresa.', text: 'Pausas fixas no Contábil, mantidas inclusive no fechamento mensal. Sem app, sem fornecedor e sem novas contratações.', points: ['Risco em ritmo de trabalho', 'R$ 0–540 estimados · 1–3 meses', 'Coordenador do Contábil + RH', 'O RH aprova ou rejeita'] },
  { title: 'Fontes citadas', caption: 'F1 a F6', icon: BookOpen, heading: 'Cada afirmação aponta para um trecho.', text: '88% do Contábil respondeu em nível crítico a "Precisa trabalhar muito rapidamente?". O plano liga esse dado à política da empresa e à literatura.', points: ['2 trechos de documento da empresa', 'Guia oficial, OMS, JD-R e NR-1'] },
  { title: 'Memória da empresa', caption: 'O que já falhou', icon: History, heading: 'O plano lembra o que não deu certo.', text: 'O histórico de ações muda o desenho do plano: a forma de comunicar e os riscos previstos vêm das experiências anteriores da própria empresa.' },
  { title: 'Discutir com a IA', caption: 'Chat do plano', icon: MessageCircle, heading: 'Um chat que conhece este plano.', text: 'O assistente recebe o perfil da empresa, o plano e os escores da pesquisa. Ele busca até 6 trechos da base e cita as fontes usadas na resposta.', points: ['Conversa real no plano de exemplo', 'Cruza histórico, pesquisa e evidência', 'Lista as fontes citadas abaixo da resposta'] },
];

function SourcesVisual() {
  return <div className="sources-visual">
    <div className="visual-label"><BookOpen size={16} />FONTES CONSULTADAS NO PLANO<span>Captura do banco do projeto</span></div>
    <p className="sources-rationale">"…a política vigente não prevê nenhuma pausa além do almoço <mark>(F1)</mark>. No fechamento, a jornada fica a critério do coordenador <mark>(F2)</mark>… A OMS, porém, aponta com baixa certeza ausência de efeito <mark>(F4)</mark>, por isso a medida mitiga o risco e não substitui a redistribuição de carga."</p>
    <ol className="source-cards">{planSources.map((source) => <li key={source.ref} className={source.type === 'Documento da empresa' ? 'company' : ''}><span className="source-ref">{source.ref}</span><div><small>{source.type}</small><b>{source.title}</b><span>{source.excerpt}</span></div></li>)}</ol>
  </div>;
}

const chatPoints = [
  { origin: 'Histórico de ações', text: 'A palestra de 2025 ocorreu durante o fechamento e não houve mudança percebida.' },
  { origin: 'Resultados da pesquisa', text: 'No Contábil, risco em exigências cognitivas (79) e insegurança laboral (75), com 16 respostas.' },
  { origin: 'Base científica [4]', text: 'A evidência da OMS para pausas estruturadas é limitada: a medida mitiga, não garante.' },
  { origin: 'O próprio plano', text: 'Palestra só como complemento breve e presencial, depois de iniciar as mudanças.' },
];

function ChatVisual({ onOpen }) {
  return <>
    <ProductScreen image="chat" title="Discutir com a IA" onOpen={onOpen} className="chat-shot" />
    <div className="chat-points">
      <div className="visual-label"><MessageCircle size={16} />DE ONDE VEIO CADA PARTE DA RESPOSTA</div>
      <p className="chat-question">"Por que não repetir a palestra sobre estresse que fizemos em 2025?"</p>
      <ol>{chatPoints.map((point) => <li key={point.origin}><small>{point.origin}</small><span>{point.text}</span></li>)}</ol>
    </div>
  </>;
}

function MemoryVisual({ onOpen }) {
  return <div className="memory-visual">
    <div className="visual-label"><History size={16} />HISTÓRICO DE AÇÕES → PLANO<span>Ápice Contabilidade</span></div>
    {planMemory.map((item) => <div className="memory-row" key={item.from}>
      <div className="memory-from"><small className={item.status === 'Não funcionou' ? 'failed' : 'partial'}>{item.status}</small><b>{item.from}</b><span>{item.note}</span></div>
      <ArrowRight size={22} className="memory-arrow" />
      <div className="memory-to"><small>{item.to}</small><span>{item.effect}</span></div>
    </div>)}
    <EvidenceButton image="historico" title="Histórico de ações — captura do sistema" onOpen={onOpen}>Ver histórico no sistema</EvidenceButton>
  </div>;
}

export function PlanScene({ onOpen }) {
  const [stage, setStage] = useState(0);
  const current = planStages[stage];
  return <section className="scene flow-scene plan-scene" aria-label="O plano de ação gerado">
    <SceneTitle index="07" eyebrow="COMO FUNCIONA · AGIR" title="O plano já nasce fundamentado." ><span className="status-label"><ShieldCheck size={15} />Revisão humana obrigatória</span></SceneTitle>
    <FlowStages stages={planStages} active={stage} onSelect={setStage} label="Partes do plano" />
    <div className="flow-workspace">
      <div className={`flow-visual ${stage === 3 ? 'plan-chat-visual' : ''}`} key={stage}>
        {stage === 0 && <ProductScreen image="planoPausas" title="Plano de ação" onOpen={onOpen} />}
        {stage === 1 && <SourcesVisual />}
        {stage === 2 && <MemoryVisual onOpen={onOpen} />}
        {stage === 3 && <ChatVisual onOpen={onOpen} />}
      </div>
      <FlowAside stage={current} />
    </div>
  </section>;
}

/* 08 · Execução e aprendizado ------------------------------------------- */

const roadmap = [
  { phase: 'Semana 1-2', owner: 'Coordenador Contábil', task: 'Definir horários com a equipe e aprovar aditivo ao item 5 da política' },
  { phase: 'Semana 3-4', owner: 'Responsável de RH', task: 'Iniciar piloto com quadro no mural e registro diário' },
  { phase: 'Mês 2', owner: 'Coordenador Contábil', task: 'Primeiro fechamento com as pausas mantidas' },
  { phase: 'Mês 3', owner: 'Responsável de RH', task: 'Levar adesão e percepção ao comitê' },
];
const columns = ['A Definir', 'Em Andamento', 'Quase Concluído', 'Concluído'];
const outcomes = [
  { id: 'successful', label: 'Funcionou', effect: 'A categoria da intervenção ganha prioridade nas próximas sugestões.' },
  { id: 'partial', label: 'Parcialmente', effect: 'Fica registrada com a observação do RH, como aconteceu com o PAE.' },
  { id: 'unsuccessful', label: 'Não funcionou', effect: 'Sai das próximas sugestões para esta empresa, como a palestra de 2025.' },
];
const loopStages = [
  { title: 'Aprovar', caption: 'Decisão do RH', icon: ShieldCheck },
  { title: 'Executar', caption: 'Kanban', icon: CheckCheck },
  { title: 'Avaliar', caption: 'Funcionou?', icon: ClipboardCheck },
  { title: 'Medir e aprender', caption: 'Próxima pesquisa', icon: TrendingUp },
];

export function LearningScene({ onOpen }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [outcome, setOutcome] = useState(null);
  const columnOf = (index) => Math.max(0, Math.min(3, progress - index));
  const selected = outcomes.find((item) => item.id === outcome);
  return <section className="scene flow-scene learning-scene" aria-label="Execução e aprendizado">
    <SceneTitle index="08" eyebrow="COMO FUNCIONA · ACOMPANHAR" title={<>Do plano aprovado <em>à memória da empresa.</em></>} />
    <FlowStages stages={loopStages} active={stage} onSelect={setStage} label="Etapas após o plano" />
    <div className="flow-workspace">
      <div className="flow-visual" key={stage}>
        {stage === 0 && <div className="loop-approve">
          <div className="visual-label"><Sparkles size={16} />PLANO PENDENTE DE REVISÃO<span>Ritmo de trabalho · Contábil</span></div>
          <h3>Pausas fixas no Contábil, mantidas inclusive no fechamento mensal.</h3>
          <div className="loop-actions"><button className="button button-white" disabled>Rejeitar</button><button className="button button-blue" onClick={() => setStage(1)}><ShieldCheck size={16} />Aprovar plano do exemplo</button></div>
          <p>Só planos aprovados pelo RH viram tarefas. A aprovação aqui é uma simulação local.</p>
        </div>}
        {stage === 1 && <div className="loop-kanban">
          <div className="visual-label"><CheckCheck size={16} />KANBAN DA EMPRESA<span>Etapas do roteiro do plano · ilustração</span></div>
          <div className="kanban-board">{columns.map((column, columnIndex) => <div className="kanban-column" key={column}><span className={`kanban-dot dot-${columnIndex}`} />{column}<div>{roadmap.map((item, index) => columnOf(index) === columnIndex && <article key={item.task} className="kanban-card"><small>{item.phase}</small><b>{item.task}</b><span><Users size={12} />{item.owner}</span></article>)}</div></div>)}</div>
          <div className="loop-actions"><button className="button button-blue" onClick={() => progress >= 6 ? setStage(2) : setProgress(progress + 1)}>{progress >= 6 ? <>Avaliar o resultado<ArrowRight size={16} /></> : <>Avançar a execução<ArrowRight size={16} /></>}</button></div>
        </div>}
        {stage === 2 && <div className="loop-outcome">
          <div className="visual-label"><ClipboardCheck size={16} />PLANO CONCLUÍDO · AVALIAÇÃO DO RH<span>Simulação</span></div>
          <h3>A ação funcionou?</h3>
          <div className="outcome-options" role="group" aria-label="Resultado da ação">{outcomes.map((item) => <button key={item.id} aria-pressed={outcome === item.id} className={`outcome-${item.id}`} onClick={() => setOutcome(item.id)}>{item.label}</button>)}</div>
          <div className="outcome-result" role="status">{selected ? <><History size={20} /><div><b>Registrado no histórico de ações · origem: Kanban</b><span>{selected.effect}</span></div></> : <span>Escolha um resultado para ver como ele entra no histórico.</span>}</div>
          <EvidenceButton image="historico" title="Histórico de ações — captura do sistema" onOpen={onOpen}>Ver histórico no sistema</EvidenceButton>
        </div>}
        {stage === 3 && <div className="loop-measure">
          <div className="visual-label"><TrendingUp size={16} />PESQUISA BASE × REAVALIAÇÃO<span>Comparação do sistema</span></div>
          <div className="reassessment-intro">
            <h3>Reaplicar para saber o que mudou.</h3>
            <p>Ao encerrar uma nova aplicação, o Sentinel compara as pesquisas do ciclo para acompanhar a evolução do índice de saúde psicossocial e das dimensões em atenção.</p>
          </div>
          <figure className="reassessment-evidence">
            <button className="reassessment-capture" onClick={() => onOpen({ file: 'comparacao-reavaliacao', title: 'Comparação entre pesquisas — pesquisa base e 1ª reavaliação' })} aria-label="Ampliar comparação entre pesquisas">
              <img src="/images/comparacao-reavaliacao.png" alt="Comparação entre pesquisas: índice de saúde de 60 para 78, ganho de 18 pontos; dimensões em atenção de 21 para 11, redução de 10. As duas pesquisas têm adesão de 86%, com 42 respostas de 49 convidados." width="1542" height="485" />
              <span><Maximize2 size={14} />Ampliar captura do sistema</span>
            </button>
            <figcaption>Pesquisa base: 26/09/2026 <ArrowRight size={14} aria-hidden="true" /> 1ª reavaliação: 20/10/2026</figcaption>
          </figure>
          <p className="loop-note">Neste exemplo, a reavaliação mostra melhora dos indicadores: índice de saúde maior e menos dimensões em atenção. A comparação ajuda o RH a acompanhar a evolução entre as coletas.</p>
        </div>}
      </div>
      <aside className="flow-aside loop-aside" key={`aside-${stage}`}>
        {[
          { icon: ShieldCheck, heading: 'A IA sugere. O RH decide.', text: 'Cada plano pode ser aprovado, rejeitado ou discutido no chat antes de virar trabalho.' },
          { icon: CheckCheck, heading: 'O roteiro vira tarefas.', text: 'Responsáveis, prazos e status em um quadro permanente da empresa, que acumula as ações de todos os ciclos.' },
          { icon: ClipboardCheck, heading: 'O resultado fica registrado.', text: 'Ao concluir, o RH informa se a ação funcionou. Isso entra no histórico que a IA consulta.' },
          { icon: TrendingUp, heading: 'A evolução fica visível.', text: 'A mesma pesquisa, reaplicada ao longo do tempo, mostra se os indicadores melhoraram, pioraram ou ficaram estáveis.' },
        ].map((item, index) => index === stage && <React.Fragment key={item.heading}><item.icon size={28} strokeWidth={1.4} /><h3>{item.heading}</h3><p>{item.text}</p></React.Fragment>)}
        {stage === 3 && <>
          <dl className="reassessment-gains">
            <div><dt>Índice de saúde</dt><dd><span>60 <ArrowRight size={18} aria-hidden="true" /> 78</span><strong>+18 pontos</strong></dd></div>
            <div><dt>Dimensões em atenção</dt><dd><span>21 <ArrowRight size={18} aria-hidden="true" /> 11</span><strong>10 a menos</strong></dd></div>
          </dl>
          <p className="reassessment-privacy"><Fingerprint size={16} />Setores com menos de 5 respostas continuam protegidos.</p>
        </>}
        <div className="loop-cycle"><span>Plano</span><ArrowRight size={12} /><span>Kanban</span><ArrowRight size={12} /><span>Histórico</span><ArrowRight size={12} /><span>Próximo plano</span></div>
      </aside>
    </div>
    <TagRow items={['Revisão humana', 'Execução acompanhada', 'Aprendizado entre ciclos']} />
  </section>;
}
