import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ThreatMap from './ThreatMap';
import ThreatGlobe from './ThreatGlobe';
import VantaBg from './VantaBg';
import DataCenter3D from './DataCenter3D';
import ElasticCursor from './ElasticCursor';

/* TYPEWRITER */
function Typewriter({ text, speed = 50 }) {
  const [displayed, setDisplayed] = useState('');
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        doneRef.current = true;
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="typewriter">{displayed}</span>
  );
}

/* COUNTUP */
function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ICONS */
const ShieldIcon = ({ pulse }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={pulse ? { animation: 'logoPulse 3s ease-in-out infinite' } : {}}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ServerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/>
    <line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const NetworkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <circle cx="5" cy="19" r="3"/>
    <circle cx="19" cy="19" r="3"/>
    <line x1="12" y1="16" x2="5" y2="16"/>
    <line x1="12" y1="16" x2="19" y2="16"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const MonitorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const tasks = [
  { icon: <ShieldIcon />, title: 'Анализ угроз', desc: 'Выявление и классификация потенциальных уязвимостей в инфраструктуре организации' },
  { icon: <LockIcon />, title: 'Настройка защиты', desc: 'Внедрение межсетевых экранов, антивирусов и систем обнаружения вторжений' },
  { icon: <EyeIcon />, title: 'Мониторинг событий', desc: 'Непрерывное отслеживание активности сети и конечных точек через SIEM-системы' },
  { icon: <ServerIcon />, title: 'Защита серверов', desc: 'Обеспечение безопасности серверных ОС, баз данных и виртуальных сред' },
  { icon: <AlertIcon />, title: 'Реагирование на инциденты', desc: 'Оперативное устранение последствий атак и восстановление работоспособности систем' },
  { icon: <CodeIcon />, title: 'Аудит и тестирование', desc: 'Проведение пентестов и аудита соответствия нормативным требованиям' },
  { icon: <NetworkIcon />, title: 'Управление доступом', desc: 'Контроль привилегий, настройка MFA и управление учётными записями' },
];

const hardSkills = [
  { name: 'Linux / Windows Server', tip: 'Умение работать в командной строке и управлять серверными ОС' },
  { name: 'Firewall (Palo Alto, FortiGate)', tip: 'Настройка и управление межсетевыми экранами нового поколения' },
  { name: 'SIEM (Splunk, QRadar)', tip: 'Сбор и анализ событий безопасности в реальном времени' },
  { name: 'Анализ уязвимостей (Nessus)', tip: 'Сканирование инфраструктуры и оценка рисков' },
  { name: 'Пентест (Kali Linux)', tip: 'Тестирование на проникновение для поиска слабых мест' },
  { name: 'Сетевые протоколы (TCP/IP)', tip: 'Понимание работы сети на уровне пакетов' },
  { name: 'Скриптование (Bash, Python)', tip: 'Автоматизация рутинных задач и анализ данных' },
  { name: 'Документация (STIX/TAXII)', tip: 'Стандарты обмена информацией об угрозах' },
];

const softSkills = [
  { name: 'Критическое мышление', tip: 'Способность анализировать situations и находить нестандартные решения' },
  { name: 'Внимание к деталям', tip: 'Мелочи решают — одна пропущенная деталь может стоить миллионов' },
  { name: 'Стрессоустойчивость', tip: 'Инциденты случаются ночью и в праздники — нужно сохранять спокойствие' },
  { name: 'Аналитический склад ума', tip: 'Умение видеть паттерны в тысячах событий и логов' },
  { name: 'Коммуникация', tip: 'Умение объяснить технические риски руководству на языке бизнеса' },
  { name: 'Постоянное обучение', tip: 'Ландшафт угроз меняется каждый день — нельзя останавливаться' },
  { name: 'Работа в команде', tip: 'ИБ — это командная игра с разработчиками, ops и бизнесом' },
  { name: 'Приоритизация задач', tip: 'Не всё критично — нужно отличать шум от реальных инцидентов' },
];

const steps = [
  { title: 'Изучи основы', desc: 'Пройди курсы по сетевой безопасности, освой Linux и базовые протоколы. Сертификации: CompTIA Security+, CEH.' },
  { title: 'Практикуйся', desc: 'Настрахай лабораторную среду, участвуй в CTF-соревнованиях, делай пентесты на учебных платформах (Hack The Box, TryHackMe).' },
  { title: 'Получи опыт', desc: 'Стажируйся в SOC-центре или ИТ-отделе. Веди блог о документировании инцидентов — это покажет твой подход.' },
  { title: 'Расти как специалист', desc: 'Двигайся от аналитика SOC к инженеру по безопасности, затем к архитектору или руководителю ИБ-направления.' },
];

const timelineData = [
  { time: '09:00', title: 'Обзор инцидентов', desc: 'Проверка SIEM-дашборда, анализ алертов за ночь, приоритизация инцидентов.', extra: 'Типичный объём: 50-200 алертов в сутки, из которых 95% — ложные.', icon: <MonitorIcon /> },
  { time: '10:30', title: 'Мониторинг', desc: 'Отслеживание сетевой активности, проверка логов конечных точек, расследование подозрительных событий.', extra: 'Используются EDR-агенты на数千ах устройств одновременно.', icon: <SearchIcon /> },
  { time: '12:00', title: 'Работа с уязвимостями', desc: 'Сканирование инфраструктуры, оценка критичности найденных уязвимостей, планирование патчей.', extra: 'Средний патч занимает 3-7 дней от тестирования до продакшена.', icon: <AlertIcon /> },
  { time: '14:00', title: 'Настройка защиты', desc: 'Обновление правил межсетевых экранов, настройка политик безопасности, тестирование конфигураций.', extra: 'Каждое изменение проходит через процедуру Change Management.', icon: <SettingsIcon /> },
  { time: '15:30', title: 'Документация', desc: 'Оформление отчётов, обновление процедур реагирования, ведение базы знаний.', extra: 'Документация — обязательное требование ФСТЭК и аудиторов.', icon: <FileTextIcon /> },
  { time: '17:00', title: 'Совещание команды', desc: 'Обсуждение текущих угроз, координация действий, планирование задач на следующий день.', extra: 'Еженедельный отчёт уходит руководителю ИБ и CISO.', icon: <MessageIcon /> },
];

const quizQuestions = [
  {
    question: 'Что такое SIEM-система?',
    options: [
      'Антивирус для серверов',
      'Платформа для сбора и анализа событий безопасности',
      'Файрвол нового поколения',
      'Средство шифрования данных',
    ],
    correct: 1,
    explanation: 'SIEM (Security Information and Event Management) — это система, которая собирает логи со всех источников в организации и анализирует их на предмет угроз.',
  },
  {
    question: 'Какой протокол используется для безопасного доступа к удалённому серверу?',
    options: ['HTTP', 'FTP', 'SSH', 'Telnet'],
    correct: 2,
    explanation: 'SSH (Secure Shell) шифрует весь трафик между вашим компьютером и сервером, в отличие от Telnet, который передаёт данные открытым текстом.',
  },
  {
    question: 'Что такое пентест?',
    options: [
      'Установка антивируса',
      'Тестирование на проникновение для поиска уязвимостей',
      'Настройка резервного копирования',
      'Мониторинг сети в реальном времени',
    ],
    correct: 1,
    explanation: 'Пентест (penetration testing) — это имитация атаки на систему для выявления уязвимостей до того, как их найдут реальные злоумышленники.',
  },
  {
    question: 'Какая сертификация является базовой для специалиста по ИБ?',
    options: ['Cisco CCNA', 'CompTIA Security+', 'AWS Solutions Architect', 'Microsoft Excel Expert'],
    correct: 1,
    explanation: 'CompTIA Security+ — это международно признанная базовая сертификация, подтверждающая знания в области информационной безопасности.',
  },
];

/* QUIZ */
function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    if (newAnswers.length <= current) newAnswers.push(selected);
    setAnswers(newAnswers);

    if (current < quizQuestions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setAnswered(false);
    setShowExplanation(false);
  };

  const score = answers.reduce((acc, ans, i) => {
    return acc + (ans === quizQuestions[i].correct ? 1 : 0);
  }, 0);

  const getAdvice = () => {
    if (score === 4) return 'Ты — будущий профессионал! Начни с курсов по сетевым технологиям и попробуй Hack The Box.';
    if (score === 3) return 'Отличный старт! Тебе стоит углубиться в практику — попробуй TryHackMe и настрой лабораторную среду.';
    if (score === 2) return 'Неплохо! Начни с основ: курс CompTIA Security+, затем практика на CTF-платформах.';
    return 'Не переживай! Начни с базы: изучи Linux, сетевые протоколы и основы ИБ.';
  };

  if (showResult) {
    return (
      <div className="quiz-container">
        <div className="quiz-result">
          <motion.div
            className="quiz-result-score"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {score}/{quizQuestions.length}
          </motion.div>
          <div className="quiz-result-label">
            {score === 4 ? 'Блестяще!' : score >= 2 ? 'Хороший результат!' : 'Начни с основ!'}
          </div>
          <div className="quiz-result-advice">{getAdvice()}</div>
          <div className="quiz-result-desc">
            Ты ответил на {score} из {quizQuestions.length} вопросов правильно.
          </div>
          <button className="quiz-restart" onClick={handleRestart}>Пройти ещё раз</button>
        </div>
      </div>
    );
  }

  const q = quizQuestions[current];

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        {quizQuestions.map((_, i) => (
          <div key={i} className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: i < current ? '100%' : i === current && answered ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="quiz-question">{q.question}</div>
        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (answered && i === q.correct) cls += ' correct';
            else if (answered && i === selected && i !== q.correct) cls += ' wrong';
            else if (!answered && selected === i) cls += ' selected';

            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)}>
                <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {showExplanation && (
          <motion.div
            className="quiz-explanation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {q.explanation}
          </motion.div>
        )}
      </motion.div>
      <div className="quiz-nav">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {current + 1} из {quizQuestions.length}
        </span>
        <button className="quiz-btn primary" onClick={handleNext} disabled={!answered}>
          {current === quizQuestions.length - 1 ? 'Завершить' : 'Далее'}
        </button>
      </div>
    </div>
  );
}

/* MAIN APP */
function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <VantaBg />
      <DataCenter3D />
      <ElasticCursor />
      <nav className="nav">
        <div className="nav-logo">
          <ShieldIcon pulse />
          CyberProfile
        </div>
        <ul className="nav-links">
          <li><a href="#about">О профессии</a></li>
          <li><a href="#tasks">Задачи</a></li>
          <li><a href="#skills">Навыки</a></li>
          <li><a href="#career">Карьера</a></li>
          <li><a href="#quiz">Тест</a></li>
        </ul>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'active' : ''}`}>
        <a href="#about" onClick={() => setMobileOpen(false)}>О профессии</a>
        <a href="#tasks" onClick={() => setMobileOpen(false)}>Задачи</a>
        <a href="#skills" onClick={() => setMobileOpen(false)}>Навыки</a>
        <a href="#career" onClick={() => setMobileOpen(false)}>Карьера</a>
        <a href="#quiz" onClick={() => setMobileOpen(false)}>Тест</a>
      </div>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            IT-профессия будущего
          </div>
          <h1 className="hero-title">
            Специалист по<br />
            <span className="hero-title-accent scan-line">информационной безопасности</span>
          </h1>
          <p className="hero-subtitle">
            <Typewriter text="Защита инфраструктуры и конечных точек от киберугроз. Ты станешь щитом, который оберегает данные компаний и пользователей." speed={30} />
          </p>
          <div className="hero-buttons">
            <a href="#about" className="btn-primary">
              Узнать больше <ChevronRight />
            </a>
            <a href="#quiz" className="btn-secondary">
              Пройти тест
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">О профессии</span>
              <h2 className="section-title">Кто это простыми словами</h2>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="about-text">
              <p>
                Специалист по информационной безопасности — это человек, который <strong>защищает компьютеры, серверы и сети от взлома</strong>. Как замок для цифрового мира: не пускает злоумышленников, обнаруживает уязвимости и устраняет последствия атак.
              </p>
              <p>
                Он не просто «настраивает антивирус». Он <strong>анализирует угрозы, мониторит десятки тысяч событий в минуту, проектирует системы защиты</strong> и принимает решения, от которых зависит безопасность тысяч людей и миллиардов рублей.
              </p>
              <p>
                Это одна из самых <strong>востребованных и высокооплачиваемых</strong> профессий в IT, потому что пока существуют кибератаки — специалисты по ИБ будут на вес золота.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section" id="tasks">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">Задачи</span>
              <h2 className="section-title">Чем занимаешься каждый день</h2>
              <p className="section-subtitle">Основные направления работы специалиста по защите инфраструктуры</p>
            </div>
          </motion.div>
          <div className="tasks-grid">
            {tasks.map((task, i) => (
              <motion.div
                key={i}
                className="task-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <div className="task-icon">{task.icon}</div>
                <div className="task-title">{task.title}</div>
                <div className="task-desc">{task.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">Навыки</span>
              <h2 className="section-title">Что нужно знать и уметь</h2>
            </div>
          </motion.div>
          <div className="skills-grid">
            <div className="skills-column">
              <div className="skills-column-title green">
                <CodeIcon /> Hard Skills
              </div>
              <div className="skills-tags">
                {hardSkills.map((skill, i) => (
                  <motion.div
                    key={i}
                    className="skill-tag green"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    {skill.name}
                    <span className="skill-tooltip">{skill.tip}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="skills-column">
              <div className="skills-column-title blue">
                <UsersIcon /> Soft Skills
              </div>
              <div className="skills-tags">
                {softSkills.map((skill, i) => (
                  <motion.div
                    key={i}
                    className="skill-tag blue"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    {skill.name}
                    <span className="skill-tooltip">{skill.tip}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="career">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">Карьера</span>
              <h2 className="section-title">Как начать карьеру студенту</h2>
              <p className="section-subtitle">Пошаговый план от нуля до первой позиции в ИБ</p>
            </div>
          </motion.div>
          <div className="steps-container">
            <div className="steps-line" />
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="step-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="step-number">{i + 1}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="day">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">День из жизни</span>
              <h2 className="section-title">Один день специалиста по ИБ</h2>
            </div>
          </motion.div>
          <div className="timeline-container">
            {timelineData.map((item, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="timeline-time">{item.time}</div>
                <div className="timeline-content">
                  <div className="timeline-content-header">
                    <div className="timeline-icon">{item.icon}</div>
                    <div>
                      <h4>{item.title}</h4>
                    </div>
                  </div>
                  <p>{item.desc}</p>
                  <div className="timeline-extra">
                    <p>{item.extra}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="important">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">Значимость</span>
              <h2 className="section-title"><span className="scan-line">Почему роль важна для ЭРТХ</span></h2>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="why-content">
              <p>
                ЭлектросетевойRetailТехХолдинг (ЭРТХ) — это компания, которая управляет критически важной инфраструктурой: сетями электроснабжения, диспетчерскими системами и данными миллионов клиентов. <strong style={{ color: 'var(--accent)' }}>Одна успешная кибератака может обесточить целые районы</strong> или привести к утечке персональных данных.
              </p>
              <p>
                Специалист по ИБ в ЭРТХ — это не просто «IT-инженер». Это <strong style={{ color: 'var(--accent)' }}>страж, который стоит между нормальной работой инфраструктуры и хаосом</strong>. Без него невозможна безопасная работа компании, доверие клиентов и стабильность энергосистемы.
              </p>
              <div className="stats-section">
                <div className="stats-grid">
                  {[
                    { end: 90, suffix: '%', label: 'атак начинаются с фишинга', delay: 0 },
                    { end: 4, suffix: ' млн ₽', label: 'средний ущерб от утечки данных', delay: 0.1 },
                    { end: 350, suffix: 'K+', label: 'вакансий по ИБ в мире', delay: 0.2 },
                    { end: 20, suffix: '%', label: 'рост рынка ИБ в год', delay: 0.3 },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className="stat-item"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: stat.delay }}
                    >
                      <div className="stat-number"><CountUp end={stat.end} suffix={stat.suffix} /></div>
                      <div className="stat-label">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="why-highlight">
                <h3>Почему именно эта роль критична</h3>
                <div className="why-list">
                  {[
                    'Критическая инфраструктура — атака на неё может вызвать физические последствия',
                    'Персональные данные миллионов клиентов подлежат защите по 152-ФЗ',
                    'Регуляторные требования (ФСТЭК, ГОСТ) обязывают компании иметь ИБ-службу',
                    'Рынок ИБ растёт на 15-20% в год — дефицит специалистов острый',
                    'Карьера от аналитика SOC до руководителя ИБ-направления за 5-7 лет',
                  ].map((item, i) => (
                    <motion.div
                      className="why-list-item"
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                    >
                      <CheckIcon />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section" id="threats">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">Карта угроз</span>
              <h2 className="section-title"><span className="scan-line">Интерактивная схема сети</span></h2>
              <p className="section-subtitle">Нажми на узел, чтобы узнать, как специалист по ИБ защищает каждый элемент инфраструктуры</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <ThreatMap />
          </motion.div>
        </div>
      </section>

      <section className="section globe-section" id="globe">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">Глобус угроз</span>
              <h2 className="section-title"><span className="scan-line">Кибератаки в реальном времени</span></h2>
              <p className="section-subtitle">Наведи на континент, чтобы увидеть статистику атак</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <ThreatGlobe />
          </motion.div>
        </div>
      </section>

      <section className="section" id="quiz">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-header">
              <span className="section-tag">Тест</span>
              <h2 className="section-title">Проверь себя</h2>
              <p className="section-subtitle">Ответь на 4 вопроса и узнай, знаком ли ты с основами ИБ</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Quiz />
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-copy">
              CyberProfile — Специалист по информационной безопасности
            </div>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="#" aria-label="GitHub"><GitHubIcon /></a>
              <a href="#" aria-label="Telegram"><TelegramIcon /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
