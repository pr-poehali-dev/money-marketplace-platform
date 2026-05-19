import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "features" | "pricing" | "cabinet" | "profile";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/fd7992d4-08db-479d-812a-5db55e13c405/files/1996794a-75d3-40f7-b8df-10dd79bd3405.jpg";

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
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: "-10px",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function NavBar({ active, setPage }: { active: Page; setPage: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "features", label: "Возможности", icon: "Sparkles" },
    { id: "pricing", label: "Тарифы", icon: "CreditCard" },
    { id: "cabinet", label: "Кабинет", icon: "LayoutDashboard" },
    { id: "profile", label: "Профиль", icon: "User" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setPage("home")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg btn-neon flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-white" />
            </div>
            <span className="font-montserrat font-extrabold text-lg text-white">
              Neural<span className="gradient-text">Pay</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === item.id
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage("profile")}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg btn-neon text-white text-sm font-semibold"
            >
              Войти
            </button>
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-border/50 pt-3 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1 ${
                  active === item.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const stats = [
    { value: "2.4M+", label: "запросов в день" },
    { value: "99.9%", label: "uptime" },
    { value: "150+", label: "ИИ-моделей" },
    { value: "12ms", label: "среднее время ответа" },
  ];

  const features = [
    { icon: "Brain", title: "GPT-4, Claude, Gemini", desc: "Доступ к топовым моделям в одном месте", color: "blue" },
    { icon: "RefreshCw", title: "Автопродление", desc: "Подписка продлевается сама — никаких прерываний", color: "violet" },
    { icon: "Shield", title: "Безопасность", desc: "Шифрование запросов и полная конфиденциальность", color: "cyan" },
    { icon: "BarChart3", title: "Аналитика", desc: "Детальная статистика использования в реальном времени", color: "pink" },
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
            <div
              className="absolute inset-8 rounded-full border border-violet-500/20 animate-spin-slow"
              style={{ animationDirection: "reverse", animationDuration: "15s" }}
            />
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
              <span className="text-white">Мощь ИИ</span>
              <br />
              <span className="gradient-text">без ограничений</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl animate-fade-in-up-delay-2">
              Единая платформа для работы со всеми топовыми ИИ-моделями.
              Умные подписки, аналитика и автоматическое продление.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-3">
              <button
                onClick={() => setPage("pricing")}
                className="btn-neon text-white font-semibold px-8 py-4 rounded-xl text-base"
              >
                Начать бесплатно
                <Icon name="ArrowRight" size={18} className="inline ml-2" />
              </button>
              <button
                onClick={() => setPage("features")}
                className="btn-ghost-neon text-foreground font-semibold px-8 py-4 rounded-xl text-base"
              >
                Посмотреть возможности
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
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Всё что нужно для работы с ИИ — в одном месте
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const colorMap: Record<string, string> = {
              blue: "glow-border-blue",
              violet: "glow-border-violet",
              cyan: "glow-border-cyan",
              pink: "border border-pink-500/30",
            };
            const iconColor: Record<string, string> = {
              blue: "text-blue-400",
              violet: "text-violet-400",
              cyan: "text-cyan-400",
              pink: "text-pink-400",
            };
            const bgColor: Record<string, string> = {
              blue: "bg-blue-500/10",
              violet: "bg-violet-500/10",
              cyan: "bg-cyan-500/10",
              pink: "bg-pink-500/10",
            };
            return (
              <div
                key={i}
                className={`card-glass rounded-2xl p-6 ${colorMap[f.color]} transition-all duration-300 hover:-translate-y-1 cursor-default`}
              >
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
              <h2 className="font-montserrat text-3xl sm:text-4xl font-bold text-white mb-4">
                Готов начать?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Первые 7 дней — бесплатно. Без привязки карты.
              </p>
              <button
                onClick={() => setPage("pricing")}
                className="btn-neon text-white font-semibold px-10 py-4 rounded-xl text-lg"
              >
                Выбрать тариф
                <Icon name="Zap" size={18} className="inline ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturesPage() {
  const features = [
    { icon: "Brain", title: "150+ ИИ-моделей", desc: "GPT-4o, Claude 3.5, Gemini Ultra, Llama 3, Mistral, DALL-E 3 и десятки других. Все в одном месте.", color: "blue", badge: "Популярно" },
    { icon: "MessageSquare", title: "Чаты и ассистенты", desc: "Создавай персонализированных ИИ-ассистентов с памятью, контекстом и любым характером.", color: "violet", badge: null },
    { icon: "Code2", title: "API доступ", desc: "Полноценный REST API. Интегрируй ИИ в своё приложение за 5 минут.", color: "cyan", badge: "Новое" },
    { icon: "Image", title: "Генерация изображений", desc: "Создавай фотореалистичные изображения и арт по текстовому описанию.", color: "pink", badge: null },
    { icon: "FileText", title: "Работа с документами", desc: "Загружай PDF, Word, Excel — ИИ анализирует и отвечает на вопросы по содержимому.", color: "blue", badge: null },
    { icon: "Mic", title: "Голос и аудио", desc: "Транскрибация речи, синтез голоса, перевод аудио в реальном времени.", color: "violet", badge: null },
    { icon: "BarChart3", title: "Аналитика", desc: "Дашборд с метриками: запросы, расходы, популярные модели, время ответа.", color: "cyan", badge: null },
    { icon: "Users", title: "Командный доступ", desc: "Единый аккаунт для команды с ролями, лимитами и аналитикой по сотрудникам.", color: "pink", badge: "Скоро" },
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
            <Icon name="Sparkles" size={14} />
            Возможности платформы
          </div>
          <h1 className="font-montserrat text-5xl font-bold text-white mb-4">
            Всё для работы с <span className="gradient-text">ИИ</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            От простых чатов до сложных автоматизаций — NeuralPay закрывает любые задачи
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <div key={i} className={`card-glass rounded-2xl p-6 ${c.border} transition-all duration-300 hover:-translate-y-1.5 cursor-default relative`}>
                {f.badge && (
                  <span className={`absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                    {f.badge}
                  </span>
                )}
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
            {["OpenAI", "Anthropic", "Google", "Meta", "Mistral AI", "Stability AI"].map((name) => (
              <div key={name} className="card-glass rounded-xl px-6 py-3 text-sm text-muted-foreground font-medium border border-border/50 hover:border-primary/30 transition-colors cursor-default">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Старт",
      price: { monthly: 490, yearly: 390 },
      desc: "Для знакомства с ИИ",
      color: "blue",
      features: ["100 000 токенов / месяц", "GPT-3.5, Claude Haiku", "Генерация изображений (50/мес)", "API доступ", "Email поддержка"],
      cta: "Начать",
      popular: false,
    },
    {
      name: "Про",
      price: { monthly: 1490, yearly: 1190 },
      desc: "Для профессионалов",
      color: "violet",
      features: ["2 000 000 токенов / месяц", "GPT-4o, Claude 3.5, Gemini", "Генерация изображений (500/мес)", "Приоритетный API", "Загрузка документов", "Аналитика использования", "Чат-поддержка 24/7"],
      cta: "Выбрать Про",
      popular: true,
    },
    {
      name: "Бизнес",
      price: { monthly: 4990, yearly: 3990 },
      desc: "Для команд и компаний",
      color: "cyan",
      features: ["Безлимитные токены", "Все модели + ранний доступ", "Безлимитные изображения", "До 10 пользователей", "Командный дашборд", "Выделенный менеджер", "SLA 99.9%", "Кастомные интеграции"],
      cta: "Связаться",
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
            <Icon name="CreditCard" size={14} />
            Тарифы и подписки
          </div>
          <h1 className="font-montserrat text-5xl font-bold text-white mb-4">
            Прозрачные <span className="gradient-text">цены</span>
          </h1>
          <p className="text-muted-foreground text-xl mb-8">
            Автоматическое продление. Отмена в любой момент.
          </p>
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${billing === "monthly" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${billing === "yearly" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Ежегодно
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">−20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const c = colorMap[plan.color];
            return (
              <div
                key={plan.name}
                className={`card-glass rounded-2xl p-8 ${c.border} ${c.glow} relative ${plan.popular ? "md:scale-105" : ""}`}
              >
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
                    <span className="font-montserrat text-5xl font-black text-white">
                      {plan.price[billing].toLocaleString("ru")}
                    </span>
                    <span className="text-muted-foreground mb-2">₽/мес</span>
                  </div>
                  {billing === "yearly" && (
                    <p className="text-green-400 text-sm mt-1">
                      Экономия {((plan.price.monthly - plan.price.yearly) * 12).toLocaleString("ru")} ₽ в год
                    </p>
                  )}
                </div>
                <button className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all mb-8 ${c.btn}`}>
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

function CabinetPage() {
  const usageData = [
    { model: "GPT-4o", requests: 1240, tokens: "820K", percent: 68 },
    { model: "Claude 3.5", requests: 450, tokens: "310K", percent: 26 },
    { model: "Gemini Pro", requests: 89, tokens: "67K", percent: 6 },
  ];

  const history = [
    { date: "Сегодня, 14:32", model: "GPT-4o", tokens: 2140, type: "Текст" },
    { date: "Сегодня, 11:15", model: "DALL-E 3", tokens: 0, type: "Изображение" },
    { date: "Вчера, 20:44", model: "Claude 3.5", tokens: 5320, type: "Документ" },
    { date: "Вчера, 16:02", model: "GPT-4o", tokens: 890, type: "Текст" },
    { date: "18 мая, 09:10", model: "Whisper", tokens: 0, type: "Аудио" },
  ];

  const typeIcon: Record<string, string> = {
    Изображение: "Image",
    Документ: "FileText",
    Аудио: "Mic",
    Текст: "MessageSquare",
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-montserrat text-4xl font-bold text-white mb-1">Мой кабинет</h1>
            <p className="text-muted-foreground">Аналитика и управление подпиской</p>
          </div>
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl glow-border-cyan bg-cyan-500/10 text-cyan-300 text-sm font-medium">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Тариф «Про»
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Токенов использовано", value: "1.2M", sub: "из 2M", icon: "Cpu", color: "blue" },
            { label: "Запросов сегодня", value: "47", sub: null, icon: "Activity", color: "violet" },
            { label: "Изображений", value: "23", sub: "из 500", icon: "Image", color: "cyan" },
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
                  {s.value}
                  {s.sub && <span className="text-muted-foreground text-sm font-normal ml-1">{s.sub}</span>}
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-glass rounded-2xl p-6 glow-border-blue">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Icon name="PieChart" size={18} className="text-blue-400" />
              Использование по моделям
            </h2>
            <div className="space-y-4">
              {usageData.map((item) => (
                <div key={item.model}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{item.model}</span>
                    <span className="text-muted-foreground">{item.tokens} токенов</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full progress-bar rounded-full" style={{ width: `${item.percent}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{item.requests} запросов · {item.percent}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass rounded-2xl p-6 glow-border-violet">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Icon name="Clock" size={18} className="text-violet-400" />
              История запросов
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
                    {item.tokens > 0 && <div className="text-xs text-blue-400">{item.tokens.toLocaleString("ru")} токенов</div>}
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
              <p className="text-muted-foreground text-sm">
                Следующее списание: <span className="text-foreground">31 мая 2026</span> · 1 490 ₽
              </p>
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <Icon name="RefreshCw" size={12} />
                Автопродление включено
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost-neon px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground">
                Отменить
              </button>
              <button className="btn-neon text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                Улучшить тариф
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
                <Icon name="Star" size={11} />
                Тариф Про
              </span>
            </div>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6 glow-border-violet mb-5">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Icon name="User" size={17} className="text-violet-400" />
            Личные данные
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {[{ label: "Имя", value: "Алексей" }, { label: "Фамилия", value: "Иванов" }].map((field) => (
              <div key={field.label}>
                <label className="block text-sm text-muted-foreground mb-2">{field.label}</label>
                <input
                  defaultValue={field.value}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-2">Email</label>
            <input
              defaultValue="alexey@company.ru"
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Компания</label>
            <input
              defaultValue="Tech Solutions LLC"
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6 glow-border-cyan mb-8">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Icon name="Shield" size={17} className="text-cyan-400" />
            Безопасность
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
          <button className="btn-ghost-neon px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground">
            Отмена
          </button>
          <button
            onClick={handleSave}
            className={`btn-neon text-white px-8 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${saved ? "opacity-90 scale-95" : ""}`}
          >
            {saved ? (
              <><Icon name="Check" size={16} />Сохранено!</>
            ) : (
              <><Icon name="Save" size={16} />Сохранить</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState<Page>("home");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="min-h-screen bg-background font-golos">
      <Particles />
      <NavBar active={page} setPage={setPage} />
      <main className="relative z-10">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "features" && <FeaturesPage />}
        {page === "pricing" && <PricingPage />}
        {page === "cabinet" && <CabinetPage />}
        {page === "profile" && <ProfilePage />}
      </main>
      <footer className="relative z-10 border-t border-border/30 py-8 text-center">
        <p className="text-muted-foreground text-sm">
          © 2026 NeuralPay · Умная ИИ-платформа ·
          <span className="gradient-text font-medium ml-1">Летим к звёздам 🚀</span>
        </p>
      </footer>
    </div>
  );
}
