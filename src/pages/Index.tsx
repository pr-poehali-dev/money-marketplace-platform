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

  const handleNav = (id: Page) => { setPage(id); setMenuOpen(false); };

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "features", label: "Возможности", icon: "Sparkles" },
    { id: "pricing", label: "Тарифы", icon: "CreditCard" },
    { id: "chatbots", label: "Чат-боты", icon: "MessageCircle" },
    { id: "editor", label: "ИИ-фото", icon: "Wand2" },
    { id: "cabinet", label: "Кабинет", icon: "LayoutDashboard" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || menuOpen ? "bg-background/90 backdrop-blur-2xl border-b border-white/8 shadow-2xl shadow-black/30" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => handleNav("home")} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl btn-neon flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Icon name="Zap" size={17} className="text-white" />
              </div>
              <span className="font-montserrat font-extrabold text-xl text-white tracking-tight">
                Neural<span className="gradient-text">Pay</span>
              </span>
            </button>

            <div className="hidden lg:flex items-center p-1 rounded-2xl bg-white/4 border border-white/8 backdrop-blur-sm gap-0.5">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active === item.id
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/6"
                  }`}>
                  <Icon name={item.icon} size={14} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => handleNav("profile")}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl btn-neon text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                <Icon name="User" size={14} />
                Войти
              </button>
              <button className="lg:hidden w-10 h-10 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
                <Icon name={menuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-16 left-3 right-3 z-40 lg:hidden bg-background/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      active === item.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground bg-white/4 hover:bg-white/8 border border-white/6"
                    }`}>
                    <Icon name={item.icon} size={17} />
                    {item.label}
                  </button>
                ))}
              </div>
              <button onClick={() => handleNav("profile")}
                className="w-full btn-neon text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
                <Icon name="User" size={16} />
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

  const colorMap: Record<string, { border: string; bg: string; bgStrong: string; text: string; badge: string; glow: string; gradient: string }> = {
    blue:   { border: "border border-blue-500/40",   bg: "bg-blue-500/10",   bgStrong: "bg-blue-500/20",   text: "text-blue-400",   badge: "bg-blue-500/20 text-blue-300",   glow: "shadow-blue-500/20",   gradient: "from-blue-600 to-blue-400" },
    violet: { border: "border border-violet-500/40", bg: "bg-violet-500/10", bgStrong: "bg-violet-500/20", text: "text-violet-400", badge: "bg-violet-500/20 text-violet-300", glow: "shadow-violet-500/25", gradient: "from-violet-600 to-purple-400" },
    cyan:   { border: "border border-cyan-500/40",   bg: "bg-cyan-500/10",   bgStrong: "bg-cyan-500/20",   text: "text-cyan-400",   badge: "bg-cyan-500/20 text-cyan-300",   glow: "shadow-cyan-500/20",   gradient: "from-cyan-600 to-teal-400" },
    pink:   { border: "border border-pink-500/40",   bg: "bg-pink-500/10",   bgStrong: "bg-pink-500/20",   text: "text-pink-400",   badge: "bg-pink-500/20 text-pink-300",   glow: "shadow-pink-500/20",   gradient: "from-pink-600 to-rose-400" },
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
        updateLastMsg(bot.id, { content: data.reply || data.error || "Ошибка. Добавьте OPENAI_API_KEY в Ядро → Секреты.", loading: false });
      }
    } catch {
      updateLastMsg(bot.id, { content: "Ошибка подключения к серверу.", loading: false });
    } finally {
      setSending(false);
    }
  };

  const c = colorMap[bot.color];

  const QUICK_PROMPTS: Record<string, { text: string; icon: string; isImage?: boolean }[]> = {
    gpt4o:    [{ text: "Напиши план запуска продукта", icon: "Rocket" }, { text: "Объясни квантовые вычисления", icon: "Brain" }, { text: "Нарисуй киберпанк-город", icon: "Image", isImage: true }],
    dalle:    [{ text: "Закат на Марсе в стиле аниме", icon: "Image", isImage: true }, { text: "Волк из северного сияния", icon: "Image", isImage: true }, { text: "Космонавт в джунглях", icon: "Image", isImage: true }],
    gpt4mini: [{ text: "Переведи текст на английский", icon: "Languages" }, { text: "Напиши email коллеге", icon: "Mail" }, { text: "Логотип стартапа по ИИ", icon: "Image", isImage: true }],
    creative: [{ text: "Слоган для кофейни", icon: "Coffee" }, { text: "Идея вирусного поста", icon: "TrendingUp" }, { text: "Обложка альбома в неоне", icon: "Image", isImage: true }],
  };

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <div className="flex flex-1 overflow-hidden pt-16" style={{ minHeight: 0 }}>

        {/* ── Sidebar ── */}
        <div className="hidden md:flex flex-col w-72 shrink-0 border-r border-border/40 bg-background/60 backdrop-blur-xl overflow-y-auto">
          <div className="px-4 pt-6 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">ИИ-ассистенты</p>
            <div className="space-y-1.5">
              {CHATBOTS.map((b) => {
                const bc = colorMap[b.color];
                const isActive = activeBotId === b.id;
                const msgCount = (chats[b.id] || []).filter(m => !m.loading).length;
                return (
                  <button key={b.id} onClick={() => setActiveBotId(b.id)}
                    className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? `${bc.bg} ${bc.border} shadow-lg ${bc.glow}`
                        : "hover:bg-white/4 border border-transparent hover:border-border/30"
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all ${
                        isActive ? `bg-gradient-to-br ${bc.gradient} shadow-lg` : "bg-muted/50"
                      }`}>
                        {b.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-foreground/80"}`}>{b.name}</span>
                          {msgCount > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${bc.badge}`}>{msgCount}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {b.canImage && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${bc.badge} opacity-80`}>🖼 Фото</span>}
                          <span className="text-[10px] text-muted-foreground/50 truncate">{b.model}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed mt-2 line-clamp-2 transition-colors ${isActive ? "text-muted-foreground" : "text-muted-foreground/50 group-hover:text-muted-foreground/70"}`}>
                      {b.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API key hint */}
          <div className="mx-4 mb-4 mt-auto">
            <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Icon name="Key" size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-300 mb-1">Как активировать?</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Ядро → Секреты → <span className="text-amber-400 font-mono">OPENAI_API_KEY</span> → вставь ключ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">

          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-3 border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-xl shadow-lg shadow-${bot.color}-500/30`}>
                {bot.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{bot.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.badge}`}>{bot.model}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-green-400">онлайн</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{bot.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {bot.canImage && (
                <button onClick={() => setGenMode(!genMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    genMode
                      ? `${c.bg} ${c.text} ${c.border} shadow-sm`
                      : "bg-muted/40 text-muted-foreground border-border/50 hover:text-foreground hover:bg-muted/60"
                  }`}>
                  <Icon name={genMode ? "Image" : "MessageSquare"} size={12} />
                  <span className="hidden sm:inline">{genMode ? "Генерация" : "Чат"}</span>
                </button>
              )}
              <button onClick={() => setChats((prev) => ({ ...prev, [bot.id]: [] }))}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors border border-transparent hover:border-border/40"
                title="Очистить чат">
                <Icon name="RotateCcw" size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto min-h-0" style={{ background: "radial-gradient(ellipse at top, rgba(99,102,241,0.03) 0%, transparent 60%)" }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-6 py-8">
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-4xl shadow-2xl shadow-${bot.color}-500/30`}>
                  {bot.avatar}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-background flex items-center justify-center`}>
                    <span className="text-[8px]">✓</span>
                  </div>
                </div>
                <div>
                  <h2 className="font-montserrat text-2xl font-bold text-white mb-2">{bot.name}</h2>
                  <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{bot.desc}</p>
                </div>
                <div className="w-full max-w-lg">
                  <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-3">Попробуй спросить</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(QUICK_PROMPTS[bot.id] || []).map((q) => (
                      <button key={q.text}
                        onClick={() => { setInput(q.text); if (q.isImage) setGenMode(true); }}
                        className={`flex items-start gap-2.5 p-3 rounded-xl text-left text-xs transition-all border hover:scale-[1.02] ${
                          q.isImage
                            ? `${c.bg} ${c.border} ${c.text} hover:${c.bgStrong}`
                            : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}>
                        <Icon name={q.icon} size={14} className="shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{q.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto w-full">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.role === "assistant" ? (
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-lg shrink-0 shadow-lg`}>
                        {bot.avatar}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg">
                        Я
                      </div>
                    )}
                    <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      {msg.loading ? (
                        <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-muted/40 border border-border/50 backdrop-blur-sm">
                          <div className="flex gap-1.5 items-center">
                            {[0, 150, 300].map((d) => (
                              <div key={d} className={`w-2 h-2 rounded-full animate-bounce ${c.text.replace("text-", "bg-")}`}
                                style={{ animationDelay: `${d}ms` }} />
                            ))}
                          </div>
                        </div>
                      ) : msg.isImage && msg.imageUrl ? (
                        <div className={`rounded-2xl rounded-tl-sm overflow-hidden border ${c.border} shadow-xl ${c.glow} shadow-lg`}>
                          <img src={msg.imageUrl} alt="Generated" className="max-w-[320px] w-full block" />
                          <div className={`px-4 py-2.5 flex items-center justify-between gap-3 ${c.bg}`}>
                            <span className={`text-xs font-medium ${c.text} flex items-center gap-1.5`}>
                              <Icon name="Sparkles" size={11} /> Сгенерировано DALL-E
                            </span>
                            <a href={msg.imageUrl} target="_blank" rel="noreferrer"
                              className={`text-xs ${c.text} hover:opacity-70 flex items-center gap-1 transition-opacity`}>
                              <Icon name="Download" size={11} />Скачать
                            </a>
                          </div>
                          {msg.content && (
                            <p className="px-4 py-2 text-xs text-muted-foreground leading-relaxed bg-background/50 border-t border-border/30">
                              {msg.content}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap backdrop-blur-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm shadow-lg shadow-primary/20"
                            : "bg-muted/40 border border-border/50 text-foreground rounded-tl-sm"
                        }`}>
                          {msg.content}
                        </div>
                      )}
                      <span className="text-[10px] text-muted-foreground/40 px-1">
                        {msg.role === "user" ? "Вы" : bot.name}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border/40 bg-background/80 backdrop-blur-xl shrink-0">
            {genMode && (
              <div className={`flex items-center gap-1.5 text-[11px] ${c.text} mb-2 px-1 opacity-80`}>
                <Icon name="Sparkles" size={11} />
                Режим генерации изображений — опиши что хочешь увидеть
              </div>
            )}
            <div className="flex gap-2 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={bot.placeholder}
                  disabled={sending}
                  className={`w-full bg-muted/40 border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 backdrop-blur-sm ${
                    input ? `${c.border} focus:ring-${bot.color}-500/30` : "border-border/50 focus:border-border"
                  }`}
                />
                {input && (
                  <button onClick={() => setInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="X" size={14} />
                  </button>
                )}
              </div>
              <button onClick={sendMessage} disabled={!input.trim() || sending}
                className={`w-12 h-12 rounded-xl font-medium transition-all shrink-0 flex items-center justify-center shadow-lg ${
                  input.trim() && !sending
                    ? `bg-gradient-to-br ${c.gradient} text-white hover:opacity-90 hover:scale-105 shadow-${bot.color}-500/30`
                    : "bg-muted/40 text-muted-foreground/40 cursor-not-allowed border border-border/30"
                }`}>
                {sending
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Icon name={genMode ? "Sparkles" : "Send"} size={16} />
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bot picker */}
      <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl shrink-0">
        <div className="flex overflow-x-auto px-3 py-2 gap-2 scrollbar-hide">
          {CHATBOTS.map((b) => {
            const bc = colorMap[b.color];
            const isActive = activeBotId === b.id;
            return (
              <button key={b.id} onClick={() => setActiveBotId(b.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                  isActive ? `${bc.bg} ${bc.border} ${bc.text}` : "border-border/30 text-muted-foreground bg-transparent"
                }`}>
                <span className="text-base">{b.avatar}</span>
                <span>{b.name.split(" ")[0]}</span>
              </button>
            );
          })}
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
    { value: "2.4M+", label: "запросов в день", icon: "Zap" },
    { value: "99.9%", label: "uptime", icon: "Shield" },
    { value: "150+", label: "ИИ-моделей", icon: "Brain" },
    { value: "12ms", label: "среднее время ответа", icon: "Clock" },
  ];
  const features = [
    { icon: "Brain", title: "GPT-4o, Claude, Gemini", desc: "Доступ ко всем топовым ИИ-моделям в одном окне", color: "blue", gradient: "from-blue-600 to-blue-400" },
    { icon: "Wand2", title: "ИИ-редактор фото", desc: "8 нейросетей: фон, качество, стиль, генерация", color: "violet", gradient: "from-violet-600 to-purple-400" },
    { icon: "Shield", title: "Безопасность", desc: "Шифрование end-to-end и полная конфиденциальность", color: "cyan", gradient: "from-cyan-600 to-teal-400" },
    { icon: "RefreshCw", title: "Автопродление", desc: "Подписка продлевается сама — никаких прерываний", color: "pink", gradient: "from-pink-600 to-rose-400" },
  ];
  const models = ["GPT-4o", "Claude 3.5", "Gemini Ultra", "DALL-E 3", "Llama 3", "Mistral", "Stable Diffusion", "Whisper"];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-background/60" />
        </div>
        {/* Glow blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow hidden lg:block" />
        <div className="absolute bottom-32 right-40 w-64 h-64 bg-violet-600/12 rounded-full blur-3xl animate-pulse-slow hidden lg:block" style={{ animationDelay: "1s" }} />
        {/* Orbits */}
        <div className="absolute top-1/2 right-16 -translate-y-1/2 hidden xl:block z-0">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 rounded-full border border-blue-500/15 animate-spin-slow" />
            <div className="absolute inset-10 rounded-full border border-violet-500/15 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "18s" }} />
            <div className="absolute inset-20 rounded-full border border-cyan-500/10 animate-spin-slow" style={{ animationDuration: "12s" }} />
            <div className="absolute inset-[38%] rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 animate-pulse-slow shadow-lg shadow-blue-500/20" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8 animate-fade-in-up shadow-lg shadow-blue-500/10">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shrink-0" />
              Новое поколение ИИ-платформ · 2026
            </div>
            <h1 className="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 animate-fade-in-up-delay-1">
              <span className="text-white">Мощь ИИ</span><br />
              <span className="gradient-text">без ограничений</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 animate-fade-in-up-delay-2">
              Единая платформа для GPT-4o, Claude, Gemini и 150+ моделей.
              Чат-боты, редактор фото, API — всё в одной подписке.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in-up-delay-3">
              <button onClick={() => setPage("pricing")}
                className="btn-neon text-white font-bold px-8 py-4 rounded-2xl text-base flex items-center gap-2 shadow-xl shadow-primary/30">
                Начать бесплатно
                <Icon name="ArrowRight" size={18} />
              </button>
              <button onClick={() => setPage("chatbots")}
                className="btn-ghost-neon text-foreground font-semibold px-8 py-4 rounded-2xl text-base flex items-center gap-2">
                <Icon name="MessageCircle" size={18} />
                Попробовать чат-бота
              </button>
            </div>

            {/* Marquee models */}
            <div className="mt-12 animate-fade-in-up-delay-4">
              <p className="text-xs text-muted-foreground/50 uppercase tracking-widest mb-3">Интегрировано с</p>
              <div className="flex flex-wrap gap-2">
                {models.map((m) => (
                  <span key={m} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground font-medium hover:border-primary/30 hover:text-foreground transition-colors cursor-default">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-glass rounded-2xl p-6 border border-white/6 text-center hover:border-primary/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon name={s.icon} size={18} className="text-primary" />
              </div>
              <div className="font-montserrat text-3xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-muted-foreground text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-5">
            <Icon name="Sparkles" size={14} />
            Почему выбирают NeuralPay
          </div>
          <h2 className="font-montserrat text-4xl sm:text-5xl font-bold text-white mb-4">
            Всё что нужно для работы с <span className="gradient-text">ИИ</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">В одном месте, с единой подпиской и без головной боли</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const borderMap: Record<string, string> = { blue: "glow-border-blue", violet: "glow-border-violet", cyan: "glow-border-cyan", pink: "border border-pink-500/30" };
            const textMap: Record<string, string> = { blue: "text-blue-400", violet: "text-violet-400", cyan: "text-cyan-400", pink: "text-pink-400" };
            return (
              <div key={i} className={`card-glass rounded-2xl p-6 ${borderMap[f.color]} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-default group`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon name={f.icon} size={26} className="text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-base">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                <div className={`mt-4 text-xs font-medium ${textMap[f.color]} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Подробнее <Icon name="ArrowRight" size={11} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-montserrat text-4xl font-bold text-white mb-4">Как это работает?</h2>
          <p className="text-muted-foreground text-lg">Три шага до вашего личного ИИ-помощника</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {[
            { step: "01", icon: "UserPlus", title: "Зарегистрируйся", desc: "Создай аккаунт за 30 секунд. Первые 7 дней бесплатно — карта не нужна.", color: "blue" },
            { step: "02", icon: "CreditCard", title: "Выбери тариф", desc: "Старт, Про или Бизнес. Меняй или отменяй подписку в любой момент.", color: "violet" },
            { step: "03", icon: "Zap", title: "Пользуйся", desc: "Чат-боты, редактор фото, API — всё доступно сразу после оплаты.", color: "cyan" },
          ].map((s, i) => {
            const borderMap: Record<string, string> = { blue: "border-blue-500/30", violet: "border-violet-500/30", cyan: "border-cyan-500/30" };
            const textMap: Record<string, string> = { blue: "text-blue-400", violet: "text-violet-400", cyan: "text-cyan-400" };
            const bgMap: Record<string, string> = { blue: "bg-blue-500/10", violet: "bg-violet-500/10", cyan: "bg-cyan-500/10" };
            return (
              <div key={i} className={`card-glass rounded-2xl p-7 border ${borderMap[s.color]} text-center relative`}>
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${bgMap[s.color]} ${textMap[s.color]} border ${borderMap[s.color]}`}>{s.step}</span>
                <div className={`w-14 h-14 rounded-2xl ${bgMap[s.color]} flex items-center justify-center mx-auto mb-4`}>
                  <Icon name={s.icon} size={26} className={textMap[s.color]} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative card-glass rounded-3xl p-12 sm:p-16 overflow-hidden border border-violet-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/8 via-blue-600/5 to-cyan-600/8" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-medium mb-6">
                <Icon name="Gift" size={14} />
                7 дней бесплатно — без привязки карты
              </div>
              <h2 className="font-montserrat text-4xl sm:text-5xl font-bold text-white mb-4">Готов начать?</h2>
              <p className="text-muted-foreground text-xl mb-10 max-w-lg mx-auto">Присоединяйся к тысячам пользователей, которые уже работают с ИИ каждый день</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => setPage("pricing")}
                  className="btn-neon text-white font-bold px-10 py-4 rounded-2xl text-lg flex items-center gap-2 shadow-2xl shadow-primary/30">
                  <Icon name="Zap" size={20} />
                  Выбрать тариф
                </button>
                <button onClick={() => setPage("features")}
                  className="btn-ghost-neon text-foreground font-semibold px-8 py-4 rounded-2xl text-lg flex items-center gap-2">
                  Узнать подробнее
                  <Icon name="ChevronRight" size={18} />
                </button>
              </div>
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