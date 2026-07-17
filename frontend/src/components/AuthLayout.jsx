import './AuthLayout.css';
import lumaIcon from '../assets/luma-icon-v2.png';

const SPIRAL_COUNT = 12;

const TopDownCoffee = () => (
  <svg className="desk-decor desk-decor--coffee" viewBox="0 0 240 240" fill="none" aria-hidden="true">
    <ellipse cx="122" cy="126" rx="118" ry="118" className="coffee-top__shadow" />
    <circle cx="118" cy="118" r="112" className="coffee-top__rim" />
    <circle cx="118" cy="118" r="94" className="coffee-top__coffee" />
    <g className="coffee-top__art">
      <path d="M118 178 V52" />
      <path d="M118 156 L98 144" />
      <path d="M118 156 L138 144" />
      <path d="M118 134 L94 120" />
      <path d="M118 134 L142 120" />
      <path d="M118 112 L92 96" />
      <path d="M118 112 L144 96" />
      <path d="M118 90 L96 74" />
      <path d="M118 90 L140 74" />
      <path d="M118 68 L104 54" />
      <path d="M118 68 L132 54" />
    </g>
    <path d="M222 100 A20 28 0 0 1 222 148" className="coffee-top__handle-shadow" />
    <path d="M220 100 A20 28 0 0 1 220 148" className="coffee-top__handle" />
  </svg>
);

const LEAF_SPOTS = [
  { x: 22, side: -1, tone: 'green' },
  { x: 68, side: 1, tone: 'green' },
  { x: 114, side: -1, tone: 'amber' },
  { x: 160, side: 1, tone: 'green' },
  { x: 206, side: -1, tone: 'greenDark' },
  { x: 252, side: 1, tone: 'green' },
  { x: 298, side: -1, tone: 'amber' },
  { x: 344, side: 1, tone: 'green' },
  { x: 390, side: -1, tone: 'green' },
  { x: 436, side: 1, tone: 'greenDark' }
];

const leafTone = {
  green: 'vine__leaf--green',
  greenDark: 'vine__leaf--green-dark',
  amber: 'vine__leaf--amber'
};

const LeafVine = ({ style, extra }) => (
  <svg
    className={`desk-decor desk-decor--vine ${extra ? 'desk-decor--vine-extra' : ''}`}
    style={style}
    viewBox="0 0 460 90"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M-10 46 C 30 30, 60 58, 96 44 C 132 30, 162 58, 198 44 C 234 30, 264 58, 300 44 C 336 30, 366 58, 402 44 C 424 36, 440 44, 470 38"
      className="vine__stem"
    />
    {LEAF_SPOTS.map((leaf, i) => {
      const tiltBase = leaf.side === 1 ? 30 : -30;
      const tilt = tiltBase + (i % 2 === 0 ? 5 : -5);
      const ly = leaf.side === 1 ? 44 + 15 : 44 - 15;
      return (
        <ellipse
          key={i}
          cx={leaf.x}
          cy={ly}
          rx="13"
          ry="6.5"
          className={`vine__leaf ${leafTone[leaf.tone]}`}
          transform={`rotate(${tilt} ${leaf.x} ${ly})`}
        />
      );
    })}
  </svg>
);

const PostIt = ({ variant, style }) => (
  <svg className={`desk-decor desk-decor--postit postit--${variant}`} style={style} viewBox="0 0 90 90" fill="none" aria-hidden="true">
    <path d="M4 4 H86 V86 H4 Z" className="postit__body" />
    <path d="M86 66 L66 86 V66 Z" className="postit__fold" />
    <path d="M20 26 H60" className="postit__line" />
    <path d="M20 40 H70" className="postit__line" />
    <path d="M20 54 H50" className="postit__line" />
  </svg>
);

const PenDecor = ({ variant, style }) => (
  <svg className={`desk-decor desk-decor--pen pen--${variant}`} style={style} viewBox="0 0 200 32" fill="none" aria-hidden="true">
    <rect x="18" y="8" width="150" height="16" rx="8" className="pen__body" />
    <rect x="14" y="11" width="30" height="10" rx="5" className="pen__clip" />
    <path d="M168 8 L196 16 L168 24 Z" className="pen__tip" />
    <circle cx="196" cy="16" r="2.4" className="pen__nib" />
  </svg>
);

const WashiRoll = ({ style }) => (
  <svg className="desk-decor desk-decor--washi" style={style} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <circle cx="60" cy="60" r="56" className="washi__outer" />
    <circle cx="60" cy="60" r="56" className="washi__pattern" />
    <circle cx="60" cy="60" r="22" className="washi__hole" />
  </svg>
);

const RulerDecor = ({ style }) => (
  <svg className="desk-decor desk-decor--ruler" style={style} viewBox="0 0 260 40" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="256" height="36" rx="4" className="ruler__body" />
    {Array.from({ length: 25 }).map((_, i) => (
      <line
        key={i}
        x1={2 + i * 10.5}
        y1="2"
        x2={2 + i * 10.5}
        y2={i % 5 === 0 ? 16 : 10}
        className="ruler__tick"
      />
    ))}
    <line x1="2" y1="26" x2="258" y2="26" className="ruler__rule" />
  </svg>
);

const PaperclipSmall = ({ style }) => (
  <svg className="desk-decor desk-decor--clip-small" style={style} viewBox="0 0 40 60" fill="none" aria-hidden="true">
    <path
      d="M20 6 C29 6 33 13 33 20 V40 C33 48 27 53 20 53 C13 53 8 48 8 42 V18 C8 13 12 9 17 9 C22 9 25 13 25 18 V38"
      className="clip-small__wire"
    />
  </svg>
);

const CardStack = ({ style }) => (
  <svg className="desk-decor desk-decor--cards" style={style} viewBox="0 0 100 70" fill="none" aria-hidden="true">
    <rect x="8" y="12" width="84" height="52" rx="6" className="cards__back" />
    <rect x="4" y="6" width="84" height="52" rx="6" className="cards__front" />
    <line x1="16" y1="22" x2="64" y2="22" className="cards__line" />
    <line x1="16" y1="34" x2="72" y2="34" className="cards__line" />
    <line x1="16" y1="46" x2="52" y2="46" className="cards__line" />
  </svg>
);

const CornerSticker = () => (
  <div className="corner-sticker">
    <span className="corner-sticker__tape" />
    <div className="corner-sticker__card">
      <img src={lumaIcon} alt="Luma" />
    </div>
  </div>
);

const AuthLayout = ({ eyebrow, title, subtitle, children, footer }) => {
  return (
    <div className="desk">
      <LeafVine />
      <LeafVine
        extra
        style={{
          top: '2%',
          left: 'auto',
          right: '-3%',
          width: '24vw',
          minWidth: '230px',
          maxWidth: '340px',
          transform: 'rotate(-22deg) scaleX(-1)'
        }}
      />
      <LeafVine
        extra
        style={{
          top: '40%',
          left: 'auto',
          right: '-4%',
          width: '20vw',
          minWidth: '200px',
          maxWidth: '300px',
          transform: 'rotate(66deg)'
        }}
      />
      <LeafVine
        extra
        style={{
          top: 'auto',
          bottom: '-3%',
          left: '38%',
          width: '22vw',
          minWidth: '210px',
          maxWidth: '320px',
          transform: 'rotate(8deg)'
        }}
      />

      <div className="desk__props">
        <TopDownCoffee />
        <WashiRoll style={{ bottom: '7%', right: '6%' }} />
        <PostIt variant="amber" style={{ top: '10%', right: '13%', transform: 'rotate(-7deg)' }} />
        <PostIt variant="olive" style={{ top: '17%', right: '6%', transform: 'rotate(5deg)' }} />
        <PostIt variant="terracotta" style={{ bottom: '16%', left: '9%', transform: 'rotate(4deg)' }} />
        <PenDecor variant="olive" style={{ top: '30%', right: '4%', transform: 'rotate(58deg)' }} />
        <PenDecor variant="terracotta" style={{ bottom: '10%', right: '18%', transform: 'rotate(-18deg)' }} />
        <RulerDecor style={{ bottom: '4%', left: '30%', transform: 'rotate(-3deg)' }} />
        <PaperclipSmall style={{ bottom: '30%', left: '4%', transform: 'rotate(-12deg)' }} />
        <PaperclipSmall style={{ top: '46%', right: '2%', transform: 'rotate(20deg) scale(0.85)' }} />
        <CardStack style={{ bottom: '22%', right: '30%', transform: 'rotate(8deg)' }} />
      </div>

      <main className="notebook">
        <CornerSticker />

        <div className="notebook__spiral" aria-hidden="true">
          {Array.from({ length: SPIRAL_COUNT }).map((_, i) => (
            <span key={i} className="notebook__ring" />
          ))}
        </div>

        <div className="notebook__page">
          <span className="notebook__wordmark">Luma</span>

          {eyebrow && <span className="notebook__sticker">{eyebrow}</span>}
          <h1 className="notebook__title">{title}</h1>
          {subtitle && <p className="notebook__subtitle">{subtitle}</p>}

          <div className="notebook__body">{children}</div>
          {footer && <div className="notebook__footer">{footer}</div>}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
