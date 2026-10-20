import React, { useEffect, useRef, useState } from 'react';
import { Check, LockKeyhole, Maximize2 } from 'lucide-react';

// Screenshot crops in natural pixels: [x, y, width, height].
export const media = {
  painel: { file: 'dashboard-v2', size: [894, 859], crop: [20, 112, 855, 473] },
  dashboard: { file: 'dashboard-v2', size: [894, 859], crop: [18, 170, 859, 418] },
  plano: { file: 'plano-v2', size: [575, 854], crop: [8, 0, 557, 465] },
  ciclos: { file: 'ciclos-v3', size: [1915, 920], crop: [1076, 154, 582, 404] },
  instrumentos: { file: 'criar-ciclo', size: [532, 657], crop: [8, 13, 512, 636] },
  anonimato: { file: 'dossie-pdf-p1', size: [2020, 1428], crop: [88, 362, 1844, 684] },
  dossie: { file: 'dossie-pdf-p2', size: [2020, 1428], crop: [88, 885, 1844, 420] },
  perfil: { file: 'configuracoes-v2', size: [1915, 918], crop: [495, 52, 1158, 620] },
  documentos: { file: 'base-conhecimento', size: [1912, 922], crop: [494, 158, 1158, 680] },
  historico: { file: 'historico-acoes', size: [1916, 913], crop: [495, 82, 1158, 480] },
  pipeline: { file: 'metodologia-ia', size: [1911, 919], crop: [493, 222, 1160, 600] },
  planoPausas: { file: 'plano-pausas', size: [1916, 912], crop: [518, 228, 1112, 606] },
  chat: { file: 'chat-plano', size: [1910, 911], crop: [1458, 84, 452, 646] },
};

export function TagRow({ items }) {
  return <div className="tag-row">{items.map((item) => <span key={item}><Check size={12} />{item}</span>)}</div>;
}

export function SceneTitle({ index, eyebrow, title, children }) {
  return <div className="scene-heading"><div><span className="eyebrow"><span>{index}</span>{eyebrow}</span><h2>{title}</h2></div>{children}</div>;
}

export function ProductScreen({ image, title, onOpen, className = '' }) {
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
