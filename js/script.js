const slider = document.getElementById("heroSlider");
const slides = slider ? Array.from(slider.querySelectorAll(".slide")) : [];
const dotsContainer = document.getElementById("sliderDots");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const languageToggle = document.getElementById("languageToggle");
const testimonialCarousel = document.getElementById("testimonialCarousel");
const testimonialTrack = document.getElementById("testimonialTrack");
const testimonialPrev = document.getElementById("testimonialPrev");
const testimonialNext = document.getElementById("testimonialNext");
const faqList = document.getElementById("faqList");

let activeLanguage = "ar";

const translations = {
  ar: {
    meta: {
      lang: "ar",
      dir: "rtl",
      title: "أكاديمية فصيح | تعلم القرآن أونلاين",
      description:
        "أكاديمية فصيح تساعد غير الناطقين بالعربية على تعلم تلاوة القرآن وحفظه وأساسيات اللغة العربية عبر الإنترنت مع معلمين مؤهلين.",
    },
    brand: "أكاديمية فصيح",
    nav: ["الرئيسية", "من نحن", "البرامج", "من نُعلّم", "لماذا فصيح", "تواصل معنا"],
    navToggleAria: "فتح وإغلاق قائمة التنقل",
    headerCta: "ابدأ التعلم",
    hero: {
      kicker: "أكاديمية قرآن أونلاين للمتعلمين حول العالم",
      title: "تعلم التلاوة والحفظ بثقة وطمأنينة",
      text: "انضم إلى أكاديمية فصيح وابدأ رحلتك في إتقان تلاوة القرآن وحفظه مع معلمين أصحاب خبرة يرافقون غير الناطقين بالعربية خطوة بخطوة حتى يقرأوا القرآن بصورة صحيحة وجميلة.",
      start: "ابدأ رحلتك",
      trial: "احجز حصة تجريبية مجانية",
      dotsAria: "شرائح القسم الرئيسي",
      dotLabelPrefix: "الانتقال إلى الشريحة",
    },
    pyramidAria: "مسار تعليمي من سبع مراحل من أساسيات القراءة حتى التقدم في الحفظ",
    pyramidSteps: [
      "التقدم في الحفظ",
      "فهم معاني القرآن",
      "أساسيات النحو العربي",
      "مفردات قرآنية",
      "أحكام التجويد",
      "المخارج",
      "أساسيات القراءة",
    ],
    about: {
      tag: "عن أكاديمية فصيح",
      title: "رحلة قرآنية هادفة ومؤثرة",
      p1: "أكاديمية فصيح منصة تعليم قرآن أونلاين تهدف إلى تمكين المسلمين حول العالم من قراءة القرآن وحفظه بإتقان. رسالتنا هي جعل تعلم القرآن سهلاً لغير الناطقين بالعربية عبر منهج واضح، ومعلمين مؤهلين، ومتابعة شخصية حقيقية.",
      p2: "نركز على <strong>المبتدئين في تلاوة القرآن</strong>، و<strong>غير الناطقين بالعربية</strong>، والطلاب الذين لديهم أساس ويرغبون في تحسين التلاوة وإتقان التجويد. لا نقدم حالياً برامج الإجازات المتقدمة أو المسارات الموجهة للمجيدين جداً.",
      p3: "رغم أن الأكاديمية تأسست في <strong>2025</strong>، فإن فريقنا يمتلك <strong>خبرة مجتمعة تتجاوز 10 سنوات في تعليم القرآن والعربية لغير الناطقين بها</strong>.",
      p4: "يتم التدريس برواية <strong>حفص عن عاصم</strong>، وهي الرواية الأكثر انتشاراً في العالم الإسلامي.",
      list: ["نطق سليم (تجويد)", "حفظ منظم", "ثقة أثناء التلاوة", "متابعة فردية قريبة"],
    },
    programs: {
      tag: "البرامج",
      title: "اختر البرنامج الأنسب لهدفك",
      cards: [
        {
          title: "تلاوة القرآن (تجويد)",
          text: "تعلم النطق الصحيح وأحكام التلاوة بأسلوب واضح ومتدرج خطوة بخطوة.",
        },
        {
          title: "حفظ القرآن",
          text: "برامج حفظ منظمة تناسب الأطفال واليافعين والكبار.",
        },
        {
          title: "أساسيات العربية للأطفال",
          text: "نبني أساساً قوياً في القراءة العربية حتى يقرأ الطفل بطلاقة عامة ويقترب من قراءة القرآن بثقة أكبر.",
        },
      ],
    },
    who: {
      tag: "من نُعلّم",
      title: "تعلم مناسب لكل طالب",
      cards: ["الأطفال", "النساء", "الرجال", "غير الناطقين بالعربية"],
      p1: "معلماتنا يدعمن <strong>الناطقين بالعربية وغير الناطقين بها</strong> مع حصص مخصصة <strong>للنساء والأطفال</strong>.",
      p2: "ويضم فريقنا كذلك <strong>معلمين رجال</strong> لتدريس <strong>الرجال والأولاد الصغار من الناطقين بالعربية وغير الناطقين بها</strong>.",
      p3: "أكاديمية فصيح مفتوحة للجميع. ورغم أن رسالتنا الأساسية دعم غير الناطقين بالعربية في تعلم القرآن، فإننا نعتز بخدمة المتعلمين العرب وغير العرب.",
      p4: "الدروس متاحة حالياً <strong>باللغتين العربية والإنجليزية</strong>. <strong>ودعم اللغة الألمانية قريباً بإذن الله.</strong>",
    },
    why: {
      tag: "لماذا تختار فصيح",
      title: "تجربة تعليمية موثوقة",
      items: [
        "معلمون متمرسون في تعليم القرآن",
        "أسعار مناسبة جداً",
        "حصص فردية مخصصة لكل طالب",
        "مواعيد أونلاين مرنة",
        "دعم خاص لغير الناطقين بالعربية",
        "بيئة مشجعة ولطيفة",
      ],
      text: "معظم معلمينا حاصلون على شهادات في تعليم القرآن، وبعضهم قد لا يحمل شهادة رسمية لكنه يمتلك خبرة عملية طويلة ومثبتة في تعليم غير الناطقين بالعربية. فريقنا متمكن في تحسين النطق والتجويد، كما يتخصص بعض المعلمين في تعليم الأطفال من مختلف الخلفيات اللغوية.",
    },
    pricing: {
      tag: "الأسعار",
      title: "خطط مرنة ومبهجة لكل أسرة",
      text: "اختَر الخطة التي تناسب جدولك الأسبوعي وهدفك التعليمي. جميع الحصص أونلاين، فردية، ومصممة لتقدم واضح ومشجّع.",
      womenBadge: "خطط النساء",
      womenDuration: "مدة الحصة: ساعة واحدة",
      childrenBadge: "خطط الأطفال",
      childrenDuration: "مدة الحصة: 30 دقيقة (أو ساعة عند الطلب)",
      womenPlans: [
        { title: "الخطة الأساسية", text: "حصتان أسبوعياً (8 حصص شهرياً)", price: "$40 / 150 AED" },
        { title: "الخطة القياسية", text: "3 حصص أسبوعياً (12 حصة شهرياً)", price: "$60 / 220 AED" },
        { title: "الخطة المكثفة", text: "4 حصص أسبوعياً (16 حصة شهرياً)", price: "$80 / 300 AED" },
      ],
      childrenPlans: [
        { title: "الخطة القياسية", text: "3 حصص أسبوعياً (12 حصة شهرياً)", price: "$30 / 110 AED" },
        { title: "الخطة المكثفة", text: "4 حصص أسبوعياً (16 حصة شهرياً)", price: "$40 / 150 AED" },
        { title: "الخطة المكثفة جداً", text: "5 حصص أسبوعياً (20 حصة شهرياً)", price: "$50 / 185 AED" },
      ],
      womenNotes: [
        "<strong>المواد:</strong> حفظ القرآن، التجويد، واللغة العربية",
        "<strong>النظام:</strong> حصص فردية أونلاين",
        "<strong>مناسب لـ:</strong> النساء والأطفال وغير الناطقين بالعربية",
      ],
      childrenNotes: [
        "أسلوب مبسط وممتع يناسب الأطفال",
        "حفظ القرآن + أساسيات التجويد + بناء أساس قوي في القراءة العربية",
        "حصص فردية أونلاين",
      ],
    },
    testimonials: {
      tag: "آراء الطلاب",
      title: "ماذا يقول طلابنا",
      carouselAria: "سلايدر تقييمات الطلاب",
      prevAria: "التقييم السابق",
      nextAria: "التقييم التالي",
      entries: [
        {
          text: "\"المعلمون رائعون وصبورون جداً مع المبتدئين. خلال أسابيع قليلة أصبحت تلاوتي أوضح، وعرفت الأخطاء التي كنت أكررها في التجويد. أسلوب الدرس بسيط ومركز وسهل المتابعة.\"",
          name: "عمر، المملكة المتحدة",
        },
        {
          text: "\"بعد سنوات من المحاولة وحدي، أخيراً ضبطت النطق الصحيح. المعلمة كانت تصحح كل حرف خطوة بخطوة وتعطيني واجبات عملية أحدثت فرقاً واضحاً.\"",
          name: "فاطمة، كندا",
        },
        {
          text: "\"الأكاديمية ممتازة لغير الناطقين بالعربية الذين يريدون تعلماً صحيحاً في بيئة داعمة. الشرح واضح ومخصص، وأشعر بتقدم ثابت كل شهر.\"",
          name: "يوسف، الولايات المتحدة",
        },
        {
          text: "\"الحصص الفردية ساعدتني أصلح أخطاء التجويد بسرعة. أعجبني توازن المعلمة بين التصحيح والتشجيع، وهذا خلاني أستمر بحماس.\"",
          name: "عائشة، ألمانيا",
        },
        {
          text: "\"ابني صار أكثر ثقة في التلاوة بعد حصص أسبوعية مركزة. المعلم هادئ ويعرف كيف يتعامل مع الأطفال بطريقة مشوقة ومنضبطة.\"",
          name: "حسن، مصر",
        },
        {
          text: "\"الشرح الواضح وطريقة التصحيح العملية ساعدتني أحسن التجويد بسرعة. كذلك المواعيد المرنة مناسبة جداً مع العمل والأسرة.\"",
          name: "زينب، تركيا",
        },
      ],
      submitText: "تحب تشاركنا تجربتك مع أكاديمية فصيح؟",
      submitBtn: "أضف تقييمك",
    },
    faq: {
      tag: "الأسئلة الشائعة",
      title: "الأسئلة الشائعة",
      items: [
        {
          q: "هل أقدر أجرب حصة قبل الاشتراك؟",
          a: "نعم. نوفر حصة تجريبية مجانية حتى تتعرف على المعلم وطريقة الشرح وتتأكد أن الأسلوب مناسب لهدفك.",
        },
        {
          q: "أنا مبتدئ، هل الأكاديمية مناسبة لي؟",
          a: "بالتأكيد. أكاديمية فصيح مصممة للمبتدئين وغير الناطقين بالعربية بأسلوب تدريجي يبني الثقة في التلاوة.",
        },
        {
          q: "هل لازم أعرف عربي قبل ما أبدأ؟",
          a: "لا. الدروس تُقدَّم بالعربية والإنجليزية، والمعلمون يشرحون النطق والتجويد بشكل واضح لغير الناطقين بالعربية.",
        },
        {
          q: "كيف يتم ترتيب مواعيد الحصص الأسبوعية؟",
          a: "معظم الطلاب يحضرون عدة حصص أسبوعياً. الجدول مرن ويتم ترتيبه حسب وقتك وتوفر المعلم.",
        },
        {
          q: "ما الفئات العمرية التي تدرسونها؟",
          a: "نُعلّم الأطفال والنساء والرجال، وبعض المعلمين متخصصون في تعليم الأطفال من خلفيات لغوية مختلفة.",
        },
        {
          q: "أي رواية تُدرَّس في الأكاديمية؟",
          a: "التدريس في الأكاديمية يكون برواية حفص عن عاصم، وهي الرواية الأكثر انتشاراً في العالم.",
        },
        {
          q: "هل ممكن آخذ حصص تجويد فقط بدون برنامج كامل؟",
          a: "نعم. يمكنك حجز حصص فردية مركزة لتصحيح النطق وتحسين التجويد فقط.",
        },
      ],
    },
    cta: {
      title: "ابدأ رحلتك مع القرآن اليوم",
      text: "احجز <strong>حصتك التجريبية المجانية</strong> وابدأ التعلم مع معلمين أصحاب خبرة.",
      button: "راسلنا على واتساب",
    },
    footer: {
      aboutTitle: "أكاديمية فصيح",
      aboutText:
        "تعليم قرآن أونلاين باحترافية للمبتدئين وغير الناطقين بالعربية، مع تركيز على تحسين التجويد، وبناء أساس الحفظ، وتنمية الفهم اللغوي.",
      linksTitle: "روابط سريعة",
      links: ["من نحن", "البرامج", "من نُعلّم", "تواصل معنا"],
      contactTitle: "تواصل",
      whatsapp: "واتساب",
      facebook: "فيسبوك",
      location: "المقر الحالي: القاهرة، مصر - والتوسع قريباً إلى أبوظبي، الإمارات.",
      copyright: "© 2025 أكاديمية فصيح - جميع الحقوق محفوظة.",
    },
    langButton: "English",
    langButtonAria: "Switch to English",
  },
  en: {
    meta: {
      lang: "en",
      dir: "ltr",
      title: "Faseeh Academy | Online Quran Learning",
      description:
        "Faseeh Academy helps non-Arabic speakers learn Quran recitation, memorization, and Arabic basics online with qualified teachers.",
    },
    brand: "Faseeh Academy",
    nav: ["Home", "About", "Programs", "Teachers", "Why Faseeh", "Contact"],
    navToggleAria: "Toggle navigation menu",
    headerCta: "Start Learning",
    hero: {
      kicker: "Online Quran Academy For Global Learners",
      title: "Learn to Recite and Memorize the Quran with Confidence",
      text: "Join Faseeh Academy and begin your journey to mastering Quran recitation and memorization with experienced teachers dedicated to helping non-Arabic speakers understand and recite the Quran beautifully.",
      start: "Start Your Journey",
      trial: "Book a Free Trial Class",
      dotsAria: "Hero slides",
      dotLabelPrefix: "Go to slide",
    },
    pyramidAria: "Seven-stage learning path from Quran reading foundations to guided hifz achievement",
    pyramidSteps: [
      "Hifz Progress",
      "Quran Understanding",
      "Basic Arabic Grammar",
      "Quran Vocabulary",
      "Tajweed Rules",
      "Makharij",
      "Reading Basics",
    ],
    about: {
      tag: "About Faseeh Academy",
      title: "Dedicated To Meaningful Quran Learning",
      p1: "Faseeh Academy is an online Quran learning platform dedicated to helping Muslims around the world recite and memorize the Quran correctly. Our mission is to make Quran learning accessible to non-Arabic speakers through structured lessons, qualified teachers, and personalized guidance.",
      p2: "We focus on <strong>beginners learning Quran recitation</strong>, <strong>non-Arabic speakers</strong>, and students with basic recitation who want to improve and master Tajweed. We do not specialize in advanced ijazah programs or certification tracks for already highly proficient reciters.",
      p3: "Although the academy was established in <strong>2025</strong>, our teachers collectively bring <strong>over 10 years of experience teaching Quran and Arabic to non-Arabic speakers</strong>.",
      p4: "Teaching is done in <strong>Riwayat Hafs 'An Asim</strong>, the most widely recited narration of the Quran worldwide.",
      list: ["Correct pronunciation (Tajweed)", "Structured memorization (Hifz)", "Confidence in recitation", "Personal mentorship"],
    },
    programs: {
      tag: "Programs",
      title: "Choose The Program That Fits Your Goal",
      cards: [
        {
          title: "Quran Recitation (Tajweed)",
          text: "Learn correct pronunciation and recitation rules with clear, step-by-step guidance.",
        },
        {
          title: "Quran Memorization (Hifz)",
          text: "Structured memorization programs designed for children, youth, and adults.",
        },
        {
          title: "Arabic Foundations for Children",
          text: "Build strong Arabic reading foundations so children can read fluently in general and approach Quran reading with confidence.",
        },
      ],
    },
    who: {
      tag: "Who We Teach",
      title: "Inclusive Learning For Every Student",
      cards: ["Children", "Women", "Men", "Non-Arabic Speakers"],
      p1: "Our female teachers support <strong>Arabic and non-Arabic speakers</strong>, with dedicated classes for <strong>women and children</strong>.",
      p2: "Our team also includes <strong>male teachers</strong> who teach <strong>Arabic and non-Arabic speaking men and young boys</strong>.",
      p3: "Faseeh Academy is open to everyone. While our main mission is helping non-Arabic speakers access Quran learning, we proudly serve both Arabic and non-Arabic learners.",
      p4: "Lessons are currently conducted in <strong>English and Arabic</strong>. <strong>German language support is coming soon.</strong>",
    },
    why: {
      tag: "Why Choose Faseeh",
      title: "A Trusted Learning Experience",
      items: [
        "Experienced Quran Teachers",
        "Very affordable prices",
        "Personalized One-on-One Classes",
        "Flexible Online Schedule",
        "Support for Non-Arabic Speakers",
        "Friendly and Encouraging Environment",
      ],
      text: "Most of our teachers are certified Quran instructors. Some may not hold formal certification but bring many years of proven experience teaching Quran to non-Arabic speakers. Our team is highly skilled in improving pronunciation and Tajweed, and some teachers specialize in teaching children from both Arabic and non-Arabic backgrounds.",
    },
    pricing: {
      tag: "Pricing",
      title: "Bright, Flexible Plans For Every Family",
      text: "Pick the plan that fits your weekly routine and learning goals. All classes are online, one-on-one, and designed to keep progress clear and encouraging.",
      womenBadge: "Women Plans",
      womenDuration: "1 hour per session",
      childrenBadge: "Children Plans",
      childrenDuration: "30 minutes per session (or 1 hour upon request)",
      womenPlans: [
        { title: "Basic Plan", text: "2 sessions per week (8 sessions/month)", price: "$40 / 150 AED" },
        { title: "Standard Plan", text: "3 sessions per week (12 sessions/month)", price: "$60 / 220 AED" },
        { title: "Intensive Plan", text: "4 sessions per week (16 sessions/month)", price: "$80 / 300 AED" },
      ],
      childrenPlans: [
        { title: "Standard Plan", text: "3 sessions per week (12 sessions/month)", price: "$30 / 110 AED" },
        { title: "Intensive Plan", text: "4 sessions per week (16 sessions/month)", price: "$40 / 150 AED" },
        { title: "Super Intensive Plan", text: "5 sessions per week (20 sessions/month)", price: "$50 / 185 AED" },
      ],
      womenNotes: [
        "<strong>Subjects:</strong> Quran memorization, Tajweed, and Arabic",
        "<strong>Format:</strong> Online one-on-one classes",
        "<strong>For:</strong> Women, children, and non-Arabic speakers",
      ],
      childrenNotes: [
        "Fun and simple teaching style for kids",
        "Quran memorization + basic Tajweed + building Arabic reading foundations",
        "Online one-on-one classes",
      ],
    },
    testimonials: {
      tag: "Testimonials",
      title: "What Our Students Say",
      carouselAria: "Student reviews slider",
      prevAria: "Previous testimonial",
      nextAria: "Next testimonial",
      entries: [
        {
          text: "\"Excellent teachers who are very patient with beginners. In just a few weeks, my recitation became clearer and I finally understood where I was making repeated Tajweed mistakes. The class structure is simple, focused, and easy to follow.\"",
          name: "Omar, UK",
        },
        {
          text: "\"I finally learned correct pronunciation after years of trying on my own. My teacher corrected each letter step by step and gave practical homework that made a real difference between classes. I now read with much more confidence.\"",
          name: "Fatima, Canada",
        },
        {
          text: "\"This academy is perfect for non-Arabic speakers who want proper Quran learning in a supportive environment. Lessons are personalized, and the teacher always explains both the rule and the reason behind it. I can feel steady progress every month.\"",
          name: "Yusuf, USA",
        },
        {
          text: "\"The one-on-one format helped me correct common Tajweed mistakes quickly. I appreciated how the teacher balanced correction with encouragement, which kept me motivated. It feels professional yet very personal.\"",
          name: "Aisha, Germany",
        },
        {
          text: "\"My son became more confident in reciting after a few focused weekly lessons. The teacher is calm, kind, and knows how to keep children engaged while still maintaining discipline in class. We are very happy with his progress.\"",
          name: "Hassan, Egypt",
        },
        {
          text: "\"Supportive teachers and clear correction methods helped me improve my Tajweed quickly. I also appreciate the flexible schedule because it fits around work and family life. The academy has been consistent and reliable from day one.\"",
          name: "Zeynep, Turkey",
        },
      ],
      submitText: "Would you like to share your own experience with Faseeh Academy?",
      submitBtn: "Leave a Review",
    },
    faq: {
      tag: "Frequently Asked Questions",
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Can I try a class before committing?",
          a: "Yes. We offer a free trial class so you can meet your teacher, understand the method, and confirm the class style fits your goals.",
        },
        {
          q: "I am a beginner. Is this academy suitable for me?",
          a: "Absolutely. Faseeh Academy is designed for beginners and non-Arabic speakers, with step-by-step support to build confidence in recitation.",
        },
        {
          q: "Do I need to know Arabic before joining?",
          a: "No. Lessons are delivered in English and Arabic, and teachers explain pronunciation and Tajweed clearly for non-Arabic speakers.",
        },
        {
          q: "How are classes scheduled each week?",
          a: "Most students take a few focused sessions per week. Scheduling is flexible and arranged based on teacher availability and your routine.",
        },
        {
          q: "What age groups do you teach?",
          a: "We teach children, women, and men. Some teachers specialize in children from both Arabic and non-Arabic backgrounds.",
        },
        {
          q: "Which riwayah do you teach in?",
          a: "We teach in Riwayat Hafs 'An Asim, the most widely recited narration of the Quran across the world.",
        },
        {
          q: "Can I take classes just to improve Tajweed without a full program?",
          a: "Yes. You can book a set of focused one-on-one lessons specifically for pronunciation correction and Tajweed improvement.",
        },
      ],
    },
    cta: {
      title: "Start Your Quran Journey Today",
      text: "Book your <strong>free trial class</strong> and begin learning Quran with experienced teachers.",
      button: "Message Us on WhatsApp",
    },
    footer: {
      aboutTitle: "Faseeh Academy",
      aboutText:
        "Professional online Quran education for beginners and non-Arabic speakers, focused on Tajweed improvement, Hifz foundations, and Arabic understanding.",
      linksTitle: "Quick Links",
      links: ["About", "Programs", "Teachers", "Contact"],
      contactTitle: "Contact",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      location: "Currently based in Cairo, Egypt - expanding soon to Abu Dhabi, UAE.",
      copyright: "© 2025 Faseeh Academy - All rights reserved.",
    },
    langButton: "العربية",
    langButtonAria: "التبديل إلى العربية",
  },
};

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function setHtml(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = value;
  }
}

function setAttribute(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

function refreshOpenFaqHeight() {
  const expanded = faqList ? faqList.querySelector('.faq-question[aria-expanded="true"]') : null;
  if (expanded && expanded.nextElementSibling) {
    expanded.nextElementSibling.style.maxHeight = `${expanded.nextElementSibling.scrollHeight}px`;
  }
}

function applyLanguage(lang) {
  const copy = translations[lang];
  if (!copy) {
    return;
  }

  activeLanguage = lang;
  document.documentElement.lang = copy.meta.lang;
  document.documentElement.dir = copy.meta.dir;
  document.title = copy.meta.title;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", copy.meta.description);
  }

  setText(".brand-text", copy.brand);
  setAttribute(".nav-toggle", "aria-label", copy.navToggleAria);

  document.querySelectorAll(".nav-links a").forEach((link, index) => {
    if (copy.nav[index]) {
      link.textContent = copy.nav[index];
    }
  });

  setText(".nav-cta", copy.headerCta);
  setText(".hero-kicker", copy.hero.kicker);
  setText(".hero-content h1", copy.hero.title);
  setText(".hero-content > p", copy.hero.text);
  setText(".hero-actions .btn-primary", copy.hero.start);
  setText(".hero-actions .btn-secondary", copy.hero.trial);
  setAttribute("#sliderDots", "aria-label", copy.hero.dotsAria);
  document.querySelectorAll("#sliderDots .slider-dot").forEach((dot, index) => {
    dot.setAttribute("aria-label", `${copy.hero.dotLabelPrefix} ${index + 1}`);
  });
  setAttribute(".learning-pyramid", "aria-label", copy.pyramidAria);

  document.querySelectorAll(".learning-pyramid .step-title").forEach((step, index) => {
    if (copy.pyramidSteps[index]) {
      step.textContent = copy.pyramidSteps[index];
    }
  });

  setText(".about .section-tag", copy.about.tag);
  setText(".about h2", copy.about.title);
  setHtml(".about-content p:nth-of-type(2)", copy.about.p1);
  setHtml(".about-content p:nth-of-type(3)", copy.about.p2);
  setHtml(".about-content p:nth-of-type(4)", copy.about.p3);
  setHtml(".about-content p:nth-of-type(5)", copy.about.p4);

  document.querySelectorAll(".about-content .clean-list li").forEach((item, index) => {
    if (copy.about.list[index]) {
      item.textContent = copy.about.list[index];
    }
  });

  setText(".programs .section-tag", copy.programs.tag);
  setText(".programs .section-title", copy.programs.title);
  document.querySelectorAll(".programs .card").forEach((card, index) => {
    const data = copy.programs.cards[index];
    if (!data) {
      return;
    }
    const title = card.querySelector("h3");
    const text = card.querySelector("p");
    if (title) {
      title.textContent = data.title;
    }
    if (text) {
      text.textContent = data.text;
    }
  });

  setText(".who-teach .section-tag", copy.who.tag);
  setText(".who-teach .section-title", copy.who.title);
  document.querySelectorAll(".who-teach .icon-cards .card h3").forEach((heading, index) => {
    if (copy.who.cards[index]) {
      heading.textContent = copy.who.cards[index];
    }
  });
  setHtml(".who-text p:nth-of-type(1)", copy.who.p1);
  setHtml(".who-text p:nth-of-type(2)", copy.who.p2);
  setHtml(".who-text p:nth-of-type(3)", copy.who.p3);
  setHtml(".who-text p:nth-of-type(4)", copy.who.p4);

  setText(".why .section-tag", copy.why.tag);
  setText(".why .section-title", copy.why.title);
  document.querySelectorAll(".feature-grid .feature-item").forEach((item, index) => {
    if (copy.why.items[index]) {
      item.textContent = copy.why.items[index];
    }
  });
  setText(".teacher-quality", copy.why.text);

  setText(".pricing .section-tag", copy.pricing.tag);
  setText(".pricing .section-title", copy.pricing.title);
  setText(".pricing .pricing-text", copy.pricing.text);
  setText(".pricing-group-women .pricing-badge", copy.pricing.womenBadge);
  setText(".pricing-group-women .pricing-group-head p", copy.pricing.womenDuration);
  setText(".pricing-group-children .pricing-badge", copy.pricing.childrenBadge);
  setText(".pricing-group-children .pricing-group-head p", copy.pricing.childrenDuration);

  document.querySelectorAll(".pricing-group-women .plan-card").forEach((card, index) => {
    const data = copy.pricing.womenPlans[index];
    if (!data) {
      return;
    }
    const title = card.querySelector("h3");
    const text = card.querySelector("p:not(.plan-price)");
    const price = card.querySelector(".plan-price");
    if (title) {
      title.textContent = data.title;
    }
    if (text) {
      text.textContent = data.text;
    }
    if (price) {
      price.textContent = data.price;
    }
  });

  document.querySelectorAll(".pricing-group-children .plan-card").forEach((card, index) => {
    const data = copy.pricing.childrenPlans[index];
    if (!data) {
      return;
    }
    const title = card.querySelector("h3");
    const text = card.querySelector("p:not(.plan-price)");
    const price = card.querySelector(".plan-price");
    if (title) {
      title.textContent = data.title;
    }
    if (text) {
      text.textContent = data.text;
    }
    if (price) {
      price.textContent = data.price;
    }
  });

  document.querySelectorAll(".pricing-group-women .pricing-notes p").forEach((note, index) => {
    if (copy.pricing.womenNotes[index]) {
      note.innerHTML = copy.pricing.womenNotes[index];
    }
  });

  document.querySelectorAll(".pricing-group-children .pricing-notes p").forEach((note, index) => {
    if (copy.pricing.childrenNotes[index]) {
      note.textContent = copy.pricing.childrenNotes[index];
    }
  });

  setText(".testimonials .section-tag", copy.testimonials.tag);
  setText(".testimonials .section-title", copy.testimonials.title);
  setAttribute("#testimonialCarousel", "aria-label", copy.testimonials.carouselAria);
  setAttribute("#testimonialPrev", "aria-label", copy.testimonials.prevAria);
  setAttribute("#testimonialNext", "aria-label", copy.testimonials.nextAria);

  document.querySelectorAll(".testimonial-track .t-slide").forEach((slide, index) => {
    const data = copy.testimonials.entries[index % copy.testimonials.entries.length];
    if (!data) {
      return;
    }
    const text = slide.querySelector("p");
    const name = slide.querySelector("h3");
    if (text) {
      text.textContent = data.text;
    }
    if (name) {
      name.textContent = data.name;
    }
  });

  setText(".testimonial-submit-box p", copy.testimonials.submitText);
  setText(".testimonial-submit-box .btn", copy.testimonials.submitBtn);

  setText(".faq .section-tag", copy.faq.tag);
  setText(".faq .section-title", copy.faq.title);
  document.querySelectorAll(".faq-item").forEach((item, index) => {
    const data = copy.faq.items[index];
    if (!data) {
      return;
    }
    const questionText = item.querySelector(".faq-question span:first-child");
    const answerText = item.querySelector(".faq-answer p");
    if (questionText) {
      questionText.textContent = data.q;
    }
    if (answerText) {
      answerText.textContent = data.a;
    }
  });

  setText(".cta h2", copy.cta.title);
  setHtml(".cta .cta-box p", copy.cta.text);
  setText(".cta .btn", copy.cta.button);

  setText(".footer-grid > div:nth-child(1) h3", copy.footer.aboutTitle);
  setText(".footer-grid > div:nth-child(1) p", copy.footer.aboutText);
  setText(".footer-grid > div:nth-child(2) h3", copy.footer.linksTitle);
  setText(".footer-grid > div:nth-child(3) h3", copy.footer.contactTitle);

  document.querySelectorAll(".footer-grid > div:nth-child(2) .footer-links a").forEach((link, index) => {
    if (copy.footer.links[index]) {
      link.textContent = copy.footer.links[index];
    }
  });

  setText(".footer-grid > div:nth-child(3) .footer-links li:nth-child(1) a", copy.footer.whatsapp);
  const facebookText = document.querySelector(".footer-grid > div:nth-child(3) .footer-links li:nth-child(2) a");
  if (facebookText) {
    facebookText.innerHTML = '<span class="social-icon" aria-hidden="true">f</span>' + copy.footer.facebook;
  }
  setText(".footer-grid > div:nth-child(3) .footer-links li:nth-child(4)", copy.footer.location);
  setText(".footer-bottom p", copy.footer.copyright);

  if (languageToggle) {
    languageToggle.textContent = copy.langButton;
    languageToggle.setAttribute("aria-label", copy.langButtonAria);
  }

  refreshOpenFaqHeight();
}

let currentIndex = 0;
let timerId;

function setSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll(".slider-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  currentIndex = index;
}

function nextSlide() {
  const nextIndex = (currentIndex + 1) % slides.length;
  setSlide(nextIndex);
}

function startSlider() {
  if (slides.length <= 1) {
    return;
  }
  timerId = setInterval(nextSlide, 4000);
}

function stopSlider() {
  clearInterval(timerId);
}

if (slides.length && dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

    dot.addEventListener("click", () => {
      stopSlider();
      setSlide(index);
      startSlider();
    });

    dotsContainer.appendChild(dot);
  });

  setSlide(0);
  startSlider();

  slider.addEventListener("mouseenter", stopSlider);
  slider.addEventListener("mouseleave", startSlider);
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("open", !isExpanded);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("open");
    });
  });
}

if (testimonialTrack) {
  const baseSlides = Array.from(testimonialTrack.querySelectorAll(".t-slide"));

  if (baseSlides.length > 1) {
    const firstClone = baseSlides[0].cloneNode(true);
    const lastClone = baseSlides[baseSlides.length - 1].cloneNode(true);

    testimonialTrack.appendChild(firstClone);
    testimonialTrack.insertBefore(lastClone, testimonialTrack.firstChild);

    let reviewIndex = 1;
    let reviewTimerId;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function moveReviews(withTransition = true) {
      testimonialTrack.style.transition = withTransition ? "transform 0.65s ease" : "none";
      testimonialTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
    }

    function goToNextReview() {
      if (isAnimating) {
        return;
      }
      isAnimating = true;
      reviewIndex += 1;
      moveReviews(true);
    }

    function goToPrevReview() {
      if (isAnimating) {
        return;
      }
      isAnimating = true;
      reviewIndex -= 1;
      moveReviews(true);
    }

    function startReviewAutoplay() {
      clearInterval(reviewTimerId);
      reviewTimerId = setInterval(() => {
        goToNextReview();
      }, 2800);
    }

    function stopReviewAutoplay() {
      clearInterval(reviewTimerId);
    }

    moveReviews(false);
    startReviewAutoplay();

    testimonialTrack.addEventListener("transitionend", () => {
      if (reviewIndex === baseSlides.length + 1) {
        reviewIndex = 1;
        moveReviews(false);
      } else if (reviewIndex === 0) {
        reviewIndex = baseSlides.length;
        moveReviews(false);
      }

      isAnimating = false;
    });

    if (testimonialCarousel) {
      testimonialCarousel.addEventListener("mouseenter", stopReviewAutoplay);
      testimonialCarousel.addEventListener("mouseleave", startReviewAutoplay);

      testimonialCarousel.addEventListener(
        "touchstart",
        (event) => {
          touchStartX = event.changedTouches[0].screenX;
        },
        { passive: true }
      );

      testimonialCarousel.addEventListener(
        "touchend",
        (event) => {
          touchEndX = event.changedTouches[0].screenX;
          const swipeDistance = touchStartX - touchEndX;

          if (Math.abs(swipeDistance) < 40) {
            return;
          }

          stopReviewAutoplay();
          if (swipeDistance > 0) {
            goToNextReview();
          } else {
            goToPrevReview();
          }
          startReviewAutoplay();
        },
        { passive: true }
      );
    }

    if (testimonialNext) {
      testimonialNext.addEventListener("click", () => {
        stopReviewAutoplay();
        goToNextReview();
        startReviewAutoplay();
      });
    }

    if (testimonialPrev) {
      testimonialPrev.addEventListener("click", () => {
        stopReviewAutoplay();
        goToPrevReview();
        startReviewAutoplay();
      });
    }
  }
}

if (faqList) {
  const questions = faqList.querySelectorAll(".faq-question");

  questions.forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      questions.forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        const panel = item.nextElementSibling;
        if (panel) {
          panel.style.maxHeight = "0px";
        }
      });

      if (!isExpanded) {
        button.setAttribute("aria-expanded", "true");
        const answer = button.nextElementSibling;
        if (answer) {
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      }
    });
  });
}

const revealSections = Array.from(document.querySelectorAll(".reveal"));

function setRevealStagger(section) {
  const revealTargets = section.querySelectorAll(
    ".section-tag, .section-title, .about-image-wrap, .about-content, .card, .feature-item, .who-text, .cta-box, .teacher-quality, .pricing-text, .testimonial-carousel, .faq-list"
  );

  revealTargets.forEach((el, index) => {
    el.style.setProperty("--reveal-delay", `${Math.min(index * 75, 420)}ms`);
  });
}

if (revealSections.length && "IntersectionObserver" in window) {
  revealSections.forEach(setRevealStagger);

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealSections.forEach((section) => revealObserver.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    const nextLanguage = activeLanguage === "ar" ? "en" : "ar";
    applyLanguage(nextLanguage);
  });
}

applyLanguage("ar");
