import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const nodes = [
  { id: 'router', label: 'Маршрутизатор', x: 400, y: 50, icon: '🌐', threat: 'MITM-атаки, перехват трафика', protection: 'Шифрование TLS, настройка ACL, мониторинг аномалий трафика' },
  { id: 'crm', label: 'Сервер CRM', x: 200, y: 180, icon: '🖥️', threat: 'SQL-инъекции, несанкционированный доступ', protection: 'WAF, ролевая модель доступа, резервное копирование' },
  { id: 'mail', label: 'Почтовый сервер', x: 600, y: 180, icon: '📧', threat: 'Фишинг, спам, утечка данных', protection: 'Спам-фильтры, SPF/DKIM, обучение сотрудников' },
  { id: 'db', label: 'База данных', x: 100, y: 340, icon: '🗄️', threat: 'Утечка данных, SQL-инъекции', protection: 'Шифрование at-rest, аудит доступа, регулярные бэкапы' },
  { id: 'wifi', label: 'Wi-Fi сеть', x: 400, y: 340, icon: '📡', threat: 'Подслушивание, Rogue AP, evil twin', protection: 'WPA3-шифрование, сегментация сетей, NAC' },
  { id: 'cloud', label: 'Облачное хранилище', x: 700, y: 340, icon: '☁️', threat: 'Утечка данных, неправильные настройки доступа', protection: 'DLP, контроль доступа, шифрование данных' },
  { id: 'workstation', label: 'Рабочая станция', x: 400, y: 480, icon: '💻', threat: 'Малварь, кейлоггеры, фишинг', protection: 'EDR/антивирус, MFA, регулярные обновления' },
];

const edges = [
  { from: 'router', to: 'crm' },
  { from: 'router', to: 'mail' },
  { from: 'crm', to: 'db' },
  { from: 'mail', to: 'cloud' },
  { from: 'router', to: 'wifi' },
  { from: 'wifi', to: 'workstation' },
  { from: 'db', to: 'workstation' },
  { from: 'cloud', to: 'workstation' },
];

function ThreatMap() {
  const [activeNode, setActiveNode] = useState(null);
  const [discovered, setDiscovered] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleNodeClick = (node) => {
    setActiveNode(node);
    setDiscovered((prev) => new Set([...prev, node.id]));
  };

  const closeModal = () => setActiveNode(null);

  if (isMobile) {
    return (
      <div className="threat-map-section">
        <div className="threat-counter">
          Обнаружено угроз: <span>{discovered.size}</span> / {nodes.length}
        </div>
        <p className="threat-hint">Нажми на любой элемент, чтобы узнать, как специалист по ИБ защищает каждый узел</p>
        <div className="threat-mobile-list">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className={`threat-mobile-card ${discovered.has(node.id) ? 'discovered' : ''}`}
              onClick={() => handleNodeClick(node)}
              whileTap={{ scale: 0.97 }}
            >
              <div className="threat-mobile-icon">{node.icon}</div>
              <div className="threat-mobile-info">
                <div className="threat-mobile-label">{node.label}</div>
                <div className="threat-mobile-status">
                  {discovered.has(node.id) ? 'Угроза изучена' : 'Нажми, чтобы узнать'}
                </div>
              </div>
              {discovered.has(node.id) && (
                <div className="threat-mobile-check">✓</div>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {activeNode && (
            <motion.div
              className="threat-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="threat-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="threat-modal-close" onClick={closeModal}>✕</button>
                <div className="threat-modal-icon">{activeNode.icon}</div>
                <h3 className="threat-modal-title">{activeNode.label}</h3>
                <div className="threat-modal-section">
                  <div className="threat-modal-label danger">Угроза</div>
                  <p>{activeNode.threat}</p>
                </div>
                <div className="threat-modal-section">
                  <div className="threat-modal-label safe">Защита</div>
                  <p>{activeNode.protection}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="threat-map-section">
      <div className="threat-map-layout">
        <div className="threat-map-sidebar">
          <div className="threat-counter">
            Обнаружено угроз: <span>{discovered.size}</span> / {nodes.length}
          </div>
          <p className="threat-hint">Нажми на любой элемент схемы, чтобы узнать, как специалист по ИБ защищает каждый узел</p>
          <div className="threat-legend">
            <div className="threat-legend-item">
              <span className="threat-legend-dot green" /> Защищённый узел
            </div>
            <div className="threat-legend-item">
              <span className="threat-legend-dot red" /> Не изучен
            </div>
          </div>
        </div>

        <div className="threat-map-canvas">
          <svg ref={svgRef} viewBox="0 0 800 540" className="threat-svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FF88" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#00FF88" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00FF88" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {edges.map((edge, i) => {
              const from = nodes.find((n) => n.id === edge.from);
              const to = nodes.find((n) => n.id === edge.to);
              const pathId = `path-${i}`;
              return (
                <g key={i}>
                  <path
                    id={pathId}
                    d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    fill="none"
                    filter="url(#glow)"
                  />
                  <circle r="3" fill="#00FF88" opacity="0.9">
                    <animateMotion
                      dur={`${2.5 + i * 0.3}s`}
                      repeatCount="indefinite"
                      path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                    />
                  </circle>
                  <circle r="2" fill="#00FF88" opacity="0.5">
                    <animateMotion
                      dur={`${2.5 + i * 0.3}s`}
                      repeatCount="indefinite"
                      begin={`${1.2 + i * 0.15}s`}
                      path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                    />
                  </circle>
                </g>
              );
            })}

            {nodes.map((node) => {
              const isActive = discovered.has(node.id);
              return (
                <g
                  key={node.id}
                  className="threat-node"
                  onClick={() => handleNodeClick(node)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="38"
                    fill={isActive ? 'rgba(0, 255, 136, 0.15)' : 'rgba(22, 22, 31, 0.9)'}
                    stroke={isActive ? '#00FF88' : '#1e1e2a'}
                    strokeWidth="2"
                    filter="url(#nodeGlow)"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="38"
                    fill="none"
                    stroke={isActive ? '#00FF88' : 'transparent'}
                    strokeWidth="2"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      values="38;44;38"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0;0.5"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <text
                    x={node.x}
                    y={node.y - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="22"
                    className="threat-node-icon"
                  >
                    {node.icon}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 22}
                    textAnchor="middle"
                    fill="#8888a0"
                    fontSize="11"
                    fontFamily="Inter, sans-serif"
                    fontWeight="500"
                  >
                    {node.label}
                  </text>
                  {isActive && (
                    <circle
                      cx={node.x + 28}
                      cy={node.y - 28}
                      r="8"
                      fill="#00FF88"
                    >
                      <animate
                        attributeName="r"
                        values="8;10;8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {activeNode && (
          <motion.div
            className="threat-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="threat-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="threat-modal-close" onClick={closeModal}>✕</button>
              <div className="threat-modal-icon">{activeNode.icon}</div>
              <h3 className="threat-modal-title">{activeNode.label}</h3>
              <div className="threat-modal-section">
                <div className="threat-modal-label danger">Угроза</div>
                <p>{activeNode.threat}</p>
              </div>
              <div className="threat-modal-section">
                <div className="threat-modal-label safe">Защита</div>
                <p>{activeNode.protection}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThreatMap;
