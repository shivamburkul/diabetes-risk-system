import React from "react";
import { motion } from "framer-motion";

function getCol(p) {
  if (p < 30) return "#10b981";
  if (p < 60) return "#f59e0b";
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
        RISK SCORE
      </text>
    </svg>
  );
}

/* ── UI TEXT ── */
const UI_TEXT = {
  en: {
    contributing: "Contributing Factors",
    recommended:  "Recommended Actions",
    review:       "Review Answers",
    retake:       "🔄 Retake Test",
    print:        "🖨️ Print Report",
    disclaimer:   "⚕️ Screening tool only · Not a substitute for medical advice · Consult a healthcare professional",
    prec: [
      { ico: "🚶", t: "30 minutes of moderate activity most days of the week" },
      { ico: "🥗", t: "Reduce sugary drinks and refined carbohydrates" },
      { ico: "🩺", t: "Consult a doctor for HbA1c or fasting glucose tests" },
      { ico: "😴", t: "Target 7–8 hours of quality sleep per night" },
      { ico: "🧘", t: "Manage stress through mindfulness or regular breaks" },
    ],
  },
  hi: {
    contributing: "योगदान देने वाले कारक",
    recommended:  "अनुशंसित कार्रवाइयाँ",
    review:       "उत्तर समीक्षा करें",
    retake:       "🔄 फिर से परीक्षण करें",
    print:        "🖨️ रिपोर्ट प्रिंट करें",
    disclaimer:   "⚕️ केवल स्क्रीनिंग टूल · चिकित्सा सलाह का विकल्प नहीं · स्वास्थ्य पेशेवर से परामर्श करें",
    prec: [
      { ico: "🚶", t: "अधिकांश दिनों में 30 मिनट की मध्यम गतिविधि करें" },
      { ico: "🥗", t: "शर्करायुक्त पेय और परिष्कृत कार्बोहाइड्रेट कम करें" },
      { ico: "🩺", t: "HbA1c या फास्टिंग ग्लूकोज परीक्षण के लिए डॉक्टर से परामर्श करें" },
      { ico: "😴", t: "प्रति रात 7–8 घंटे की गुणवत्तापूर्ण नींद का लक्ष्य रखें" },
      { ico: "🧘", t: "माइंडफुलनेस के माध्यम से तनाव प्रबंधित करें" },
    ],
  },
  mr: {
    contributing: "योगदान देणारे घटक",
    recommended:  "शिफारस केलेल्या कृती",
    review:       "उत्तरे तपासा",
    retake:       "🔄 पुन्हा चाचणी घ्या",
    print:        "🖨️ अहवाल प्रिंट करा",
    disclaimer:   "⚕️ केवळ तपासणी साधन · वैद्यकीय सल्ल्याचा पर्याय नाही · आरोग्यसेवा व्यावसायिकांचा सल्ला घ्या",
    prec: [
      { ico: "🚶", t: "बहुतेक दिवशी 30 मिनिटे मध्यम व्यायाम करा" },
      { ico: "🥗", t: "साखरयुक्त पेये आणि परिष्कृत कर्बोदके कमी करा" },
      { ico: "🩺", t: "HbA1c किंवा उपवास ग्लूकोज चाचण्यांसाठी डॉक्टरांचा सल्ला घ्या" },
      { ico: "😴", t: "रात्री 7–8 तासांची दर्जेदार झोप घ्या" },
      { ico: "🧘", t: "माइंडफुलनेसद्वारे ताण व्यवस्थापित करा" },
    ],
  },
};

/* ── RESULT LABEL TRANSLATIONS (backend sends English) ── */
const RESULT_TRANS = {
  hi: {
    "Low Risk Detected":      "कम जोखिम पाया गया",
    "Moderate Risk Detected": "मध्यम जोखिम पाया गया",
    "High Risk Detected":     "उच्च जोखिम पाया गया",
    "Connection Error":       "कनेक्शन त्रुटि",
    "Risk Assessment":        "जोखिम मूल्यांकन",
  },
  mr: {
    "Low Risk Detected":      "कमी जोखीम आढळली",
    "Moderate Risk Detected": "मध्यम जोखीम आढळली",
    "High Risk Detected":     "उच्च जोखीम आढळली",
    "Connection Error":       "कनेक्शन त्रुटी",
    "Risk Assessment":        "जोखीम मूल्यांकन",
  },
};

/* ── EXPLANATION TRANSLATIONS (backend sends English) ── */
const EXPLANATION_TRANS = {
  hi: {
    "This assessment is an estimate based on your answers. It is not a medical diagnosis. Please consult a healthcare professional for definitive testing.":
      "यह मूल्यांकन आपके उत्तरों पर आधारित एक अनुमान है। यह चिकित्सा निदान नहीं है। कृपया निश्चित परीक्षण के लिए किसी स्वास्थ्य पेशेवर से परामर्श करें।",
    "Cannot reach the backend at localhost:5000. Make sure app.py is running.":
      "बैकएंड से कनेक्ट नहीं हो सका। कृपया सुनिश्चित करें कि app.py चल रहा है।",
  },
  mr: {
    "This assessment is an estimate based on your answers. It is not a medical diagnosis. Please consult a healthcare professional for definitive testing.":
      "हे मूल्यांकन तुमच्या उत्तरांवर आधारित एक अंदाज आहे. हे वैद्यकीय निदान नाही. कृपया निश्चित चाचणीसाठी आरोग्यसेवा व्यावसायिकाचा सल्ला घ्या.",
    "Cannot reach the backend at localhost:5000. Make sure app.py is running.":
      "बॅकएंडशी कनेक्ट होता आले नाही. कृपया खात्री करा की app.py चालू आहे.",
  },
};

/* ── REASON TRANSLATIONS ── */
const REASON_TRANS = {
  hi: {
    "Age ≥ 45 increases risk":                                        "45 वर्ष या उससे अधिक आयु — जोखिम बढ़ता है",
    "High body weight / BMI (approx)":                                "अधिक वजन / BMI — प्राथमिक जोखिम कारक",
    "Large waist circumference":                                       "बड़ी कमर परिधि — केंद्रीय मोटापा",
    "Family history of diabetes":                                      "मधुमेह का पारिवारिक इतिहास",
    "Gestational diabetes in family":                                  "परिवार में गर्भकालीन मधुमेह",
    "Low physical activity":                                           "कम शारीरिक गतिविधि",
    "Unhealthy diet (processed/sugary)":                               "अस्वस्थ आहार (प्रसंस्कृत/शर्करायुक्त)",
    "Regular sugary drink consumption":                                "नियमित शर्करायुक्त पेय सेवन",
    "High alcohol intake":                                             "अत्यधिक शराब सेवन",
    "Current smoker":                                                  "वर्तमान धूम्रपायी",
    "Frequent thirst":                                                 "बार-बार प्यास लगना",
    "Frequent urination":                                              "बार-बार पेशाब आना",
    "Dark skin patches (insulin resistance sign)":                     "काले त्वचा के धब्बे (इंसुलिन प्रतिरोध का संकेत)",
    "Persistent fatigue":                                              "लगातार थकान",
    "Recent unexplained weight change: Weight loss":                   "हाल ही में अस्पष्टीकृत वजन कम होना",
    "Recent unexplained weight change: Weight gain":                   "हाल ही में अस्पष्टीकृत वजन बढ़ना",
    "Excessive hunger after meals":                                    "खाने के बाद अत्यधिक भूख",
    "Short sleep duration":                                            "कम नींद की अवधि",
    "Sub-optimal sleep duration":                                      "अपर्याप्त नींद की अवधि",
    "Sleep issues / possible sleep apnea":                             "नींद संबंधी समस्याएं / संभावित स्लीप एपनिया",
    "Moderate stress":                                                 "मध्यम तनाव",
    "Daily high stress":                                               "रोजाना उच्च तनाव",
    "Female-specific risk (GDM/PCOS)":                                 "महिला-विशिष्ट जोखिम (GDM/PCOS)",
    "Backend server not responding — please start app.py":             "बैकएंड सर्वर प्रतिक्रिया नहीं दे रहा — कृपया app.py शुरू करें",
  },
  mr: {
    "Age ≥ 45 increases risk":                                        "45 किंवा त्यावरील वय — धोका वाढतो",
    "High body weight / BMI (approx)":                                "जास्त वजन / BMI — प्राथमिक जोखीम घटक",
    "Large waist circumference":                                       "मोठी कंबर परिधी — केंद्रीय लठ्ठपणा",
    "Family history of diabetes":                                      "मधुमेहाचा कौटुंबिक इतिहास",
    "Gestational diabetes in family":                                  "कुटुंबात गर्भकालीन मधुमेह",
    "Low physical activity":                                           "कमी शारीरिक हालचाल",
    "Unhealthy diet (processed/sugary)":                               "अनारोग्यकारक आहार (प्रक्रिया केलेले/साखरयुक्त)",
    "Regular sugary drink consumption":                                "नियमित साखरयुक्त पेये सेवन",
    "High alcohol intake":                                             "जास्त मद्यपान",
    "Current smoker":                                                  "सध्या धूम्रपान करतो",
    "Frequent thirst":                                                 "वारंवार तहान लागणे",
    "Frequent urination":                                              "वारंवार लघवीला जाणे",
    "Dark skin patches (insulin resistance sign)":                     "काळे त्वचेचे डाग (इन्सुलिन प्रतिरोधाचे चिन्ह)",
    "Persistent fatigue":                                              "सतत थकवा",
    "Recent unexplained weight change: Weight loss":                   "अलीकडे अस्पष्टीकृत वजन कमी",
    "Recent unexplained weight change: Weight gain":                   "अलीकडे अस्पष्टीकृत वजन वाढ",
    "Excessive hunger after meals":                                    "जेवणानंतर जास्त भूक",
    "Short sleep duration":                                            "कमी झोपेचा कालावधी",
    "Sub-optimal sleep duration":                                      "अपुऱ्या झोपेचा कालावधी",
    "Sleep issues / possible sleep apnea":                             "झोपेच्या समस्या / संभाव्य स्लीप एपनिया",
    "Moderate stress":                                                 "मध्यम ताण",
    "Daily high stress":                                               "रोज जास्त ताण",
    "Female-specific risk (GDM/PCOS)":                                 "महिला-विशिष्ट धोका (GDM/PCOS)",
    "Backend server not responding — please start app.py":             "बॅकएंड सर्व्हर प्रतिसाद देत नाही — कृपया app.py सुरू करा",
  },
};

function tr(map, lang, text) {
  if (lang === "en" || !map[lang]) return text;
  const m = map[lang];
  if (m[text]) return m[text];
  const key = Object.keys(m).find((k) => text.startsWith(k));
  return key ? m[key] : text;
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
    .map((r) => `<li><span>⚠️</span><span>${tr(REASON_TRANS, lang, r)}</span></li>`)
    .join("");

  const precItems = t.prec
    .map((item) => `<li><span>${item.ico}</span><span>${item.t}</span></li>`)
    .join("");

  const labels = {
    en: {
      brand: "DiabetesIQ", sub: "Lifestyle Screening — Risk Report",
      riskLbl: "Risk Score", contributing: "Contributing Factors",
      recommended: "Recommended Actions",
      discTitle: "⚕️ Medical Disclaimer",
      discBody: "This tool is for educational screening purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.",
      footer: `DiabetesIQ · Lifestyle Screening Report · ${date}`,
    },
    hi: {
      brand: "DiabetesIQ", sub: "जीवनशैली जांच — जोखिम रिपोर्ट",
      riskLbl: "जोखिम स्कोर", contributing: "योगदान देने वाले कारक",
      recommended: "अनुशंसित कार्रवाइयाँ",
      discTitle: "⚕️ चिकित्सा अस्वीकरण",
      discBody: "यह उपकरण केवल शैक्षिक स्क्रीनिंग उद्देश्यों के लिए है। यह चिकित्सा सलाह, निदान या उपचार नहीं है। हमेशा एक योग्य स्वास्थ्य पेशेवर से परामर्श करें।",
      footer: `DiabetesIQ · जीवनशैली जांच रिपोर्ट · ${date}`,
    },
    mr: {
      brand: "DiabetesIQ", sub: "जीवनशैली तपासणी — जोखीम अहवाल",
      riskLbl: "जोखीम स्कोर", contributing: "योगदान देणारे घटक",
      recommended: "शिफारस केलेल्या कृती",
      discTitle: "⚕️ वैद्यकीय अस्वीकरण",
      discBody: "हे साधन केवळ शैक्षणिक तपासणी उद्देशांसाठी आहे. हे वैद्यकीय सल्ला, निदान किंवा उपचार नाही. नेहमी एखाद्या पात्र आरोग्यसेवा व्यावसायिकाचा सल्ला घ्या.",
      footer: `DiabetesIQ · जीवनशैली तपासणी अहवाल · ${date}`,
    },
  };
  const lbl = labels[lang] || labels.en;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>${lbl.brand} — ${lbl.sub}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;background:#fff;color:#1a1a1a;max-width:640px;margin:0 auto;padding:48px 40px}
    .header{text-align:center;border-bottom:2px solid #10b981;padding-bottom:20px;margin-bottom:28px}
    .brand{font-size:2rem;font-weight:900;letter-spacing:-.03em}
    .brand em{color:#10b981;font-style:normal}
    .sub{font-size:.8rem;color:#777;margin-top:6px;letter-spacing:.05em}
    .risk-box{text-align:center;border:2px solid ${col};border-radius:12px;padding:28px;margin-bottom:28px}
    .pct{font-size:5rem;font-weight:900;color:${col};line-height:1}
    .pct-lbl{font-size:.75rem;color:#999;margin-top:4px}
    .result{font-size:1.4rem;font-weight:700;color:${col};margin-top:10px}
    .expl{font-size:.85rem;color:#555;margin-top:8px;line-height:1.7}
    .sec-title{font-size:.75rem;font-weight:800;color:#10b981;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin:24px 0 12px}
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
  ${reasons ? `<div class="sec-title">${lbl.contributing}</div><ul>${reasons}</ul>` : ""}
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
  const emoji   = p < 30 ? "🟢" : p < 60 ? "🟡" : "🔴";
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
              <div className="rs-heading">{t.contributing}</div>
              <ul className="reasons-list">
                {reasons.map((r, i) => (
                  <li key={i}>
                    <span className="reason-dot">⚠️</span>
                    {tr(REASON_TRANS, lang, r)}
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