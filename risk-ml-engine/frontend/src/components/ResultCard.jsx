import React from "react";
import { motion } from "framer-motion";

function getCol(p) {
  if (p < 35) return "#10b981";
  if (p < 70) return "#f59e0b";
  return "#ef4444";
}

function Gauge({ percent }) {
  const p = Math.max(0, Math.min(100, percent ?? 0));
  const r = 90;
  const circ = 2 * Math.PI * r;
  const col = getCol(p);
  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      <circle cx="110" cy="110" r={r} stroke="rgba(255,255,255,.06)" strokeWidth="16" fill="none" />
      <motion.circle
        cx="110" cy="110" r={r}
        stroke={col} strokeWidth="16" strokeLinecap="round" fill="none"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - p / 100) }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        transform="rotate(-90 110 110)"
      />
      <motion.text
        x="110" y="103" textAnchor="middle"
        fontFamily="'Syne',sans-serif" fontSize="36" fontWeight="900"
        fill={col}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        {Math.round(p)}%
      </motion.text>
      <text x="110" y="126" textAnchor="middle" fontSize="11"
        fill="rgba(255,255,255,.4)" fontFamily="DM Sans,sans-serif">
        RISK PROBABILITY
      </text>
    </svg>
  );
}

/* ── UI TEXT ── */
const UI_TEXT = {
  en: {
    riskFactors: "Risk Factors Identified",
    recommended: "Recommended Actions",
    review:      "Review Answers",
    retake:      "🔄 Retake",
    print:       "🖨️ Print Report",
    disclaimer:  "⚕️ AI Screening only · Not a substitute for medical advice · Consult a healthcare professional",
    prec: [
      { ico: "🚶", t: "30 minutes of moderate activity most days" },
      { ico: "🥗", t: "Reduce sugary and processed foods" },
      { ico: "🩺", t: "Request HbA1c / fasting glucose test from your doctor" },
      { ico: "😴", t: "Target 7–8 hours of quality sleep per night" },
      { ico: "🧘", t: "Manage chronic stress — it raises blood glucose" },
    ],
  },
  hi: {
    riskFactors: "पहचाने गए जोखिम कारक",
    recommended: "अनुशंसित कार्रवाइयाँ",
    review:      "उत्तर समीक्षा करें",
    retake:      "🔄 फिर से परीक्षण करें",
    print:       "🖨️ रिपोर्ट प्रिंट करें",
    disclaimer:  "⚕️ केवल AI स्क्रीनिंग · चिकित्सा सलाह का विकल्प नहीं · स्वास्थ्य पेशेवर से परामर्श करें",
    prec: [
      { ico: "🚶", t: "अधिकांश दिनों में 30 मिनट की मध्यम गतिविधि" },
      { ico: "🥗", t: "शर्करायुक्त और प्रसंस्कृत खाद्य पदार्थ कम करें" },
      { ico: "🩺", t: "HbA1c / फास्टिंग ग्लूकोज परीक्षण के लिए डॉक्टर से परामर्श करें" },
      { ico: "😴", t: "प्रति रात 7–8 घंटे की गुणवत्तापूर्ण नींद का लक्ष्य" },
      { ico: "🧘", t: "पुराने तनाव को प्रबंधित करें — यह रक्त ग्लूकोज बढ़ाता है" },
    ],
  },
  mr: {
    riskFactors: "ओळखले गेलेले जोखीम घटक",
    recommended: "शिफारस केलेल्या कृती",
    review:      "उत्तरे तपासा",
    retake:      "🔄 पुन्हा चाचणी घ्या",
    print:       "🖨️ अहवाल प्रिंट करा",
    disclaimer:  "⚕️ केवळ AI तपासणी · वैद्यकीय सल्ल्याचा पर्याय नाही · आरोग्यसेवा व्यावसायिकांचा सल्ला घ्या",
    prec: [
      { ico: "🚶", t: "बहुतेक दिवशी 30 मिनिटे मध्यम व्यायाम करा" },
      { ico: "🥗", t: "साखरयुक्त आणि प्रक्रिया केलेले अन्न कमी करा" },
      { ico: "🩺", t: "HbA1c / उपवास ग्लूकोज चाचणीसाठी डॉक्टरांचा सल्ला घ्या" },
      { ico: "😴", t: "रात्री 7–8 तासांची दर्जेदार झोप घ्या" },
      { ico: "🧘", t: "दीर्घकालीन ताण व्यवस्थापित करा — यामुळे रक्तातील ग्लूकोज वाढतो" },
    ],
  },
};

/* ── RESULT LABEL TRANSLATIONS ── */
const RESULT_TRANS = {
  hi: {
    "Low Risk Detected":      "कम जोखिम पाया गया",
    "Moderate Risk Detected": "मध्यम जोखिम पाया गया",
    "High Risk Detected":     "उच्च जोखिम पाया गया",
    "Connection Error":       "कनेक्शन त्रुटि",
    "Model Failed":           "मॉडेल विफल",
    "Error":                  "त्रुटि",
  },
  mr: {
    "Low Risk Detected":      "कमी जोखीम आढळली",
    "Moderate Risk Detected": "मध्यम जोखीम आढळली",
    "High Risk Detected":     "उच्च जोखीम आढळली",
    "Connection Error":       "कनेक्शन त्रुटी",
    "Model Failed":           "मॉडेल अयशस्वी",
    "Error":                  "त्रुटी",
  },
};

/* ── EXPLANATION TRANSLATIONS ── */
const EXPLANATION_TRANS = {
  hi: {
    "This is a screening estimate, not a medical diagnosis. Consult a healthcare professional for formal testing.":
      "यह एक स्क्रीनिंग अनुमान है, चिकित्सा निदान नहीं। औपचारिक परीक्षण के लिए किसी स्वास्थ्य पेशेवर से परामर्श करें।",
    "Check backend logs.":
      "बैकएंड लॉग जांचें।",
  },
  mr: {
    "This is a screening estimate, not a medical diagnosis. Consult a healthcare professional for formal testing.":
      "हे एक तपासणी अंदाज आहे, वैद्यकीय निदान नाही. औपचारिक चाचणीसाठी आरोग्यसेवा व्यावसायिकाचा सल्ला घ्या.",
    "Check backend logs.":
      "बॅकएंड लॉग तपासा.",
  },
};

/* ── REASON TRANSLATIONS ── */
const REASON_TRANS = {
  hi: {
    "General health rated Fair/Poor — strongest diabetes predictor.":         "सामान्य स्वास्थ्य उचित/खराब — सबसे मजबूत मधुमेह भविष्यवक्ता।",
    "High blood pressure — primary diabetes risk factor.":                    "उच्च रक्तचाप — प्राथमिक मधुमेह जोखिम कारक।",
    "BMI in Obese range — strongest predictor of Type 2 diabetes.":           "BMI मोटापे की श्रेणी में — टाइप 2 मधुमेह का सबसे मजबूत भविष्यवक्ता।",
    "Age 50+ — risk rises significantly with age.":                           "50+ आयु — उम्र के साथ जोखिम काफी बढ़ता है।",
    "High cholesterol — linked to insulin resistance.":                       "उच्च कोलेस्ट्रॉल — इंसुलिन प्रतिरोध से जुड़ा।",
    "No cholesterol check in 5 years — delayed screening raises risk.":       "5 वर्षों में कोलेस्ट्रॉल जांच नहीं — देरी से जोखिम बढ़ता है।",
    "Lower income — limits healthy food access and healthcare.":              "कम आय — स्वस्थ भोजन और स्वास्थ्य देखभाल तक पहुंच सीमित।",
    "Frequent poor physical health — indicates chronic illness burden.":      "बार-बार खराब शारीरिक स्वास्थ्य — पुरानी बीमारी का संकेत।",
    "Difficulty walking — linked to inactivity and metabolic risk.":          "चलने में कठिनाई — निष्क्रियता और चयापचय जोखिम से जुड़ा।",
    "Heart disease history — shares the same risk pathway as diabetes.":      "हृदय रोग का इतिहास — मधुमेह के समान जोखिम मार्ग।",
    "No physical activity — sedentary lifestyle raises risk.":                "कोई शारीरिक गतिविधि नहीं — गतिहीन जीवनशैली जोखिम बढ़ाती है।",
    "History of stroke — overlapping risk factors with diabetes.":            "स्ट्रोक का इतिहास — मधुमेह के साथ अतिव्यापी जोखिम कारक।",
    "Frequent poor mental health — stress raises blood glucose chronically.": "बार-बार खराब मानसिक स्वास्थ्य — तनाव रक्त ग्लूकोज बढ़ाता है।",
    "No daily vegetables — poor diet linked to insulin resistance.":          "दैनिक सब्जियां नहीं — खराब आहार इंसुलिन प्रतिरोध से जुड़ा।",
    "Heavy alcohol use — impairs liver and insulin function.":                "अत्यधिक शराब — यकृत और इंसुलिन कार्य बाधित करती है।",
    "No daily fruit — lower fibre intake linked to metabolic risk.":          "दैनिक फल नहीं — कम फाइबर सेवन चयापचय जोखिम से जुड़ा।",
    "Lifetime smoker — causes inflammation, impairs glucose metabolism.":     "जीवनकाल धूम्रपायी — सूजन का कारण, ग्लूकोज चयापचय बाधित।",
    "No health coverage — delays diagnosis and management.":                  "कोई स्वास्थ्य कवरेज नहीं — निदान और प्रबंधन में देरी।",
    "Cost blocked doctor visit — unmanaged conditions increase risk.":        "लागत ने डॉक्टर के दौरे को रोका — अप्रबंधित स्थितियां जोखिम बढ़ाती हैं।",
    "Lower education level — correlates with higher diabetes risk.":          "कम शिक्षा स्तर — अधिक मधुमेह जोखिम से संबंधित।",
    "Backend server not responding — please start app.py":                    "बैकएंड सर्वर प्रतिक्रिया नहीं दे रहा — कृपया app.py शुरू करें",
  },
  mr: {
    "General health rated Fair/Poor — strongest diabetes predictor.":         "सामान्य आरोग्य बरे/वाईट — सर्वात मजबूत मधुमेह भविष्यवक्ता.",
    "High blood pressure — primary diabetes risk factor.":                    "उच्च रक्तदाब — प्राथमिक मधुमेह जोखीम घटक.",
    "BMI in Obese range — strongest predictor of Type 2 diabetes.":           "BMI लठ्ठपणाच्या श्रेणीत — टाइप 2 मधुमेहाचा सर्वात मजबूत भविष्यवक्ता.",
    "Age 50+ — risk rises significantly with age.":                           "50+ वय — वयानुसार धोका लक्षणीयरीत्या वाढतो.",
    "High cholesterol — linked to insulin resistance.":                       "उच्च कोलेस्टेरॉल — इन्सुलिन प्रतिरोधाशी संबंधित.",
    "No cholesterol check in 5 years — delayed screening raises risk.":       "5 वर्षांत कोलेस्टेरॉल तपासणी नाही — उशीर झालेली तपासणी धोका वाढवते.",
    "Lower income — limits healthy food access and healthcare.":              "कमी उत्पन्न — निरोगी अन्न आणि आरोग्यसेवेपर्यंत पोहोच मर्यादित.",
    "Frequent poor physical health — indicates chronic illness burden.":      "वारंवार खराब शारीरिक आरोग्य — जुनाट आजाराचे लक्षण.",
    "Difficulty walking — linked to inactivity and metabolic risk.":          "चालण्यात अडचण — निष्क्रियता आणि चयापचय जोखीमशी संबंधित.",
    "Heart disease history — shares the same risk pathway as diabetes.":      "हृदयरोगाचा इतिहास — मधुमेहासारखाच जोखीम मार्ग.",
    "No physical activity — sedentary lifestyle raises risk.":                "कोणतीही शारीरिक हालचाल नाही — बैठी जीवनशैली धोका वाढवते.",
    "History of stroke — overlapping risk factors with diabetes.":            "स्ट्रोकचा इतिहास — मधुमेहाशी अतिव्यापी जोखीम घटक.",
    "Frequent poor mental health — stress raises blood glucose chronically.": "वारंवार खराब मानसिक आरोग्य — ताण रक्तातील ग्लूकोज वाढवतो.",
    "No daily vegetables — poor diet linked to insulin resistance.":          "दैनंदिन भाज्या नाहीत — खराब आहार इन्सुलिन प्रतिरोधाशी संबंधित.",
    "Heavy alcohol use — impairs liver and insulin function.":                "जास्त मद्यपान — यकृत आणि इन्सुलिन कार्य बाधित करते.",
    "No daily fruit — lower fibre intake linked to metabolic risk.":          "दैनंदिन फळे नाहीत — कमी फायबर सेवन चयापचय जोखीमशी संबंधित.",
    "Lifetime smoker — causes inflammation, impairs glucose metabolism.":     "आयुष्यभर धूम्रपान — जळजळ कारणीभूत, ग्लूकोज चयापचय बाधित.",
    "No health coverage — delays diagnosis and management.":                  "आरोग्य कव्हरेज नाही — निदान आणि व्यवस्थापनास विलंब.",
    "Cost blocked doctor visit — unmanaged conditions increase risk.":        "खर्चामुळे डॉक्टर भेट अडली — अव्यवस्थापित स्थिती धोका वाढवतात.",
    "Lower education level — correlates with higher diabetes risk.":          "कमी शिक्षण पातळी — जास्त मधुमेह जोखीमशी संबंधित.",
    "Backend server not responding — please start app.py":                    "बॅकएंड सर्व्हर प्रतिसाद देत नाही — कृपया app.py सुरू करा",
  },
};

/* ── also translate the dynamic probability/threshold lines from backend ── */
const DYNAMIC_REASON_TRANS = {
  hi: [
    { match: "Prediction Probability:",   replace: (r) => r.replace("Prediction Probability:", "अनुमानित संभावना:") },
    { match: "Model Decision:",           replace: (r) => r
        .replace("Model Decision:", "मॉडेल निर्णय:")
        .replace("Positive (Diabetic/Prediabetic)", "सकारात्मक (मधुमेही/प्रीडायबेटिक)")
        .replace("Negative (Non-Diabetic)", "नकारात्मक (गैर-मधुमेही)") },
    { match: "Decision Threshold:",       replace: (r) => r.replace("Decision Threshold:", "निर्णय सीमा:").replace("optimised for sensitivity", "संवेदनशीलता के लिए अनुकूलित") },
    { match: "Based on XGBoost trained",  replace: (r) => r.replace("Based on XGBoost trained on full BRFSS 2015 dataset — 21 features.", "BRFSS 2015 डेटासेट पर प्रशिक्षित XGBoost पर आधारित — 21 विशेषताएं।") },
  ],
  mr: [
    { match: "Prediction Probability:",   replace: (r) => r.replace("Prediction Probability:", "अंदाजित संभाव्यता:") },
    { match: "Model Decision:",           replace: (r) => r
        .replace("Model Decision:", "मॉडेल निर्णय:")
        .replace("Positive (Diabetic/Prediabetic)", "सकारात्मक (मधुमेही/प्रीडायबेटिक)")
        .replace("Negative (Non-Diabetic)", "नकारात्मक (मधुमेह नाही)") },
    { match: "Decision Threshold:",       replace: (r) => r.replace("Decision Threshold:", "निर्णय उंबरठा:").replace("optimised for sensitivity", "संवेदनशीलतेसाठी अनुकूलित") },
    { match: "Based on XGBoost trained",  replace: (r) => r.replace("Based on XGBoost trained on full BRFSS 2015 dataset — 21 features.", "BRFSS 2015 डेटासेटवर प्रशिक्षित XGBoost वर आधारित — 21 वैशिष्ट्ये.") },
  ],
};

function tr(map, lang, text) {
  if (lang === "en" || !map[lang]) return text;
  const m = map[lang];
  if (m[text]) return m[text];
  const key = Object.keys(m).find((k) => text.startsWith(k));
  return key ? m[key] : text;
}

function translateReason(reason, lang) {
  if (lang === "en") return reason;
  // static lookup first
  const staticResult = tr(REASON_TRANS, lang, reason);
  if (staticResult !== reason) return staticResult;
  // dynamic pattern replacements for ML-engine backend reasons
  const patterns = DYNAMIC_REASON_TRANS[lang] || [];
  for (const p of patterns) {
    if (reason.includes(p.match)) return p.replace(reason);
  }
  return reason;
}

/* ── PRINT ── */
function buildPrintWindow(data, lang) {
  const p   = data?.percent ?? 0;
  const col = getCol(p);
  const t   = UI_TEXT[lang] || UI_TEXT.en;
  const date = new Date().toLocaleDateString(
    lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const translatedResult      = tr(RESULT_TRANS, lang, data?.result ?? "");
  const translatedExplanation = tr(EXPLANATION_TRANS, lang, data?.explanation ?? "");

  const reasons = (data?.reasons ?? [])
    .map((r) => `<li><span>⚠️</span><span>${translateReason(r, lang)}</span></li>`)
    .join("");

  const precItems = t.prec
    .map((item) => `<li><span>${item.ico}</span><span>${item.t}</span></li>`)
    .join("");

  const labels = {
    en: {
      sub: "AI Clinical Assessment — Risk Report",
      riskLbl: "Risk Probability", riskFactors: "Risk Factors Identified",
      recommended: "Recommended Actions",
      discTitle: "⚕️ Medical Disclaimer",
      discBody: "This tool is for educational screening purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.",
      footer: `DiabetesIQ · AI Clinical Assessment · ${date} · XGBoost · BRFSS 2015`,
    },
    hi: {
      sub: "AI क्लिनिकल मूल्यांकन — जोखिम रिपोर्ट",
      riskLbl: "जोखिम संभावना", riskFactors: "पहचाने गए जोखिम कारक",
      recommended: "अनुशंसित कार्रवाइयाँ",
      discTitle: "⚕️ चिकित्सा अस्वीकरण",
      discBody: "यह उपकरण केवल शैक्षिक स्क्रीनिंग उद्देश्यों के लिए है। यह चिकित्सा सलाह, निदान या उपचार नहीं है। हमेशा एक योग्य स्वास्थ्य पेशेवर से परामर्श करें।",
      footer: `DiabetesIQ · AI क्लिनिकल मूल्यांकन · ${date} · XGBoost · BRFSS 2015`,
    },
    mr: {
      sub: "AI क्लिनिकल मूल्यांकन — जोखीम अहवाल",
      riskLbl: "जोखीम संभाव्यता", riskFactors: "ओळखले गेलेले जोखीम घटक",
      recommended: "शिफारस केलेल्या कृती",
      discTitle: "⚕️ वैद्यकीय अस्वीकरण",
      discBody: "हे साधन केवळ शैक्षणिक तपासणी उद्देशांसाठी आहे. हे वैद्यकीय सल्ला, निदान किंवा उपचार नाही. नेहमी एखाद्या पात्र आरोग्यसेवा व्यावसायिकाचा सल्ला घ्या.",
      footer: `DiabetesIQ · AI क्लिनिकल मूल्यांकन · ${date} · XGBoost · BRFSS 2015`,
    },
  };
  const lbl = labels[lang] || labels.en;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>DiabetesIQ — ${lbl.sub}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;background:#fff;color:#1a1a1a;max-width:640px;margin:0 auto;padding:48px 40px}
    .header{text-align:center;border-bottom:2px solid #06b6d4;padding-bottom:20px;margin-bottom:28px}
    .brand{font-size:2rem;font-weight:900;letter-spacing:-.03em}
    .brand em{color:#06b6d4;font-style:normal}
    .sub{font-size:.8rem;color:#777;margin-top:6px;letter-spacing:.05em}
    .risk-box{text-align:center;border:2px solid ${col};border-radius:12px;padding:28px;margin-bottom:28px}
    .pct{font-size:5rem;font-weight:900;color:${col};line-height:1}
    .pct-lbl{font-size:.75rem;color:#999;margin-top:4px}
    .result{font-size:1.4rem;font-weight:700;color:${col};margin-top:10px}
    .expl{font-size:.85rem;color:#555;margin-top:8px;line-height:1.7}
    .sec-title{font-size:.75rem;font-weight:800;color:#06b6d4;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:24px 0 12px}
    ul{list-style:none;padding:0}
    ul li{font-size:.88rem;color:#333;padding:6px 0;line-height:1.6;border-bottom:1px solid #f3f4f6;display:flex;gap:10px}
    ul li:last-child{border-bottom:none}
    .disc{background:#fffbeb;border:1px solid #f59e0b;border-radius:8px;padding:14px 18px;margin-top:28px}
    .disc strong{color:#92400e;font-size:.85rem;display:block;margin-bottom:4px}
    .disc p{font-size:.8rem;color:#78350f;line-height:1.7}
    .footer{margin-top:24px;text-align:center;font-size:.72rem;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:14px}
    @media print{body{padding:0}}
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">🩸 Diabetes<em>IQ</em></div>
    <div class="sub">${lbl.sub}</div>
  </div>
  <div class="risk-box">
    <div class="pct">${Math.round(p)}%</div>
    <div class="pct-lbl">${lbl.riskLbl}</div>
    <div class="result">${translatedResult}</div>
    ${translatedExplanation ? `<div class="expl">${translatedExplanation}</div>` : ""}
  </div>
  ${reasons ? `<div class="sec-title">${lbl.riskFactors}</div><ul>${reasons}</ul>` : ""}
  <div class="sec-title">${lbl.recommended}</div>
  <ul>${precItems}</ul>
  <div class="disc">
    <strong>${lbl.discTitle}</strong>
    <p>${lbl.discBody}</p>
  </div>
  <div class="footer">${lbl.footer}</div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=720,height=900");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }
}

/* ── COMPONENT ── */
export default function ResultCard({ data, onRetake, onReview, lang = "en" }) {
  const p       = data?.percent ?? 0;
  const col     = getCol(p);
  const reasons = data?.reasons ?? [];
  const emoji   = p < 35 ? "🟢" : p < 70 ? "🟡" : "🔴";
  const t       = UI_TEXT[lang] || UI_TEXT.en;

  const displayResult      = tr(RESULT_TRANS, lang, data?.result ?? "");
  const displayExplanation = tr(EXPLANATION_TRANS, lang, data?.explanation ?? "");

  return (
    <motion.div
      className="result-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <div className="result-top">
        <div className="gauge-wrap"><Gauge percent={p} /></div>

        <div className="result-text">
          <div className="risk-label">
            {emoji}&nbsp;
            <span style={{ color: col }}>{displayResult}</span>
          </div>

          <p className="risk-expl">{displayExplanation}</p>

          {reasons.length > 0 && (
            <>
              <div className="rs-heading">{t.riskFactors}</div>
              <ul className="reasons-list">
                {reasons.map((r, i) => (
                  <li key={i}>
                    <span className="reason-dot">⚠️</span>
                    {translateReason(r, lang)}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="rs-heading">{t.recommended}</div>
          <ul className="prec-list">
            {t.prec.map((item, i) => (
              <li key={i}>
                <span className="prec-ico">{item.ico}</span>
                {item.t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="result-footer-btns">
        <button className="btn-flat"    onClick={onReview}>{t.review}</button>
        <button className="btn-danger"  onClick={onRetake}>{t.retake}</button>
        <button className="btn-primary" onClick={() => buildPrintWindow(data, lang)}>{t.print}</button>
      </div>

      <div className="disc-note">{t.disclaimer}</div>
    </motion.div>
  );
}