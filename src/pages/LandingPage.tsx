import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "⬡", label: "KIPRIS 실시간 연동", desc: "특허청 공공데이터 직접 연결" },
  { icon: "◈", label: "IPC 분류 시각화", desc: "기술 분야별 분포 차트" },
  { icon: "⊞", label: "출원 추이 분석", desc: "월별·누적 트렌드 한눈에" },
  { icon: "⊙", label: "경쟁사 비교", desc: "최대 5개사 나란히 비교" },
  { icon: "◱", label: "프리셋 재사용", desc: "검색 조건 저장·즉시 재실행" },
];

const STATS = [
  { value: "7,119+", label: "삼성전자 2024년 출원 건수" },
  { value: "5개", label: "핵심 분석 기능" },
  { value: "실시간", label: "KIPRIS 데이터 연동" },
];

export default function LandingPage() {
  return (
    <div className="landing-root">
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="2" fill="#1d4ed8" />
              <rect x="13" y="2" width="9" height="9" rx="2" fill="#1d4ed8" opacity=".5" />
              <rect x="2" y="13" width="9" height="9" rx="2" fill="#1d4ed8" opacity=".5" />
              <rect x="13" y="13" width="9" height="9" rx="2" fill="#1d4ed8" />
            </svg>
            TechLens
          </span>
          <div className="landing-nav-links">
            <a href="#features">기능</a>
            <a href="#screenshots">화면</a>
            <Link to="/login" className="landing-nav-cta">데모 체험</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-text">
            <span className="landing-badge">KIPRIS 공공데이터 기반</span>
            <h1 className="landing-h1">
              기업 특허 동향을<br />
              <span className="landing-h1-accent">데이터로 읽는다</span>
            </h1>
            <p className="landing-hero-sub">
              출원 추이·기술 분야·등록률·경쟁사 비교까지—<br />
              R&amp;D 인텔리전스를 한 화면에서
            </p>
            <div className="landing-hero-actions">
              <Link to="/login" className="landing-btn-primary">
                데모 계정으로 체험하기
                <span className="landing-btn-arrow">→</span>
              </Link>
              <a href="#screenshots" className="landing-btn-ghost">화면 보기</a>
            </div>
            <div className="landing-stats">
              {STATS.map((s) => (
                <div key={s.label} className="landing-stat">
                  <span className="landing-stat-value">{s.value}</span>
                  <span className="landing-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="landing-hero-img-wrap">
            <div className="landing-hero-img-frame">
              <img
                src="/screenshots/04_summary_dashboard.png"
                alt="요약분석 대시보드"
                className="landing-hero-img"
              />
            </div>
            <div className="landing-hero-img-badge">
              <span>삼성전자 · 2020–2024</span>
              <span className="landing-hero-img-badge-num">2,000건 분석</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE STRIP ───────────────────────────────── */}
      <section className="landing-strip" id="features">
        <div className="landing-strip-inner">
          {FEATURES.map((f) => (
            <div key={f.label} className="landing-strip-item">
              <span className="landing-strip-icon">{f.icon}</span>
              <div>
                <div className="landing-strip-label">{f.label}</div>
                <div className="landing-strip-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCREENSHOTS ─────────────────────────────────── */}
      <section className="landing-screens" id="screenshots">

        {/* 01 — 요약분석 */}
        <div className="landing-feature landing-feature-right">
          <div className="landing-feature-text">
            <span className="landing-feature-tag">01 — 요약분석</span>
            <h2 className="landing-feature-h2">R&amp;D 인텔리전스를<br />한눈에</h2>
            <p className="landing-feature-desc">
              출원인과 기간을 입력하면 총 특허 건수, 등록률, 월평균 출원,
              기술 분야 분포를 즉시 시각화합니다.
              AI 요약 인사이트로 핵심만 빠르게 파악하세요.
            </p>
            <ul className="landing-feature-list">
              <li>월별 출원 동향 + 누적 추이 차트</li>
              <li>IPC 기술 분야 TOP 5 분포</li>
              <li>등록 상태 도넛 차트</li>
              <li>출원 트렌드·피크월 자동 인사이트</li>
            </ul>
          </div>
          <div className="landing-feature-screen">
            <div className="landing-screen-clip landing-screen-clip-summary">
              <img src="/screenshots/04_summary_dashboard.png" alt="요약분석 대시보드" />
            </div>
          </div>
        </div>

        {/* 02 — 특허검색 */}
        <div className="landing-feature landing-feature-left">
          <div className="landing-feature-screen">
            <div className="landing-screen-clip landing-screen-clip-search">
              <img src="/screenshots/06_patent_search.png" alt="특허 검색 결과" />
            </div>
          </div>
          <div className="landing-feature-text">
            <span className="landing-feature-tag">02 — 특허검색</span>
            <h2 className="landing-feature-h2">7,000건도<br />즉시 검색</h2>
            <p className="landing-feature-desc">
              출원인·기간·상태·IPC 코드로 조건을 조합해
              KIPRIS 데이터를 실시간 검색합니다.
              결과는 CSV로 내보내거나 관심특허로 저장하세요.
            </p>
            <ul className="landing-feature-list">
              <li>기본 검색 / 상세 5조건 검색</li>
              <li>출원일 정렬·페이지네이션</li>
              <li>특허 상세 모달 (초록·IPC·상태)</li>
              <li>CSV 내보내기 · 관심특허 저장</li>
            </ul>
          </div>
        </div>

        {/* 03 — 경쟁사 비교 */}
        <div className="landing-feature landing-feature-right">
          <div className="landing-feature-text">
            <span className="landing-feature-tag">03 — 경쟁사 비교</span>
            <h2 className="landing-feature-h2">최대 5개사<br />나란히 비교</h2>
            <p className="landing-feature-desc">
              여러 회사의 특허 포트폴리오를 같은 기간으로 비교해
              기술 경쟁력의 격차를 수치와 차트로 확인합니다.
            </p>
            <ul className="landing-feature-list">
              <li>총 특허·등록률·월평균 비교 카드</li>
              <li>월별 출원 동향 멀티라인 차트</li>
              <li>기술 분야별 누적 바 차트</li>
              <li>비교 요약 테이블 + CSV 내보내기</li>
            </ul>
          </div>
          <div className="landing-feature-screen">
            <div className="landing-screen-clip landing-screen-clip-comparison">
              <img src="/screenshots/08_comparison_charts.png" alt="경쟁사 비교 결과" />
            </div>
          </div>
        </div>

        {/* 04 — 분석 인사이트 */}
        <div className="landing-feature landing-feature-left">
          <div className="landing-feature-screen">
            <div className="landing-screen-clip landing-screen-clip-insight">
              <img src="/screenshots/05_summary_donut.png" alt="등록 상태 분석" />
            </div>
          </div>
          <div className="landing-feature-text">
            <span className="landing-feature-tag">04 — 분석 인사이트</span>
            <h2 className="landing-feature-h2">등록률부터<br />최근 출원까지</h2>
            <p className="landing-feature-desc">
              도넛 차트로 공개·등록·거절·취하 비율을 시각화하고,
              최근 출원 특허 목록을 바로 확인할 수 있습니다.
            </p>
            <ul className="landing-feature-list">
              <li>등록 상태 비율 도넛 차트</li>
              <li>최근 출원 특허 카드 목록</li>
              <li>IPC 한글명 자동 매핑</li>
              <li>전체 보기로 특허검색 연동</li>
            </ul>
          </div>
        </div>

      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <p className="landing-cta-eyebrow">회원가입 없이 즉시 체험 가능</p>
          <h2 className="landing-cta-h2">지금 바로 특허 데이터를<br />분석해보세요</h2>
          <p className="landing-cta-sub">
            데모 계정으로 삼성전자·LG전자 등 실제 KIPRIS 데이터를 탐색할 수 있습니다.
          </p>
          <Link to="/login" className="landing-cta-btn">
            데모 계정으로 체험하기 →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="landing-logo" style={{ color: "#6b7280" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="2" fill="#6b7280" />
              <rect x="13" y="2" width="9" height="9" rx="2" fill="#6b7280" opacity=".5" />
              <rect x="2" y="13" width="9" height="9" rx="2" fill="#6b7280" opacity=".5" />
              <rect x="13" y="13" width="9" height="9" rx="2" fill="#6b7280" />
            </svg>
            TechLens
          </span>
          <span className="landing-footer-copy">
            © 2025 Woohyun Sim · KIPRIS 공공데이터 기반 특허 인텔리전스 플랫폼
          </span>
          <Link to="/login" className="landing-footer-link">앱 접속 →</Link>
        </div>
      </footer>

      <style>{`
        /* ── RESET / BASE ───────────────────────────────── */
        .landing-root {
          font-family: 'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif;
          color: #111827;
          background: #fff;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .landing-root *, .landing-root *::before, .landing-root *::after {
          box-sizing: border-box;
        }
        .landing-root a { text-decoration: none; }

        /* ── NAV ─────────────────────────────────────────── */
        .landing-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e5e7eb;
        }
        .landing-nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 2rem;
          height: 60px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .landing-logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 1rem; font-weight: 700; color: #0f172a;
          letter-spacing: -0.02em;
        }
        .landing-nav-links {
          display: flex; align-items: center; gap: 2rem;
        }
        .landing-nav-links a {
          font-size: 0.875rem; color: #4b5563; font-weight: 500;
          transition: color 0.15s;
        }
        .landing-nav-links a:hover { color: #1d4ed8; }
        .landing-nav-cta {
          background: #1d4ed8 !important; color: #fff !important;
          padding: 0.45rem 1.1rem; border-radius: 6px;
          font-size: 0.875rem !important; font-weight: 600 !important;
          transition: background 0.15s !important;
        }
        .landing-nav-cta:hover { background: #1e40af !important; color: #fff !important; }

        /* ── HERO ────────────────────────────────────────── */
        .landing-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
          padding: 6rem 2rem 5rem;
          overflow: hidden;
        }
        .landing-hero-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem;
          align-items: center;
        }
        .landing-badge {
          display: inline-block;
          background: rgba(29,78,216,0.3); color: #93c5fd;
          border: 1px solid rgba(147,197,253,0.3);
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.3rem 0.8rem; border-radius: 100px;
          margin-bottom: 1.5rem;
        }
        .landing-h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800; color: #fff;
          line-height: 1.15; letter-spacing: -0.03em;
          margin: 0 0 1.25rem;
        }
        .landing-h1-accent { color: #60a5fa; }
        .landing-hero-sub {
          font-size: 1.05rem; color: #94a3b8;
          margin: 0 0 2rem; line-height: 1.7;
        }
        .landing-hero-actions {
          display: flex; gap: 1rem; flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .landing-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #1d4ed8; color: #fff;
          padding: 0.75rem 1.75rem; border-radius: 8px;
          font-size: 0.9rem; font-weight: 600;
          transition: background 0.15s, transform 0.1s;
        }
        .landing-btn-primary:hover { background: #1e40af; transform: translateY(-1px); }
        .landing-btn-arrow { font-size: 1rem; }
        .landing-btn-ghost {
          display: inline-flex; align-items: center;
          color: #94a3b8; border: 1px solid rgba(148,163,184,0.3);
          padding: 0.75rem 1.5rem; border-radius: 8px;
          font-size: 0.9rem; font-weight: 500;
          transition: color 0.15s, border-color 0.15s;
        }
        .landing-btn-ghost:hover { color: #e2e8f0; border-color: rgba(226,232,240,0.4); }
        .landing-stats {
          display: flex; gap: 2rem; padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .landing-stat { display: flex; flex-direction: column; gap: 2px; }
        .landing-stat-value { font-size: 1.4rem; font-weight: 700; color: #fff; }
        .landing-stat-label { font-size: 0.75rem; color: #64748b; }

        /* hero image */
        .landing-hero-img-wrap { position: relative; }
        .landing-hero-img-frame {
          border-radius: 12px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          height: 340px;
        }
        .landing-hero-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: 0 40%;
          display: block;
        }
        .landing-hero-img-badge {
          position: absolute; bottom: -14px; left: 24px;
          background: #1d4ed8; color: #fff;
          padding: 0.5rem 1rem; border-radius: 8px;
          font-size: 0.8rem; font-weight: 600;
          display: flex; gap: 0.75rem; align-items: center;
          box-shadow: 0 8px 24px rgba(29,78,216,0.4);
        }
        .landing-hero-img-badge-num {
          background: rgba(255,255,255,0.15);
          padding: 0.1rem 0.5rem; border-radius: 4px;
        }

        /* ── FEATURE STRIP ───────────────────────────────── */
        .landing-strip {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 2rem;
        }
        .landing-strip-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; gap: 0; flex-wrap: wrap;
        }
        .landing-strip-item {
          flex: 1; min-width: 200px;
          display: flex; align-items: center; gap: 0.875rem;
          padding: 1rem 1.5rem;
          border-right: 1px solid #e2e8f0;
        }
        .landing-strip-item:last-child { border-right: none; }
        .landing-strip-icon {
          font-size: 1.25rem; color: #1d4ed8;
          flex-shrink: 0;
        }
        .landing-strip-label {
          font-size: 0.85rem; font-weight: 600; color: #1e293b;
          margin-bottom: 2px;
        }
        .landing-strip-desc { font-size: 0.75rem; color: #6b7280; }

        /* ── SCREENSHOTS SECTION ─────────────────────────── */
        .landing-screens { padding: 0; }

        .landing-feature {
          max-width: 1200px; margin: 0 auto;
          padding: 6rem 2rem;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: center;
        }
        .landing-feature-right { }
        .landing-feature-left { }
        .landing-feature:nth-child(even) {
          background: #f8fafc;
          max-width: 100%;
          padding-left: calc(50% - 600px + 2rem);
          padding-right: calc(50% - 600px + 2rem);
        }
        .landing-feature-tag {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #1d4ed8;
          margin-bottom: 1rem;
        }
        .landing-feature-h2 {
          font-size: clamp(1.6rem, 3vw, 2.25rem);
          font-weight: 800; color: #0f172a;
          line-height: 1.2; letter-spacing: -0.03em;
          margin: 0 0 1.25rem;
        }
        .landing-feature-desc {
          font-size: 0.95rem; color: #4b5563; line-height: 1.75;
          margin: 0 0 1.5rem;
        }
        .landing-feature-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 0.6rem;
        }
        .landing-feature-list li {
          font-size: 0.875rem; color: #374151;
          display: flex; align-items: center; gap: 0.6rem;
        }
        .landing-feature-list li::before {
          content: ''; display: block;
          width: 6px; height: 6px; border-radius: 50%;
          background: #1d4ed8; flex-shrink: 0;
        }

        /* screen clips */
        .landing-screen-clip {
          border-radius: 10px; overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .landing-screen-clip img {
          display: block; width: 100%;
          object-fit: cover;
        }
        .landing-screen-clip-summary img {
          height: 380px; object-position: 0 45%;
        }
        .landing-screen-clip-search img {
          height: 360px; object-position: 0 20%;
        }
        .landing-screen-clip-comparison img {
          height: 360px; object-position: 0 30%;
        }
        .landing-screen-clip-insight img {
          height: 360px; object-position: 0 5%;
        }

        /* ── CTA ─────────────────────────────────────────── */
        .landing-cta {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
          padding: 6rem 2rem;
          text-align: center;
        }
        .landing-cta-inner { max-width: 640px; margin: 0 auto; }
        .landing-cta-eyebrow {
          font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #60a5fa;
          margin: 0 0 1rem;
        }
        .landing-cta-h2 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800; color: #fff;
          line-height: 1.2; letter-spacing: -0.03em;
          margin: 0 0 1rem;
        }
        .landing-cta-sub {
          font-size: 0.95rem; color: #94a3b8;
          margin: 0 0 2.5rem; line-height: 1.7;
        }
        .landing-cta-btn {
          display: inline-block;
          background: #1d4ed8; color: #fff;
          padding: 0.9rem 2.25rem; border-radius: 8px;
          font-size: 1rem; font-weight: 700;
          transition: background 0.15s, transform 0.1s;
        }
        .landing-cta-btn:hover { background: #1e40af; transform: translateY(-2px); }

        /* ── FOOTER ──────────────────────────────────────── */
        .landing-footer {
          border-top: 1px solid #e5e7eb;
          padding: 1.5rem 2rem;
        }
        .landing-footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
        }
        .landing-footer-copy {
          font-size: 0.8rem; color: #9ca3af;
        }
        .landing-footer-link {
          font-size: 0.8rem; color: #1d4ed8; font-weight: 500;
        }

        /* ── RESPONSIVE ──────────────────────────────────── */
        @media (max-width: 900px) {
          .landing-hero-inner,
          .landing-feature,
          .landing-feature:nth-child(even) {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .landing-feature-left .landing-feature-screen {
            order: -1;
          }
          .landing-hero-img-wrap { display: none; }
          .landing-strip-inner { gap: 0; }
          .landing-strip-item { min-width: 45%; border-bottom: 1px solid #e2e8f0; }
          .landing-stats { gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
