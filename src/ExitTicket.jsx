import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ChevronRight, Award } from 'lucide-react';
import { sounds } from './utils/sounds';

export default function ExitTicket() {
  const [step, setStep] = useState(0); 
  // 0: Intro, 1: Matching, 2: True/False, 3: Multiple Choice, 4: Result

  const [score, setScore] = useState(0);

  // --- STAGE 1: MATCHING (4 items) ---
  const matchingQuestions = [
    { id: 'm1', text: 'Kralın yetkilerini sınırlayan ilk belge', matchId: 'a1' },
    { id: 'm2', text: 'Asya Hun Devleti\'nde danışma meclisi', matchId: 'a2' },
    { id: 'm3', text: 'Hukukun üstünlüğüne atılan ilk ciddi adım', matchId: 'a3' },
    { id: 'm4', text: 'Padişahın yetkilerini sınırlandırdığı belge', matchId: 'a4' },
  ];
  const matchingAnswers = [
    { id: 'a2', text: 'Kurultay' },
    { id: 'a4', text: 'Sened-i İttifak' },
    { id: 'a1', text: 'Magna Carta' },
    { id: 'a3', text: 'Tanzimat Fermanı' },
  ];
  const [matchedPairs, setMatchedPairs] = useState([]); // { qId, aId }
  const [selectedQ, setSelectedQ] = useState(null);
  const [selectedA, setSelectedA] = useState(null);
  const [matchError, setMatchError] = useState(false);

  useEffect(() => {
    if (selectedQ && selectedA) {
      const q = matchingQuestions.find(x => x.id === selectedQ);
      if (q.matchId === selectedA) {
        sounds.success();
        setMatchedPairs(prev => [...prev, { qId: selectedQ, aId: selectedA }]);
        setScore(s => s + 10); // 10 points each
        setSelectedQ(null);
        setSelectedA(null);
      } else {
        sounds.error();
        setMatchError(true);
        setTimeout(() => {
          setMatchError(false);
          setSelectedQ(null);
          setSelectedA(null);
        }, 800);
      }
    }
  }, [selectedQ, selectedA]);

  // --- STAGE 2: TRUE / FALSE (4 items) ---
  const tfQuestions = [
    { id: 'tf1', text: "Atina Kent Devleti'nde kadınların da oy kullanma hakkı vardı.", correct: 'Yanlış' },
    { id: 'tf2', text: "Laik devlet sisteminde hukuk kuralları dini kurallara dayandırılmaz.", correct: 'Doğru' },
    { id: 'tf3', text: "15 Temmuz'da Türk halkı demokrasiye ve milli iradeye sahip çıkmıştır.", correct: 'Doğru' },
    { id: 'tf4', text: "I. Meşrutiyet ile padişahın meclisi kapatma yetkisi tamamen kaldırılmıştır.", correct: 'Yanlış' },
  ];
  const [tfAnswers, setTfAnswers] = useState({}); // { tf1: 'Doğru', ... }
  const [tfChecked, setTfChecked] = useState(false);

  const checkTF = () => {
    let pts = 0;
    tfQuestions.forEach(q => {
      if (tfAnswers[q.id] === q.correct) pts += 10;
    });
    if (pts >= 30) sounds.success();
    else sounds.error();
    
    setScore(s => s + pts);
    setTfChecked(true);
  };

  // --- STAGE 3: MULTIPLE CHOICE (7 items) ---
  const mcQuestions = [
    {
      q: "Aşağıdakilerden hangisi Demokratik Devlet'in özelliklerinden biri değildir?",
      options: ["Seçimlerin belirli aralıklarla yapılması", "Siyasi partilerin bulunması", "Egemenliğin belli bir gruba ait olması", "Vatandaşların eşit oy hakkına sahip olması"],
      ans: 2
    },
    {
      q: "Fransız İhtilali'nden sonra ortaya çıkan ve 'İnsanlar özgür ve eşit doğarlar' diyen bildirge hangisidir?",
      options: ["İnsan ve Yurttaş Hakları Bildirgesi", "Magna Carta", "Amerikan Bağımsızlık Bildirgesi", "BM Evrensel Bildirgesi"],
      ans: 0
    },
    {
      q: "Osmanlı Devleti'nde halk yönetime ilk defa hangi gelişme ile katılmıştır?",
      options: ["Sened-i İttifak", "Tanzimat Fermanı", "Islahat Fermanı", "I. Meşrutiyet"],
      ans: 3
    },
    {
      q: "Hangi kavram, devletin dini inançlar karşısında tarafsız kalmasını ifade eder?",
      options: ["Sosyal Devlet", "Laik Devlet", "Hukuk Devleti", "Demokratik Devlet"],
      ans: 1
    },
    {
      q: "Türk kadınına milletvekili seçme ve seçilme hakkı hangi yıl verilmiştir?",
      options: ["1923", "1930", "1933", "1934"],
      ans: 3
    },
    {
      q: "Devletin yaşlıları, çocukları ve özel gereksinimli bireyleri koruması, hangi devlet niteliğinin bir sonucudur?",
      options: ["Sosyal Devlet", "Laik Devlet", "Demokratik Devlet", "Hukuk Devleti"],
      ans: 0
    },
    {
      q: "TBMM'nin açılmasıyla en çok vurgulanan temel ilke aşağıdakilerden hangisidir?",
      options: ["Güçler Ayrılığı", "Milli Egemenlik", "Sosyal Güvenlik", "Fırsat Eşitliği"],
      ans: 1
    }
  ];
  const [currentMcIdx, setCurrentMcIdx] = useState(0);
  const [mcSelected, setMcSelected] = useState(null);
  const [mcChecked, setMcChecked] = useState(false);

  const checkMC = () => {
    if (mcSelected === mcQuestions[currentMcIdx].ans) {
      sounds.success();
      setScore(s => s + 10);
    } else {
      sounds.error();
    }
    setMcChecked(true);
  };

  const nextMC = () => {
    if (currentMcIdx < mcQuestions.length - 1) {
      setCurrentMcIdx(i => i + 1);
      setMcSelected(null);
      setMcChecked(false);
    } else {
      sounds.examComplete();
      setStep(4); // Final
    }
  };

  const [certName, setCertName] = useState('');
  const [showCert, setShowCert] = useState(false);

  const generateCert = () => {
    if (certName.trim().length > 2) {
      sounds.success();
      setShowCert(true);
    }
  };

  const restart = () => {
    setStep(1); setScore(0);
    setMatchedPairs([]); setSelectedQ(null); setSelectedA(null);
    setTfAnswers({}); setTfChecked(false);
    setCurrentMcIdx(0); setMcSelected(null); setMcChecked(false);
    setCertName(''); setShowCert(false);
  };

  return (
    <section id="exit-ticket" className="py-20 bg-[var(--color-navy)] min-h-screen relative text-white border-t-8 border-amber-500">
      <div className="max-w-4xl mx-auto px-4">
        
        {step === 0 && (
          <div className="text-center animate-in zoom-in duration-500 mt-20">
            <Award className="w-24 h-24 mx-auto text-amber-400 mb-6" />
            <h2 className="text-5xl font-bold mb-6 text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>
              Müze Çıkış Bileti
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Müzemizdeki gezinizi tamamlamak üzeresiniz! Ziyaretiniz boyunca öğrendiklerinizi pekiştirmek ve çıkış biletinizi almak için 15 soruluk bu mini testi tamamlayın.
            </p>
            <button onClick={() => { sounds.click(); setStep(1); }} className="px-10 py-4 bg-amber-500 text-slate-900 font-bold text-xl rounded-full hover:bg-amber-400 transition-all shadow-xl hover:scale-105">
              Testi Başlat
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right duration-500 pb-20">
            <div className="text-center mb-10">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-sm">Aşama 1 / 3</span>
              <h3 className="text-3xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>Eşleştirme Oyunu</h3>
              <p className="text-blue-200 mt-2 text-sm italic">Akıllı tahtalar için: Önce bir açıklamaya, sonra da uygun kavrama dokunun!</p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${matchError ? 'animate-pulse' : ''}`}>
              <div className="flex flex-col gap-4">
                <h4 className="text-amber-300 font-bold text-center mb-2">Açıklamalar</h4>
                {matchingQuestions.map(q => {
                  const isMatched = matchedPairs.some(p => p.qId === q.id);
                  const isSelected = selectedQ === q.id;
                  return (
                    <div 
                      key={q.id}
                      onClick={() => !isMatched && setSelectedQ(isSelected ? null : q.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-lg
                        ${isMatched ? 'bg-green-600/20 border-green-500 text-gray-300 opacity-50' : 
                          isSelected ? 'bg-amber-500 border-amber-400 text-slate-900 scale-105' : 
                          'bg-slate-800 border-slate-600 hover:border-amber-400'}`}
                    >
                      {q.text} {isMatched && '✓'}
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-amber-300 font-bold text-center mb-2">Kavramlar</h4>
                {matchingAnswers.map(a => {
                  const isMatched = matchedPairs.some(p => p.aId === a.id);
                  const isSelected = selectedA === a.id;
                  return (
                    <div 
                      key={a.id}
                      onClick={() => !isMatched && setSelectedA(isSelected ? null : a.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center font-bold shadow-lg
                        ${isMatched ? 'bg-green-600/20 border-green-500 text-gray-300 opacity-50' : 
                          isSelected ? 'bg-blue-500 border-blue-400 scale-105' : 
                          'bg-slate-800 border-slate-600 hover:border-blue-400'}`}
                    >
                      {a.text} {isMatched && '✓'}
                    </div>
                  )
                })}
              </div>
            </div>

            {matchedPairs.length === 4 && (
              <div className="mt-12 text-center animate-in zoom-in">
                <button onClick={() => setStep(2)} className="px-8 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-400 transition-all flex items-center mx-auto gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  Harika! Sonraki Aşama <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right duration-500 pb-20">
            <div className="text-center mb-10">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-sm">Aşama 2 / 3</span>
              <h3 className="text-3xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>Doğru mu Yanlış mı?</h3>
              <p className="text-blue-200 mt-2 text-sm italic">Cümlelerin yanındaki Doğru veya Yanlış butonlarından uygun olanı seçiniz.</p>
            </div>

            <div className="flex flex-col gap-4">
              {tfQuestions.map((q, idx) => (
                <div key={q.id} className="flex flex-col md:flex-row items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <span className="text-amber-500 font-bold text-xl">{idx + 1}.</span>
                  <p className="flex-1 text-lg leading-relaxed">{q.text}</p>
                  
                  <div className="flex gap-2 min-w-max">
                    <button 
                      onClick={() => !tfChecked && setTfAnswers(prev => ({ ...prev, [q.id]: 'Doğru' }))}
                      disabled={tfChecked}
                      className={`px-4 py-2 rounded-lg font-bold border-2 transition-all cursor-pointer 
                        ${tfAnswers[q.id] === 'Doğru' ? 'bg-green-500 border-green-400 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)] scale-105' : 'bg-slate-800 border-green-500 text-green-400 hover:bg-slate-700'}
                        ${tfChecked && q.correct === 'Doğru' ? 'ring-2 ring-green-300' : ''}
                        ${tfChecked && tfAnswers[q.id] === 'Doğru' && q.correct !== 'Doğru' ? 'bg-red-500 border-red-500 text-white ring-2 ring-red-400' : ''}
                      `}
                    >
                      DOĞRU
                    </button>
                    <button 
                      onClick={() => !tfChecked && setTfAnswers(prev => ({ ...prev, [q.id]: 'Yanlış' }))}
                      disabled={tfChecked}
                      className={`px-4 py-2 rounded-lg font-bold border-2 transition-all cursor-pointer
                        ${tfAnswers[q.id] === 'Yanlış' ? 'bg-red-500 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-105' : 'bg-slate-800 border-red-500 text-red-400 hover:bg-slate-700'}
                        ${tfChecked && q.correct === 'Yanlış' ? 'ring-2 ring-green-300' : ''}
                        ${tfChecked && tfAnswers[q.id] === 'Yanlış' && q.correct !== 'Yanlış' ? 'bg-red-500 border-red-500 text-white ring-2 ring-red-400' : ''}
                      `}
                    >
                      YANLIŞ
                    </button>
                  </div>
                  
                  {tfChecked && (
                    <div className="w-8 ml-2 flex justify-center">
                      {tfAnswers[q.id] === q.correct ? <CheckCircle2 className="text-green-400 w-8 h-8" /> : <XCircle className="text-red-400 w-8 h-8" />}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center flex flex-col items-center">
              {!tfChecked ? (
                <button 
                  onClick={checkTF} 
                  disabled={Object.keys(tfAnswers).length < 4}
                  className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full disabled:opacity-50 hover:bg-blue-400 transition-all shadow-lg"
                >
                  Cevapları Kontrol Et
                </button>
              ) : (
                <button onClick={() => setStep(3)} className="px-8 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-400 transition-all flex items-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  Son Aşama! <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right duration-500 pb-20">
            <div className="text-center mb-8">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-sm">Aşama 3 / 3 (Soru {currentMcIdx + 1}/7)</span>
              <h3 className="text-3xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>Uzmanlık Testi</h3>
            </div>

            <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 md:p-10 shadow-2xl relative">
              <h4 className="text-xl md:text-2xl font-bold mb-8 leading-normal text-white">
                {currentMcIdx + 1}. {mcQuestions[currentMcIdx].q}
              </h4>

              <div className="flex flex-col gap-4">
                {mcQuestions[currentMcIdx].options.map((opt, oIdx) => {
                  let btnClass = "text-left p-4 rounded-xl border-2 transition-all font-medium text-lg ";
                  if (!mcChecked) {
                    btnClass += mcSelected === oIdx ? "bg-amber-500 border-amber-400 text-black scale-[1.02]" : "bg-slate-700 border-slate-600 hover:border-amber-400 text-gray-200";
                  } else {
                    if (oIdx === mcQuestions[currentMcIdx].ans) {
                      btnClass += "bg-green-600 border-green-400 text-white scale-[1.02] shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                    } else if (oIdx === mcSelected) {
                      btnClass += "bg-red-600 border-red-400 text-white";
                    } else {
                      btnClass += "bg-slate-800 border-slate-700 text-gray-400 opacity-50";
                    }
                  }
                  
                  return (
                    <button 
                      key={oIdx}
                      disabled={mcChecked}
                      onClick={() => setMcSelected(oIdx)}
                      className={btnClass}
                    >
                      <span className="font-bold mr-3">{['A', 'B', 'C', 'D'][oIdx]})</span> {opt}
                    </button>
                  )
                })}
              </div>

              <div className="mt-10 flex justify-end">
                {!mcChecked ? (
                  <button 
                    onClick={checkMC} 
                    disabled={mcSelected === null}
                    className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full disabled:opacity-50 hover:bg-blue-400 transition-all shadow-lg"
                  >
                    Cevapla
                  </button>
                ) : (
                  <button onClick={nextMC} className="px-8 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-400 transition-all flex items-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    {currentMcIdx < 6 ? 'Sıradaki Soru' : 'Bileti Al!'} <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center animate-in zoom-in slide-in-from-bottom-10 duration-700 mt-10 p-8 border-4 border-amber-500 border-dashed rounded-3xl bg-slate-800">
            <h2 className="text-5xl font-bold mb-4 text-amber-400" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tebrikler!
            </h2>
            <p className="text-2xl text-white mb-2">Müze Çıkış Biletinizi Kazandınız.</p>
            
            <div className="my-10 inline-block bg-gradient-to-r from-amber-500 to-amber-300 text-slate-900 p-8 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.4)] transform rotate-2">
              <div className="border-4 border-slate-900 border-dashed p-6 rounded-xl relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-slate-800 rounded-full"></div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-slate-800 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-slate-800 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-slate-800 rounded-full"></div>
                
                <h3 className="text-4xl font-bold uppercase tracking-widest mb-4">DEMOKRASİ BİLETİ</h3>
                <div className="text-6xl font-black mb-2">{score} / 150</div>
                <p className="font-bold text-lg uppercase tracking-wide">Puan</p>
              </div>
            </div>

            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              {score >= 120 ? "Muhteşem bir sonuç! Demokrasi tarihini gerçekten çok iyi kavramışsın." : 
               score >= 80 ? "Harika iş! Ufak tefek eksiklerin var ama temel çok sağlam." : 
               "Müzeyi bir kez daha gezmeye ne dersin? Yeni şeyler keşfedeceğine eminim!"}
            </p>

            {score >= 80 && !showCert && (
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-amber-500/30 max-w-md mx-auto mb-8 animate-in fade-in zoom-in duration-500">
                <h4 className="text-xl font-bold text-amber-400 mb-4">Sertifikanı Al!</h4>
                <p className="text-sm text-slate-300 mb-4">Müzedeki başarın bir belgeyi hak ediyor. Adını yaz ve sertifikanı oluştur:</p>
                <input 
                  type="text" 
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="Ad Soyad"
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-white mb-4 focus:outline-none focus:border-amber-400 text-center"
                />
                <button onClick={generateCert} disabled={certName.trim().length <= 2} className="w-full py-3 bg-amber-500 text-slate-900 font-bold rounded-xl disabled:opacity-50 hover:bg-amber-400 transition-colors">
                  Sertifika Oluştur
                </button>
              </div>
            )}

            {showCert && (
              <div className="bg-[#fdfbf7] p-8 md:p-12 rounded-xl text-center max-w-2xl mx-auto mb-8 relative border-[12px] border-[var(--color-espresso)] shadow-2xl animate-in zoom-in duration-700">
                <div className="absolute inset-0 border border-[var(--color-gold)] m-2" />
                <Award className="w-20 h-20 mx-auto text-[var(--color-gold)] mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-espresso)] uppercase mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Fahri Demokrasi Elçisi
                </h1>
                <p className="text-xl text-[var(--color-espresso-light)] mb-4 font-serif">Bu belge, Demokrasi Müzesi'ni başarıyla tamamlayan</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-gold)] border-b-2 border-dashed border-[var(--color-gold)] inline-block pb-2 px-8 mb-6 font-mono">
                  {certName}
                </h2>
                <p className="text-lg text-[var(--color-espresso-light)] mb-8 font-serif leading-relaxed">'e, tarih boyunca insanın özgürlük arayışına gösterdiği derin ilgi ve Çıkış Bileti sınavında elde ettiği {score} puanlık üstün başarı nedeniyle takdim edilmiştir.</p>
                <div className="flex justify-between items-end border-t border-[var(--color-espresso)]/20 pt-6 mt-4">
                  <div className="text-left font-serif text-[var(--color-espresso)]">
                    <p className="text-sm font-bold">Tarih:</p>
                    <p className="italic">{new Date().toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div className="w-24 h-24 border-4 border-red-800 rounded-full flex flex-col items-center justify-center text-red-800 font-bold -rotate-12 opacity-80 mix-blend-multiply">
                    <span className="text-[10px] tracking-widest">ONAYLI MÜHÜR</span>
                    <span className="text-2xl mt-1">✯</span>
                  </div>
                  <div className="text-right font-serif text-[var(--color-espresso)]">
                    <p className="text-sm font-bold pb-2 border-b border-[var(--color-espresso)]/30 inline-block mb-1">Düzenleyen</p>
                    <p className="italic font-bold text-xl mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>Kürşat Çelik</p>
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--color-espresso)]/70 mt-1">Demokrasi Müzesi</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={restart} className="px-8 py-3 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-all flex items-center mx-auto shadow-lg mt-8">
              <RotateCcw className="w-5 h-5 mr-2" /> Tekrar Oyna
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
