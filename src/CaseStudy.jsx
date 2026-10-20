import React, { useState } from 'react';
import { ArrowRight, BarChart3, BookOpen, BrainCircuit, Check, CheckCheck, ChevronRight, ClipboardList, FileText, Maximize2, RotateCcw, ShieldCheck, Users } from 'lucide-react';

const stages = [
  { title: 'Resultado da pesquisa', icon: BarChart3, heading: 'A pesquisa mostra onde agir.', text: 'Após encerrar a coleta, o Sentinel organiza os indicadores e destaca as dimensões que merecem atenção. Neste caso, seguimos o alerta de ritmo de trabalho até uma ação para o setor Contábil.', takeaway: 'O resultado da pesquisa é o ponto de partida do plano.' },
  { title: 'Contexto da empresa', icon: BookOpen, heading: 'A ação precisa caber na empresa.', text: 'A IA combina os riscos identificados com o perfil, as restrições e os documentos da organização. Explore como cada informação dá direção à mesma proposta.', takeaway: 'Risco + realidade da empresa → uma sugestão utilizável.' },
  { title: 'Plano de ação', icon: ClipboardList, heading: 'Uma recomendação concreta.', text: 'O plano apresentado nos prints propõe pausas fixas, inclusive no fechamento mensal. Ele define execução, responsabilidade, prazo e estimativa de investimento para o gestor revisar.', takeaway: 'A IA propõe. O gestor avalia e aprova a execução.' },
  { title: 'Acompanhamento', icon: RotateCcw, heading: 'Executar. Reavaliar. Comparar.', text: 'As ações viram tarefas acompanháveis. Depois, o mesmo grupo pode responder novamente ao COPSOQ II no ciclo, permitindo comparar as coletas e observar a evolução dos indicadores.', takeaway: 'Concluir a tarefa registra a execução; a nova pesquisa ajuda a avaliar o resultado.' },
];

const indicators = [
  { title: 'Ritmo de trabalho', value: 69, label: 'Risco', tone: 'risk' },
  { title: 'Exigências cognitivas', value: 67, label: 'Risco', tone: 'risk' },
  { title: 'Burnout', value: 56, label: 'Intermediário', tone: 'attention' },
];

const contextInputs = [
  { title: 'Perfil da empresa', source: 'Print das configurações', heading: '49 colaboradores. Trabalho presencial.', detail: 'A Ápice presta serviços contábeis e de departamento pessoal para pequenas empresas.', effect: 'Planejar uma ação presencial, inserida na rotina do próprio setor.' },
  { title: 'Política de jornada', source: 'Política mencionada no plano', heading: 'As pausas precisam fazer parte da rotina.', detail: 'O plano exibido menciona uma política que não prevê pausas além do almoço e propõe alterar seu item 5.', effect: 'Prever pausas fixas também nos dias de fechamento, quando a demanda se intensifica.' },
  { title: 'Viabilidade', source: 'Condição da proposta exibida', heading: 'Usar a estrutura que a empresa já tem.', detail: 'A proposta do print dispensa app, fornecedor ou novas contratações e prevê cerca de uma hora semanal do RH.', effect: 'Organizar horários com o coordenador, afixar no mural e acompanhar a execução.' },
];

function EvidenceButton({ file, title, onOpen, children }) {
  return <button className="case-evidence-button" onClick={() => onOpen({ file, title })}><Maximize2 size={13} />{children}</button>;
}

export function CaseScene({ onOpen }) {
  const [stage, setStage] = useState(0);
  const [contextIndex, setContextIndex] = useState(0);
  const [approved, setApproved] = useState(false);
  const [done, setDone] = useState(false);
  const [reassessment, setReassessment] = useState(false);
  const current = stages[stage];
  const context = contextInputs[contextIndex];
  return <section className="scene case-scene grounded-case" aria-label="Caso demonstrativo do setor Contábil">
    <div className="case-top"><div className="story-heading"><span className="eyebrow"><span>07</span>UM CASO DO SENTINEL</span><h2>Da pesquisa<br /><em>à ação no Contábil.</em></h2></div><span className="demo-badge"><span />BASEADO NOS PRINTS DO PROJETO</span></div>
    <nav className="case-stages" aria-label="Etapas do caso">{stages.map((item, i) => <button key={item.title} aria-current={stage === i ? 'step' : undefined} onClick={() => setStage(i)}><span>0{i + 1}</span><item.icon size={18} />{item.title}{i < 3 && <ChevronRight className="case-chevron" size={17} />}</button>)}</nav>
    <div className="case-workspace"><div className="case-visual" key={stage}>
      {stage === 0 && <div className="case-survey-result">
        <div className="visual-label"><ClipboardList size={16} />COPSOQ II · PESQUISA ENCERRADA<span>Captura de demonstração</span></div>
        <h3>Quais dimensões pedem atenção?</h3>
        <div className="case-indicators" role="img" aria-label="Indicadores da captura: ritmo de trabalho 69, risco; exigências cognitivas 67, risco; burnout 56, intermediário. Escores, não porcentagens de pessoas.">{indicators.map((item) => <div className={`case-indicator ${item.tone}`} key={item.title}><span>{item.title}</span><div className="case-indicator-track"><i style={{ width: `${item.value}%` }} /></div><b>{item.value}</b><small>{item.label}</small></div>)}</div>
        <div className="case-priority"><span>O CASO QUE VAMOS ACOMPANHAR</span><b>Ritmo de trabalho <ArrowRight size={17} /> Setor Contábil</b><p>Como manter as pausas mesmo durante o fechamento mensal?</p></div>
        <div className="case-evidence-row"><small>Escores do dashboard da pesquisa; o plano exibido direciona a ação ao Contábil.</small><EvidenceButton file="dashboard-v2" title="Dashboard da pesquisa — captura fornecida" onOpen={onOpen}>Ver dashboard</EvidenceButton></div>
      </div>}
      {stage === 1 && <div className="case-context-inputs">
        <div className="visual-label"><BrainCircuit size={16} />O QUE CONTEXTUALIZA A IA<span>Mesmo caso · Contábil</span></div>
        <div className="case-context-choices" role="group" aria-label="Informações usadas no contexto">{contextInputs.map((item, i) => <button key={item.title} aria-pressed={contextIndex === i} onClick={() => setContextIndex(i)}><FileText size={16} />{item.title}</button>)}</div>
        <div className="case-context-comparison" key={context.title}><div className="case-context-fact"><span>{context.source}</span><h3>{context.heading}</h3><p>{context.detail}</p></div><div className="case-context-effect"><ArrowRight size={21} /><div><span>COMO ISSO ORIENTA A PROPOSTA</span><p>{context.effect}</p></div></div></div>
        <div className="case-evidence-row"><small>O exemplo explica o uso de contexto; não executa uma consulta à IA.</small><EvidenceButton file={contextIndex === 0 ? 'contexto-v2' : 'plano-v2'} title={contextIndex === 0 ? 'Perfil da empresa — captura fornecida' : 'Plano de ação — captura fornecida'} onOpen={onOpen}>Ver print de referência</EvidenceButton></div>
      </div>}
      {stage === 2 && <div className="case-action-plan">
        <div className="visual-label"><ClipboardList size={16} />PROPOSTA EXIBIDA NO SISTEMA<span>Ritmo de trabalho</span></div>
        <h3>Pausas fixas, inclusive<br />no fechamento mensal.</h3>
        <div className="case-plan-facts">{[['Responsáveis', 'Coordenador do Contábil + RH'], ['Prazo do plano', '1–3 meses'], ['Investimento estimado', 'R$ 0–540'], ['Primeiros 30 dias', 'Combinar horários e iniciar o piloto']].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div>
        <div className="case-plan-actions"><button className="button button-blue" onClick={() => { setApproved(true); setStage(3); }}><ShieldCheck size={16} />{approved ? 'Ver acompanhamento' : 'Aprovar plano do exemplo'}</button><EvidenceButton file="plano-v2" title="Plano original e 5W2H — captura fornecida" onOpen={onOpen}>Ver plano e 5W2H</EvidenceButton></div>
        <small className="case-source-note">Prazo e custo são estimativas da captura. A aprovação aqui é uma simulação.</small>
      </div>}
      {stage === 3 && <div className="case-tracking">
        <div className="visual-label"><CheckCheck size={16} />DA EXECUÇÃO À NOVA PESQUISA<span>{approved ? 'Plano aprovado no exemplo' : 'Fluxo ilustrativo'}</span></div>
        <button className={`example-task ${done ? 'is-done' : ''}`} aria-pressed={done} onClick={() => { setDone(!done); if (done) setReassessment(false); }}><span className="task-checkbox">{done && <Check size={17} />}</span><span><b>Definir e registrar os horários de pausa</b><small>Coordenador do Contábil + RH</small></span><span className="task-state">{done ? 'Concluída' : 'A fazer'}</span></button>
        <div className="case-research-loop"><div><ClipboardList size={23} /><b>Pesquisa base</b><span>COPSOQ II · encerrada</span></div><ArrowRight size={20} /><div><RotateCcw size={23} /><b>Nova avaliação</b><span>Mesmo instrumento e grupo</span></div></div>
        <div className="case-reassessment" role="status"><b>{reassessment ? 'Nova coleta a realizar.' : done ? 'A execução foi registrada. E os indicadores?' : 'Acompanhe a execução das pausas.'}</b><p>{reassessment ? 'A comparação depende das respostas da nova aplicação. Ainda não há resultado de melhora neste caso.' : done ? 'Reaplicar a pesquisa permite comparar os indicadores no mesmo ciclo.' : 'Marque a tarefa do exemplo como concluída para avançar à reavaliação.'}</p></div>
        <div className="case-plan-actions"><button className="button button-white" disabled={!done || reassessment} onClick={() => setReassessment(true)}><RotateCcw size={15} />{reassessment ? 'Reaplicação preparada no exemplo' : 'Preparar reaplicação do COPSOQ II'}</button><EvidenceButton file="ciclo-v2" title="Ciclo e nova avaliação — captura fornecida" onOpen={onOpen}>Ver ciclo real</EvidenceButton></div>
      </div>}
    </div><aside className="case-explanation"><span className="case-step-label">O MESMO CASO · ETAPA {String(stage + 1).padStart(2, '0')}</span><h3>{current.heading}</h3><p>{current.text}</p><div className="case-takeaway"><current.icon size={22} /><b>{current.takeaway}</b></div><button className="text-button" onClick={() => setStage((stage + 1) % stages.length)}>{stage === 3 ? 'Recomeçar o caso' : 'Continuar o caso'}<ArrowRight size={17} /></button></aside></div>
    <small className="story-disclosure">Caso demonstrativo baseado nas capturas fornecidas. Contexto e execução são ilustrados; os escores não são diagnósticos individuais e não há resultado de reavaliação.</small>
  </section>;
}
