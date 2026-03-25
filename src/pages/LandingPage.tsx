import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const COMPANIES = [
  { name: "삼성전자", count: "7,119", field: "반도체·디스플레이" },
  { name: "LG전자", count: "2,847", field: "가전·전장" },
  { name: "현대자동차", count: "3,412", field: "자동차·모빌리티" },
  { name: "SK하이닉스", count: "4,203", field: "메모리 반도체" },
];

const HERO_TABS = [
  { label: "요약분석", img: "/screenshots/04_summary_dashboard.png", pos: "0 42%" },
  { label: "특허검색", img: "/screenshots/09_search_results.png", pos: "0 0%" },
  { label: "경쟁사 비교", img: "/screenshots/08_comparison_charts.png", pos: "0 30%" },
  { label: "관심특허", img: "/screenshots/11_favorites.png", pos: "0 0%" },
];

const FEATURES = [
  { icon: "⬡", label: "KIPRIS 실시간 연동", desc: "특허청 공공데이터 직접 연결" },
  { icon: "◈", label: "IPC 분류 시각화", desc: "기술 분야별 분포 차트" },
  { icon: "⊞", label: "출원 추이 분석", desc: "월별·누적 트렌드 한눈에" },
  { icon: "⊙", label: "경쟁사 비교", desc: "최대 5개사 나란히 비교" },
  { icon: "◱", label: "프리셋 재사용", desc: "검색 조건 저장·즉시 재실행" },
];

const SECTIONS = [
  {
    tag: "01 — 요약분석",
    title: "R&D 인텔리전스를\n한눈에",
    desc: "출원인과 기간만 입력하면 총 특허 건수, 등록률, 월평균 출원, 기술 분야 분포를 즉시 시각화합니다. AI 요약 인사이트로 핵심만 빠르게 파악하세요.",
    bullets: [
      "월별 출원 동향 + 누적 추이 차트",
      "IPC 기술 분야 TOP 5 분포",
      "등록 상태 도넛 차트",
      "출원 트렌드·피크월 자동 인사이트",
    ],
    img: "/screenshots/04_summary_dashboard.png",
    imgAlt: "요약분석 대시보드 — 삼성전자 2020~2024",
    imgPos: "0 42%",
    imgHeight: 480,
  },
  {
    tag: "02 — 특허검색",
    title: "7,119건도\n즉시 검색",
    desc: "출원인·기간·상태·IPC 코드로 조건을 조합해 KIPRIS 데이터를 실시간 검색합니다. 결과는 CSV로 내보내거나 관심특허로 저장하세요.",
    bullets: [
      "기본 검색 / 상세 5조건 검색",
      "출원일 정렬·페이지네이션",
      "특허 상세 모달 — 초록·IPC 전체·도면 원문",
      "CSV 내보내기 · 관심특허 즐겨찾기",
    ],
    img: "/screenshots/09_search_results.png",
    imgAlt: "특허 검색 결과 테이블",
    imgPos: "0 0%",
    imgHeight: 420,
  },
  {
    tag: "02-B — 특허 상세",
    title: "초록·IPC·도면\n원문까지",
    desc: "검색 결과 행을 클릭하면 상세 모달이 열립니다. 출원·공개·등록 일정, IPC 전체 분류, 발명의 요약을 한 화면에서 확인하고 도면 원문도 바로 볼 수 있습니다.",
    bullets: [
      "출원 → 공개 → 등록 타임라인",
      "IPC 코드 전체 목록",
      "발명의 요약 전문",
      "KIPRIS 도면 원문 링크",
    ],
    img: "/screenshots/10_patent_modal.png",
    imgAlt: "특허 상세 모달 — 반도체 패키지",
    imgPos: "center 0%",
    imgHeight: 520,
  },
  {
    tag: "03 — 경쟁사 비교",
    title: "최대 5개사\n나란히 비교",
    desc: "여러 회사의 특허 포트폴리오를 같은 기간으로 비교해 기술 경쟁력의 격차를 수치와 차트로 확인합니다.",
    bullets: [
      "총 특허·등록률·월평균 비교 카드",
      "월별 출원 동향 멀티라인 차트",
      "기술 분야별 누적 바 차트",
      "비교 요약 테이블 + CSV 내보내기",
    ],
    img: "/screenshots/08_comparison_charts.png",
    imgAlt: "경쟁사 비교 결과 — 삼성전자 vs LG전자",
    imgPos: "0 30%",
    imgHeight: 420,
  },
  {
    tag: "04 — 분석 인사이트",
    title: "등록률부터\n최근 출원까지",
    desc: "도넛 차트로 공개·등록·거절·취하 비율을 시각화하고, 가장 최근 출원된 특허 목록을 바로 확인할 수 있습니다.",
    bullets: [
      "등록 상태 비율 도넛 차트",
      "최근 출원 특허 카드 목록",
      "IPC 한글명 자동 매핑",
      "전체 보기로 특허검색 연동",
    ],
    img: "/screenshots/05_summary_donut.png",
    imgAlt: "등록 상태 분석 + 최근 출원 특허",
    imgPos: "0 5%",
    imgHeight: 420,
  },
  {
    tag: "05 — 관심특허",
    title: "중요한 특허\n상태 변화 추적",
    desc: "관심 있는 특허를 저장해두면 출원·공개·등록 상태 변화를 한곳에서 관리합니다. 메모를 달아 분석 노트로 활용하고, 저장 목록을 CSV로 내보낼 수 있습니다.",
    bullets: [
      "하트 버튼 한 번으로 즐겨찾기 저장",
      "등록·공개·거절 상태 한눈에 확인",
      "특허별 메모 — 분석 노트 기능",
      "저장 목록 CSV 내보내기",
    ],
    img: "/screenshots/11_favorites.png",
    imgAlt: "관심특허 — 저장된 특허 목록",
    imgPos: "0 0%",
    imgHeight: 420,
  },
];

export default function LandingPage() {
  const [typed, setTyped] = useState("");
  const [compIdx, setCompIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "result" | "deleting">("typing");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const company = COMPANIES[compIdx];
    if (phase === "typing") {
      if (typed.length < company.name.length) {
        const t = setTimeout(() => setTyped(company.name.slice(0, typed.length + 1)), 90);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("result"), 700);
        return () => clearTimeout(t);
      }
    }
    if (phase === "result") {
      const t = setTimeout(() => setPhase("deleting"), 2400);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (typed.length > 0) {
        const t = setTimeout(() => setTyped(typed.slice(0, -1)), 38);
        return () => clearTimeout(t);
      } else {
        setCompIdx((compIdx + 1) % COMPANIES.length);
        setPhase("typing");
      }
    }
  }, [typed, phase, compIdx]);

  const currentCompany = COMPANIES[compIdx];
  const showResult = phase === "result";

  return (
    <div className="l-root">
      {/* NAV */}
      <nav className="l-nav">
        <div className="l-nav-in">
          <span className="l-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="2" fill="#1d4ed8" />
              <rect x="13" y="2" width="9" height="9" rx="2" fill="#1d4ed8" opacity=".45" />
              <rect x="2" y="13" width="9" height="9" rx="2" fill="#1d4ed8" opacity=".45" />
              <rect x="13" y="13" width="9" height="9" rx="2" fill="#1d4ed8" />
            </svg>
            TechLens
          </span>
          <div className="l-nav-links">
            <a href="#features">기능</a>
            <a href="#sections">화면</a>
            <Link to="/login" className="l-nav-cta">데모 체험</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="l-hero">
        <div className="l-hero-in">
          <div className="l-hero-text">
            <span className="l-badge">KIPRIS 공공데이터 기반</span>
            <h1 className="l-h1">
              기업 특허 동향을<br />
              <span className="l-h1-accent">데이터로 읽는다</span>
            </h1>
            <p className="l-hero-sub">
              출원 추이·기술 분야·등록률·경쟁사 비교까지—<br />
              R&amp;D 인텔리전스를 한 화면에서
            </p>
            <div className="l-hero-actions">
              <Link to="/login" className="l-btn-primary">데모 계정으로 체험하기 →</Link>
              <a href="#sections" className="l-btn-ghost">화면 보기</a>
            </div>

            {/* 인터랙티브 검색 데모 */}
            <div className="l-hsearch">
              <div className="l-hsearch-label">라이브 데모</div>
              <div className="l-hsearch-bar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span className="l-hsearch-text">
                  {typed || <span className="l-hsearch-placeholder">회사명 입력...</span>}
                  {!showResult && <span className="l-hsearch-cursor">|</span>}
                </span>
                {showResult && <span className="l-hsearch-enter">Enter ↵</span>}
              </div>
              <div className={`l-hsearch-result${showResult ? " l-hsearch-result-show" : ""}`}>
                <span className="l-hsearch-count">{currentCompany.count}건</span>
                <span className="l-hsearch-field">{currentCompany.field} 관련 특허 검색됨</span>
                <span className="l-hsearch-arrow">→ 차트 생성 중</span>
              </div>
            </div>

            <div className="l-stats">
              <div className="l-stat"><span className="l-stat-v">7,119+</span><span className="l-stat-l">삼성전자 2024년 출원</span></div>
              <div className="l-stat"><span className="l-stat-v">5개</span><span className="l-stat-l">핵심 분석 기능</span></div>
              <div className="l-stat"><span className="l-stat-v">실시간</span><span className="l-stat-l">KIPRIS 데이터 연동</span></div>
            </div>
          </div>
          <div className="l-hero-img-wrap">
            <div className="l-hero-tabs">
              {HERO_TABS.map((tab, i) => (
                <button
                  key={tab.label}
                  className={`l-hero-tab${activeTab === i ? " l-hero-tab-active" : ""}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="l-hero-img-frame">
              {HERO_TABS.map((tab, i) => (
                <img
                  key={tab.label}
                  src={tab.img}
                  alt={tab.label}
                  className={`l-hero-img${activeTab === i ? " l-hero-img-active" : ""}`}
                  style={{ objectPosition: tab.pos }}
                />
              ))}
            </div>
            <div className="l-hero-badge">
              <span>{HERO_TABS[activeTab].label} 화면</span>
              <span className="l-hero-badge-pill">실제 UI</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="l-strip" id="features">
        <div className="l-strip-in">
          {FEATURES.map((f) => (
            <div key={f.label} className="l-strip-item">
              <span className="l-strip-icon">{f.icon}</span>
              <div>
                <div className="l-strip-label">{f.label}</div>
                <div className="l-strip-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE SECTIONS — 설명 위, 이미지 아래 */}
      <section id="sections">
        {SECTIONS.map((s, i) => (
          <div key={s.tag} className={`l-section ${i % 2 === 1 ? "l-section-alt" : ""}`}>
            <div className="l-section-in">
              <div className="l-section-text">
                <span className="l-tag">{s.tag}</span>
                <h2 className="l-section-h2">
                  {s.title.split("\n").map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </h2>
                <p className="l-section-desc">{s.desc}</p>
                <ul className="l-bullets">
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
              <div className="l-section-img-wrap">
                <div className="l-screen-frame">
                  <img
                    src={s.img}
                    alt={s.imgAlt}
                    style={{
                      width: "100%",
                      height: `${s.imgHeight}px`,
                      objectFit: "cover",
                      objectPosition: s.imgPos,
                      display: "block",
                    }}
                  />
                </div>
                <div className="l-img-caption">{s.imgAlt}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SME VALUE PROP */}
      <section className="l-sme">
        <div className="l-sme-in">
          <div className="l-sme-header">
            <span className="l-tag" style={{ color: "#0369a1" }}>중소·중견기업 R&amp;D 팀을 위한</span>
            <h2 className="l-sme-h2">R&amp;D 시작 전,<br /><span className="l-sme-accent">특허 조사부터 빠르게</span></h2>
            <p className="l-sme-desc">복잡한 특허 데이터베이스 없이도 실무진이 직접 경쟁사 특허 동향을 파악하고 의사결정에 활용할 수 있습니다.</p>
          </div>
          <div className="l-sme-cards">
            <div className="l-sme-card">
              <div className="l-sme-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div className="l-sme-card-num">01</div>
              <h3 className="l-sme-card-title">쉬운 특허 검색</h3>
              <p className="l-sme-card-body">출원인 이름만 입력하면 됩니다. IPC 코드·기간·상태 필터로 경쟁사 기술 포트폴리오를 빠르게 좁혀볼 수 있습니다.</p>
            </div>
            <div className="l-sme-card">
              <div className="l-sme-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div className="l-sme-card-num">02</div>
              <h3 className="l-sme-card-title">즉시 차트 시각화</h3>
              <p className="l-sme-card-body">검색 즉시 월별 출원 추이·기술 분야 분포·등록률이 자동으로 차트화됩니다. 보고서용 인사이트를 몇 초 만에 확인하세요.</p>
            </div>
            <div className="l-sme-card">
              <div className="l-sme-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div className="l-sme-card-num">03</div>
              <h3 className="l-sme-card-title">CSV 다운로드 → 엑셀 분석</h3>
              <p className="l-sme-card-body">검색 결과·관심특허 목록을 CSV로 즉시 내보냅니다. 익숙한 엑셀에서 피벗·필터로 추가 수치 분석에 바로 활용하세요.</p>
            </div>
          </div>
          <div className="l-sme-bottom">
            <span className="l-sme-quote">"특허 전문가 없이도 실무진이 직접 R&amp;D 방향을 데이터로 검증할 수 있습니다."</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="l-cta">
        <div className="l-cta-in">
          <p className="l-cta-eyebrow">회원가입 없이 즉시 체험 가능</p>
          <h2 className="l-cta-h2">지금 바로 특허 데이터를<br />분석해보세요</h2>
          <p className="l-cta-sub">데모 계정으로 삼성전자 등 실제 KIPRIS 데이터를 탐색할 수 있습니다.</p>
          <Link to="/login" className="l-cta-btn">데모 계정으로 체험하기 →</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="l-footer">
        <div className="l-footer-in">
          <span className="l-logo" style={{ color: "#9ca3af" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="2" fill="#9ca3af" />
              <rect x="13" y="2" width="9" height="9" rx="2" fill="#9ca3af" opacity=".45" />
              <rect x="2" y="13" width="9" height="9" rx="2" fill="#9ca3af" opacity=".45" />
              <rect x="13" y="13" width="9" height="9" rx="2" fill="#9ca3af" />
            </svg>
            TechLens
          </span>
          <span className="l-footer-copy">© 2025 Woohyun Sim · KIPRIS 공공데이터 기반 특허 인텔리전스 플랫폼</span>
          <Link to="/login" className="l-footer-link">앱 접속 →</Link>
        </div>
      </footer>

      <style>{`
        .l-root {
          font-family: 'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif;
          color: #111827; background: #fff; line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .l-root *, .l-root *::before, .l-root *::after { box-sizing: border-box; }
        .l-root a { text-decoration: none; }

        /* NAV */
        .l-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.96); backdrop-filter: blur(12px);
          border-bottom: 1px solid #e5e7eb;
        }
        .l-nav-in {
          max-width: 1100px; margin: 0 auto; padding: 0 2rem;
          height: 58px; display: flex; align-items: center; justify-content: space-between;
        }
        .l-logo { display: flex; align-items: center; gap: 8px; font-size: .95rem; font-weight: 700; color: #0f172a; letter-spacing: -.02em; }
        .l-nav-links { display: flex; align-items: center; gap: 1.75rem; }
        .l-nav-links a { font-size: .875rem; color: #4b5563; font-weight: 500; transition: color .15s; }
        .l-nav-links a:hover { color: #1d4ed8; }
        .l-nav-cta { background: #1d4ed8 !important; color: #fff !important; padding: .4rem 1rem; border-radius: 6px; font-size: .875rem !important; font-weight: 600 !important; }
        .l-nav-cta:hover { background: #1e40af !important; }

        /* HERO */
        .l-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 5.5rem 2rem 4.5rem; }
        .l-hero-in { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .l-badge { display: inline-block; background: rgba(29,78,216,.25); color: #93c5fd; border: 1px solid rgba(147,197,253,.3); font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: .28rem .75rem; border-radius: 100px; margin-bottom: 1.25rem; }
        .l-h1 { font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 800; color: #fff; line-height: 1.15; letter-spacing: -.03em; margin: 0 0 1.1rem; }
        .l-h1-accent { color: #60a5fa; }
        .l-hero-sub { font-size: 1rem; color: #94a3b8; margin: 0 0 2rem; line-height: 1.75; }
        .l-hero-actions { display: flex; gap: .875rem; flex-wrap: wrap; margin-bottom: 2.25rem; }
        .l-btn-primary { display: inline-flex; align-items: center; background: #1d4ed8; color: #fff; padding: .7rem 1.6rem; border-radius: 7px; font-size: .875rem; font-weight: 600; transition: background .15s, transform .1s; }
        .l-btn-primary:hover { background: #1e40af; transform: translateY(-1px); }
        .l-btn-ghost { display: inline-flex; align-items: center; color: #94a3b8; border: 1px solid rgba(148,163,184,.3); padding: .7rem 1.4rem; border-radius: 7px; font-size: .875rem; font-weight: 500; transition: color .15s; }
        .l-btn-ghost:hover { color: #e2e8f0; }
        .l-stats { display: flex; gap: 1.75rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,.08); }
        .l-stat { display: flex; flex-direction: column; gap: 2px; }
        .l-stat-v { font-size: 1.3rem; font-weight: 700; color: #fff; }
        .l-stat-l { font-size: .72rem; color: #64748b; }
        .l-hero-img-wrap { position: relative; }
        .l-hero-img-frame { position: relative; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); box-shadow: 0 28px 70px rgba(0,0,0,.5); height: 320px; }
        .l-hero-img { width: 100%; height: 100%; object-fit: cover; object-position: 0 42%; display: block; }
        .l-hero-badge { position: absolute; bottom: -12px; left: 20px; background: #1d4ed8; color: #fff; padding: .45rem .9rem; border-radius: 7px; font-size: .78rem; font-weight: 600; display: flex; gap: .65rem; align-items: center; box-shadow: 0 6px 20px rgba(29,78,216,.4); }
        .l-hero-badge-pill { background: rgba(255,255,255,.15); padding: .1rem .45rem; border-radius: 4px; }

        /* HERO TABS */
        .l-hero-tabs { display: flex; gap: .35rem; margin-bottom: .65rem; flex-wrap: wrap; }
        .l-hero-tab { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); color: #94a3b8; font-size: .72rem; font-weight: 600; padding: .3rem .7rem; border-radius: 5px; cursor: pointer; transition: all .18s; }
        .l-hero-tab:hover { background: rgba(255,255,255,.13); color: #e2e8f0; }
        .l-hero-tab-active { background: #1d4ed8 !important; border-color: #1d4ed8 !important; color: #fff !important; }
        .l-hero-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0; transition: opacity .35s ease; }
        .l-hero-img-active { opacity: 1; }

        /* HERO SEARCH DEMO */
        .l-hsearch { margin-bottom: 2.25rem; }
        .l-hsearch-label { font-size: .62rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #475569; margin-bottom: .45rem; }
        .l-hsearch-bar { display: flex; align-items: center; gap: .6rem; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 7px; padding: .6rem .9rem; min-height: 38px; }
        .l-hsearch-text { flex: 1; font-size: .85rem; color: #e2e8f0; font-family: 'SF Mono', 'Menlo', monospace; min-width: 80px; }
        .l-hsearch-placeholder { color: #475569; font-style: italic; font-family: inherit; }
        .l-hsearch-cursor { color: #60a5fa; animation: l-blink .9s step-end infinite; margin-left: 1px; }
        .l-hsearch-enter { font-size: .68rem; color: #60a5fa; background: rgba(96,165,250,.12); border: 1px solid rgba(96,165,250,.25); padding: .15rem .45rem; border-radius: 4px; white-space: nowrap; }
        .l-hsearch-result { display: flex; align-items: center; gap: .65rem; margin-top: .4rem; padding: .45rem .9rem; border-radius: 6px; background: rgba(29,78,216,.18); border: 1px solid rgba(29,78,216,.3); opacity: 0; transform: translateY(-4px); transition: opacity .25s ease, transform .25s ease; pointer-events: none; }
        .l-hsearch-result-show { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .l-hsearch-count { font-size: .9rem; font-weight: 700; color: #60a5fa; }
        .l-hsearch-field { font-size: .78rem; color: #94a3b8; flex: 1; }
        .l-hsearch-arrow { font-size: .72rem; color: #34d399; white-space: nowrap; }
        @keyframes l-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* STRIP */
        .l-strip { background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 1.75rem 2rem; }
        .l-strip-in { max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; }
        .l-strip-item { flex: 1; min-width: 190px; display: flex; align-items: center; gap: .8rem; padding: .875rem 1.25rem; border-right: 1px solid #e2e8f0; }
        .l-strip-item:last-child { border-right: none; }
        .l-strip-icon { font-size: 1.2rem; color: #1d4ed8; flex-shrink: 0; }
        .l-strip-label { font-size: .82rem; font-weight: 600; color: #1e293b; margin-bottom: 1px; }
        .l-strip-desc { font-size: .72rem; color: #6b7280; }

        /* SECTIONS */
        .l-section { padding: 5rem 2rem; }
        .l-section-alt { background: #f8fafc; }
        .l-section-in { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 2.25rem; }
        .l-section-text { }
        .l-tag { display: inline-block; font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #1d4ed8; margin-bottom: .875rem; }
        .l-section-h2 { font-size: clamp(1.6rem, 2.8vw, 2.1rem); font-weight: 800; color: #0f172a; line-height: 1.2; letter-spacing: -.03em; margin: 0 0 1rem; }
        .l-section-desc { font-size: .925rem; color: #4b5563; line-height: 1.75; margin: 0 0 1.4rem; max-width: 620px; }
        .l-bullets { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: .5rem .75rem; }
        .l-bullets li { font-size: .83rem; color: #374151; display: flex; align-items: center; gap: .55rem; }
        .l-bullets li::before { content: ''; display: block; width: 5px; height: 5px; border-radius: 50%; background: #1d4ed8; flex-shrink: 0; }

        /* 이미지 */
        .l-section-img-wrap { width: 100%; }
        .l-screen-frame { border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 16px 48px rgba(0,0,0,.09); width: 100%; }
        .l-img-caption { margin-top: .5rem; font-size: .7rem; color: #9ca3af; text-align: center; }

        /* SME */
        .l-sme { padding: 5.5rem 2rem; background: #eff6ff; border-top: 1px solid #dbeafe; border-bottom: 1px solid #dbeafe; }
        .l-sme-in { max-width: 960px; margin: 0 auto; }
        .l-sme-header { text-align: center; margin-bottom: 3rem; }
        .l-sme-h2 { font-size: clamp(1.6rem, 2.8vw, 2.1rem); font-weight: 800; color: #0f172a; line-height: 1.2; letter-spacing: -.03em; margin: .5rem 0 1rem; }
        .l-sme-accent { color: #1d4ed8; }
        .l-sme-desc { font-size: .9rem; color: #4b5563; line-height: 1.75; max-width: 520px; margin: 0 auto; }
        .l-sme-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .l-sme-card { background: #fff; border: 1px solid #dbeafe; border-radius: 10px; padding: 1.75rem 1.5rem; position: relative; }
        .l-sme-card-icon { width: 40px; height: 40px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
        .l-sme-card-num { font-size: .68rem; font-weight: 700; color: #93c5fd; letter-spacing: .08em; margin-bottom: .5rem; }
        .l-sme-card-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 .625rem; }
        .l-sme-card-body { font-size: .83rem; color: #4b5563; line-height: 1.7; margin: 0; }
        .l-sme-bottom { margin-top: 2.5rem; text-align: center; }
        .l-sme-quote { font-size: .875rem; color: #1d4ed8; font-weight: 500; font-style: italic; }

        /* CTA */
        .l-cta { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 5.5rem 2rem; text-align: center; }
        .l-cta-in { max-width: 580px; margin: 0 auto; }
        .l-cta-eyebrow { font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #60a5fa; margin: 0 0 .875rem; }
        .l-cta-h2 { font-size: clamp(1.6rem, 2.8vw, 2.25rem); font-weight: 800; color: #fff; line-height: 1.2; letter-spacing: -.03em; margin: 0 0 .875rem; }
        .l-cta-sub { font-size: .9rem; color: #94a3b8; margin: 0 0 2.25rem; line-height: 1.7; }
        .l-cta-btn { display: inline-block; background: #1d4ed8; color: #fff; padding: .85rem 2rem; border-radius: 8px; font-size: .95rem; font-weight: 700; transition: background .15s, transform .1s; }
        .l-cta-btn:hover { background: #1e40af; transform: translateY(-2px); }

        /* FOOTER */
        .l-footer { border-top: 1px solid #e5e7eb; padding: 1.4rem 2rem; }
        .l-footer-in { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .75rem; }
        .l-footer-copy { font-size: .78rem; color: #9ca3af; }
        .l-footer-link { font-size: .78rem; color: #1d4ed8; font-weight: 500; }

        /* RESPONSIVE */
        @media (max-width: 800px) {
          .l-hero-in { grid-template-columns: 1fr; gap: 2rem; }
          .l-hero-img-wrap { display: none; }
          .l-bullets { grid-template-columns: 1fr; }
          .l-strip-item { min-width: 46%; border-bottom: 1px solid #e2e8f0; }
          .l-section { padding: 3.5rem 1.25rem; }
          .l-sme-cards { grid-template-columns: 1fr; }
          .l-sme { padding: 3.5rem 1.25rem; }
        }
      `}</style>
    </div>
  );
}
