import { Button } from "@/components/ui/button";

interface TermsModalProps {
  type: "terms" | "privacy";
  onClose: () => void;
}

const TERMS_CONTENT = {
  terms: {
    title: "서비스 이용약관",
    content: `제1조 (목적)
이 약관은 TechLens(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 KIPRIS 공공데이터를 기반으로 특허 검색, 분석, 관리 기능을 제공하는 웹 애플리케이션을 의미합니다.
② "이용자"란 이 약관에 따라 서비스를 이용하는 자를 의미합니다.

제3조 (서비스의 제공)
① 서비스는 다음 기능을 제공합니다.
  - 기업별 특허 검색 및 상세 조회
  - 특허 데이터 요약 분석 (IPC 분류, 출원 추이, 등록 상태)
  - 관심 특허 즐겨찾기 관리
  - 검색 조건 프리셋 저장 및 관리
② 서비스는 KIPRIS Open API를 통해 제공되는 공공데이터를 활용하며, 데이터의 정확성은 KIPRIS에 준합니다.

제4조 (이용자의 의무)
① 이용자는 서비스를 본래 목적에 맞게 사용하여야 합니다.
② 이용자는 타인의 정보를 무단으로 수집하거나 서비스를 악용해서는 안 됩니다.
③ 이용자는 자신의 계정 정보를 안전하게 관리할 책임이 있습니다.

제5조 (면책조항)
① 서비스 제공자는 무료로 제공되는 서비스의 이용과 관련하여 이용자에게 발생한 손해에 대해 책임을 지지 않습니다.
② 서비스 제공자는 KIPRIS API의 장애, 데이터 오류 등 외부 요인에 의한 서비스 중단에 대해 책임을 지지 않습니다.

제6조 (약관의 변경)
서비스 제공자는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 효력이 발생합니다.`,
  },
  privacy: {
    title: "개인정보 처리방침",
    content: `1. 수집하는 개인정보 항목
  - 이메일 주소, 비밀번호(암호화 저장)

2. 개인정보의 수집 및 이용 목적
  - 회원 식별 및 인증
  - 서비스 이용 기록 관리
  - 관심 특허 및 프리셋 데이터 저장

3. 개인정보의 보유 및 이용 기간
  - 회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다.

4. 개인정보의 제3자 제공
  - 수집된 개인정보는 제3자에게 제공하지 않습니다.

5. 개인정보의 안전성 확보 조치
  - 비밀번호는 bcrypt 알고리즘으로 단방향 암호화 저장
  - JWT 기반 인증으로 세션 하이재킹 방지
  - HTTPS 통신으로 데이터 전송 구간 암호화

6. 개인정보 보호 책임자
  - 이메일: wmr06244@naver.com

7. 개인정보 처리방침 변경
  - 본 방침은 서비스 내 공지를 통해 변경될 수 있습니다.`,
  },
};

export default function TermsModal({ type, onClose }: TermsModalProps) {
  const { title, content } = TERMS_CONTENT[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {content}
          </pre>
        </div>
        <div className="px-6 py-4 border-t">
          <Button onClick={onClose} className="w-full">
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
