/* ─────────────────────────────────────────────
   DiabetesIQ Hub — Script
   Theme • Language (EN / HI / MR) • Counter • Navbar
───────────────────────────────────────────── */

// ── THEME ──────────────────────────────────────
const html     = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const saved    = localStorage.getItem('diq-theme') || 'dark';
html.setAttribute('data-theme', saved);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('diq-theme', next);
});

// ── LANGUAGES ──────────────────────────────────
const I18N = {
  en: {
    eyebrow:'AI-Powered Diabetes Early Detection',
    h1a:'Know Your Risk.', h1b:'Protect Your Future.',
    hero_desc:'Over <strong>537 million adults</strong> live with diabetes worldwide — most don\'t know their risk. Our scientifically-backed AI screening gives you answers in minutes.',
    cta_primary:'Start Assessment', cta_ghost:'See How It Works',
    s1:'People With Diabetes', s2:'Type 2 — Preventable', s3:'ML Training Records', s4:'To Complete',
    choose_label:'CHOOSE YOUR PATH', choose_title:'Two assessments. One mission.',
    choose_sub:'Pick the screening approach that matches your situation.',
    b_beginner:'Beginner Friendly', b_clinical:'Clinical Grade', hot_tag:'🔥 Most Accurate',
    lc_title:'Lifestyle Screening',
    lc_desc:'Answer questions about your daily habits, diet, sleep, stress, and family history. No medical records needed — instant risk analysis.',
    lc1:'22 comprehensive lifestyle questions', lc2:'No medical knowledge required',
    lc3:'Instant detailed risk breakdown', lc4:'Personalised prevention tips',
    engine_rule:'Rule-Based Scoring Engine', go_lc:'Start →',
    ai_title:'AI Clinical Assessment',
    ai_desc:'XGBoost model trained on 70,000+ real patient records from the BRFSS 2015 clinical dataset. Optimised for maximum sensitivity.',
    ai1:'XGBoost ML — AUC-optimised', ai2:'70,000+ real patient records',
    ai3:'21 clinically-validated parameters', ai4:'F1-optimised decision threshold', go_ai:'Start →',
    how_label:'THE PROCESS', how_title:'Simple. Fast. Insightful.',
    st1t:'Answer Questions', st1d:'Choose your path and answer clear, guided questions about your health profile and lifestyle.',
    st2t:'AI Analysis', st2d:'Our backend model processes your inputs using clinically-validated algorithms in milliseconds.',
    st3t:'Receive Your Report', st3d:'Get a detailed risk score with contributing factors, colour-coded risk level, and actionable recommendations.',
    st4t:'Take Action', st4d:'Use your report to have an informed conversation with your doctor for formal testing and follow-up.',
    why_label:'WHY IT MATTERS', why_title:'The silent epidemic — act now',
    w1t:'Reverse Prediabetes', w1d:'Caught early, prediabetes can be completely reversed through lifestyle changes alone.',
    w2t:'Protect Your Heart', w2d:'Diabetes doubles the risk of heart disease and stroke. Early action dramatically cuts this risk.',
    w3t:'Save Your Vision', w3d:'Diabetic retinopathy is a leading cause of blindness — but is entirely preventable with early management.',
    w4t:'Understand Your Genes', w4d:'Family history raises your risk by 40%. Early screening gives you the power to intervene.',
    w5t:'Reduce Future Costs', w5d:'Treating diabetes complications costs 10× more than prevention. A 3-minute test pays for itself.',
    w6t:'Mental Health Link', w6d:'Unmanaged blood sugar is linked to cognitive decline and depression. Awareness is the first medicine.',
    disc_t:'Medical Disclaimer',
    disc_d:'This tool is for educational screening purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.',
    footer_tag:'Early detection. Better outcomes. Healthier lives.',
    nav_assess:'Assess Now', nav_how:'How It Works', nav_why:'Why It Matters',
  },

  hi: {
    eyebrow:'AI-संचालित मधुमेह प्रारंभिक पहचान',
    h1a:'अपना जोखिम जानें।', h1b:'अपना भविष्य सुरक्षित करें।',
    hero_desc:'दुनिया भर में <strong>53.7 करोड़ से अधिक वयस्क</strong> मधुमेह के साथ जी रहे हैं — अधिकतर अपना जोखिम नहीं जानते। हमारी AI स्क्रीनिंग मिनटों में उत्तर देती है।',
    cta_primary:'जांच शुरू करें', cta_ghost:'यह कैसे काम करता है',
    s1:'मधुमेह रोगी', s2:'टाइप 2 — रोकथाम योग्य', s3:'ML प्रशिक्षण रिकॉर्ड', s4:'पूरा करने में',
    choose_label:'अपना रास्ता चुनें', choose_title:'दो जांच। एक लक्ष्य।',
    choose_sub:'वह स्क्रीनिंग दृष्टिकोण चुनें जो आपकी स्थिति से मेल खाता हो।',
    b_beginner:'शुरुआती के लिए', b_clinical:'क्लिनिकल ग्रेड', hot_tag:'🔥 सबसे सटीक',
    lc_title:'जीवनशैली जांच',
    lc_desc:'अपनी दैनिक आदतों, आहार, नींद, तनाव और पारिवारिक इतिहास के बारे में प्रश्नों के उत्तर दें।',
    lc1:'22 व्यापक जीवनशैली प्रश्न', lc2:'कोई चिकित्सा ज्ञान आवश्यक नहीं',
    lc3:'तत्काल विस्तृत जोखिम रिपोर्ट', lc4:'व्यक्तिगत रोकथाम सुझाव',
    engine_rule:'नियम-आधारित स्कोरिंग इंजन', go_lc:'शुरू करें →',
    ai_title:'AI क्लिनिकल जांच',
    ai_desc:'BRFSS 2015 क्लिनिकल डेटासेट से 70,000+ वास्तविक रोगी रिकॉर्ड पर प्रशिक्षित XGBoost मॉडेल।',
    ai1:'XGBoost ML — AUC-अनुकूलित', ai2:'70,000+ वास्तविक रोगी रिकॉर्ड',
    ai3:'21 नैदानिक रूप से सत्यापित पैरामीटर', ai4:'F1-अनुकूलित निर्णय सीमा', go_ai:'शुरू करें →',
    how_label:'प्रक्रिया', how_title:'सरल। तेज़। व्यावहारिक।',
    st1t:'प्रश्नों के उत्तर दें', st1d:'अपना रास्ता चुनें और अपनी स्वास्थ्य प्रोफ़ाइल के बारे में स्पष्ट प्रश्नों के उत्तर दें।',
    st2t:'AI विश्लेषण', st2d:'हमारा मॉडेल मिलीसेकंड में आपके इनपुट को संसाधित करता है।',
    st3t:'अपनी रिपोर्ट प्राप्त करें', st3d:'जोखिम स्कोर, योगदान कारकों और सुझावों के साथ विस्तृत रिपोर्ट पाएं।',
    st4t:'कार्रवाई करें', st4d:'औपचारिक परीक्षण के लिए अपने डॉक्टर से बातचीत करने के लिए अपनी रिपोर्ट का उपयोग करें।',
    why_label:'यह क्यों मायने रखता है', why_title:'मूक महामारी — अभी कार्रवाई करें',
    w1t:'प्रीडायबिटीज को उलटें', w1d:'जल्दी पहचान से, प्रीडायबिटीज को केवल जीवनशैली परिवर्तनों से पूरी तरह उलटा जा सकता है।',
    w2t:'अपने दिल की रक्षा करें', w2d:'मधुमेह हृदय रोग और स्ट्रोक के जोखिम को दोगुना करता है।',
    w3t:'अपनी दृष्टि बचाएं', w3d:'मधुमेह रेटिनोपैथी अंधेपन का एक प्रमुख कारण है — लेकिन यह पूरी तरह से रोकथाम योग्य है।',
    w4t:'अपने जीन समझें', w4d:'पारिवारिक इतिहास आपके जोखिम को 40% तक बढ़ा देता है।',
    w5t:'भविष्य की लागत कम करें', w5d:'मधुमेह की जटिलताओं का उपचार रोकथाम से 10 गुना अधिक महंगा है।',
    w6t:'मानसिक स्वास्थ्य संबंध', w6d:'अनियंत्रित रक्त शर्करा संज्ञानात्मक गिरावट और अवसाद से जुड़ी है।',
    disc_t:'चिकित्सा अस्वीकरण',
    disc_d:'यह उपकरण केवल शैक्षिक स्क्रीनिंग उद्देश्यों के लिए है। यह चिकित्सा सलाह, निदान या उपचार नहीं है।',
    footer_tag:'जल्दी पहचान। बेहतर परिणाम। स्वस्थ जीवन।',
    nav_assess:'जांच करें', nav_how:'कैसे काम करता है', nav_why:'क्यों मायने रखता है',
  },

  // ── MARATHI (replaces Spanish) ──────────────────
  mr: {
    eyebrow:'AI-आधारित मधुमेह लवकर शोध',
    h1a:'तुमचा धोका जाणा.', h1b:'तुमचे भविष्य सुरक्षित करा.',
    hero_desc:'जगभरात <strong>53.7 कोटींहून अधिक प्रौढ</strong> मधुमेहासह जगत आहेत — बहुतेकांना त्यांचा धोका माहीत नाही. आमची AI तपासणी मिनिटांत उत्तरे देते.',
    cta_primary:'मूल्यांकन सुरू करा', cta_ghost:'हे कसे कार्य करते ते पहा',
    s1:'मधुमेह रुग्ण', s2:'प्रकार 2 — प्रतिबंध करण्यायोग्य', s3:'ML प्रशिक्षण नोंदी', s4:'पूर्ण करण्यासाठी',
    choose_label:'तुमचा मार्ग निवडा', choose_title:'दोन मूल्यांकने. एक ध्येय.',
    choose_sub:'तुमच्या परिस्थितीला अनुरूप असलेला तपासणी दृष्टिकोन निवडा.',
    b_beginner:'सुरुवातीसाठी', b_clinical:'क्लिनिकल दर्जा', hot_tag:'🔥 सर्वात अचूक',
    lc_title:'जीवनशैली तपासणी',
    lc_desc:'तुमच्या दैनंदिन सवयी, आहार, झोप, ताण आणि कौटुंबिक इतिहासाबद्दल प्रश्नांची उत्तरे द्या. वैद्यकीय नोंदी आवश्यक नाहीत.',
    lc1:'22 सर्वसमावेशक जीवनशैली प्रश्न', lc2:'वैद्यकीय ज्ञान आवश्यक नाही',
    lc3:'तात्काळ तपशीलवार धोका विश्लेषण', lc4:'वैयक्तिकृत प्रतिबंध टिपा',
    engine_rule:'नियम-आधारित स्कोरिंग इंजिन', go_lc:'सुरू करा →',
    ai_title:'AI क्लिनिकल मूल्यांकन',
    ai_desc:'BRFSS 2015 क्लिनिकल डेटासेटमधील 70,000+ वास्तविक रुग्ण नोंदींवर प्रशिक्षित XGBoost मॉडेल.',
    ai1:'XGBoost ML — AUC-अनुकूलित', ai2:'70,000+ वास्तविक रुग्ण नोंदी',
    ai3:'21 क्लिनिकली प्रमाणित पॅरामीटर्स', ai4:'F1-अनुकूलित निर्णय उंबरठा', go_ai:'सुरू करा →',
    how_label:'प्रक्रिया', how_title:'सोपे. जलद. अंतर्दृष्टीपूर्ण.',
    st1t:'प्रश्नांची उत्तरे द्या', st1d:'तुमचा मार्ग निवडा आणि आरोग्य प्रोफाइलबद्दल स्पष्ट प्रश्नांची उत्तरे द्या.',
    st2t:'AI विश्लेषण', st2d:'आमचे मॉडेल मिलिसेकंदात क्लिनिकली प्रमाणित अल्गोरिदम वापरून प्रक्रिया करते.',
    st3t:'तुमचा अहवाल प्राप्त करा', st3d:'योगदान घटक, रंग-कोडेड धोका पातळी आणि कार्यक्षम शिफारशींसह तपशीलवार धोका स्कोर मिळवा.',
    st4t:'कृती करा', st4d:'औपचारिक चाचणीसाठी तुमच्या डॉक्टरांशी माहितीपूर्ण संवाद साधण्यासाठी तुमचा अहवाल वापरा.',
    why_label:'हे का महत्त्वाचे आहे', why_title:'मूक साथरोग — आता कृती करा',
    w1t:'प्रीडायबेटिस उलटवा', w1d:'लवकर आढळल्यास, प्रीडायबेटिस केवळ जीवनशैली बदलांद्वारे पूर्णपणे उलटवता येतो.',
    w2t:'तुमचे हृदय वाचवा', w2d:'मधुमेह हृदयरोग आणि स्ट्रोकचा धोका दुप्पट करतो.',
    w3t:'तुमची दृष्टी वाचवा', w3d:'मधुमेह रेटिनोपॅथी अंधत्वाचे प्रमुख कारण आहे — परंतु लवकर व्यवस्थापनाने ते प्रतिबंध करण्यायोग्य आहे.',
    w4t:'तुमची जीन्स समजून घ्या', w4d:'कौटुंबिक इतिहास तुमचा धोका 40% ने वाढवतो. लवकर तपासणी तुम्हाला कृती करण्याची शक्ती देते.',
    w5t:'भविष्यातील खर्च कमी करा', w5d:'मधुमेह गुंतागुंतींवर उपचार प्रतिबंधापेक्षा 10 पट जास्त खर्च येतो.',
    w6t:'मानसिक आरोग्य संबंध', w6d:'अनियंत्रित रक्त शर्करा संज्ञानात्मक घट आणि नैराश्याशी जोडलेले आहे.',
    disc_t:'वैद्यकीय अस्वीकृती',
    disc_d:'हे साधन केवळ शैक्षणिक तपासणी हेतूंसाठी आहे. हे वैद्यकीय सल्ला, निदान किंवा उपचार नाही. नेहमी पात्र आरोग्य व्यावसायिकांचा सल्ला घ्या.',
    footer_tag:'लवकर शोध. चांगले परिणाम. निरोगी जीवन.',
    nav_assess:'मूल्यांकन करा', nav_how:'हे कसे कार्य करते', nav_why:'का महत्त्वाचे आहे',
  }
};

let lang = localStorage.getItem('diq-lang') || 'en';

function applyLang(l) {
  lang = l;
  localStorage.setItem('diq-lang', l);
  const d = I18N[l];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (d[k] !== undefined) el.innerHTML = d[k];
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === l);
  });
}

document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
applyLang(lang);

// ── COUNTER ANIMATION ───────────────────────────
function animCount(el, to, ms = 1600) {
  const start = performance.now();
  const raf = (t) => {
    const p = Math.min((t - start) / ms, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(ease * to);
    if (p < 1) requestAnimationFrame(raf);
    else el.textContent = to;
  };
  requestAnimationFrame(raf);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animCount(e.target, +e.target.dataset.to);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.cnt').forEach(el => io.observe(el));

// ── NAVBAR SCROLL ───────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30));

// ── CARD KEYBOARD ───────────────────────────────
document.querySelectorAll('.acard').forEach(c => {
  c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') c.click(); });
});