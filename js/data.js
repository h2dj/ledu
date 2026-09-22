// 문제 데이터: 화면 코드를 고치지 않고도 이 파일만 수정해서 문항을 추가/변경할 수 있습니다.
// 각 문항: situation(상황 설명, 선택), prompt(질문), choices(선택지 배열, correct 표시), explain(정답 뒤 설명)

const TOPICS = [
  {
    id: "kakao",
    name: "연락처와 카카오톡",
    emoji: "💬",
    questions: [
      {
        situation: "단체방에 새로운 동료를 초대하려고 합니다.",
        prompt: "초대 직전에 무엇을 확인해야 할까요?",
        choices: [
          { text: "초대할 사람 이름과 참여자 명단", correct: true },
          { text: "프로필 사진 색깔", correct: false }
        ],
        explain: "동명이인이나 잘못된 번호가 아닌지 대상자를 다시 확인합니다."
      },
      {
        situation: "모르는 번호로 단체방 초대 메시지가 왔습니다.",
        prompt: "먼저 할 일은 무엇일까요?",
        choices: [
          { text: "바로 참여한다", correct: false },
          { text: "보낸 사람이 아는 사람인지 먼저 확인한다", correct: true }
        ],
        explain: "누가 왜 초대했는지 확인한 뒤 참여 여부를 결정하는 것이 안전합니다."
      },
      {
        situation: "친구 목록에 없는 사람이 사진 파일을 보냈습니다.",
        prompt: "가장 안전한 행동은 무엇일까요?",
        choices: [
          { text: "사진을 눌러 바로 확인한다", correct: false },
          { text: "보낸 사람이 누구인지 먼저 확인한다", correct: true }
        ],
        explain: "모르는 사람이 보낸 파일은 열기 전에 상대가 누구인지부터 확인합니다."
      }
    ]
  },
  {
    id: "security",
    name: "보안과 사기 예방",
    emoji: "🛡️",
    questions: [
      {
        situation: "택배 주소가 틀렸다며 문자 속 인터넷 주소를 누르라고 합니다.",
        prompt: "먼저 할 일은 무엇일까요?",
        choices: [
          { text: "주소를 눌러 확인한다", correct: false },
          { text: "택배사 공식 앱에서 배송 내역을 확인한다", correct: true }
        ],
        explain: "문자 링크로 진위를 확인하지 않습니다. 평소 쓰던 공식 앱이나 대표번호로 따로 확인합니다."
      },
      {
        situation: "아들이 휴대전화가 고장 났다며 새 번호로 상품권을 사 달라고 합니다.",
        prompt: "어떻게 할까요?",
        choices: [
          { text: "원래 알고 있던 아들 번호로 직접 확인한다", correct: true },
          { text: "급해 보이니 먼저 결제한다", correct: false }
        ],
        explain: "가족을 사칭해 급하게 돈이나 개인정보를 요구하는 경우가 많습니다."
      },
      {
        situation: "은행 직원이라며 앱을 설치하면 낮은 금리로 바꿔 준다고 합니다.",
        prompt: "가장 안전한 행동은 무엇일까요?",
        choices: [
          { text: "안내대로 설치한다", correct: false },
          { text: "전화를 끊고 은행 공식 대표번호로 확인한다", correct: true }
        ],
        explain: "전화 상대가 알려 준 번호나 링크가 아니라 공식 경로로 확인합니다."
      },
      {
        situation: "모르는 번호로 무료 쿠폰이라며 인터넷 주소가 담긴 문자가 왔습니다.",
        prompt: "어떻게 할까요?",
        choices: [
          { text: "주소를 눌러 쿠폰을 받는다", correct: false },
          { text: "문자를 삭제하고 누르지 않는다", correct: true }
        ],
        explain: "출처를 알 수 없는 링크는 누르지 않고 바로 삭제하는 것이 안전합니다."
      },
      {
        situation: "공공기관을 사칭해 세금 환급을 해준다며 링크를 누르라고 합니다.",
        prompt: "안전한 행동은 무엇일까요?",
        choices: [
          { text: "링크를 눌러 환급을 신청한다", correct: false },
          { text: "기관 대표번호로 직접 전화해 확인한다", correct: true }
        ],
        explain: "문자나 전화로 온 안내가 아니라 공식 대표번호로 사실인지 확인합니다."
      },
      {
        situation: "택배기사를 사칭한 사람이 전화로 개인정보를 요구합니다.",
        prompt: "어떻게 하는 것이 안전할까요?",
        choices: [
          { text: "요구하는 정보를 알려준다", correct: false },
          { text: "전화를 끊고 가족이나 강사에게 알린다", correct: true }
        ],
        explain: "전화로 개인정보를 요구하면 먼저 끊고, 믿을 수 있는 사람에게 알려 확인합니다."
      }
    ]
  },
  {
    id: "storage",
    name: "휴대폰 용량",
    emoji: "📦",
    questions: [
      {
        situation: "저장 공간이 부족하다는 알림이 떴습니다.",
        prompt: "가장 먼저 확인하기 좋은 것은 무엇일까요?",
        choices: [
          { text: "사진, 동영상 등 앱별 사용량", correct: true },
          { text: "시스템 파일을 모두 삭제", correct: false }
        ],
        explain: "무엇이 용량을 많이 차지하는지 확인한 뒤 불필요한 항목만 지웁니다."
      },
      {
        situation: "사진을 삭제 버튼으로 지웠습니다.",
        prompt: "삭제한 사진은 바로 완전히 사라질까요?",
        choices: [
          { text: "그렇다, 바로 완전히 사라진다", correct: false },
          { text: "아니다, 휴지통에 남아 있어 복구할 수 있다", correct: true }
        ],
        explain: "대부분 일정 기간 휴지통에 남아 있으며, 그 안에서 복구하거나 완전히 지울 수 있습니다."
      },
      {
        situation: "저장 공간을 정리하려고 합니다.",
        prompt: "순서로 알맞은 것은 무엇일까요?",
        choices: [
          { text: "큰 항목 확인 → 불필요한 사진·동영상 삭제 → 휴지통 비우기", correct: true },
          { text: "확인 없이 시스템 파일부터 삭제", correct: false }
        ],
        explain: "무엇이 큰지 먼저 확인하고, 필요 없는 것만 지운 뒤 휴지통까지 정리합니다."
      }
    ]
  },
  {
    id: "ticket",
    name: "승차권",
    emoji: "🚆",
    questions: [
      {
        situation: "승차권을 예매하고 결제 버튼을 누르기 직전입니다.",
        prompt: "다시 볼 내용은 무엇일까요?",
        choices: [
          { text: "출발지, 도착지, 날짜, 시간, 인원", correct: true },
          { text: "휴대폰 배경화면", correct: false }
        ],
        explain: "결제 전에 이용 조건을 한 번에 다시 확인하면 실수를 줄일 수 있습니다."
      },
      {
        situation: "예약한 승차권 정보를 다시 확인하고 싶습니다.",
        prompt: "어디에서 확인해야 할까요?",
        choices: [
          { text: "앱의 예약 내역(티켓함)", correct: true },
          { text: "문자로 온 광고 메시지", correct: false }
        ],
        explain: "예약 내역은 앱 안의 예약 내역 또는 티켓함 메뉴에서 확인합니다."
      },
      {
        situation: "승차권 화면의 좌석 번호가 생각한 것과 다른 것 같습니다.",
        prompt: "먼저 할 일은 무엇일까요?",
        choices: [
          { text: "그냥 탑승한다", correct: false },
          { text: "예약 내역을 다시 확인하고 필요하면 직원에게 문의한다", correct: true }
        ],
        explain: "헷갈릴 때는 예약 내역을 다시 확인하거나 직원에게 도움을 요청하면 됩니다."
      }
    ]
  },
  {
    id: "pictogram",
    name: "픽토그램",
    emoji: "🔣",
    questions: [
      {
        prompt: "톱니바퀴 모양 아이콘은 보통 무엇을 뜻할까요?",
        choices: [
          { text: "설정", correct: true },
          { text: "전화 끊기", correct: false }
        ],
        explain: "톱니바퀴는 앱과 휴대폰의 여러 기능을 바꾸는 설정을 뜻하는 경우가 많습니다."
      },
      {
        prompt: "돋보기 모양 아이콘은 보통 무엇을 뜻할까요?",
        choices: [
          { text: "검색", correct: true },
          { text: "전화 걸기", correct: false }
        ],
        explain: "돋보기 모양은 원하는 내용을 찾는 검색 기능을 나타냅니다."
      },
      {
        prompt: "종 모양 아이콘은 보통 무엇을 뜻할까요?",
        choices: [
          { text: "알림", correct: true },
          { text: "카메라", correct: false }
        ],
        explain: "종 모양은 새로운 소식을 알려주는 알림 기능을 나타냅니다."
      },
      {
        prompt: "왼쪽으로 굽은 화살표 아이콘은 보통 무엇을 뜻할까요?",
        choices: [
          { text: "뒤로 가기", correct: true },
          { text: "설정", correct: false }
        ],
        explain: "왼쪽 화살표는 이전 화면으로 돌아가는 뒤로 가기 기능을 나타냅니다."
      }
    ]
  },
  {
    id: "kiosk",
    name: "키오스크",
    emoji: "🖥️",
    questions: [
      {
        situation: "수량을 잘못 골랐고 뒤에 사람이 기다리고 있습니다.",
        prompt: "어떻게 할까요?",
        choices: [
          { text: "서둘러 결제한다", correct: false },
          { text: "수정 또는 이전을 찾고, 어렵다면 직원에게 도움을 요청한다", correct: true }
        ],
        explain: "천천히 수정해도 괜찮습니다. 도움을 요청하는 것도 올바른 이용 방법입니다."
      },
      {
        situation: "결제 버튼을 누르기 직전입니다.",
        prompt: "화면에서 꼭 확인해야 할 것은 무엇일까요?",
        choices: [
          { text: "선택한 메뉴와 총액", correct: true },
          { text: "매장 인테리어", correct: false }
        ],
        explain: "결제 전에는 선택한 메뉴와 총액이 맞는지 확인하는 것이 중요합니다."
      },
      {
        situation: "화면이 멈추거나 다음 단계를 모르겠습니다.",
        prompt: "가장 안전한 행동은 무엇일까요?",
        choices: [
          { text: "아무 버튼이나 눌러본다", correct: false },
          { text: "취소·도움 버튼을 찾거나 직원에게 요청한다", correct: true }
        ],
        explain: "모를 때는 취소나 도움 버튼을 찾거나 직원에게 요청하면 됩니다."
      },
      {
        situation: "포장 또는 매장 선택 화면에서 실수로 잘못 눌렀습니다.",
        prompt: "어떻게 할까요?",
        choices: [
          { text: "처음부터 다시 결제한다", correct: false },
          { text: "이전 또는 취소 버튼을 찾아 수정한다", correct: true }
        ],
        explain: "대부분 이전이나 취소 버튼으로 바로 수정할 수 있습니다."
      }
    ]
  }
];
