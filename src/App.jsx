import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, Landmark, BookOpen, Scale, Users, Sparkles, Download } from 'lucide-react'
import ExitTicket from './ExitTicket'
import { sounds } from './utils/sounds'

gsap.registerPlugin(ScrollTrigger)

// GitHub Pages base URL fix: all /images/ and /docs/ paths must be prefixed
const imgUrl = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')

/* ==============================
   DATA
   ============================== */
const timelineEvents = [
  {
    year: 'MÖ ~500', title: 'Atina Kent Devleti', icon: '🏛️',
    description: 'Demokrasinin doğduğu yer! "Demokrasi" kelimesi Yunanca "Demos" (Halk) ve "Kratos" (İktidar/Güç) kelimelerinin birleşiminden (Halkın Gücü) gelir. Kent Devleti’nin yönetiminde Beş Yüzler Meclisinin önemli bir rolü vardı.',
    extraInfoTitle: 'Sürpriz Yaklaşım: Demokrasi ve God of War 🎮',
    extraInfo: [
      { text: 'Hazır konu "Kratos" kelimesinden açılmışken... Aranızda meşhur "God of War" oyununu oynayan var mı? Ana karakterin adı Kratos\'tur! Yunan mitolojisinde güç ve kudretin sembolüdür. Oyun yapımcıları bu ismi tesadüfen seçmemiş; Kratos devasa yaratıkları alt ederken aslında Demokrasinin son hecesi olan pür "Güç" kavramını temsil ediyor! 💪', image: imgUrl('/images/kratos.webp') }
    ],
    image: imgUrl('/images/athens.png'),
  },
  {
    year: 'MÖ ~500', title: 'Antik Roma Cumhuriyeti', icon: '⚔️',
    description: 'Roma, cumhuriyet yönetimine geçti. Güçler ayrılığının ilk tohumları burada atıldı. Konsül ve Senato birlikte yönetiyordu.',
    extraInfoTitle: 'Sözlük',
    extraInfo: [
      { text: 'Konsül: Roma Cumhuriyeti\'nde devleti yöneten ve orduya komuta eden en üst düzey iki yöneticiden her biri.' },
      { text: 'Senato: Roma\'da yaşlılar meclisi; devletin dış politika ve maliyesini yönlendiren en üst düzey kurul.' }
    ],
    image: imgUrl('/images/rome.png'),
  },
  {
    year: '1215', title: 'Magna Charta', icon: '📜',
    description: 'Büyük Ferman anlamına gelir. İngiltere\'de Kral John, soyluların isyanı ve zorlaması sonucu Magna Charta\'yı imzaladı. Böylece kralın sonsuz yetkileri ilk defa yazılı bir belgeyle yasal bir çerçeveye oturtulup sınırlandırıldı.',
    question: 'Kral neden bunu imzaladı, problem neydi?',
    questionAnswer: 'XIII. yüzyılın başlarında İngiliz Kralı John ile İngiliz soylu sınıfı arasında gerginlik ortaya çıktı. Bu gerginlik Kral John\'un ek vergi çıkarmasıyla birlikte çatışmaya dönüştü. Soylular, Londra başta olmak üzere İngiltere\'nin bazı önemli şehirlerini işgal etti. Bunun üzerine Kral John ve papa, soylularla 63 maddeden oluşan Magna Carta\'yı imzaladı.',
    image: imgUrl('/images/magna_carta.png'),
  },
  {
    year: '1776', title: 'Amerikan Bağımsızlık Bildirgesi', icon: '🗽',
    description: '13 İngiliz kolonisi bağımsızlığını ilan etti ve ABD kuruldu. Anayasa’da aydınlanma felsefesi etkiliydi. Yasama gücü iki ayrı meclise, yürütme gücü başkana, yargı gücü ise yüksek mahkemeye verildi. Meclis üyeleri ve başkan, seçimle belirlenmeye başlandı. Bu durum ABD’de günümüzde de devam etmektedir.',
    question: 'Sizce ABD’de yasama, yürütme ve yargının farklı organlara verilme sebebi nedir?',
    questionAnswer: 'Güçlerin tek bir elde toplanması, tarihte pek çok kez baskı ve tiranlığa yol açmıştır. Farklı organlara dağıtılarak her birinin diğerini denetlemesi (denge-denetim sistemi) amaçlanmıştır. Bu sayede hiçbir kişi ya da kurum mutlak güce sahip olamaz; özgürlük ve adalet korunmuş olur.',
    image: imgUrl('/images/usa.png'),
  },
  {
    year: '1789', title: 'İnsan ve Yurttaş Hakları', icon: '🇫🇷',
    description: 'Fransız İhtilali\'nden sonra yurttaşların hak ve özgürlüklerini güvence altına almak, insan haklarına yasal bir zemin oluşturmak amacıyla 1789’da yayımlanmıştır.',
    extraInfoTitle: 'Daha fazlasını görmek ister misin? (1789 İnsan ve Yurttaş Hakları Bildirgesi)',
    extraInfo: [
      { text: '1. İnsanlar özgür ve eşit doğarlar ve yaşarlar.' },
      { text: '2. Her topluluğun amacı, insanın doğal ve zaman aşımına uğramaz haklarının korunmasıdır.' },
      { text: '3. Her egemenliğin özü, esas itibarıyla millettedir.' },
      { text: '4. Hürriyet başkasına zarar vermeyen her şeyi yapabilmekten ibarettir.' }
    ],
    image: imgUrl('/images/france.png'),
  },
  {
    year: '1948', title: 'BM Evrensel Bildirgesi', icon: '🌍',
    description: 'BM, 10 Aralık 1948\'de İnsan Hakları Evrensel Bildirgesi\'ni kabul etti. İnsan Hakları Evrensel Bildirgesi ile dünyada ilk kez insan hak ve özgürlükleriyle ilgili bu kadar geniş katılımlı bir belge imzalanmış oldu. Bildirge\'de yaşama hakkı, düşünce ve ifade özgürlüğü; keyfi tutuklama, hapis ve sürgünden korunma hakkı; mülkiyet hakkı; dernek kurma, toplantı ve yürüyüş gibi siyasi hak ve özgürlükler yer almaktadır.',
    image: imgUrl('/images/un.png'),
  },
]

const concepts = [
  { id: 1, title: 'Demokrasi', emoji: '🏛️', text: 'Halkın egemenliğine dayanan yönetim biçimi.' },
  { id: 7, title: 'Divan', emoji: '📋', text: 'Türk-İslam devletlerinde devlet işlerinin görüşüldüğü en yüksek kurul.' },
  { id: 2, title: 'Cumhuriyet', emoji: '🗳️', text: 'Milletin egemenliği kendi elinde tuttuğu devlet şekli.' },
  { id: 6, title: 'Konsül', emoji: '⚔️', text: 'Roma Cumhuriyetinde devleti yöneten ve orduya komuta eden yöneticiler.' },
  { id: 3, title: 'Laiklik', emoji: '⚖️', text: 'Din ve devlet işlerinin birbirinden ayrılması.' },
  { id: 8, title: 'Bildirge', emoji: '📜', text: 'Fikirlerin veya kararların kamuoyuna duyurulması için hazırlanan metin.' },
  { id: 4, title: 'Anayasa', emoji: '📖', text: 'Devletin temel yapısını belirleyen en üstün kanun.' },
  { id: 5, title: 'Millî Egemenlik', emoji: '👑', text: 'Devleti yönetme gücünün tamamen millette olması.' },
]

/* ==============================
   CHEST SCENE
   ============================== */
function ChestScene({ onEnter }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-black p-4 relative">
      <div className="text-center mb-16 px-4 z-10 w-full max-w-4xl">
        <p className="text-amber-500 text-3xl md:text-5xl font-serif italic drop-shadow-md leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
          "İnsanlığın devlet yönetimindeki en büyük sırlarından birini nedir biliyor musun?"
        </p>
        <p className="text-amber-200 text-2xl md:text-3xl mt-8 font-serif drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>
          Öğrenmek ister misin? O zaman kutuya tıkla...
        </p>
      </div>

      <div 
        className="w-full max-w-lg mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
        onMouseEnter={() => sounds.hover()}
        onClick={() => {
          sounds.chestOpen();
          onEnter();
        }}
      >
        <img src={imgUrl('/images/chest.png')} alt="Gizemli Sandık" className="w-full h-auto object-contain drop-shadow-2xl" />
      </div>
    </section>
  )
}

/* ==============================
   EXPANDABLE CARD COMPONENT
   ============================== */
function ExpandableCard({ title, items }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-6 border border-[var(--color-gold)] rounded-xl overflow-hidden bg-white/50">
      <button 
        onClick={() => {
          sounds.click();
          setExpanded(!expanded);
        }}
        onMouseEnter={() => sounds.hover()}
        className="w-full p-4 flex items-center justify-between text-left font-bold text-[var(--color-espresso)] hover:bg-[var(--color-gold)]/10 transition-colors"
      >
        <span>{title || 'Daha fazlasını görmek ister misin?'}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-4 pt-0 text-[var(--color-espresso-light)]">
            {items.map((item, i) => (
              <div key={i} className="space-y-3 mb-4 last:mb-0">
                {item.text && <p className="text-base leading-relaxed">{item.text}</p>}
                {item.image && <img src={item.image} alt="Derin Ek Bilgi" className="rounded-xl shadow-md border-2 border-[var(--color-gold)]/30 w-full max-w-sm mx-auto opacity-90 transition-opacity hover:opacity-100" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   CLICKABLE QUESTION COMPONENT
   ============================== */
function ClickableQuestion({ question, answer }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => {
          sounds.click();
          setRevealed(!revealed);
        }}
        onMouseEnter={() => sounds.hover()}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-3 group ${
          revealed
            ? 'bg-[var(--color-burgundy)]/10 border-[var(--color-burgundy)]'
            : 'bg-[var(--color-burgundy)]/5 border-[var(--color-burgundy)]/40 hover:border-[var(--color-burgundy)]'
        }`}
      >
        <span className="text-2xl mt-0.5">{revealed ? '💡' : '🤔'}</span>
        <div className="flex-1">
          <p className="text-lg italic font-bold text-[var(--color-burgundy)]">{question}</p>
          <div className={`grid transition-all duration-500 ease-in-out ${revealed ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <p className="text-base text-[var(--color-espresso)] leading-relaxed">{answer}</p>
            </div>
          </div>
          {!revealed && <p className="text-sm text-[var(--color-burgundy)]/60 mt-1">Cevabı görmek için tıkla →</p>}
        </div>
      </button>
    </div>
  )
}


/* ==============================
   CONCEPT MAP COMPONENT
   ============================== */
function ConceptMap() {
  const [activeId, setActiveId] = useState(null)
  const activeConcept = concepts.find(c => c.id === activeId)

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-[var(--color-espresso)] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Temel Kavramlar
        </h3>
        <p className="text-lg text-[var(--color-espresso-light)]">
          Bir kavrama tıklayarak anlamını keşfet.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {concepts.map((concept) => (
          <button
            key={concept.id}
            onClick={() => {
              sounds.click();
              setActiveId(activeId === concept.id ? null : concept.id);
            }}
            onMouseEnter={() => sounds.hover()}
            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 font-bold transition-all duration-300 cursor-pointer text-center ${
              activeId === concept.id
                ? 'bg-[var(--color-gold)] border-[var(--color-gold)] text-white scale-105 shadow-lg shadow-[var(--color-gold)]/30'
                : 'bg-[var(--color-cream)] border-[var(--color-gold)]/40 text-[var(--color-espresso)] hover:border-[var(--color-gold)] hover:scale-105 hover:shadow-md'
            }`}
          >
            <span className="text-3xl">{concept.emoji}</span>
            <span className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{concept.title}</span>
          </button>
        ))}
      </div>

      {/* Info Box */}
      {activeConcept && (
        <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg border-2 border-[var(--color-gold)] flex items-start gap-4 animate-in slide-in-from-bottom-2 duration-300">
          <span className="text-4xl">{activeConcept.emoji}</span>
          <div>
            <h4 className="text-2xl font-bold text-[var(--color-gold)] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {activeConcept.title}
            </h4>
            <p className="text-lg leading-relaxed text-[var(--color-espresso)]">
              {activeConcept.text}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ==============================
   HORIZONTAL TIMELINE
   ============================== */
function HorizontalTimeline() {
  const [activeIdx, setActiveIdx] = useState(0)
  const activeEvent = timelineEvents[activeIdx]

  return (
    <div className="py-12">
      <div className="text-center mb-8 px-4">
        <h3 className="text-3xl font-bold text-[var(--color-espresso)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Tarih Çizgisi
        </h3>
        <p className="text-lg text-[var(--color-espresso-light)]">Bir döneme tıklayarak detayları görün.</p>
      </div>

      <div className="timeline-scroll-container">
        <div className="timeline-track justify-between md:justify-center">
          {timelineEvents.map((evt, idx) => (
            <div
              key={idx}
              className={`timeline-point ${activeIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveIdx(idx)}
            >
              <div className="timeline-icon">{evt.icon}</div>
              <div className="timeline-dot" />
              <div className="timeline-year">{evt.year}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-4">
        <div key={activeIdx} className="event-detail-card">
          <img src={activeEvent.image} alt={activeEvent.title} className="event-img" />
          <div className="event-content">
            <span className="inline-block px-3 py-1 bg-[var(--color-gold)]/10 text-[var(--color-gold)] font-bold rounded-full mb-4 font-mono">
              {activeEvent.year}
            </span>
            <h4 className="text-3xl font-bold text-[var(--color-espresso)] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {activeEvent.title}
            </h4>
            <p className="text-xl leading-relaxed text-[var(--color-espresso-light)]">
              {activeEvent.description}
            </p>
            {activeEvent.question && activeEvent.questionAnswer && (
              <ClickableQuestion question={activeEvent.question} answer={activeEvent.questionAnswer} />
            )}
            {activeEvent.question && !activeEvent.questionAnswer && (
              <div className="mt-4 p-4 bg-[var(--color-burgundy)]/5 border-l-4 border-[var(--color-burgundy)] rounded-r-lg">
                <p className="text-lg italic font-bold text-[var(--color-burgundy)]">
                  {activeEvent.question}
                </p>
              </div>
            )}
            {activeEvent.extraInfo && (
              <ExpandableCard title={activeEvent.extraInfoTitle} items={activeEvent.extraInfo} />
            )}
            
            {activeIdx < timelineEvents.length - 1 && (
              <button 
                onClick={() => setActiveIdx(activeIdx + 1)}
                className="mt-8 self-end flex items-center gap-2 text-[var(--color-gold)] font-bold tracking-widest uppercase hover:text-[var(--color-gold)]/70 transition-colors group px-4 py-2 border-2 border-[var(--color-gold)]/30 rounded-full hover:bg-[var(--color-gold)]/10"
              >
                <span>Sıradaki Etkinlik</span>
                <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   SALON 1
   ============================== */
function Salon1() {
  return (
    <section id="salon-1" className="py-20 bg-[var(--color-parchment-light)]">
      <div className="text-center mb-16 px-4">
        <span className="inline-block text-sm font-semibold tracking-widest text-[var(--color-gold)] uppercase mb-3 font-mono">
          Salon 01
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-[var(--color-espresso)] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Geçmişten Günümüze Demokrasi
        </h2>
        <p className="text-2xl font-semibold text-[var(--color-gold)] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Demokrasi Müzesi'ne Hoş Geldin — Keşfetmeye Hazır mısın?
        </p>
        <p className="text-xl max-w-3xl mx-auto text-[var(--color-espresso-light)]">
          Demokrasi, halkın egemenliği temeline dayanan bir yönetim biçimidir.
          Bu serüveni Antik Çağ'dan günümüze birlikte keşfedelim.
        </p>
      </div>

      <ConceptMap />
      
      {/* Scroll Indicator */}
      <div className="flex flex-col items-center gap-2 my-16">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent" />
        <p className="text-sm font-semibold tracking-widest text-[var(--color-gold)]/60 uppercase font-mono">Tarih Çizgisi</p>
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <div className="w-3 h-3 border-r-2 border-b-2 border-[var(--color-gold)] rotate-45" />
          <div className="w-3 h-3 border-r-2 border-b-2 border-[var(--color-gold)]/50 rotate-45 -mt-1.5" />
        </div>
      </div>

      <HorizontalTimeline />

      {/* Scroll to Salon 2 Indicator */}
      <BottomNavArrow targetId="salon-2" text="Salon 2'ye İlerle" />
    </section>
  )
}


/* ==============================
   SALON 2 — CHAPTER CARD
   ============================== */
function ChapterCard({ event }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all duration-500 cursor-pointer group ${
        open
          ? 'border-[var(--color-gold)] shadow-xl'
          : 'border-[var(--color-gold)]/30 hover:border-[var(--color-gold)]/70 hover:shadow-md'
      }`}
      onClick={() => setOpen(!open)}
    >
      {/* Header Row */}
      <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-[var(--color-cream)] to-white">
        <span className="text-4xl">{event.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono font-bold text-[var(--color-gold)] tracking-widest mb-1">{event.year}</div>
          <h4 className="text-xl font-bold text-[var(--color-espresso)] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {event.title}
          </h4>
        </div>
        <ChevronDown className={`w-6 h-6 text-[var(--color-gold)] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </div>
      {/* Expandable Content */}
      <div className={`grid transition-all duration-500 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col md:flex-row gap-0">
            {event.image && (
              <img src={event.image} alt={event.title} className="w-full md:w-56 h-44 object-cover flex-shrink-0" />
            )}
            <div className="p-5 space-y-3 flex-1">
              <p className="text-base leading-relaxed text-[var(--color-espresso-light)]">{event.description}</p>
              {event.question && event.questionAnswer && (
                <ClickableQuestion question={event.question} answer={event.questionAnswer} />
              )}
              {event.question && !event.questionAnswer && (
                <div className="p-3 bg-[var(--color-burgundy)]/5 border-l-4 border-[var(--color-burgundy)] rounded-r-lg">
                  <p className="text-base italic font-bold text-[var(--color-burgundy)]">{event.question}</p>
                </div>
              )}
              {event.extraInfo && (
                <ExpandableCard title={event.extraInfoTitle} items={event.extraInfo} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   SALON 2 — CHAPTER SECTION
   ============================== */
function ChapterSection({ number, title, subtitle, accentColor, events, heroImage }) {
  return (
    <div className="mb-16">
      {/* Chapter Banner */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 ${accentColor}`}>
        <div className="absolute inset-0">
          {heroImage && <img src={heroImage} alt={title} className="w-full h-full object-cover opacity-30" />}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="relative z-10 p-8 md:p-12">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-amber-300 uppercase mb-3 px-3 py-1 border border-amber-300/40 rounded-full">
            Bölüm {number}
          </span>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h3>
          <p className="text-lg text-amber-100/80 max-w-2xl">{subtitle}</p>
        </div>
      </div>
      {/* Cards */}
      <div className="space-y-4 px-2">
        {events.map((evt, i) => <ChapterCard key={i} event={evt} />)}
      </div>
    </div>
  )
}

/* ==============================
   SALON 2 DATA
   ============================== */
/* ==============================
   SALON 2 DATA (TIMELINE)
   ============================== */
const salon2Events = [
  {
    chapter: 'Bölüm 1: Türklerde Demokrasi',
    year: 'M.S. ~200', title: 'Asya Hun Devleti — Kurultay', icon: '🏹',
    image: imgUrl('/images/hun_otagi.png'),
    description: 'Türk tarihinde ilk demokratik uygulamalara Asya Hun Devleti\'nde rastlanmaktadır. Hükümdarın başkanlığında yılda iki kez devletin ileri gelenlerinin (toygun) katıldığı kurultay yapılırdı. Katılanlar görüşlerini özgürce dile getirirdi. Danışma meclisi niteliğindeki kurultaylar, devletin genel politikasına yön vermede hükümdara yardımcı olurdu.',
    question: 'Asya Hun Devleti\'ndeki kurultayın işleyişi ile demokrasi arasında nasıl bir ilişki kurulabilir?',
    questionAnswer: 'Kurultay, hükümdarın tek başına karar vermesi yerine devletin ileri gelenlerinin görüşünü alması anlamına geliyordu. Bu, mutlak monarşi anlayışına karşı kolektif bir danışma geleneğini temsil eder — modern demokrasilerde de kararlar çoğunluğun iradesine dayandırılır.',
  },
  {
    chapter: 'Bölüm 1: Türklerde Demokrasi',
    year: '~11–15. yy', title: 'Türk-İslam Devletleri — Divan', icon: '📋',
    image: imgUrl('/images/selcuklu_divan.png'),
    description: 'Türk-İslam devletlerinde kurultay yerini divana bıraktı. Üst düzey yönetim organı olan divanda mali, idari ve askerî konular görüşülüp karara bağlanırdı. Alınan kararlar padişahın onayından sonra yürürlüğe girerdi. Osmanlı\'da sonraları divana vezir-i azam başkanlık etmeye başladı.',
  },
  {
    chapter: 'Bölüm 2: Osmanlı\'dan Meşrutiyete',
    year: '1808', title: 'Sened-i İttifak', icon: '🤝',
    image: imgUrl('/images/sened_ittifak_v2.png'),
    description: 'Osmanlı Devleti\'nde paşalar ve ayanlar (yerel güçler) ile padişah arasında imzalanan bu belge, bazı tarihçiler tarafından ilk anayasal adım olarak kabul edilir. Padişahın yetkileri ilk kez bu belge ile kendi rızasıyla sınırlanmıştı.',
  },
  {
    chapter: 'Bölüm 2: Osmanlı\'dan Meşrutiyete',
    year: '1839', title: 'Tanzimat Fermanı', icon: '📜',
    image: imgUrl('/images/tanzimat_fermani.png'),
    description: 'Gülhane Parkı\'nda okunan bu fermanla devlet, hangi dinden olursa olsun tüm vatandaşlarının can ve mal güvenliğini garanti altına aldı. Hukukun üstünlüğüne doğru atılan en ciddi adımdı.',
    question: 'Peki Osmanlı neden durup dururken demokratikleşme hareketlerine girişti, rüyasında mı gördü, ne değişti? 😅',
    questionAnswer: 'Tabii ki rüyasında görmedi! 😊 Fransız İhtilali\'nin yaydığı milliyetçilik akımı imparatorluğu parçalamaya başlamıştı. Avrupalı devletler de azınlık haklarını bahane edip Osmanlı\'nın iç işlerine karışıyordu. Osmanlı devleti hem dağılmayı önlemek hem de Avrupa\'nın desteğini almak için "Bakın ben de modern ve eşitlikçi bir devletim" demek zorundaydı!',
  },
  {
    chapter: 'Bölüm 2: Osmanlı\'dan Meşrutiyete',
    year: '1876-1908', title: 'I. ve II. Meşrutiyet', icon: '🏛️',
    image: imgUrl('/images/ikinci_mesrutiyet.png'),
    description: 'İlk anayasa (Kanun-i Esasi) yürürlüğe girdi ve halk ilk defa seçtiği temsilcilerle (Meclis-i Mebusan) yönetime katıldı. II. Meşrutiyet ile birlikte ise Türkiye\'de çok partili siyasal hayatın fiilen ilk adımları atılmış oldu.',
    question: 'Kanun-i Esasi\'nin demokrasi açısından zayıf tarafı neydi?',
    questionAnswer: 'Padişahın meclisi istediği zaman kapatma yetkisi vardı ve nitekim II. Abdülhamid meclisi 30 yıl boyunca kapalı tuttu. Kalıcı demokrasi için gücün şahıslardan tamamen kurumlara geçmesi gerekir.',
  },
  {
    chapter: 'Bölüm 3: Atatürk\'ün Katkıları',
    year: '1919', title: 'Amasya Genelgesi & Kongreler', icon: '📢',
    image: imgUrl('/images/ataturk_meclis.png'),
    description: 'Mustafa Kemal Paşa\'nın millî egemenliğe ve meclise verdiği önemin sinyalleri Amasya Genelgesi, Erzurum ve Sivas kongrelerinde görülmektedir. Amasya Genelgesi\'nin "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır" maddesinde bu önem vurgulanmaktadır. Sivas Kongresi\'nin yurdun dört bir tarafından gelen milletin temsilcisi delegelerle yapılması bu amaca hizmet etmiştir. Alınan kararlar doğrultusunda İstanbul\'da Meclis-i Mebusan açılmıştır.',
  },
  {
    chapter: 'Bölüm 3: Atatürk\'ün Katkıları',
    year: '1920-1923', title: 'TBMM ve Cumhuriyet', icon: '🇹🇷',
    image: imgUrl('/images/ataturk_meclis.png'),
    description: '"Egemenlik kayıtsız şartsız milletindir!" Mustafa Kemal Paşa\'nın önderliğinde kurulan meclis, halk iradesini devletin tek meşru kaynağı yaptı. Ve 29 Ekim 1923\'te Cumhuriyetin ilanıyla Türk demokrasisi taçlandı.',
  },
  {
    chapter: 'Bölüm 3: Atatürk\'ün Katkıları',
    year: '1930–1934', title: 'Kadınlara Seçme ve Seçilme Hakkı', icon: '👩',
    image: imgUrl('/images/kadin_haklari.png'),
    description: 'Türk kadını birçok gelişmiş Batı ülkesinden çok daha önce, kademeli olarak belediye (1930), muhtarlık (1933) ve milletvekilliği (1934) seçimlerinde oy kullanma ve aday olma hakkını kazandı.',
    question: 'Avrupa\'ya kıyasla bu hakkın erken verilmesi ne anlama geliyor?',
    questionAnswer: 'Fransa (1944) ve İsviçre (1971) gibi ülkelerden on yıllar önce kadınlara bu hakkın verilmesi, demokratikleşmenin sadece ekonomik gelişmişlikle değil, güçlü bir vizyon ve siyasi iradeyle ilgili olduğunu gösterir.',
    extraInfoTitle: 'Atatürk\'ün Demokrasiye Diğer Etkileri',
    extraInfo: [
      { text: 'Türk Medeni Kanunu ile kadın-erkek eşitliğinin yasal güvenceye alınması' },
      { text: 'Çok partili hayata geçiş denemeleri (Terakkiperver ve Serbest Fırka)' },
      { text: 'Hukuk devletinin inşası için yapılan köklü anayasal reformlar' }
    ]
  },
  {
    chapter: 'Bölüm 4: Milli İradenin Zaferi',
    year: '2016', title: '15 Temmuz Demokrasi Zaferi', icon: '🇹🇷',
    image: imgUrl('/images/15_temmuz_zaferi.png'),
    description: '15 Temmuz 2016\'da gerçekleştirilmeye çalışılan hain darbe girişimi, Türk halkının demokrasiye ve millî iradeye sahip çıkmasıyla engellenmiştir. Vatandaşlar tankların önüne geçerek egemenliğin yalnızca millete ait olduğunu tüm dünyaya bir kez daha kanıtlamıştır.',
  },
]

/* ==============================
   SALON 2 TIMELINE
   ============================== */
function Salon2Timeline() {
  const [activeIdx, setActiveIdx] = useState(0)
  const activeEvent = salon2Events[activeIdx]

  return (
    <section id="salon-2" className="py-20 bg-[var(--color-espresso)] min-h-screen relative border-t-4 border-[var(--color-gold)]">
      <div className="text-center mb-8 px-4">
        <span className="inline-block text-sm font-semibold tracking-widest text-[#d4af37] uppercase mb-3 font-mono">
          Salon 02
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Atatürk ve Türk Demokrasisinin Gelişimi
        </h2>
        <p className="text-lg text-amber-100/70 max-w-2xl mx-auto">
          Bozkır kurultayından Cumhuriyet meclisine uzanan yüzyıllık bir özgürlük yolculuğunu cetvelde keşfedin.
        </p>
      </div>

      <div className="py-8">
        <div className="timeline-scroll-container">
          <div className="timeline-track justify-between md:justify-center">
            {salon2Events.map((evt, idx) => (
              <div
                key={idx}
                className={`timeline-point ${activeIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                <div className="timeline-icon bg-white text-black border-2 border-[var(--color-gold)]">{evt.icon}</div>
                <div className="timeline-dot border-[var(--color-gold)]" style={{ backgroundColor: activeIdx === idx ? 'var(--color-gold)' : '#333' }} />
                <div className="timeline-year text-amber-200">{evt.year}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 mt-8">
          <div key={activeIdx} className="event-detail-card border flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-500" style={{ borderColor: 'var(--color-gold)', backgroundColor: 'var(--color-parchment)' }}>
            <div className="md:w-1/3 relative overflow-hidden flex-shrink-0">
              <img src={activeEvent.image} alt={activeEvent.title} className="w-full h-full object-cover min-h-[300px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                 <span className="text-xs font-mono font-bold tracking-widest text-white/90 uppercase border border-white/50 px-2 py-1 rounded backdrop-blur-sm">
                   {activeEvent.chapter}
                 </span>
              </div>
            </div>
            
            <div className="event-content md:w-2/3 p-8 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-[#1a1a1a] text-[#d4af37] font-bold rounded-full mb-4 font-mono self-start">
                {activeEvent.year}
              </span>
              <h4 className="text-3xl font-bold text-[var(--color-espresso)] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {activeEvent.title}
              </h4>
              <p className="text-xl leading-relaxed text-[var(--color-espresso-light)] whitespace-pre-line mb-4">
                {activeEvent.description}
              </p>
              {activeEvent.question && activeEvent.questionAnswer && (
                <ClickableQuestion question={activeEvent.question} answer={activeEvent.questionAnswer} />
              )}
              {activeEvent.extraInfo && (
                <ExpandableCard title={activeEvent.extraInfoTitle} items={activeEvent.extraInfo} />
              )}

              {activeIdx < salon2Events.length - 1 && (
                <button 
                  onClick={() => setActiveIdx(activeIdx + 1)}
                  className="mt-8 self-end flex items-center gap-2 text-[#d4af37] font-bold tracking-widest uppercase hover:text-[#d4af37]/70 transition-colors group px-4 py-2 border-2 border-[#d4af37]/30 rounded-full hover:bg-[#d4af37]/10"
                >
                  <span>Sıradaki Etkinlik</span>
                  <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
          {activeIdx === 4 && (
            <div className="mt-12 animate-in slide-in-from-bottom-8 duration-700">
              <OttomanDemocracyTable />
            </div>
          )}
        </div>
      </div>
      <BottomNavArrow targetId="salon-3" text="Sonraki Salon" isDark={true} />
    </section>
  )
}

/* ==============================
   SALON 3 DATA
   ============================== */
const republicPillars = [
  {
    id: 'demokratik',
    title: 'Demokratik Devlet',
    icon: <Users className="w-12 h-12" />,
    image: imgUrl('/images/demokratik_devlet_yeni.png'),
    summary: 'Egemenlik kayıtsız şartsız milletindir.',
    description: 'Vatandaşlar cumhurbaşkanını, milletvekillerini ve yerel yöneticilerini belirli aralıklarla seçerek egemenlik hakkını kullanır. Seçimlere her siyasi görüşü temsil eden partilerin yanında bağımsız adaylar da katılabilir. Hiç kimseye ayrıcalık tanınmaz.',
  },
  {
    id: 'laik',
    title: 'Laik Devlet',
    icon: <Sparkles className="w-12 h-12" />,
    image: imgUrl('/images/laik_devlet_yeni.png'),
    summary: 'Din ve vicdan hürriyetinin teminatı.',
    description: 'Devlet bütün inançlar karşısında tarafsızdır. Hangi inanca sahip olursa olsun bütün vatandaşların vicdan, dini inanç ve kanaat hürriyeti bulunmaktadır. Hukuk kuralları dini kurallara dayandırılamaz.',
    question: 'Sizce demokratik bir yönetim için laiklik ilkesinin önemi nedir?',
    questionAnswer: 'Laiklik, farklı inançlara sahip insanların bir arada barış ve eşitlik içinde yaşamasını sağlar. Devletin belirli bir gruba ayrıcalık yapmasını engelleyerek, gerçek demokrasinin temeli olan "fırsat ve hak eşitliğini" korur.',
  },
  {
    id: 'sosyal',
    title: 'Sosyal Devlet',
    icon: <Landmark className="w-12 h-12" />,
    image: imgUrl('/images/sosyal_devlet_yeni.png'),
    summary: 'İnsana onurlu bir hayat sağlama güvencesi.',
    description: 'Devlet, her vatandaşın onurlu bir hayat sürmesi için çalışır. Sosyal güvenlik hakkı sunar; yaşlıları, özel gereksinimli bireyleri ve korunmaya muhtaç çocukları topluma kazandırmak için her türlü tedbiri alır.',
  },
  {
    id: 'hukuk',
    title: 'Hukuk Devleti',
    icon: <Scale className="w-12 h-12" />,
    image: imgUrl('/images/hukuk_devleti_yeni.png'),
    summary: 'Hukukun üstünlüğü ve adalet terazisi.',
    description: 'Hukuk kuralları herkes için bağlayıcıdır. Kişi veya kurumlarca haksızlığa uğradığını düşünen vatandaş, bağımsız mahkemelerde hakkını arayabilir. Yargı kararları adil, tarafsız ve herkes için bağlayıcıdır.',
    question: 'Sizce yargı kararları neden herkes için bağlayıcıdır?',
    questionAnswer: 'Çünkü adalet kişiye göre değişmez! Kurallar yetkili bir kişi veya ayrıcalıklı bir zümre için esnetilirse toplumda güven duygusu çöker. Yasaların gücü, en tepedeki yöneticiden sıradan vatandaşa kadar eşit şekilde işlemesinden gelir.',
  }
];

/* ==============================
   SALON 3
   ============================== */
function Salon3() {
  const [activePillar, setActivePillar] = useState(null)

  return (
    <section id="salon-3" className="py-20 bg-[var(--color-parchment-light)] min-h-screen relative border-t-4 border-[var(--color-gold)]">
      <div className="text-center mb-16 px-4">
        <span className="inline-block text-sm font-semibold tracking-widest text-[var(--color-gold)] uppercase mb-3 font-mono">
          Salon 03
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-espresso)] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Cumhuriyetin Nitelikleri
        </h2>
        <p className="text-lg text-[var(--color-espresso-light)] max-w-2xl mx-auto">
          Anayasamızın 2. maddesiyle güvence altına alınan, Türkiye Cumhuriyeti\'nin temel taşları olan 4 büyük sütun. Detayları keşfetmek için sütunlara tıklayın.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {republicPillars.map((pillar) => {
            const isActive = activePillar === pillar.id;
            return (
              <div 
                key={pillar.id}
                onClick={() => setActivePillar(isActive ? null : pillar.id)}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 flex flex-col items-center justify-center p-8 border-2 ${
                  isActive 
                    ? 'bg-[var(--color-espresso)] border-[var(--color-gold)] shadow-2xl scale-105' 
                    : 'bg-white border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] hover:shadow-xl hover:-translate-y-2'
                }`}
                style={{ minHeight: '320px' }}
              >
                <div className={`mb-6 p-4 rounded-full transition-colors duration-500 ${isActive ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]' : 'bg-[var(--color-parchment)] text-[var(--color-espresso)]'}`}>
                  {pillar.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-3 text-center transition-colors duration-500 ${isActive ? 'text-white' : 'text-[var(--color-espresso)]'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                  {pillar.title}
                </h3>
                <p className={`text-center transition-colors duration-500 ${isActive ? 'text-amber-200/80' : 'text-[var(--color-espresso-light)]'}`}>
                  {pillar.summary}
                </p>
                
                {/* Click Hint */}
                <div className={`mt-auto pt-6 text-sm font-semibold tracking-widest uppercase transition-colors duration-500 ${isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-gold)]/60'}`}>
                  {isActive ? 'Gizle' : 'İncele'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Expanded Detail Modal/Card */}
      {activePillar && (
        <div className="max-w-5xl mx-auto px-4 mt-12 animate-in slide-in-from-bottom-8 duration-500">
          {republicPillars.filter(p => p.id === activePillar).map(pillar => (
            <div key={pillar.id} className="bg-white border-2 border-[var(--color-gold)] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <div className="md:w-1/2 relative min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-[var(--color-gold)] via-[var(--color-espresso)] to-black flex items-center justify-center">
                {pillar.image ? (
                  <>
                    <img src={pillar.image} alt={pillar.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-espresso)]/90 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="text-white/20 scale-150">
                    {pillar.icon}
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[var(--color-parchment-light)]">
                <div className="text-[var(--color-gold)] mb-6">
                  {pillar.icon}
                </div>
                <h3 className="text-4xl font-bold text-[var(--color-espresso)] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {pillar.title}
                </h3>
                <div className="w-12 h-1 bg-[var(--color-gold)] mb-6" />
                <p className={`text-xl leading-relaxed text-[var(--color-espresso-light)] ${pillar.question ? 'mb-4' : ''}`}>
                  {pillar.description}
                </p>
                {pillar.question && pillar.questionAnswer && (
                  <ClickableQuestion question={pillar.question} answer={pillar.questionAnswer} />
                )}
                <div className="mt-8">
                  <span className="inline-block px-4 py-2 bg-[var(--color-espresso)] text-white text-sm font-semibold tracking-widest uppercase rounded-full font-mono shadow-md">
                    Anayasa Madde 2
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DragDropActivity />
      <BottomNavArrow targetId="exit-ticket" text="Çıkış Biletini Al" />
    </section>
  )
}

/* ==============================
   OTTOMAN DEMOCRACY TABLE
   ============================== */
function OttomanDemocracyTable() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const developments = ['Tanzimat Fermanı', 'Islahat Fermanı', 'I. Meşrutiyet', 'II. Meşrutiyet'];
  const features = ['Anayasa vardır.', 'Meclis bulunmaktadır.', 'Fransız İhtilali\'nin etkisi vardır.', 'Tüm Osmanlı vatandaşlarını kapsar.', 'Bakanlar Kurulu vardır.'];

  const correctMap = {
    'Tanzimat Fermanı': [2, 3],
    'Islahat Fermanı': [2],
    'I. Meşrutiyet': [0, 1, 2, 3, 4],
    'II. Meşrutiyet': [0, 1, 2, 3, 4]
  };

  const toggle = (dev, featIdx) => {
    if (showResults) return;
    const key = `${dev}-${featIdx}`;
    setAnswers(prev => ({...prev, [key]: !prev[key]}));
  };

  return (
    <div className="w-full mt-4 p-6 bg-white/95 rounded-3xl shadow-xl border-2 border-[var(--color-gold)]">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[var(--color-espresso)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Etkinlik Zamanı: Osmanlı'da Demokrasi Adımları
        </h3>
        <p className="text-sm text-[var(--color-espresso-light)]">Aşağıdaki tabloda verilen özelliklerin hangi gelişmelere ait olduğunu işaretleyiniz.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-2 border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 text-[var(--color-espresso)] font-bold">Gelişmeler \\ Özellikler</th>
              {features.map((f, i) => (
                <th key={i} className="p-3 border-2 border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 text-[var(--color-espresso)] font-bold text-sm text-center w-32">{f}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {developments.map(dev => (
              <tr key={dev}>
                <td className="p-3 border-2 border-[var(--color-gold)]/20 font-bold text-[var(--color-espresso)] bg-gray-50">{dev}</td>
                {features.map((f, featIdx) => {
                  const key = `${dev}-${featIdx}`;
                  const isChecked = !!answers[key];
                  const isCorrectAnswer = correctMap[dev].includes(featIdx);
                  
                  let cellClass = "p-3 border-2 border-[var(--color-gold)]/20 text-center cursor-pointer hover:bg-gray-100 transition-colors";
                  if (showResults) {
                    if (isChecked && isCorrectAnswer) cellClass += " bg-green-200 border-green-500";
                    else if (isChecked && !isCorrectAnswer) cellClass += " bg-red-200 border-red-500";
                    else if (!isChecked && isCorrectAnswer) cellClass += " bg-yellow-100 border-yellow-500";
                  }

                  return (
                    <td key={featIdx} className={cellClass} onClick={() => toggle(dev, featIdx)}>
                      <div className={`w-6 h-6 mx-auto rounded border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-[var(--color-espresso)] border-[var(--color-espresso)]' : 'border-gray-400'}`}>
                        {isChecked && <span className="text-white text-sm font-bold">✓</span>}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        {!showResults ? (
          <button onClick={() => setShowResults(true)} className="px-8 py-3 bg-[var(--color-espresso)] text-white font-bold rounded-full hover:bg-black transition-colors shadow-lg">
            Cevapları Kontrol Et
          </button>
        ) : (
          <button onClick={() => { setShowResults(false); setAnswers({}); }} className="px-8 py-3 bg-[var(--color-gold)] text-white font-bold rounded-full hover:bg-yellow-600 transition-colors shadow-lg">
            Tekrar Dene
          </button>
        )}
      </div>
      {showResults && <p className="text-center mt-4 text-sm font-bold text-gray-500">Yeşil: Doğru, Kırmızı: Yanlış, Sarı: İşaretlenmesi Gerekenler</p>}
    </div>
  )
}

/* ==============================
   DRAG DROP ACTIVITY
   ============================== */
function DragDropActivity() {
  const [items, setItems] = useState([
    { id: 1, text: 'Egemenliğin millete ait olması', correctPillar: 'demokratik', currentPillar: null },
    { id: 2, text: 'Seçimlerin serbestçe yapılması', correctPillar: 'demokratik', currentPillar: null },
    { id: 3, text: 'Din ve vicdan hürriyeti', correctPillar: 'laik', currentPillar: null },
    { id: 4, text: 'Kuralların dine dayandırılmaması', correctPillar: 'laik', currentPillar: null },
    { id: 5, text: 'Sosyal güvenlik hakkı', correctPillar: 'sosyal', currentPillar: null },
    { id: 6, text: 'Muhtaçların desteklenmesi', correctPillar: 'sosyal', currentPillar: null },
    { id: 7, text: 'Bağımsız mahkemeler', correctPillar: 'hukuk', currentPillar: null },
    { id: 8, text: 'Kanun önünde eşitlik', correctPillar: 'hukuk', currentPillar: null },
  ]);
  const [showResults, setShowResults] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const pillars = [
    { id: 'demokratik', title: 'Demokratik Devlet', color: 'bg-green-100 border-green-300' },
    { id: 'laik', title: 'Laik Devlet', color: 'bg-orange-100 border-orange-300' },
    { id: 'hukuk', title: 'Hukuk Devleti', color: 'bg-blue-100 border-blue-300' },
    { id: 'sosyal', title: 'Sosyal Devlet', color: 'bg-yellow-100 border-yellow-300' },
  ];

  const handleDragStart = (e, id) => {
    if (showResults) return;
    e.dataTransfer.setData('itemId', id);
  };

  const handleDrop = (e, pillarId) => {
    if (showResults) return;
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData('itemId'));
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, currentPillar: pillarId } : item));
  };

  const handleItemClick = (id) => {
    if (showResults) return;
    setSelectedItemId(prev => prev === id ? null : id);
  };

  const handlePillarClick = (pillarId) => {
    if (showResults || !selectedItemId) return;
    setItems(prev => prev.map(item => item.id === selectedItemId ? { ...item, currentPillar: pillarId } : item));
    setSelectedItemId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-20 p-8 bg-white/95 rounded-3xl shadow-2xl border-2 border-[var(--color-gold)]">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-[var(--color-espresso)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Etkinlik Zamanı: Cumhuriyetin Nitelikleri
        </h3>
        <p className="text-[var(--color-espresso-light)]">Kavramları uygun devlet nitelikleri kutularına sürükleyip bırakınız.</p>
      </div>

      {/* Source Area */}
      <div 
        className={`flex flex-wrap gap-3 justify-center mb-10 min-h-[60px] p-4 bg-gray-50 border-2 border-dashed rounded-xl transition-all cursor-pointer ${selectedItemId ? 'border-amber-400 bg-amber-50' : 'border-gray-300'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, null)}
        onClick={() => handlePillarClick(null)}
      >
        {items.filter(i => i.currentPillar === null).map(item => {
          const isSelected = selectedItemId === item.id;
          return (
            <div
              key={item.id}
              draggable={!showResults}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onClick={(e) => { e.stopPropagation(); handleItemClick(item.id); }}
              className={`px-4 py-2 bg-white border rounded shadow-sm cursor-grab active:cursor-grabbing font-semibold transition-all ${isSelected ? 'border-amber-500 ring-2 ring-amber-400 scale-105 text-amber-900 bg-amber-50 shadow-md transform' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              {item.text}
            </div>
          )
        })}
        {items.filter(i => i.currentPillar === null).length === 0 && <span className="text-gray-400 italic">Harika, tüm kavramları yerleştirdin!</span>}
      </div>

      {/* Target Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pillars.map(pillar => (
          <div 
            key={pillar.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, pillar.id)}
            onClick={() => handlePillarClick(pillar.id)}
            className={`flex flex-col border-2 rounded-xl overflow-hidden min-h-[200px] cursor-pointer hover:shadow-lg transition-all ${pillar.color} ${selectedItemId ? 'ring-4 ring-amber-400 ring-offset-2 scale-[1.02]' : ''}`}
          >
            <div className="p-3 text-center font-bold bg-white/50 border-b border-inherit pointer-events-none">
              {pillar.title}
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2 pointer-events-none">
              {items.filter(i => i.currentPillar === pillar.id).map(item => {
                const isCorrect = item.correctPillar === item.currentPillar;
                const isSelected = selectedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    draggable={!showResults}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onClick={(e) => { e.stopPropagation(); handleItemClick(item.id); }}
                    className={`px-3 py-2 bg-white border rounded shadow-sm text-sm cursor-grab active:cursor-grabbing font-medium pointer-events-auto transition-all ${
                      showResults ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50 text-red-700 line-through') : (isSelected ? 'border-amber-500 ring-2 ring-amber-400 scale-105 bg-amber-50' : 'border-gray-200 hover:border-amber-300')
                    }`}
                  >
                     {item.text}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        {!showResults ? (
          <button onClick={() => setShowResults(true)} className="px-8 py-3 bg-[var(--color-espresso)] text-white font-bold rounded-full hover:bg-black transition-colors shadow-lg">
            Cevapları Kontrol Et
          </button>
        ) : (
          <button onClick={() => { setShowResults(false); setItems(i => i.map(x => ({...x, currentPillar: null}))); }} className="px-8 py-3 bg-[var(--color-gold)] text-white font-bold rounded-full hover:bg-yellow-600 transition-colors shadow-lg">
            Tekrar Dene
          </button>
        )}
      </div>
    </div>
  )
}

/* ==============================
   TOP NAVBAR
   ============================== */
function TopNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('salon-1');
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['salon-1', 'salon-2', 'salon-3', 'exit-ticket'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      
      if (current) setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full px-6 py-3 flex items-center gap-5 md:gap-7 ${
      scrolled 
        ? 'bg-[var(--color-espresso)]/95 backdrop-blur-xl shadow-2xl shadow-black/30 border border-white/10' 
        : 'bg-black/50 backdrop-blur-md border border-white/5'
    }`}>
      <span className="text-[var(--color-gold)] font-bold text-lg tracking-widest font-mono select-none hidden md:inline-block">D.M.</span>
      <div className="flex gap-3 md:gap-5 items-center">
        <a href="#salon-1" className={`transition-all text-xs font-semibold tracking-widest uppercase hidden sm:inline-block ${activeSection === 'salon-1' ? 'text-[var(--color-gold)] scale-110 underline decoration-2 underline-offset-4' : 'text-white hover:text-[var(--color-gold)]'}`}>Salon 01</a>
        <a href="#salon-2" className={`transition-all text-xs font-semibold tracking-widest uppercase hidden sm:inline-block ${activeSection === 'salon-2' ? 'text-[var(--color-gold)] scale-110 underline decoration-2 underline-offset-4' : 'text-white hover:text-[var(--color-gold)]'}`}>Salon 02</a>
        <a href="#salon-3" className={`transition-all text-xs font-semibold tracking-widest uppercase hidden sm:inline-block ${activeSection === 'salon-3' ? 'text-[var(--color-gold)] scale-110 underline decoration-2 underline-offset-4' : 'text-white hover:text-[var(--color-gold)]'}`}>Salon 03</a>
        
        <a href="#exit-ticket" className={`transition-all text-[10px] sm:text-xs font-bold tracking-widest uppercase border px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${activeSection === 'exit-ticket' ? 'text-white bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)] scale-105' : 'text-amber-400 border-amber-500/50 bg-amber-500/10 hover:text-white'} `}>Çıkış Bileti</a>

        <a href={imgUrl('/docs/Demokrasi_ve_Vatandaslik.pdf')} target="_blank" rel="noreferrer" title="MEB Demokrasi ve Vatandaşlık Ders Özeti PDF Kılavuzu" className="text-emerald-400 hover:text-white transition-colors text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-emerald-500/50 px-2 sm:px-3 py-1 rounded-full bg-emerald-500/10 flex items-center gap-1.5 group whitespace-nowrap">
          <Download className="w-3 h-3 group-hover:scale-110 transition-transform" /> 
          <span className="hidden sm:inline-block">PDF Özet</span>
          <span className="sm:hidden">Özet</span>
        </a>
      </div>
    </nav>
  )
}

/* ==============================
   BOTTOM NAV ARROW
   ============================== */
function BottomNavArrow({ targetId, text, isDark = false }) {
  const textColor = isDark ? 'text-amber-200/60 hover:text-amber-200' : 'text-amber-700/60 hover:text-amber-600';
  const lineColor = isDark ? 'via-amber-200' : 'via-amber-600';
  const bgColor = isDark ? 'bg-[var(--color-espresso)]' : 'bg-transparent';
  return (
    <div className={`flex flex-col items-center gap-2 pb-12 pt-8 relative z-10 w-full ${bgColor}`}>
      <div className={`w-px h-12 bg-gradient-to-b from-transparent ${lineColor} to-transparent opacity-50`} />
      <a 
        onClick={() => sounds.click()}
        href={`#${targetId}`} 
        className={`flex flex-col items-center group cursor-pointer transition-colors ${textColor}`}
      >
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase font-mono mb-2">{text}</p>
        <div className="flex flex-col items-center gap-1 animate-bounce group-hover:scale-110 transition-transform">
          <div className="w-3 h-3 border-r-2 border-b-2 border-current rotate-45" />
          <div className="w-3 h-3 border-r-2 border-b-2 border-current rotate-45 -mt-1.5" />
        </div>
      </a>
    </div>
  )
}

/* ==============================
   SCROLL PROGRESS BAR
   ============================== */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calcScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };
    window.addEventListener('scroll', calcScroll);
    return () => window.removeEventListener('scroll', calcScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-black/20">
      <div 
        className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-100 ease-out" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}

/* ==============================
   MAIN APP
   ============================== */
function App() {
  const [entered, setEntered] = useState(false)

  return (
    <>
      {!entered ? (
        <ChestScene onEnter={() => setEntered(true)} />
      ) : (
        <main className="relative">
          <ScrollProgress />
          <TopNavbar />
          <Salon1 />
          <div className="w-full bg-[var(--color-espresso)] h-8 rounded-t-[3rem] -mb-8 z-20 relative" />
          <Salon2Timeline />
          <div className="w-full bg-[var(--color-parchment-light)] h-8 rounded-t-[3rem] -mb-8 z-20 relative" />
          <Salon3 />
          <ExitTicket />
        </main>
      )}
    </>
  )
}

export default App

