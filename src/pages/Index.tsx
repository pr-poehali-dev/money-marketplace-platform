import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "features" | "pricing" | "cabinet" | "profile" | "editor" | "chatbots";

const AI_CHAT_URL = "https://functions.poehali.dev/64fb0c10-f9fa-4e32-8819-0778bd03a604";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/fd7992d4-08db-479d-812a-5db55e13c405/files/1996794a-75d3-40f7-b8df-10dd79bd3405.jpg";

// ─── Particles ───────────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
    color: ["#3b82f6", "#8b5cf6", "#22d3ee", "#ec4899"][Math.floor(Math.random() * 4)],
  }));
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size,
          left: `${p.left}%`, bottom: "-10px",
          background: p.color,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ plan, onClose }: { plan: { name: string; price: number; color: string } | null; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  if (!plan) return null;

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handlePay = () => {
    if (!cardNum || !expiry || !cvv || !name) return;
    setStep("processing");
    setTimeout(() => setStep("success"), 2200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md card-glass rounded-2xl border border-border/80 shadow-2xl shadow-black/50 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-violet-500/5" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Icon name="CreditCard" size={18} className="text-blue-400" />
                <span className="font-montserrat font-bold text-white">Оплата подписки</span>
              </div>
              <p className="text-muted-foreground text-sm">Тариф «{plan.name}» · {plan.price.toLocaleString("ru")} ₽/мес</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === "form" && (
            <div className="space-y-4">
              {/* Card visual */}
              <div className="relative h-36 rounded-xl overflow-hidden mb-2" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #312e81 100%)" }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%)" }} />
                <div className="absolute top-4 left-4">
                  <div className="w-8 h-6 rounded bg-yellow-400/80" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }} />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-mono text-white/90 text-base tracking-widest mb-1">
                    {cardNum ? cardNum.padEnd(19, "·").replace(/ /g, " ") : "•••• •••• •••• ••••"}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs uppercase tracking-wider">{name || "ИМЯ ВЛАДЕЛЬЦА"}</span>
                    <span className="text-white/60 text-xs">{expiry || "MM/YY"}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-white/40 text-xs font-semibold">VISA</div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Номер карты</label>
                <input value={cardNum} onChange={(e) => setCardNum(formatCard(e.target.value))}
                  placeholder="0000 0000 0000 0000" maxLength={19}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground font-mono tracking-wider focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Имя владельца</label>
                <input value={name} onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="IVAN PETROV"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground uppercase tracking-wider focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Срок действия</label>
                  <input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY" maxLength={5}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">CVV</label>
                  <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="•••" maxLength={3} type="password"
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                </div>
              </div>

              <button onClick={handlePay}
                className="w-full btn-neon text-white font-semibold py-3.5 rounded-xl mt-2 flex items-center justify-center gap-2">
                <Icon name="Lock" size={16} />
                Оплатить {plan.price.toLocaleString("ru")} ₽
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1"><Icon name="ShieldCheck" size={13} className="text-green-400" />Безопасная оплата</div>
                <div className="flex items-center gap-1"><Icon name="RefreshCw" size={13} className="text-blue-400" />Автопродление</div>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
                <div className="absolute inset-3 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Icon name="CreditCard" size={20} className="text-blue-400" />
                </div>
              </div>
              <p className="text-white font-semibold mb-1">Обрабатываем платёж...</p>
              <p className="text-muted-foreground text-sm">Подождите несколько секунд</p>
            </div>
          )}

          {step === "success" && (
            <div className="py-10 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <Icon name="CheckCircle" size={32} className="text-green-400" />
              </div>
              <p className="font-montserrat text-xl font-bold text-white mb-2">Подписка активирована!</p>
              <p className="text-muted-foreground text-sm mb-6">Тариф «{plan.name}» успешно подключён.<br />Следующее списание через 30 дней.</p>
              <button onClick={onClose} className="btn-neon text-white px-8 py-3 rounded-xl font-semibold">
                Перейти в кабинет
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function NavBar({ active, setPage }: { active: Page; setPage: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Закрываем меню при смене страницы
  const handleNav = (id: Page) => {
    setPage(id);
    setMenuOpen(false);
  };

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "features", label: "Возможности", icon: "Sparkles" },
    { id: "pricing", label: "Тарифы", icon: "CreditCard" },
    { id: "chatbots", label: "Чат-боты", icon: "MessageCircle" },
    { id: "editor", label: "ИИ-фото", icon: "Wand2" },
    { id: "cabinet", label: "Кабинет", icon: "LayoutDashboard" },
    { id: "profile", label: "Профиль", icon: "User" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/20" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => handleNav("home")} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg btn-neon flex items-center justify-center">
                <Icon name="Zap" size={16} className="text-white" />
              </div>
              <span className="font-montserrat font-extrabold text-lg text-white">
                Neural<span className="gradient-text">Pay</span>
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active === item.id
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon name={item.icon} size={14} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => handleNav("profile")} className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg btn-neon text-white text-sm font-semibold">
                Войти
              </button>
              <button className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
                <Icon name={menuOpen ? "X" : "Menu"} size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Мобильное меню — отдельный слой поверх всего */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-40 lg:hidden bg-background/98 backdrop-blur-xl border-b border-border shadow-2xl shadow-black/40">
            <div className="max-w-7xl mx-auto px-4 py-3 pb-5">
              <div className="grid grid-cols-2 gap-1.5">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      active === item.id
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50"
                    }`}>
                    <Icon name={item.icon} size={18} />
                    {item.label}
                  </button>
                ))}
              </div>
              <button onClick={() => handleNav("profile")}
                className="w-full mt-3 btn-neon text-white font-semibold py-3 rounded-xl text-sm">
                Войти в аккаунт
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── ChatBots Page ────────────────────────────────────────────────────────────
const CHATBOTS = [
  {
    id: "gpt4o",
    name: "ChatGPT (GPT-4o)",
    avatar: "🤖",
    color: "blue",
    desc: "Самая умная модель OpenAI — отвечает на любые вопросы, пишет код, анализирует",
    canImage: true,
    imageModel: "dall-e-3",
    model: "gpt-4o",
    placeholder: "Напиши что-нибудь или попроси сгенерировать картинку...",
    systemPrompt: "Ты ChatGPT — умный ИИ-ассистент от OpenAI. Отвечай развёрнуто и полезно на русском языке.",
  },
  {
    id: "dalle",
    name: "DALL-E 3",
    avatar: "🎨",
    color: "violet",
    desc: "Генерация фотореалистичных изображений по текстовому описанию от OpenAI",
    canImage: true,
    imageModel: "dall-e-3",
    model: "gpt-4o",
    placeholder: "Опиши изображение, которое хочешь создать...",
    systemPrompt: "Ты DALL-E 3 ассистент. Каждый запрос пользователя — это запрос на генерацию изображения. Отвечай кратко по-русски, что именно ты сгенерируешь.",
    autoImage: true,
  },
  {
    id: "gpt4mini",
    name: "GPT-4o mini",
    avatar: "⚡",
    color: "cyan",
    desc: "Быстрая и экономичная версия GPT-4o — идеально для простых задач",
    canImage: true,
    imageModel: "dall-e-2",
    model: "gpt-4o-mini",
    placeholder: "Задай любой вопрос — отвечу быстро...",
    systemPrompt: "Ты GPT-4o mini — быстрый и точный ИИ-ассистент. Отвечай лаконично по-русски.",
  },
  {
    id: "creative",
    name: "Creative AI",
    avatar: "✨",
    color: "pink",
    desc: "Специализируется на творческих задачах: сторителлинг, маркетинг, идеи",
    canImage: true,
    imageModel: "dall-e-3",
    model: "gpt-4o",
    placeholder: "Попроси придумать идею, слоган, историю...",
    systemPrompt: "Ты творческий ИИ-ассистент. Специализируешься на копирайтинге, идеях, маркетинге и сторителлинге. Будь креативным и вдохновляющим. Отвечай по-русски.",
  },
];

type ChatMsg = { role: "user" | "assistant"; content: string; imageUrl?: string; isImage?: boolean; loading?: boolean };

function ChatBotsPage() {
  const [activeBotId, setActiveBotId] = useState(CHATBOTS[0].id);
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({});
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [genMode, setGenMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bot = CHATBOTS.find((b) => b.id === activeBotId)!;
  const messages: ChatMsg[] = chats[activeBotId] || [];

  const colorMap: Record<string, { border: string; bg: string; text: string; badge: string; bubble: string }> = {
    blue: { border: "glow-border-blue", bg: "bg-blue-500/10", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300", bubble: "bg-blue-600" },
    violet: { border: "glow-border-violet", bg: "bg-violet-500/10", text: "text-violet-400", badge: "bg-violet-500/20 text-violet-300", bubble: "bg-violet-600" },
    cyan: { border: "glow-border-cyan", bg: "bg-cyan-500/10", text: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300", bubble: "bg-cyan-600" },
    pink: { border: "border border-pink-500/30", bg: "bg-pink-500/10", text: "text-pink-400", badge: "bg-pink-500/20 text-pink-300", bubble: "bg-pink-600" },
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setGenMode(bot.autoImage ?? false);
  }, [activeBotId, bot.autoImage]);

  const addMsg = (botId: string, msg: ChatMsg) => {
    setChats((prev) => ({ ...prev, [botId]: [...(prev[botId] || []), msg] }));
  };

  const updateLastMsg = (botId: string, patch: Partial<ChatMsg>) => {
    setChats((prev) => {
      const msgs = [...(prev[botId] || [])];
      if (msgs.length > 0) msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], ...patch };
      return { ...prev, [botId]: msgs };
    });
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);

    const shouldGenerateImage = genMode || bot.autoImage;
    addMsg(bot.id, { role: "user", content: text });
    addMsg(bot.id, { role: "assistant", content: "", loading: true });

    try {
      if (shouldGenerateImage) {
        // Генерируем изображение
        const res = await fetch(AI_CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate_image", prompt: text, model: bot.imageModel, style: "vivid" }),
        });
        const data = await res.json();
        if (data.url) {
          updateLastMsg(bot.id, { content: data.revised_prompt || "Изображение сгенерировано", imageUrl: data.url, isImage: true, loading: false });
        } else {
          updateLastMsg(bot.id, { content: data.error || "Ошибка генерации. Проверьте API ключ.", loading: false });
        }
      } else {
        // Обычный чат
        const history = (chats[bot.id] || [])
          .filter((m) => !m.loading && m.content)
          .map((m) => ({ role: m.role, content: m.content }));
        history.push({ role: "user", content: text });

        const res = await fetch(AI_CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "chat", model: bot.model, messages: history, system: bot.systemPrompt }),
        });
        const data = await res.json();
        updateLastMsg(bot.id, { content: data.reply || data.error || "Ошибка. Проверьте API ключ.", loading: false });
      }
    } catch {
      updateLastMsg(bot.id, { content: "Ошибка подключения к серверу.", loading: false });
    } finally {
      setSending(false);
    }
  };

  const c = colorMap[bot.color];

  return (
    <div className="min-h-screen pt-20 pb-0 flex flex-col" style={{ height: "100dvh" }}>
      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 gap-5 pb-4" style={{ minHeight: 0 }}>

        {/* Sidebar — боты */}
        <div className="hidden md:flex flex-col w-64 shrink-0 gap-2 pt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 px-1">Выбери бота</p>
          {CHATBOTS.map((b) => {
            const bc = colorMap[b.color];
            return (
              <button key={b.id} onClick={() => setActiveBotId(b.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  activeBotId === b.id ? `${bc.bg} ${bc.border}` : "border-border/40 hover:border-border/70 bg-transparent hover:bg-white/3"
                }`}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{b.avatar}</span>
                  <div>
                    <div className={`text-sm font-semibold ${activeBotId === b.id ? "text-white" : "text-foreground"}`}>{b.name}</div>
                    {b.canImage && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${bc.badge}`}>🖼 Фото</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Chat window */}
        <div className={`flex-1 flex flex-col card-glass rounded-2xl ${c.border} overflow-hidden min-h-0`}>
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{bot.avatar}</span>
              <div>
                <div className="font-semibold text-white text-sm">{bot.name}</div>
                <div className="text-xs text-muted-foreground">{bot.desc.slice(0, 50)}...</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {bot.canImage && (
                <button onClick={() => setGenMode(!genMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    genMode ? `${c.bg} ${c.text} border ${c.border}` : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}>
                  <Icon name="Image" size={13} />
                  {genMode ? "Режим: Фото" : "Режим: Чат"}
                </button>
              )}
              <button onClick={() => setChats((prev) => ({ ...prev, [bot.id]: [] }))}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors" title="Очистить чат">
                <Icon name="Trash2" size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
                <span className="text-6xl">{bot.avatar}</span>
                <div>
                  <p className="font-semibold text-white text-lg">{bot.name}</p>
                  <p className="text-muted-foreground text-sm mt-1 max-w-xs">{bot.desc}</p>
                </div>
                {bot.canImage && (
                  <div className="flex gap-2 flex-wrap justify-center">
                    {["Нарисуй закат на море", "Сгенерируй кот-астронавт", "Футуристический город"].map((s) => (
                      <button key={s} onClick={() => { setInput(s); setGenMode(true); }}
                        className={`text-xs px-3 py-1.5 rounded-full ${c.bg} ${c.text} border ${c.border} hover:opacity-80 transition-opacity`}>
                        🖼 {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 flex-wrap justify-center">
                  {["Привет! Что ты умеешь?", "Помоги с идеей для бизнеса", "Объясни квантовую физику просто"].map((s) => (
                    <button key={s} onClick={() => setInput(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border hover:text-foreground hover:border-border/80 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.role === "assistant" && (
                  <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center text-base shrink-0 mt-0.5`}>
                    {bot.avatar}
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {msg.loading ? (
                    <div className="card-glass rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  ) : msg.isImage && msg.imageUrl ? (
                    <div className={`card-glass rounded-2xl rounded-tl-sm border ${c.border} overflow-hidden`}>
                      <img src={msg.imageUrl} alt="Generated" className="max-w-xs w-full rounded-xl" />
                      <div className="px-3 py-2 flex items-center justify-between gap-3">
                        <span className={`text-xs ${c.text}`}>✓ Сгенерировано {bot.name}</span>
                        <a href={msg.imageUrl} download target="_blank" rel="noreferrer"
                          className={`text-xs ${c.text} hover:opacity-70 flex items-center gap-1`}>
                          <Icon name="Download" size={12} />Скачать
                        </a>
                      </div>
                      {msg.content && <p className="px-3 pb-2 text-xs text-muted-foreground leading-relaxed">{msg.content}</p>}
                    </div>
                  ) : (
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "card-glass border border-border/50 text-foreground rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                    Я
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border/50 shrink-0">
            {genMode && (
              <div className={`flex items-center gap-1.5 text-xs ${c.text} mb-2 px-1`}>
                <Icon name="Image" size={12} />
                Режим генерации изображений активен
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={bot.placeholder}
                disabled={sending}
                className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
              />
              <button onClick={sendMessage} disabled={!input.trim() || sending}
                className={`px-4 py-3 rounded-xl font-medium transition-all shrink-0 ${
                  input.trim() && !sending ? "btn-neon text-white" : "bg-muted/50 text-muted-foreground cursor-not-allowed border border-border"
                }`}>
                {sending
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Icon name={genMode ? "Image" : "Send"} size={18} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile bot selector */}
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-30">
          <div className="card-glass rounded-xl border border-border/80 p-2 flex gap-2 overflow-x-auto">
            {CHATBOTS.map((b) => {
              const bc = colorMap[b.color];
              return (
                <button key={b.id} onClick={() => setActiveBotId(b.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shrink-0 transition-all ${
                    activeBotId === b.id ? `${bc.bg} ${bc.text} border ${bc.border}` : "text-muted-foreground hover:text-foreground"
                  }`}>
                  <span>{b.avatar}</span>
                  <span className="text-xs">{b.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Photo Editor ──────────────────────────────────────────────────────────
const AI_TOOLS = [
  {
    id: "remove-bg",
    name: "Удалить фон",
    desc: "Автоматически убирает фон с любой фотографии",
    icon: "Scissors",
    color: "blue",
    badge: "Быстро",
    model: "Remove.bg AI",
    time: "3 сек",
  },
  {
    id: "upscale",
    name: "Улучшить качество",
    desc: "Увеличивает разрешение в 4× и убирает артефакты",
    icon: "ZoomIn",
    color: "violet",
    badge: null,
    model: "Real-ESRGAN",
    time: "8 сек",
  },
  {
    id: "style",
    name: "Изменить стиль",
    desc: "Превращает фото в аниме, масло, акварель, киберпанк",
    icon: "Palette",
    color: "cyan",
    badge: "Топ",
    model: "Stable Diffusion XL",
    time: "15 сек",
  },
  {
    id: "inpaint",
    name: "Редактировать текстом",
    desc: "Опиши изменение — ИИ внесёт его прямо на фото",
    icon: "PenTool",
    color: "pink",
    badge: "Новое",
    model: "DALL-E 3",
    time: "12 сек",
  },
  {
    id: "face",
    name: "Улучшить лицо",
    desc: "Восстанавливает черты лица, убирает дефекты",
    icon: "Smile",
    color: "blue",
    badge: null,
    model: "GFPGAN",
    time: "6 сек",
  },
  {
    id: "colorize",
    name: "Раскрасить фото",
    desc: "Добавляет цвет к чёрно-белым снимкам",
    icon: "Droplets",
    color: "violet",
    badge: null,
    model: "DeOldify",
    time: "5 сек",
  },
  {
    id: "object-remove",
    name: "Удалить объект",
    desc: "Убирает любой объект и восстанавливает фон",
    icon: "Eraser",
    color: "cyan",
    badge: null,
    model: "LaMa Inpainting",
    time: "10 сек",
  },
  {
    id: "generate",
    name: "Генерация по фото",
    desc: "Создаёт новое изображение в стиле загруженного",
    icon: "Wand2",
    color: "pink",
    badge: null,
    model: "Stable Diffusion img2img",
    time: "20 сек",
  },
];

const STYLE_PRESETS = [
  { name: "Аниме", emoji: "🎌" },
  { name: "Масляная живопись", emoji: "🖼" },
  { name: "Акварель", emoji: "💧" },
  { name: "Киберпанк", emoji: "🌆" },
  { name: "Гравюра", emoji: "📜" },
  { name: "Комикс", emoji: "💥" },
  { name: "Ретро-фото", emoji: "📷" },
  { name: "Студийный свет", emoji: "✨" },
];

function EditorPage() {
  const [activeTool, setActiveTool] = useState(AI_TOOLS[0].id);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Аниме");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const tool = AI_TOOLS.find((t) => t.id === activeTool)!;

  const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    blue: { border: "glow-border-blue", bg: "bg-blue-500/10", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300" },
    violet: { border: "glow-border-violet", bg: "bg-violet-500/10", text: "text-violet-400", badge: "bg-violet-500/20 text-violet-300" },
    cyan: { border: "glow-border-cyan", bg: "bg-cyan-500/10", text: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300" },
    pink: { border: "border border-pink-500/30", bg: "bg-pink-500/10", text: "text-pink-400", badge: "bg-pink-500/20 text-pink-300" },
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = () => {
    if (!uploadedImage) return;
    setProcessing(true);
    setProgress(0);
    setResultImage(null);
    const duration = parseInt(tool.time) * 1000;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 12;
      });
    }, duration / 15);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResultImage(uploadedImage);
        setProcessing(false);
        setProgress(0);
      }, 400);
    }, duration);
  };

  const c = colorMap[tool.color];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glow-border-violet bg-violet-500/10 text-violet-300 text-sm font-medium mb-4">
            <Icon name="Wand2" size={14} />
            ИИ-редактор фотографий
          </div>
          <h1 className="font-montserrat text-4xl font-bold text-white mb-2">
            Редактируй фото с <span className="gradient-text">нейросетями</span>
          </h1>
          <p className="text-muted-foreground">8 инструментов на базе топовых ИИ-моделей</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools sidebar */}
          <div className="lg:col-span-1 space-y-1.5">
            {AI_TOOLS.map((t) => {
              const tc = colorMap[t.color];
              return (
                <button key={t.id} onClick={() => { setActiveTool(t.id); setResultImage(null); }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                    activeTool === t.id
                      ? `${tc.bg} ${tc.border} shadow-sm`
                      : "border-border/40 hover:border-border hover:bg-white/3 bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeTool === t.id ? tc.bg : "bg-muted/50"}`}>
                      <Icon name={t.icon} size={16} className={activeTool === t.id ? tc.text : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${activeTool === t.id ? "text-white" : "text-foreground"}`}>{t.name}</span>
                        {t.badge && <span className={`text-xs px-1.5 py-0.5 rounded-full ${tc.badge}`}>{t.badge}</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{t.model}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main workspace */}
          <div className="lg:col-span-3 space-y-5">
            {/* Tool info */}
            <div className={`card-glass rounded-2xl p-5 ${c.border}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                    <Icon name={tool.icon} size={22} className={c.text} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-white text-lg">{tool.name}</h2>
                      {tool.badge && <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>{tool.badge}</span>}
                    </div>
                    <p className="text-muted-foreground text-sm">{tool.desc}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground">Модель</div>
                  <div className={`text-sm font-medium ${c.text}`}>{tool.model}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">~{tool.time}</div>
                </div>
              </div>

              {/* Prompt for text-based tools */}
              {(activeTool === "inpaint" || activeTool === "generate") && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <label className="block text-sm text-muted-foreground mb-2">Текстовое описание изменений</label>
                  <div className="flex gap-2">
                    <input value={prompt} onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Например: замени фон на закат в горах..."
                      className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                  </div>
                </div>
              )}

              {/* Style presets */}
              {activeTool === "style" && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <label className="block text-sm text-muted-foreground mb-3">Выберите стиль</label>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_PRESETS.map((s) => (
                      <button key={s.name} onClick={() => setSelectedStyle(s.name)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedStyle === s.name
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-muted/50 text-muted-foreground border border-border hover:border-border/80 hover:text-foreground"
                        }`}>
                        {s.emoji} {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Upload + Result */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Upload */}
              <div className="card-glass rounded-2xl border border-border/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Icon name="Upload" size={14} className="text-muted-foreground" />
                    Исходное фото
                  </span>
                  {uploadedImage && (
                    <button onClick={() => { setUploadedImage(null); setResultImage(null); }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Очистить
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                {uploadedImage ? (
                  <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                    <img src={uploadedImage} alt="Uploaded" className="w-full h-56 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium flex items-center gap-2">
                        <Icon name="RefreshCw" size={16} />
                        Заменить
                      </span>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full h-56 flex flex-col items-center justify-center gap-3 hover:bg-white/3 transition-colors group">
                    <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                      <Icon name="ImagePlus" size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Загрузить фото</p>
                      <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP до 10 МБ</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Result */}
              <div className="card-glass rounded-2xl border border-border/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Icon name="Sparkles" size={14} className={c.text} />
                    Результат
                  </span>
                  {resultImage && (
                    <a href={resultImage} download="result.png"
                      className={`text-xs font-medium ${c.text} hover:opacity-80 flex items-center gap-1 transition-opacity`}>
                      <Icon name="Download" size={13} />
                      Скачать
                    </a>
                  )}
                </div>
                <div className="h-56 relative">
                  {processing ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 px-6">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                        <div className={`absolute inset-2 rounded-full ${c.bg} flex items-center justify-center`}>
                          <Icon name={tool.icon} size={18} className={c.text} />
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                          <span>{tool.name}...</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full progress-bar rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{tool.model} · ~{tool.time}</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative h-full">
                      <img src={resultImage} alt="Result" className="w-full h-full object-cover" style={{ filter: getFilter(activeTool, selectedStyle) }} />
                      <div className="absolute bottom-2 right-2">
                        <span className={`text-xs px-2 py-1 rounded-lg ${c.bg} ${c.text} border ${c.border} backdrop-blur-sm`}>
                          ✓ {tool.model}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center opacity-50`}>
                        <Icon name={tool.icon} size={24} className={c.text} />
                      </div>
                      <p className="text-sm">{uploadedImage ? "Нажми «Применить»" : "Загрузи фото"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Process button */}
            <button onClick={handleProcess} disabled={!uploadedImage || processing}
              className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2.5 transition-all ${
                uploadedImage && !processing
                  ? "btn-neon text-white"
                  : "bg-muted/50 text-muted-foreground cursor-not-allowed border border-border"
              }`}>
              {processing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Обрабатываю...</>
              ) : (
                <><Icon name={tool.icon} size={18} />Применить: {tool.name}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getFilter(toolId: string, style: string): string {
  if (toolId === "remove-bg") return "drop-shadow(0 4px 24px rgba(0,0,0,0.5))";
  if (toolId === "upscale") return "contrast(1.05) saturate(1.1) sharpen(1)";
  if (toolId === "face") return "contrast(1.05) brightness(1.05)";
  if (toolId === "colorize") return "saturate(1.8) hue-rotate(10deg)";
  if (toolId === "style") {
    if (style === "Аниме") return "saturate(1.8) contrast(1.15) hue-rotate(-10deg)";
    if (style === "Акварель") return "saturate(0.7) blur(0.3px) brightness(1.1)";
    if (style === "Киберпанк") return "hue-rotate(180deg) saturate(2) contrast(1.2)";
    if (style === "Ретро-фото") return "sepia(0.8) contrast(1.1) brightness(0.95)";
    return "contrast(1.2) saturate(1.4)";
  }
  return "brightness(1.05) contrast(1.05)";
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const stats = [
    { value: "2.4M+", label: "запросов в день" },
    { value: "99.9%", label: "uptime" },
    { value: "150+", label: "ИИ-моделей" },
    { value: "12ms", label: "среднее время ответа" },
  ];
  const features = [
    { icon: "Brain", title: "GPT-4, Claude, Gemini", desc: "Доступ к топовым моделям в одном месте", color: "blue" },
    { icon: "Wand2", title: "ИИ-редактор фото", desc: "8 нейросетей для редактирования изображений", color: "violet" },
    { icon: "Shield", title: "Безопасность", desc: "Шифрование запросов и полная конфиденциальность", color: "cyan" },
    { icon: "RefreshCw", title: "Автопродление", desc: "Подписка продлевается сама — никаких прерываний", color: "pink" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="AI Platform" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/80" />
        </div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 hidden lg:block z-0">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-violet-500/20 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "15s" }} />
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10 animate-pulse-slow" />
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glow-border-blue bg-blue-500/10 text-blue-300 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Новое поколение ИИ-платформ
            </div>
            <h1 className="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-fade-in-up-delay-1">
              <span className="text-white">Мощь ИИ</span><br />
              <span className="gradient-text">без ограничений</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl animate-fade-in-up-delay-2">
              Единая платформа для работы со всеми топовыми ИИ-моделями.
              ИИ-редактор фото, умные подписки с автопродлением и аналитика.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-3">
              <button onClick={() => setPage("pricing")} className="btn-neon text-white font-semibold px-8 py-4 rounded-xl text-base">
                Начать бесплатно <Icon name="ArrowRight" size={18} className="inline ml-2" />
              </button>
              <button onClick={() => setPage("editor")} className="btn-ghost-neon text-foreground font-semibold px-8 py-4 rounded-xl text-base flex items-center gap-2">
                <Icon name="Wand2" size={18} />
                ИИ-редактор фото
              </button>
            </div>
            <div className="flex flex-wrap gap-8 mt-14 animate-fade-in-up-delay-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-montserrat text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-muted-foreground text-sm mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-montserrat text-4xl font-bold text-white mb-4">
            Почему выбирают <span className="gradient-text">NeuralPay</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Всё что нужно для работы с ИИ — в одном месте</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const colorMap: Record<string, string> = { blue: "glow-border-blue", violet: "glow-border-violet", cyan: "glow-border-cyan", pink: "border border-pink-500/30" };
            const iconColor: Record<string, string> = { blue: "text-blue-400", violet: "text-violet-400", cyan: "text-cyan-400", pink: "text-pink-400" };
            const bgColor: Record<string, string> = { blue: "bg-blue-500/10", violet: "bg-violet-500/10", cyan: "bg-cyan-500/10", pink: "bg-pink-500/10" };
            return (
              <div key={i} className={`card-glass rounded-2xl p-6 ${colorMap[f.color]} transition-all duration-300 hover:-translate-y-1 cursor-default`}>
                <div className={`w-12 h-12 rounded-xl ${bgColor[f.color]} flex items-center justify-center mb-4`}>
                  <Icon name={f.icon} size={24} className={iconColor[f.color]} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card-glass rounded-3xl p-12 glow-border-violet relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-blue-500/5" />
            <div className="relative z-10">
              <h2 className="font-montserrat text-3xl sm:text-4xl font-bold text-white mb-4">Готов начать?</h2>
              <p className="text-muted-foreground text-lg mb-8">Первые 7 дней — бесплатно. Без привязки карты.</p>
              <button onClick={() => setPage("pricing")} className="btn-neon text-white font-semibold px-10 py-4 rounded-xl text-lg">
                Выбрать тариф <Icon name="Zap" size={18} className="inline ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Features Page ────────────────────────────────────────────────────────────
function FeaturesPage({ setPage }: { setPage: (p: Page) => void }) {
  const features = [
    { icon: "Brain", title: "150+ ИИ-моделей", desc: "GPT-4o, Claude 3.5, Gemini Ultra, Llama 3, Mistral, DALL-E 3 и десятки других.", color: "blue", badge: "Популярно" },
    { icon: "Wand2", title: "ИИ-редактор фото", desc: "8 нейросетей: удаление фона, улучшение качества, смена стиля, генерация по тексту.", color: "violet", badge: "Новое" },
    { icon: "Code2", title: "API доступ", desc: "Полноценный REST API. Интегрируй ИИ в своё приложение за 5 минут.", color: "cyan", badge: null },
    { icon: "MessageSquare", title: "Чаты и ассистенты", desc: "Персонализированные ИИ-ассистенты с памятью и контекстом.", color: "pink", badge: null },
    { icon: "FileText", title: "Работа с документами", desc: "Загружай PDF, Word, Excel — ИИ анализирует и отвечает на вопросы.", color: "blue", badge: null },
    { icon: "Mic", title: "Голос и аудио", desc: "Транскрибация речи, синтез голоса, перевод на 50+ языков.", color: "violet", badge: null },
    { icon: "BarChart3", title: "Аналитика", desc: "Дашборд с метриками: запросы, расходы, модели, время ответа.", color: "cyan", badge: null },
    { icon: "Users", title: "Командный доступ", desc: "Единый аккаунт для команды с ролями и аналитикой по сотрудникам.", color: "pink", badge: "Скоро" },
  ];
  const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    blue: { border: "glow-border-blue", bg: "bg-blue-500/10", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300" },
    violet: { border: "glow-border-violet", bg: "bg-violet-500/10", text: "text-violet-400", badge: "bg-violet-500/20 text-violet-300" },
    cyan: { border: "glow-border-cyan", bg: "bg-cyan-500/10", text: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300" },
    pink: { border: "border border-pink-500/30", bg: "bg-pink-500/10", text: "text-pink-400", badge: "bg-pink-500/20 text-pink-300" },
  };
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glow-border-cyan bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-6">
            <Icon name="Sparkles" size={14} />Возможности платформы
          </div>
          <h1 className="font-montserrat text-5xl font-bold text-white mb-4">
            Всё для работы с <span className="gradient-text">ИИ</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">От простых чатов до редактирования фото — NeuralPay закрывает любые задачи</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div key={i} onClick={f.id === "editor" ? () => setPage("editor") : undefined}
                className={`card-glass rounded-2xl p-6 ${c.border} transition-all duration-300 hover:-translate-y-1.5 cursor-default relative`}>
                {f.badge && <span className={`absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>{f.badge}</span>}
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
                  <Icon name={f.icon} size={24} className={c.text} />
                </div>
                <h3 className="font-semibold text-white mb-2 text-base">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-20 text-center">
          <p className="text-muted-foreground text-sm mb-8 uppercase tracking-widest">Интегрировано с</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["OpenAI", "Anthropic", "Google", "Meta", "Stable Diffusion", "Remove.bg", "Real-ESRGAN", "Mistral AI"].map((name) => (
              <div key={name} className="card-glass rounded-xl px-5 py-2.5 text-sm text-muted-foreground font-medium border border-border/50 hover:border-primary/30 transition-colors cursor-default">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Page ─────────────────────────────────────────────────────────────
function PricingPage({ onPay }: { onPay: (plan: { name: string; price: number; color: string }) => void }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Старт",
      price: { monthly: 990, yearly: 790 },
      desc: "Попробуй ИИ без риска — идеально для фрилансеров и личных проектов",
      color: "blue",
      features: [
        "500 000 токенов / месяц",
        "GPT-4o mini, Claude Haiku, Gemini Flash",
        "Чат-боты: GPT-4o mini и Creative AI",
        "ИИ-редактор фото (50 фото/мес)",
        "Генерация изображений DALL-E 3 (100/мес)",
        "Удаление фона, улучшение качества",
        "API доступ",
        "Email поддержка",
      ],
      cta: "Начать бесплатно",
      popular: false,
    },
    {
      name: "Про",
      price: { monthly: 2490, yearly: 1990 },
      desc: "Всё без ограничений для активной работы — контент, код, дизайн каждый день",
      color: "violet",
      features: [
        "5 000 000 токенов / месяц",
        "GPT-4o, Claude 3.5 Sonnet, Gemini Pro",
        "Все 4 чат-бота с генерацией фото",
        "ИИ-редактор фото (500 фото/мес)",
        "Все 8 нейросетей для фото",
        "Генерация изображений DALL-E 3 (1000/мес)",
        "Приоритетная очередь API",
        "Аналитика по токенам и моделям",
        "Чат-поддержка 24/7",
      ],
      cta: "Выбрать Про",
      popular: true,
    },
    {
      name: "Бизнес",
      price: { monthly: 9990, yearly: 7990 },
      desc: "Безлимит для всей команды — агентства, стартапы, корпоративные задачи",
      color: "cyan",
      features: [
        "Безлимитные токены",
        "GPT-4o, Claude 3 Opus, Gemini Ultra + все новинки",
        "Все чат-боты без ограничений",
        "ИИ-редактор фото — безлимит",
        "Генерация изображений — безлимит",
        "До 25 пользователей в команде",
        "Командный дашборд и роли",
        "Выделенный персональный менеджер",
        "Интеграция с корпоративными системами",
        "SLA 99.9% и приоритетная поддержка",
      ],
      cta: "Оставить заявку",
      popular: false,
    },
  ];

  const colorMap: Record<string, { border: string; btn: string; glow: string }> = {
    blue: { border: "glow-border-blue", btn: "btn-ghost-neon text-blue-300", glow: "" },
    violet: { border: "glow-border-violet", btn: "btn-neon text-white", glow: "shadow-xl shadow-violet-500/20" },
    cyan: { border: "glow-border-cyan", btn: "btn-ghost-neon text-cyan-300", glow: "" },
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glow-border-blue bg-blue-500/10 text-blue-300 text-sm font-medium mb-6">
            <Icon name="CreditCard" size={14} />Тарифы и подписки
          </div>
          <h1 className="font-montserrat text-5xl font-bold text-white mb-4">
            Прозрачные <span className="gradient-text">цены</span>
          </h1>
          <p className="text-muted-foreground text-xl mb-8">Автоматическое продление. Отмена в любой момент.</p>
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border">
            <button onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${billing === "monthly" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
              Ежемесячно
            </button>
            <button onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${billing === "yearly" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
              Ежегодно
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">−20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const c = colorMap[plan.color];
            return (
              <div key={plan.name} className={`card-glass rounded-2xl p-8 ${c.border} ${c.glow} relative ${plan.popular ? "md:scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-violet-500/30">
                      ⭐ Популярный
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-montserrat text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.desc}</p>
                </div>
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="font-montserrat text-5xl font-black text-white">{plan.price[billing].toLocaleString("ru")}</span>
                    <span className="text-muted-foreground mb-2">₽/мес</span>
                  </div>
                  {billing === "yearly" && (
                    <p className="text-green-400 text-sm mt-1">
                      Экономия {((plan.price.monthly - plan.price.yearly) * 12).toLocaleString("ru")} ₽ в год
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onPay({ name: plan.name, price: plan.price[billing], color: plan.color })}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all mb-8 ${c.btn}`}>
                  {plan.cta}
                </button>
                <ul className="space-y-3">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Icon name="Check" size={16} className="text-green-400 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {["Безопасная оплата картой", "Автопродление можно отключить", "Полный возврат в течение 7 дней"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Icon name="ShieldCheck" size={16} className="text-green-400" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cabinet Page ─────────────────────────────────────────────────────────────
function CabinetPage() {
  const usageData = [
    { model: "GPT-4o", tokens: "820K", percent: 55 },
    { model: "Claude 3.5", tokens: "310K", percent: 26 },
    { model: "DALL-E 3", tokens: "—", percent: 12 },
    { model: "Stable Diffusion", tokens: "—", percent: 7 },
  ];
  const history = [
    { date: "Сегодня, 14:32", model: "GPT-4o", tokens: 2140, type: "Текст" },
    { date: "Сегодня, 13:10", model: "Remove.bg", tokens: 0, type: "Фото" },
    { date: "Сегодня, 11:15", model: "DALL-E 3", tokens: 0, type: "Изображение" },
    { date: "Вчера, 20:44", model: "Claude 3.5", tokens: 5320, type: "Документ" },
    { date: "Вчера, 18:02", model: "Real-ESRGAN", tokens: 0, type: "Фото" },
  ];
  const typeIcon: Record<string, string> = { Изображение: "Image", Документ: "FileText", Аудио: "Mic", Текст: "MessageSquare", Фото: "Wand2" };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="font-montserrat text-4xl font-bold text-white mb-1">Мой кабинет</h1>
            <p className="text-muted-foreground">Аналитика и управление подпиской</p>
          </div>
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl glow-border-cyan bg-cyan-500/10 text-cyan-300 text-sm font-medium">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />Тариф «Про»
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Токенов использовано", value: "1.2M", sub: "из 2M", icon: "Cpu", color: "blue" },
            { label: "Фото обработано", value: "47", sub: "из 200", icon: "Wand2", color: "violet" },
            { label: "Изображений создано", value: "23", sub: "из 500", icon: "Image", color: "cyan" },
            { label: "Дней до продления", value: "12", sub: null, icon: "Calendar", color: "pink" },
          ].map((s, i) => {
            const colors: Record<string, { border: string; bg: string; text: string }> = {
              blue: { border: "glow-border-blue", bg: "bg-blue-500/10", text: "text-blue-400" },
              violet: { border: "glow-border-violet", bg: "bg-violet-500/10", text: "text-violet-400" },
              cyan: { border: "glow-border-cyan", bg: "bg-cyan-500/10", text: "text-cyan-400" },
              pink: { border: "border border-pink-500/30", bg: "bg-pink-500/10", text: "text-pink-400" },
            };
            const c = colors[s.color];
            return (
              <div key={i} className={`card-glass rounded-2xl p-5 ${c.border}`}>
                <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                  <Icon name={s.icon} size={18} className={c.text} />
                </div>
                <div className="font-montserrat text-2xl font-bold text-white">
                  {s.value}{s.sub && <span className="text-muted-foreground text-sm font-normal ml-1">{s.sub}</span>}
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-glass rounded-2xl p-6 glow-border-blue">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Icon name="PieChart" size={18} className="text-blue-400" />Использование по моделям
            </h2>
            <div className="space-y-4">
              {usageData.map((item) => (
                <div key={item.model}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{item.model}</span>
                    <span className="text-muted-foreground">{item.tokens}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full progress-bar rounded-full" style={{ width: `${item.percent}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{item.percent}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass rounded-2xl p-6 glow-border-violet">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Icon name="Clock" size={18} className="text-violet-400" />История запросов
            </h2>
            <div className="space-y-1">
              {history.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Icon name={typeIcon[item.type] || "MessageSquare"} size={15} className="text-violet-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.model}</div>
                      <div className="text-xs text-muted-foreground">{item.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{item.type}</div>
                    {item.tokens > 0 && <div className="text-xs text-blue-400">{item.tokens.toLocaleString("ru")} ток.</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 card-glass rounded-2xl p-6 border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-blue-500/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-white text-lg mb-1">Подписка «Про»</h2>
              <p className="text-muted-foreground text-sm">Следующее списание: <span className="text-foreground">31 мая 2026</span> · 1 490 ₽</p>
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <Icon name="RefreshCw" size={12} />Автопродление включено
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost-neon px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground">Отменить</button>
              <button className="btn-neon text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Улучшить тариф</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-montserrat text-4xl font-bold text-white mb-2">Профиль</h1>
        <p className="text-muted-foreground mb-10">Управление аккаунтом и настройками</p>

        <div className="card-glass rounded-2xl p-6 glow-border-blue mb-5">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <span className="font-montserrat text-3xl font-bold text-white">АИ</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Camera" size={13} className="text-white" />
              </button>
            </div>
            <div>
              <h2 className="font-semibold text-white text-xl">Алексей Иванов</h2>
              <p className="text-muted-foreground text-sm">alexey@company.ru</p>
              <span className="inline-flex items-center gap-1.5 mt-2 text-xs px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                <Icon name="Star" size={11} />Тариф Про
              </span>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6 glow-border-violet mb-5">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Icon name="User" size={17} className="text-violet-400" />Личные данные
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {[{ label: "Имя", value: "Алексей" }, { label: "Фамилия", value: "Иванов" }].map((field) => (
              <div key={field.label}>
                <label className="block text-sm text-muted-foreground mb-2">{field.label}</label>
                <input defaultValue={field.value} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-2">Email</label>
            <input defaultValue="alexey@company.ru" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Компания</label>
            <input defaultValue="Tech Solutions LLC" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6 glow-border-cyan mb-8">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Icon name="Shield" size={17} className="text-cyan-400" />Безопасность
          </h3>
          <div className="space-y-3">
            {[
              { label: "Двухфакторная аутентификация", status: "Включена", statusColor: "text-green-400", icon: "ShieldCheck" },
              { label: "API ключ", status: "sk-***...***abc", statusColor: "text-muted-foreground", icon: "Key" },
              { label: "Активные сессии", status: "2 устройства", statusColor: "text-blue-400", icon: "Monitor" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <Icon name={item.icon} size={16} className="text-cyan-400" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${item.statusColor}`}>{item.status}</span>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="btn-ghost-neon px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground">Отмена</button>
          <button onClick={handleSave}
            className={`btn-neon text-white px-8 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${saved ? "opacity-90 scale-95" : ""}`}>
            {saved ? <><Icon name="Check" size={16} />Сохранено!</> : <><Icon name="Save" size={16} />Сохранить</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [paymentPlan, setPaymentPlan] = useState<{ name: string; price: number; color: string } | null>(null);

  useEffect(() => {
    if (page !== "chatbots") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  return (
    <div className={`bg-background font-golos ${page === "chatbots" ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <Particles />
      <NavBar active={page} setPage={setPage} />
      <main className="relative z-10">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "features" && <FeaturesPage setPage={setPage} />}
        {page === "pricing" && <PricingPage onPay={setPaymentPlan} />}
        {page === "chatbots" && <ChatBotsPage />}
        {page === "editor" && <EditorPage />}
        {page === "cabinet" && <CabinetPage />}
        {page === "profile" && <ProfilePage />}
      </main>
      {page !== "chatbots" && (
        <footer className="relative z-10 border-t border-border/30 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 NeuralPay · Умная ИИ-платформа ·
            <span className="gradient-text font-medium ml-1">Летим к звёздам 🚀</span>
          </p>
        </footer>
      )}

      {paymentPlan && <PaymentModal plan={paymentPlan} onClose={() => setPaymentPlan(null)} />}
    </div>
  );
}