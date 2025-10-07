import type { Locale } from './locales';

type Dict ={ 
    hero: { 
        title: string; 
        subtitle: string; 
        tagline: string; 
    };
    about: {
        title: string; 
        body: string; 
    };
    links: {
        tracker: string;
        contact: string;
        daily: string;
        builds: string;
    };
    footer: {
        madeby: string;
    };
    cube: {
    caption: string; // "Identity cube"
    helper: string;  // "Rotate to read the core"
    face1: string;   // "Builder"
    face2: string;   // "AI Engineer"
    face3: string;   // "Daily Log"
    face4: string;   // "Open Source"
    face5: string;   // "Write & Teach"
    face6: string;   // "Ship Fast"
  };
  snippet: {
    title: string; // "Quick commands"
    sub: string;   // "Minimal tools. Max signal."
  };
  cta: {
  title: string;     // "Strong frame. Soft eyes."
  subtitle: string;  // "Build boldly."
  body: string;      // "This site shares my routine and the tools I trust."
  };
};

export const dictionaries: Record<Locale, Dict> = {
    en: {
    hero: {
      title: 'Gabriel Jung',
      subtitle: 'Full-Stack & AI Engineer · CEO, DoubleJ',
      tagline: 'Building warm, modern tech that connects AI and commerce.',
    },
    about: {
      title: 'About',
      body:
        'KR/US-based engineer & founder focusing on e-commerce and AI services (Oniv, Timora). ' +
        'Work spans scheduling AI, recommender systems, and developer-friendly tooling. ' +
        'Previously collaborated with MFDS and Eduscope AI.',
    },
    links: {
      tracker: 'Open Tracker',
      contact: 'Contact',
      daily: 'Open Daily',
      builds: 'Builds & Notes',
    },
    footer: {
      madeby: 'Designed & built by Gabriel Jung.',
    },
    cube: {
      caption: 'Identity cube',
      helper: 'Rotate to read the core',
      face1: 'Builder',
      face2: 'AI Engineer',
      face3: 'Daily Log',
      face4: 'Open Source',
      face5: 'Write & Teach',
      face6: 'Ship Fast',
    },
    snippet: {
      title: 'Quick commands',
      sub: 'Minimal tools. Max signal.',
    },
    cta: {
      title: 'Strong frame. Soft eyes.',
      subtitle: 'Build boldly.',
      body: 'This site shares my routine and the tools I trust.',
    },
  },

  ko: {
    hero: {
      title: '정재원 (Gabriel Jung)',
      subtitle: '풀스택 & AI 엔지니어 · DoubleJ CEO',
      tagline: 'AI와 이커머스를 잇는 따뜻하고 모던한 기술을 만듭니다.',
    },
    about: {
      title: '소개',
      body:
        '한국/미국 기반의 엔지니어이자 창업가. 이커머스 플랫폼(Oniv)과 대학 시간표 AI(Timora), ' +
        '개인화 추천 등 실용 AI 서비스를 만듭니다. 식약처(MFDS), Eduscope AI 협업 경험 보유.',
    },
    links: {
      tracker: '트래커 열기',
      contact: '연락하기',
      daily: '오늘 열기',
      builds: '빌드 & 노트',
    },
    footer: {
      madeby: 'Designed & built by Gabriel Jung.',
    },
    cube: {
      caption: '정체성 큐브',
      helper: '회전하여 핵심 읽기',
      face1: '빌더',
      face2: 'AI 엔지니어',
      face3: '데일리 로그',
      face4: '오픈 소스',
      face5: '쓰기 & 공유',
      face6: '빠른 배포',
    },
    snippet: {
      title: '퀵 커맨드',
      sub: '도구는 최소, 신호는 최대',
    },
    cta: {
      title: '강한 프레임, 부드러운 눈.',
      subtitle: '과감하게 만든다.',
      body: '이 사이트는 나의 일상과 신뢰하는 도구들을 공유합니다.',
    },

  },
  zh: {
    hero: {
      title: '鄭在原  (Gabriel Jung)',
      subtitle: '全栈与AI工程师 · DoubleJ 首席执行官',
      tagline: '连接 AI 与电商，打造温暖而现代的技术体验。',
    },
    about: {
      title: '简介',
      body:
        '常驻韩国/美国的工程师兼创始人，专注电商与AI服务（Oniv、Timora）。' +
        '经验涵盖排课AI、个性化推荐与开发者工具，曾与韩国食药处(MFDS)与 Eduscope AI 合作。',
    },
    links: {
      tracker: '打开追踪器',
      contact: '联系',
      daily: '打开日记',
      builds: '构建与笔记',
    },
    footer: {
      madeby: 'Designed & built by Gabriel Jung.',
    },
    cube: {
      caption: '身份立方体',
      helper: '旋转以阅读核心',
      face1: '构建者',
      face2: 'AI 工程师',
      face3: '日常记录',
      face4: '开源',
      face5: '写作与分享',
      face6: '快速交付',
    },
    snippet: {
      title: '快速命令',
      sub: '最简工具，最大信号。',
    },
    cta: {
      title: '坚实的框架，温柔的目光。',
      subtitle: '大胆构建。',
      body: '此网站分享我的日常与我信赖的工具。',
    },
  },
};