import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 3D-styled animated mascot Bee (Ong Vàng)
export const MascotBee: React.FC<IconProps & { mood?: 'happy' | 'thinking' | 'cheer' }> = ({
  className = 'w-24 h-24',
  mood = 'happy',
}) => {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="beeBody" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
        <radialGradient id="beeHead" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Wings */}
      <ellipse cx="65" cy="65" rx="36" ry="22" transform="rotate(-35 65 65)" fill="url(#wingGrad)" stroke="#bae6fd" strokeWidth="2.5" />
      <ellipse cx="135" cy="65" rx="36" ry="22" transform="rotate(35 135 65)" fill="url(#wingGrad)" stroke="#bae6fd" strokeWidth="2.5" />
      <ellipse cx="68" cy="80" rx="24" ry="14" transform="rotate(-20 68 80)" fill="url(#wingGrad)" stroke="#bae6fd" strokeWidth="2" opacity="0.8" />
      <ellipse cx="132" cy="80" rx="24" ry="14" transform="rotate(20 132 80)" fill="url(#wingGrad)" stroke="#bae6fd" strokeWidth="2" opacity="0.8" />

      {/* Stinger */}
      <path d="M100 178 L93 162 L107 162 Z" fill="#1e293b" />

      {/* Main Oval Body with Stripes */}
      <g filter="url(#shadow)">
        <ellipse cx="100" cy="125" rx="52" ry="44" fill="url(#beeBody)" />
        {/* Stripe 1 */}
        <path d="M56 112 C70 120, 130 120, 144 112 C146 118, 144 125, 140 130 C125 137, 75 137, 60 130 C56 125, 54 118, 56 112 Z" fill="#1e293b" />
        {/* Stripe 2 */}
        <path d="M68 140 C80 146, 120 146, 132 140 C130 146, 125 152, 120 155 C110 158, 90 158, 80 155 C75 152, 70 146, 68 140 Z" fill="#1e293b" />
      </g>

      {/* Head */}
      <g filter="url(#shadow)">
        <circle cx="100" cy="72" r="42" fill="url(#beeHead)" />
      </g>

      {/* Antennae */}
      <path d="M85 36 Q75 15, 62 20" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="60" cy="20" r="6" fill="#f59e0b" stroke="#1e293b" strokeWidth="2" />
      <path d="M115 36 Q125 15, 138 20" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="140" cy="20" r="6" fill="#f59e0b" stroke="#1e293b" strokeWidth="2" />

      {/* Rosy Cheeks */}
      <ellipse cx="74" cy="80" rx="9" ry="6" fill="#fb7185" opacity="0.65" />
      <ellipse cx="126" cy="80" rx="9" ry="6" fill="#fb7185" opacity="0.65" />

      {/* Big cartoon eyes */}
      <ellipse cx="82" cy="65" rx="11" ry="14" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
      <ellipse cx="118" cy="65" rx="11" ry="14" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
      <ellipse cx="85" cy="66" rx="6" ry="8" fill="#1e293b" />
      <ellipse cx="115" cy="66" rx="6" ry="8" fill="#1e293b" />
      <circle cx="87" cy="63" r="3" fill="#ffffff" />
      <circle cx="117" cy="63" r="3" fill="#ffffff" />

      {/* Smiling Mouth based on mood */}
      {mood === 'happy' || mood === 'cheer' ? (
        <path d="M86 85 Q100 102 114 85" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="#e11d48" />
      ) : (
        <path d="M88 88 Q100 93 112 88" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}

      {/* Little hands */}
      <circle cx="58" cy="115" r="9" fill="#f59e0b" stroke="#ca8a04" strokeWidth="2" />
      <circle cx="142" cy="115" r="9" fill="#f59e0b" stroke="#ca8a04" strokeWidth="2" />
    </svg>
  );
};

// Teacher Mascot (Cô Đào - Ảnh chân dung thật)
export const MascotTeacher: React.FC<IconProps> = ({ className = 'w-24 h-24', size }) => {
  const sizeStyle = size ? { width: size, height: size } : {};
  return (
    <div
      style={sizeStyle}
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md ring-2 ring-white/40 bg-white/20 select-none shrink-0 ${className}`}
    >
      <img
        src="/assets/aistudio/1792500275588_287236970869219108_4822552393583529781_7460d31db21a51ae15149da4afc3ba60_43223e7c.jpg"
        alt="Cô Đào"
        className="w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '68% 20%' }}
        loading="eager"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.indexOf('co-dao-portrait.jpg') === -1) {
            target.src = '/co-dao-portrait.jpg';
          }
        }}
      />
    </div>
  );
};

// Pedagogical Item Illustrations
export const PedagogicalIllustration: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-32 h-32',
}) => {
  switch (name) {
    case 'con_ca': // Con cá
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          <ellipse cx="78" cy="80" rx="48" ry="30" fill="#38bdf8" />
          <path d="M115 80 L145 55 L145 105 Z" fill="#0284c7" />
          <path d="M75 52 L90 40 L98 52 Z" fill="#0284c7" />
          <path d="M72 108 L86 118 L94 108 Z" fill="#0284c7" />
          <circle cx="52" cy="74" r="6" fill="#ffffff" />
          <circle cx="50" cy="74" r="3.5" fill="#0f172a" />
          <path d="M75 70 Q85 80 75 90" stroke="#0284c7" strokeWidth="2.5" fill="none" />
          <path d="M90 72 Q100 80 90 88" stroke="#0284c7" strokeWidth="2.5" fill="none" />
          <circle cx="36" cy="65" r="4" fill="#e0f2fe" opacity="0.7" />
          <circle cx="28" cy="55" r="3" fill="#e0f2fe" opacity="0.7" />
        </svg>
      );

    case 'qua_bo': // Quả bơ
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          <path d="M80 30 C62 30 52 50 50 78 C46 110 58 135 80 135 C102 135 114 110 110 78 C108 50 98 30 80 30 Z" fill="#15803d" />
          <path d="M80 38 C66 38 58 55 57 80 C54 106 64 127 80 127 C96 127 106 106 103 80 C102 55 94 38 80 38 Z" fill="#86efac" />
          <circle cx="80" cy="98" r="20" fill="#78350f" />
          <circle cx="83" cy="94" r="6" fill="#92400e" opacity="0.6" />
          <path d="M80 24 L80 32" stroke="#573010" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'con_cong': // Con công
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          {/* Feather fan */}
          <path d="M80 110 Q30 50 40 30 Q60 50 80 100" fill="#0284c7" opacity="0.8" />
          <path d="M80 110 Q50 30 70 20 Q80 45 80 100" fill="#0d9488" opacity="0.8" />
          <path d="M80 110 Q80 20 90 20 Q95 45 80 100" fill="#10b981" opacity="0.8" />
          <path d="M80 110 Q110 30 120 30 Q110 60 80 100" fill="#0284c7" opacity="0.8" />
          <path d="M80 110 Q130 50 135 45 Q125 75 80 100" fill="#0d9488" opacity="0.8" />
          {/* Feather eyes */}
          <circle cx="45" cy="35" r="5" fill="#facc15" />
          <circle cx="70" cy="24" r="5" fill="#facc15" />
          <circle cx="95" cy="24" r="5" fill="#facc15" />
          <circle cx="120" cy="36" r="5" fill="#facc15" />
          {/* Body */}
          <ellipse cx="80" cy="110" rx="18" ry="24" fill="#0369a1" />
          <circle cx="80" cy="82" r="12" fill="#0284c7" />
          {/* Beak */}
          <path d="M72 82 L62 85 L72 88 Z" fill="#f59e0b" />
          {/* Eye */}
          <circle cx="77" cy="80" r="2.5" fill="#ffffff" />
          <circle cx="76" cy="80" r="1.5" fill="#000000" />
          {/* Legs */}
          <path d="M75 132 L75 145 M85 132 L85 145" stroke="#ca8a04" strokeWidth="3" />
        </svg>
      );

    case 'bong_sen': // Bông sen
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          {/* Leaf */}
          <ellipse cx="80" cy="130" rx="60" ry="16" fill="#15803d" />
          {/* Stem */}
          <path d="M80 100 L80 135" stroke="#166534" strokeWidth="5" />
          {/* Petals */}
          <path d="M80 40 C65 60 60 90 80 105 C100 90 95 60 80 40 Z" fill="#f43f5e" />
          <path d="M80 50 C60 65 52 85 68 102 C72 88 75 70 80 50 Z" fill="#fb7185" />
          <path d="M80 50 C100 65 108 85 92 102 C88 88 85 70 80 50 Z" fill="#fb7185" />
          <path d="M60 70 C45 80 46 95 62 104 C60 90 60 80 60 70 Z" fill="#fda4af" />
          <path d="M100 70 C115 80 114 95 98 104 C100 90 100 80 100 70 Z" fill="#fda4af" />
        </svg>
      );

    case 'ngoi_nha': // Ngôi nhà
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          {/* Roof */}
          <path d="M80 32 L30 75 L130 75 Z" fill="#ef4444" />
          {/* Chimney */}
          <rect x="105" y="42" width="12" height="20" fill="#991b1b" />
          {/* Body */}
          <rect x="42" y="75" width="76" height="55" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          {/* Door */}
          <rect x="70" y="95" width="20" height="35" rx="3" fill="#854d0e" />
          <circle cx="86" cy="112" r="2" fill="#facc15" />
          {/* Window */}
          <rect x="50" y="86" width="16" height="16" rx="2" fill="#67e8f9" stroke="#0891b2" strokeWidth="1.5" />
          <path d="M58 86 L58 102 M50 94 L66 94" stroke="#0891b2" strokeWidth="1.5" />
        </svg>
      );

    case 'xe_dap': // Xe đạp
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          {/* Wheels */}
          <circle cx="45" cy="105" r="22" stroke="#334155" strokeWidth="5" fill="#e2e8f0" />
          <circle cx="115" cy="105" r="22" stroke="#334155" strokeWidth="5" fill="#e2e8f0" />
          {/* Frame */}
          <path d="M45 105 L72 105 L100 75 L62 75 Z" stroke="#2563eb" strokeWidth="4" fill="none" strokeLinejoin="round" />
          <path d="M72 105 L60 62" stroke="#2563eb" strokeWidth="4" />
          <path d="M115 105 L96 65" stroke="#2563eb" strokeWidth="4" />
          {/* Handlebars */}
          <path d="M92 65 L102 65 L106 70" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          {/* Seat */}
          <path d="M54 62 L66 62" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'but_chi': // Bút chì
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          <g transform="rotate(45 80 80)">
            {/* Eraser */}
            <rect x="70" y="25" width="20" height="15" rx="3" fill="#f43f5e" />
            <rect x="70" y="38" width="20" height="8" fill="#cbd5e1" />
            {/* Wooden body */}
            <rect x="70" y="46" width="20" height="65" fill="#facc15" />
            <path d="M76 46 L76 111 M83 46 L83 111" stroke="#eab308" strokeWidth="2" />
            {/* Tip */}
            <path d="M70 111 L90 111 L80 135 Z" fill="#fed7aa" />
            {/* Lead */}
            <path d="M76 127 L84 127 L80 135 Z" fill="#1e293b" />
          </g>
        </svg>
      );

    case 'con_tho': // Con thỏ
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          {/* Ears */}
          <ellipse cx="68" cy="45" rx="9" ry="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <ellipse cx="68" cy="45" rx="5" ry="18" fill="#fbcfe8" />
          <ellipse cx="92" cy="45" rx="9" ry="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <ellipse cx="92" cy="45" rx="5" ry="18" fill="#fbcfe8" />
          {/* Body */}
          <ellipse cx="80" cy="115" rx="32" ry="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          {/* Head */}
          <circle cx="80" cy="80" r="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          {/* Eyes */}
          <ellipse cx="72" cy="76" rx="3.5" ry="5" fill="#ec4899" />
          <ellipse cx="88" cy="76" rx="3.5" ry="5" fill="#ec4899" />
          {/* Nose */}
          <path d="M77 84 L83 84 L80 88 Z" fill="#f43f5e" />
          {/* Mouth */}
          <path d="M76 90 Q80 94 84 90" stroke="#94a3b8" strokeWidth="2" fill="none" />
          {/* Whiskers */}
          <path d="M60 84 L72 85 M60 88 L72 87 M88 85 L100 84 M88 87 L100 88" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      );

    case 'qua_tao': // Quả táo
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          <path d="M80 50 C65 40 45 48 45 75 C45 105 65 125 80 128 C95 125 115 105 115 75 C115 48 95 40 80 50 Z" fill="#ef4444" />
          <circle cx="65" cy="65" r="10" fill="#f87171" opacity="0.5" />
          {/* Stem */}
          <path d="M80 50 Q85 30 92 26" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Leaf */}
          <path d="M88 36 Q105 32 102 44 Q90 44 88 36 Z" fill="#22c55e" />
        </svg>
      );

    case 'no_do': // Nơ đỏ
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          <path d="M80 80 L35 55 Q30 80 35 105 L80 80 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
          <path d="M80 80 L125 55 Q130 80 125 105 L80 80 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
          <path d="M80 85 L60 125 L75 120 L80 100 L85 120 L100 125 Z" fill="#dc2626" />
          <circle cx="80" cy="80" r="14" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          <circle cx="78" cy="78" r="4" fill="#f87171" />
        </svg>
      );

    case 'mat_troi': // Mặt trời
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path
              key={angle}
              d="M80 20 L80 35"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
              transform={`rotate(${angle} 80 80)`}
            />
          ))}
          {/* Core */}
          <circle cx="80" cy="80" r="32" fill="#facc15" stroke="#f59e0b" strokeWidth="3" />
          {/* Smiling face */}
          <circle cx="70" cy="75" r="3.5" fill="#78350f" />
          <circle cx="90" cy="75" r="3.5" fill="#78350f" />
          <path d="M72 87 Q80 96 88 87" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="66" cy="82" r="3" fill="#f87171" opacity="0.6" />
          <circle cx="94" cy="82" r="3" fill="#f87171" opacity="0.6" />
        </svg>
      );

    case 'chu_chim': // Chú chim
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          <ellipse cx="80" cy="88" rx="28" ry="20" fill="#38bdf8" />
          <circle cx="102" cy="72" r="16" fill="#38bdf8" />
          <path d="M116 72 L128 75 L116 78 Z" fill="#f59e0b" />
          <circle cx="106" cy="69" r="2.5" fill="#0f172a" />
          {/* Wing */}
          <path d="M68 84 Q82 75 92 86 Q80 98 68 84 Z" fill="#0284c7" />
          {/* Tail */}
          <path d="M54 88 L35 78 L38 94 Z" fill="#0284c7" />
          {/* Legs */}
          <path d="M75 106 L72 118 M84 106 L84 118" stroke="#ca8a04" strokeWidth="2.5" />
        </svg>
      );

    case 'cap_da': // Cặp da / Balo
      return (
        <svg viewBox="0 0 160 160" className={className} fill="none">
          <path d="M68 45 Q80 32 92 45" stroke="#475569" strokeWidth="4" fill="none" />
          <rect x="42" y="45" width="76" height="70" rx="14" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
          <path d="M42 45 Q80 75 118 45 L118 78 Q80 102 42 78 Z" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" />
          {/* Buckles */}
          <rect x="58" y="80" width="8" height="12" rx="2" fill="#facc15" />
          <rect x="94" y="80" width="8" height="12" rx="2" fill="#facc15" />
          {/* Pocket */}
          <rect x="52" y="96" width="56" height="15" rx="3" fill="#1e40af" />
        </svg>
      );

    case 'be_tuoi_cay': // Tranh bé tưới cây
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none">
          {/* Ground */}
          <path d="M10 135 Q100 130 190 135" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
          {/* Plant */}
          <path d="M145 135 Q145 95 150 75" stroke="#15803d" strokeWidth="4" />
          <ellipse cx="140" cy="95" rx="10" ry="6" transform="rotate(-30 140 95)" fill="#4ade80" />
          <ellipse cx="158" cy="85" rx="10" ry="6" transform="rotate(30 158 85)" fill="#4ade80" />
          {/* Flower on plant */}
          <circle cx="152" cy="70" r="9" fill="#f43f5e" />
          <circle cx="152" cy="70" r="4" fill="#fde047" />
          {/* Child */}
          <circle cx="70" cy="55" r="18" fill="#fed7aa" />
          {/* Child hair */}
          <path d="M55 52 Q70 36 85 52" fill="#1e293b" />
          <circle cx="66" cy="54" r="2" fill="#1e293b" />
          <circle cx="76" cy="54" r="2" fill="#1e293b" />
          <path d="M68 62 Q71 65 74 62" stroke="#e11d48" strokeWidth="1.5" fill="none" />
          {/* Child body */}
          <path d="M58 73 L82 73 L86 112 L54 112 Z" fill="#38bdf8" />
          {/* Child legs */}
          <rect x="60" y="112" width="7" height="23" fill="#1e293b" />
          <rect x="73" y="112" width="7" height="23" fill="#1e293b" />
          {/* Watering can */}
          <rect x="92" y="85" width="22" height="18" rx="4" fill="#f59e0b" />
          <path d="M85 86 Q92 74 102 85" stroke="#b45309" strokeWidth="2.5" fill="none" />
          <path d="M114 92 L128 82" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          {/* Water drops */}
          <circle cx="132" cy="90" r="1.5" fill="#38bdf8" />
          <circle cx="136" cy="98" r="1.5" fill="#38bdf8" />
          <circle cx="140" cy="106" r="1.5" fill="#38bdf8" />
        </svg>
      );

    case 'me_di_cho': // Tranh mẹ đi chợ về
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none">
          <path d="M10 140 Q100 138 190 140" stroke="#16a34a" strokeWidth="5" />
          {/* Mother */}
          <ellipse cx="100" cy="46" rx="16" ry="18" fill="#fed7aa" />
          {/* Hair tied in bun */}
          <ellipse cx="100" cy="38" rx="18" ry="14" fill="#1e1b4b" />
          <circle cx="100" cy="22" r="7" fill="#1e1b4b" />
          {/* Eyes & smile */}
          <circle cx="95" cy="46" r="2" fill="#1e293b" />
          <circle cx="105" cy="46" r="2" fill="#1e293b" />
          <path d="M97 54 Q100 58 103 54" stroke="#be123c" strokeWidth="1.5" fill="none" />
          {/* Dress */}
          <path d="M85 64 Q100 60 115 64 L125 125 L75 125 Z" fill="#ec4899" />
          {/* Conical hat on arm */}
          <path d="M60 85 L78 68 L78 102 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Basket with veggies/fruits */}
          <path d="M118 85 Q135 85 138 108 L114 108 Z" fill="#b45309" />
          <circle cx="124" cy="85" r="5" fill="#ef4444" />
          <circle cx="132" cy="84" r="5" fill="#22c55e" />
          {/* Legs */}
          <rect x="91" y="125" width="6" height="15" fill="#fed7aa" />
          <rect x="103" y="125" width="6" height="15" fill="#fed7aa" />
        </svg>
      );

    case 'dan_ga_con': // Đàn gà con theo mẹ
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none">
          <path d="M10 138 Q100 135 190 138" stroke="#15803d" strokeWidth="5" />
          {/* Mother Hen */}
          <ellipse cx="65" cy="95" rx="30" ry="24" fill="#b45309" />
          <circle cx="85" cy="75" r="14" fill="#b45309" />
          <path d="M82 60 Q86 52 90 60" fill="#dc2626" />
          <path d="M96 75 L106 78 L96 82 Z" fill="#f59e0b" />
          <circle cx="89" cy="73" r="2.5" fill="#000000" />
          {/* Hen legs */}
          <path d="M60 118 L58 135 M72 118 L74 135" stroke="#d97706" strokeWidth="3" />
          {/* Baby Chicks */}
          <g transform="translate(110, 10)">
            <ellipse cx="20" cy="105" rx="10" ry="8" fill="#facc15" />
            <circle cx="27" cy="98" r="6" fill="#facc15" />
            <path d="M32 98 L37 100 L32 102 Z" fill="#f59e0b" />
            <circle cx="28" cy="97" r="1.5" fill="#000" />
          </g>
          <g transform="translate(145, 10)">
            <ellipse cx="20" cy="105" rx="10" ry="8" fill="#facc15" />
            <circle cx="27" cy="98" r="6" fill="#facc15" />
            <path d="M32 98 L37 100 L32 102 Z" fill="#f59e0b" />
            <circle cx="28" cy="97" r="1.5" fill="#000" />
          </g>
        </svg>
      );

    default:
      return (
        <div className={`${className} flex items-center justify-center bg-amber-50 rounded-2xl border-2 border-amber-200 text-amber-700 font-bold text-lg p-2 text-center`}>
          📚 {name.replace('_', ' ')}
        </div>
      );
  }
};
