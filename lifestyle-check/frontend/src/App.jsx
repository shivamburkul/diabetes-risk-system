import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ProgressNav from "./components/ProgressNav";
import QuestionCard from "./components/QuestionCard";
import ResultCard from "./components/ResultCard";

/* ─── BASE QUESTIONS (English — used as source of truth for backend keys) ─── */
const QUESTIONS = [
  { id:"age",      short:"Age",       title:"What is your age?",                                         desc:"Risk increases significantly after age 45.",                                           options:["<25","25–34","35–44","45–54","55–64","65–74","75+"],                                          sticker:"/stickers/cake.png" },
  { id:"gender",   short:"Gender",    title:"What is your gender?",                                      desc:"Biological sex influences metabolic risk factors.",                                    options:["Male","Female","Non-binary","Prefer not to say"],                                             sticker:"/stickers/gender.png" },
  { id:"ethnicity",short:"Ethnicity", title:"What is your ethnicity?",                                   desc:"Some ethnic groups have a significantly higher genetic predisposition.",               options:["South Asian","African-American","Latino/Hispanic","Native American","White/Caucasian","East Asian","Middle Eastern","Prefer not to say"], sticker:"/stickers/ethnicity.png" },
  { id:"weight",   short:"Weight",    title:"What is your approximate weight range?",                    desc:"Used to estimate BMI — a key risk factor for Type 2 diabetes.",                       options:["<50 kg","50–64 kg","65–79 kg","80–94 kg","95–109 kg","110+ kg"],                              sticker:"/stickers/scale.png" },
  { id:"waist",    short:"Waist",     title:"Do you have a large waist circumference?",                  desc:"Men >102 cm / Women >88 cm indicates central obesity — a primary risk factor.",       options:["Yes","No","Not sure","Prefer not to say"],                                                    sticker:"/stickers/waist.png" },
  { id:"family",   short:"Family",    title:"Do blood relatives have diabetes?",                         desc:"First-degree family history (parent/sibling) is one of the strongest risk markers.",  options:["Yes","No","Gestational only","Not sure"],                                                    sticker:"/stickers/family.png" },
  { id:"gestational_family", short:"GDM Fam", title:"Has anyone in your family had gestational diabetes?", desc:"Gestational diabetes in family history indicates heightened genetic risk.",      options:["Yes","No","Not sure","Prefer not to say"],                                                     sticker:"/stickers/pregnancy.png" },
  { id:"activity", short:"Activity",  title:"How many days/week do you exercise ≥30 mins?",              desc:"Regular physical activity is one of the most effective protective factors.",            options:["0","1–2","3–4","5–7"],                                                                         sticker:"/stickers/run.png" },
  { id:"diet",     short:"Diet",      title:"How would you describe your diet?",                         desc:"Diet quality has a direct and significant impact on blood glucose regulation.",        options:["High fruits/veg/whole grains","Balanced/mixed","High processed/sugary foods","Mostly fast food"], sticker:"/stickers/food.png" },
  { id:"sugary_drinks", short:"Drinks", title:"Do you consume sugary drinks regularly?",                 desc:"Sodas, energy drinks and juices spike blood sugar and increase long-term risk.",      options:["Daily","Few times/week","Rarely","Never"],                                                   sticker:"/stickers/drink.png" },
  { id:"alcohol",  short:"Alcohol",   title:"How much alcohol do you consume weekly?",                   desc:"High alcohol intake impairs liver function and affects insulin metabolism.",           options:["None","1–7 units","8–14 units","15+ units"],                                                  sticker:"/stickers/alcohol.png" },
  { id:"smoke",    short:"Smoking",   title:"Do you smoke?",                                             desc:"Smoking increases cardiometabolic inflammation and insulin resistance.",              options:["Current smoker","Former smoker","Never","Prefer not to say"],                                 sticker:"/stickers/cig.png" },
  { id:"thirst",   short:"Thirst",    title:"Do you often feel very thirsty?",                           desc:"Excessive thirst (polydipsia) is one of the earliest warning signs of high blood sugar.", options:["Yes","Sometimes","Rarely","Never"],                                                 sticker:"/stickers/thirst.png" },
  { id:"urinate",  short:"Urination", title:"Do you urinate frequently (especially at night)?",          desc:"Frequent urination (polyuria) is a classic early symptom of diabetes.",               options:["Yes","Sometimes","No","Prefer not to say"],                                                   sticker:"/stickers/toilet.png" },
  { id:"fatigue",  short:"Fatigue",   title:"Do you feel very tired even after rest?",                   desc:"Persistent unexplained fatigue can be related to impaired glucose utilisation.",     options:["Yes","Sometimes","Rarely","Never"],                                                           sticker:"/stickers/tired.png" },
  { id:"weight_change", short:"Wt Change", title:"Any unexplained weight loss or gain?",                desc:"Sudden unexplained weight changes can indicate metabolic disruption.",                options:["Weight loss","Weight gain","No change","Prefer not to say"],                                  sticker:"/stickers/weight.png" },
  { id:"hunger",   short:"Hunger",    title:"Do you feel hungry shortly after eating?",                  desc:"Rapid return of hunger after meals may reflect blood sugar fluctuations.",            options:["Yes","Sometimes","Rarely","Never"],                                                           sticker:"/stickers/hunger.png" },
  { id:"acanthosis",short:"Skin",     title:"Dark skin patches on neck or armpits?",                     desc:"Dark velvety patches (acanthosis nigricans) are a visible sign of insulin resistance.", options:["Yes","No","Not sure","Prefer not to say"],                                               sticker:"/stickers/skin.png" },
  { id:"sleep",    short:"Sleep",     title:"How many hours of sleep per night on average?",             desc:"Both under and over-sleeping are associated with increased metabolic risk.",           options:["<5","5–6","7–8",">8"],                                                                         sticker:"/stickers/sleep.png" },
  { id:"sleep_issues", short:"Apnea", title:"Do you have sleep issues or sleep apnea?",                 desc:"Sleep apnea causes oxygen disruption strongly linked to insulin resistance.",         options:["Yes","No","Not sure","Prefer not to say"],                                                   sticker:"/stickers/apnea.png" },
  { id:"stress",   short:"Stress",    title:"How often do you experience high stress?",                  desc:"Chronic stress elevates cortisol, which directly raises blood glucose levels.",       options:["Rarely","Sometimes","Often","Daily"],                                                         sticker:"/stickers/stress.png" },
  { id:"female_factors", short:"Female", title:"For women: Gestational diabetes or PCOS?",              desc:"Both GDM and PCOS are strong independent risk factors for developing Type 2 diabetes.", options:["Gestational diabetes","PCOS","Both","No / Not applicable"],                              sticker:"/stickers/female.png" },
];

/* ─── TRANSLATIONS (Hindi + Marathi) ──────────────────────────────────────── */
// Options use {key, label}: key = English string sent to backend, label = displayed text
const QUESTIONS_I18N = {
  hi: {
    age:      { short:"उम्र",       title:"आपकी उम्र क्या है?",                                    desc:"45 के बाद जोखिम काफी बढ़ जाता है।",
                options:[{key:"<25",label:"<25"},{key:"25–34",label:"25–34"},{key:"35–44",label:"35–44"},{key:"45–54",label:"45–54"},{key:"55–64",label:"55–64"},{key:"65–74",label:"65–74"},{key:"75+",label:"75+"}] },
    gender:   { short:"लिंग",       title:"आपका लिंग क्या है?",                                    desc:"जैविक लिंग चयापचय जोखिम को प्रभावित करता है।",
                options:[{key:"Male",label:"पुरुष"},{key:"Female",label:"महिला"},{key:"Non-binary",label:"गैर-बाइनरी"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    ethnicity:{ short:"जातीयता",    title:"आपकी जातीयता क्या है?",                                 desc:"कुछ जातीय समूहों में आनुवंशिक प्रवृत्ति अधिक होती है।",
                options:[{key:"South Asian",label:"दक्षिण एशियाई"},{key:"African-American",label:"अफ्रीकी-अमेरिकी"},{key:"Latino/Hispanic",label:"लैटिनो/हिस्पैनिक"},{key:"Native American",label:"मूल अमेरिकी"},{key:"White/Caucasian",label:"श्वेत/कॉकेशियन"},{key:"East Asian",label:"पूर्व एशियाई"},{key:"Middle Eastern",label:"मध्य पूर्वी"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    weight:   { short:"वजन",        title:"आपका अनुमानित वजन?",                                    desc:"BMI का अनुमान लगाने के लिए — टाइप 2 मधुमेह का प्रमुख जोखिम कारक।",
                options:[{key:"<50 kg",label:"<50 kg"},{key:"50–64 kg",label:"50–64 kg"},{key:"65–79 kg",label:"65–79 kg"},{key:"80–94 kg",label:"80–94 kg"},{key:"95–109 kg",label:"95–109 kg"},{key:"110+ kg",label:"110+ kg"}] },
    waist:    { short:"कमर",        title:"क्या आपकी कमर बड़ी है?",                                desc:"पुरुष >102 सेमी / महिलाएं >88 सेमी — केंद्रीय मोटापे का संकेत।",
                options:[{key:"Yes",label:"हाँ"},{key:"No",label:"नहीं"},{key:"Not sure",label:"निश्चित नहीं"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    family:   { short:"परिवार",     title:"क्या परिजनों को मधुमेह है?",                            desc:"प्रथम-श्रेणी का पारिवारिक इतिहास सबसे मजबूत जोखिम संकेतकों में से एक है।",
                options:[{key:"Yes",label:"हाँ"},{key:"No",label:"नहीं"},{key:"Gestational only",label:"केवल गर्भकालीन"},{key:"Not sure",label:"निश्चित नहीं"}] },
    gestational_family:{ short:"GDM परिवार", title:"क्या परिवार में गर्भकालीन मधुमेह है?",       desc:"परिवार में गर्भकालीन मधुमेह बढ़े हुए आनुवंशिक जोखिम का संकेत देता है।",
                options:[{key:"Yes",label:"हाँ"},{key:"No",label:"नहीं"},{key:"Not sure",label:"निश्चित नहीं"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    activity: { short:"गतिविधि",   title:"आप सप्ताह में कितने दिन ≥30 मिनट व्यायाम करते हैं?",  desc:"नियमित शारीरिक गतिविधि सबसे प्रभावी सुरक्षात्मक कारकों में से एक है।",
                options:[{key:"0",label:"0"},{key:"1–2",label:"1–2"},{key:"3–4",label:"3–4"},{key:"5–7",label:"5–7"}] },
    diet:     { short:"आहार",       title:"आपका आहार कैसा है?",                                    desc:"आहार की गुणवत्ता का रक्त शर्करा नियमन पर सीधा प्रभाव पड़ता है।",
                options:[{key:"High fruits/veg/whole grains",label:"उच्च फल/सब्जी/साबुत अनाज"},{key:"Balanced/mixed",label:"संतुलित/मिश्रित"},{key:"High processed/sugary foods",label:"उच्च प्रसंस्कृत/शर्करायुक्त"},{key:"Mostly fast food",label:"ज्यादातर फास्ट फूड"}] },
    sugary_drinks:{ short:"पेय",    title:"क्या आप नियमित रूप से मीठे पेय लेते हैं?",              desc:"सोडा, एनर्जी ड्रिंक से रक्त शर्करा बढ़ती है।",
                options:[{key:"Daily",label:"रोज"},{key:"Few times/week",label:"सप्ताह में कुछ बार"},{key:"Rarely",label:"कभी-कभार"},{key:"Never",label:"कभी नहीं"}] },
    alcohol:  { short:"शराब",       title:"आप साप्ताहिक कितनी शराब पीते हैं?",                    desc:"अत्यधिक शराब इंसुलिन चयापचय को प्रभावित करती है।",
                options:[{key:"None",label:"कुछ नहीं"},{key:"1–7 units",label:"1–7 यूनिट"},{key:"8–14 units",label:"8–14 यूनिट"},{key:"15+ units",label:"15+ यूनिट"}] },
    smoke:    { short:"धूम्रपान",   title:"क्या आप धूम्रपान करते हैं?",                            desc:"धूम्रपान इंसुलिन प्रतिरोध बढ़ाता है।",
                options:[{key:"Current smoker",label:"वर्तमान धूम्रपान करने वाले"},{key:"Former smoker",label:"पूर्व धूम्रपान करने वाले"},{key:"Never",label:"कभी नहीं"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    thirst:   { short:"प्यास",      title:"क्या आपको अक्सर बहुत प्यास लगती है?",                  desc:"अत्यधिक प्यास उच्च रक्त शर्करा का प्रारंभिक संकेत है।",
                options:[{key:"Yes",label:"हाँ"},{key:"Sometimes",label:"कभी-कभी"},{key:"Rarely",label:"कभी-कभार"},{key:"Never",label:"कभी नहीं"}] },
    urinate:  { short:"मूत्रत्याग", title:"क्या आप बार-बार पेशाब करते हैं (रात में)?",            desc:"बार-बार पेशाब आना मधुमेह का क्लासिक प्रारंभिक लक्षण है।",
                options:[{key:"Yes",label:"हाँ"},{key:"Sometimes",label:"कभी-कभी"},{key:"No",label:"नहीं"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    fatigue:  { short:"थकान",       title:"क्या आराम के बाद भी बहुत थके हुए महसूस करते हैं?",    desc:"लगातार थकान ग्लूकोज उपयोग से संबंधित हो सकती है।",
                options:[{key:"Yes",label:"हाँ"},{key:"Sometimes",label:"कभी-कभी"},{key:"Rarely",label:"कभी-कभार"},{key:"Never",label:"कभी नहीं"}] },
    weight_change:{ short:"वजन परिवर्तन", title:"कोई अस्पष्ट वजन कमी या बढ़ोतरी?",               desc:"अचानक वजन परिवर्तन चयापचय विकार का संकेत हो सकता है।",
                options:[{key:"Weight loss",label:"वजन कमी"},{key:"Weight gain",label:"वजन बढ़ोतरी"},{key:"No change",label:"कोई परिवर्तन नहीं"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    hunger:   { short:"भूख",        title:"क्या खाने के बाद जल्दी भूख लगती है?",                  desc:"खाने के बाद भूख का लौटना रक्त शर्करा के उतार-चढ़ाव को दर्शा सकता है।",
                options:[{key:"Yes",label:"हाँ"},{key:"Sometimes",label:"कभी-कभी"},{key:"Rarely",label:"कभी-कभार"},{key:"Never",label:"कभी नहीं"}] },
    acanthosis:{ short:"त्वचा",     title:"गर्दन या बगल में काले धब्बे?",                         desc:"काले मखमली धब्बे (एकैंथोसिस) इंसुलिन प्रतिरोध का दृश्य संकेत हैं।",
                options:[{key:"Yes",label:"हाँ"},{key:"No",label:"नहीं"},{key:"Not sure",label:"निश्चित नहीं"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    sleep:    { short:"नींद",        title:"रात में औसतन कितने घंटे सोते हैं?",                    desc:"कम और अधिक सोना दोनों बढ़े हुए चयापचय जोखिम से जुड़े हैं।",
                options:[{key:"<5",label:"<5"},{key:"5–6",label:"5–6"},{key:"7–8",label:"7–8"},{key:">8",label:">8"}] },
    sleep_issues:{ short:"स्लीप एपनिया", title:"क्या आपको नींद की समस्या या स्लीप एपनिया है?",  desc:"स्लीप एपनिया इंसुलिन प्रतिरोध से दृढ़ता से जुड़ा है।",
                options:[{key:"Yes",label:"हाँ"},{key:"No",label:"नहीं"},{key:"Not sure",label:"निश्चित नहीं"},{key:"Prefer not to say",label:"बताना नहीं चाहते"}] },
    stress:   { short:"तनाव",       title:"आप कितनी बार उच्च तनाव अनुभव करते हैं?",               desc:"दीर्घकालिक तनाव कोर्टिसोल बढ़ाता है, जो रक्त शर्करा बढ़ाता है।",
                options:[{key:"Rarely",label:"कभी-कभार"},{key:"Sometimes",label:"कभी-कभी"},{key:"Often",label:"अक्सर"},{key:"Daily",label:"रोज"}] },
    female_factors:{ short:"महिला", title:"महिलाओं के लिए: गर्भकालीन मधुमेह या PCOS?",          desc:"GDM और PCOS दोनों टाइप 2 मधुमेह के स्वतंत्र जोखिम कारक हैं।",
                options:[{key:"Gestational diabetes",label:"गर्भकालीन मधुमेह"},{key:"PCOS",label:"PCOS"},{key:"Both",label:"दोनों"},{key:"No / Not applicable",label:"नहीं / लागू नहीं"}] },
  },

  mr: {
    age:      { short:"वय",         title:"तुमचे वय किती आहे?",                                    desc:"45 नंतर धोका लक्षणीयरीत्या वाढतो.",
                options:[{key:"<25",label:"<25"},{key:"25–34",label:"25–34"},{key:"35–44",label:"35–44"},{key:"45–54",label:"45–54"},{key:"55–64",label:"55–64"},{key:"65–74",label:"65–74"},{key:"75+",label:"75+"}] },
    gender:   { short:"लिंग",       title:"तुमचे लिंग काय आहे?",                                   desc:"जैविक लिंग चयापचय धोका घटकांवर परिणाम करते.",
                options:[{key:"Male",label:"पुरुष"},{key:"Female",label:"महिला"},{key:"Non-binary",label:"नॉन-बायनरी"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    ethnicity:{ short:"वांशिकता",   title:"तुमची वांशिकता काय आहे?",                               desc:"काही वांशिक गटांमध्ये अनुवांशिक प्रवृत्ती जास्त असते.",
                options:[{key:"South Asian",label:"दक्षिण आशियाई"},{key:"African-American",label:"आफ्रिकन-अमेरिकन"},{key:"Latino/Hispanic",label:"लॅटिनो/हिस्पॅनिक"},{key:"Native American",label:"मूळ अमेरिकन"},{key:"White/Caucasian",label:"श्वेत/कॉकेशियन"},{key:"East Asian",label:"पूर्व आशियाई"},{key:"Middle Eastern",label:"मध्य पूर्व"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    weight:   { short:"वजन",        title:"तुमचे अंदाजे वजन किती आहे?",                           desc:"BMI चा अंदाज घेण्यासाठी — टाइप 2 मधुमेहाचा प्रमुख धोका घटक.",
                options:[{key:"<50 kg",label:"<50 kg"},{key:"50–64 kg",label:"50–64 kg"},{key:"65–79 kg",label:"65–79 kg"},{key:"80–94 kg",label:"80–94 kg"},{key:"95–109 kg",label:"95–109 kg"},{key:"110+ kg",label:"110+ kg"}] },
    waist:    { short:"कंबर",       title:"तुमची कंबर मोठी आहे का?",                               desc:"पुरुष >102 सेमी / महिला >88 सेमी मध्यवर्ती लठ्ठपणा दर्शवते.",
                options:[{key:"Yes",label:"हो"},{key:"No",label:"नाही"},{key:"Not sure",label:"निश्चित नाही"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    family:   { short:"कुटुंब",     title:"रक्त नातेवाईकांना मधुमेह आहे का?",                     desc:"प्रथम-श्रेणी कौटुंबिक इतिहास सर्वात मजबूत धोका निर्देशकांपैकी एक आहे.",
                options:[{key:"Yes",label:"हो"},{key:"No",label:"नाही"},{key:"Gestational only",label:"केवळ गर्भावस्थेत"},{key:"Not sure",label:"निश्चित नाही"}] },
    gestational_family:{ short:"GDM कुटुंब", title:"कुटुंबात गर्भावस्थेतील मधुमेह आहे का?",     desc:"कुटुंबात गर्भावस्थेतील मधुमेह वाढीव अनुवांशिक धोका दर्शवतो.",
                options:[{key:"Yes",label:"हो"},{key:"No",label:"नाही"},{key:"Not sure",label:"निश्चित नाही"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    activity: { short:"व्यायाम",    title:"तुम्ही आठवड्यात किती दिवस ≥30 मिनिटे व्यायाम करता?", desc:"नियमित शारीरिक क्रियाकलाप सर्वात प्रभावी संरक्षणात्मक घटकांपैकी एक आहे.",
                options:[{key:"0",label:"0"},{key:"1–2",label:"1–2"},{key:"3–4",label:"3–4"},{key:"5–7",label:"5–7"}] },
    diet:     { short:"आहार",       title:"तुमचा आहार कसा आहे?",                                   desc:"आहाराची गुणवत्ता रक्तातील साखर नियमनावर थेट परिणाम करते.",
                options:[{key:"High fruits/veg/whole grains",label:"जास्त फळे/भाज्या/धान्य"},{key:"Balanced/mixed",label:"संतुलित/मिश्रित"},{key:"High processed/sugary foods",label:"जास्त प्रक्रिया केलेले/साखरयुक्त"},{key:"Mostly fast food",label:"जास्तीत जास्त फास्ट फूड"}] },
    sugary_drinks:{ short:"पेये",   title:"तुम्ही नियमितपणे साखरयुक्त पेये घेता का?",             desc:"सोडा, एनर्जी ड्रिंक रक्तातील साखर वाढवतात.",
                options:[{key:"Daily",label:"दररोज"},{key:"Few times/week",label:"आठवड्यातून काही वेळा"},{key:"Rarely",label:"क्वचित"},{key:"Never",label:"कधीच नाही"}] },
    alcohol:  { short:"मद्यपान",    title:"तुम्ही आठवड्यात किती मद्यपान करता?",                   desc:"जास्त मद्यपान यकृत कार्य आणि इन्सुलिन चयापचयावर परिणाम करते.",
                options:[{key:"None",label:"काहीच नाही"},{key:"1–7 units",label:"1–7 युनिट"},{key:"8–14 units",label:"8–14 युनिट"},{key:"15+ units",label:"15+ युनिट"}] },
    smoke:    { short:"धूम्रपान",   title:"तुम्ही धूम्रपान करता का?",                              desc:"धूम्रपान इन्सुलिन प्रतिरोध वाढवते.",
                options:[{key:"Current smoker",label:"सध्या धूम्रपान करतो"},{key:"Former smoker",label:"पूर्वी केले"},{key:"Never",label:"कधीच नाही"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    thirst:   { short:"तहान",       title:"तुम्हाला अनेकदा खूप तहान लागते का?",                   desc:"अत्याधिक तहान उच्च रक्त शर्करेचे सुरुवातीचे चेतावणी चिन्ह आहे.",
                options:[{key:"Yes",label:"हो"},{key:"Sometimes",label:"काही वेळा"},{key:"Rarely",label:"क्वचित"},{key:"Never",label:"कधीच नाही"}] },
    urinate:  { short:"लघवी",       title:"तुम्ही वारंवार लघवी करता का (रात्री)?",                 desc:"वारंवार लघवी मधुमेहाचे क्लासिक सुरुवातीचे लक्षण आहे.",
                options:[{key:"Yes",label:"हो"},{key:"Sometimes",label:"काही वेळा"},{key:"No",label:"नाही"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    fatigue:  { short:"थकवा",       title:"विश्रांतीनंतरही तुम्हाला खूप थकवा जाणवतो का?",        desc:"सतत अस्पष्ट थकवा ग्लूकोज वापराशी संबंधित असू शकतो.",
                options:[{key:"Yes",label:"हो"},{key:"Sometimes",label:"काही वेळा"},{key:"Rarely",label:"क्वचित"},{key:"Never",label:"कधीच नाही"}] },
    weight_change:{ short:"वजन बदल", title:"कोणतेही अस्पष्ट वजन कमी किंवा वाढ?",                desc:"अचानक अस्पष्ट वजन बदल चयापचय विकाराचे संकेत असू शकतो.",
                options:[{key:"Weight loss",label:"वजन कमी"},{key:"Weight gain",label:"वजन वाढ"},{key:"No change",label:"कोणताही बदल नाही"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    hunger:   { short:"भूक",        title:"जेवणानंतर लवकर भूक लागते का?",                         desc:"जेवणानंतर भुकेचे लवकर परत येणे रक्त शर्करेतील चढ-उतार दर्शवू शकते.",
                options:[{key:"Yes",label:"हो"},{key:"Sometimes",label:"काही वेळा"},{key:"Rarely",label:"क्वचित"},{key:"Never",label:"कधीच नाही"}] },
    acanthosis:{ short:"त्वचा",     title:"मान किंवा काखेत काळे डाग?",                            desc:"काळे मखमली डाग (अॅकॅन्थोसिस) इन्सुलिन प्रतिरोधाचे दृश्य चिन्ह आहे.",
                options:[{key:"Yes",label:"हो"},{key:"No",label:"नाही"},{key:"Not sure",label:"निश्चित नाही"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    sleep:    { short:"झोप",        title:"रात्री सरासरी किती तास झोपता?",                         desc:"कमी आणि जास्त झोप दोन्ही वाढीव चयापचय धोक्याशी संबंधित आहेत.",
                options:[{key:"<5",label:"<5"},{key:"5–6",label:"5–6"},{key:"7–8",label:"7–8"},{key:">8",label:">8"}] },
    sleep_issues:{ short:"स्लीप एपनिया", title:"तुम्हाला झोपेच्या समस्या किंवा स्लीप एपनिया आहे का?", desc:"स्लीप एपनिया इन्सुलिन प्रतिरोधाशी दृढपणे जोडलेले आहे.",
                options:[{key:"Yes",label:"हो"},{key:"No",label:"नाही"},{key:"Not sure",label:"निश्चित नाही"},{key:"Prefer not to say",label:"सांगणे नको"}] },
    stress:   { short:"ताण",        title:"तुम्हाला किती वेळा जास्त ताण येतो?",                    desc:"दीर्घकालीन ताण कॉर्टिसोल वाढवतो, जे थेट रक्त शर्करा वाढवते.",
                options:[{key:"Rarely",label:"क्वचित"},{key:"Sometimes",label:"काही वेळा"},{key:"Often",label:"अनेकदा"},{key:"Daily",label:"रोज"}] },
    female_factors:{ short:"महिला", title:"महिलांसाठी: गर्भावस्थेतील मधुमेह किंवा PCOS?",        desc:"GDM आणि PCOS दोन्ही टाइप 2 मधुमेहाचे स्वतंत्र धोका घटक आहेत.",
                options:[{key:"Gestational diabetes",label:"गर्भावस्थेतील मधुमेह"},{key:"PCOS",label:"PCOS"},{key:"Both",label:"दोन्ही"},{key:"No / Not applicable",label:"नाही / लागू नाही"}] },
  },
};

/* ─── Navigation button labels ───────────────────────────────────────────── */
const BTNS = {
  en: { prev:"← Previous", next:"Next →", predict:"Get My Result →", analyzing:"Analysing…", review:"← Review Answers", viewResult:"View Result →", answered:"answered" },
  hi: { prev:"← पिछला",   next:"अगला →", predict:"मेरा परिणाम →",  analyzing:"विश्लेषण…",  review:"← उत्तर देखें",  viewResult:"परिणाम देखें →", answered:"उत्तर दिए" },
  mr: { prev:"← मागील",   next:"पुढे →",  predict:"माझा निकाल →",   analyzing:"विश्लेषण…",  review:"← उत्तरे पाहा",  viewResult:"निकाल पाहा →",  answered:"उत्तरे दिली" },
};

/* ─── App name ───────────────────────────────────────────────────────────── */
const APP_NAME = { en:"Lifestyle Screening", hi:"जीवनशैली जांच", mr:"जीवनशैली तपासणी" };

/* ─── Loading text ───────────────────────────────────────────────────────── */
const LOADING_TEXT = {
  en: { p:"Analysing your responses…",             s:"Calculating risk score" },
  hi: { p:"आपके उत्तरों का विश्लेषण हो रहा है…", s:"जोखिम स्कोर की गणना हो रही है" },
  mr: { p:"तुमच्या उत्तरांचे विश्लेषण होत आहे…",  s:"धोका स्कोर मोजत आहे" },
};

/* ─── Helper: return localised question ──────────────────────────────────── */
function getQ(q, lang) {
  if (lang === "en") return q;
  const t = QUESTIONS_I18N[lang]?.[q.id];
  if (!t) return q;
  return { ...q, ...t };
}

/* ─── API ────────────────────────────────────────────────────────────────── */
async function fetchPrediction(answers) {
  try {
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    return {
      percent: 0, result: "Connection Error",
      explanation: `Cannot reach the backend at localhost:5000. Make sure app.py is running. (${e.message})`,
      reasons: ["Backend server not responding — please start app.py"],
    };
  }
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [index,    setIndex]    = useState(0);
  const [answers,  setAnswers]  = useState({});
  const [result,   setResult]   = useState(null);
  const [locked,   setLocked]   = useState(false);
  const [viewMode, setViewMode] = useState("quiz");
  const [theme,    setTheme]    = useState(() => localStorage.getItem("diq-theme") || "dark");
  const [lang,     setLang]     = useState(() => localStorage.getItem("diq-lang")  || "en");
  const navRef = useRef(null);
  const advRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("diq-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current.querySelector(`[data-navindex="${index}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (viewMode !== "quiz" && viewMode !== "review") return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, viewMode, locked]);

  const selectOption = useCallback((qid, option) => {
    if (locked) return;
    setAnswers(prev => ({ ...prev, [qid]: option }));
    if (advRef.current) clearTimeout(advRef.current);
    if (index < QUESTIONS.length - 1) {
      advRef.current = setTimeout(() => setIndex(i => i + 1), 380);
    }
  }, [locked, index]);

  function goPrev() {
    if (locked || viewMode === "loading") return;
    if (index > 0) setIndex(i => i - 1);
  }

  function goNext() {
    if (index < QUESTIONS.length - 1) setIndex(i => i + 1);
    else submitAll();
  }

  async function submitAll() {
    if (locked && viewMode === "loading") return;
    setLocked(true);
    setViewMode("loading");
    const data = await fetchPrediction(answers);
    setResult(data);
    setLocked(false);
    setViewMode("result");
  }

  function retake() {
    setAnswers({}); setResult(null);
    setLocked(false); setViewMode("quiz"); setIndex(0);
  }

  const btn          = BTNS[lang] || BTNS.en;
  const loadTxt      = LOADING_TEXT[lang] || LOADING_TEXT.en;
  const navItems     = QUESTIONS.map(q => { const lq = getQ(q, lang); return { key: lq.id, label: lq.short, title: lq.title }; });
  const completedKeys = Object.keys(answers);
  const answeredCount = completedKeys.length;
  const showPrev     = index > 0 && viewMode !== "loading" && viewMode !== "result";
  const showNext     = index < QUESTIONS.length - 1 && viewMode !== "result" && viewMode !== "loading";
  const showPredict  = index === QUESTIONS.length - 1 && viewMode !== "result" && viewMode !== "loading";

  return (
    <div className="app-root">
      <div className="bg-scene">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="grid-lines" />
      </div>

      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")}
        lang={lang}
        onChangeLang={l => { setLang(l); localStorage.setItem("diq-lang", l); }}
        appName={APP_NAME[lang] || APP_NAME.en}
      />

      <main className="main-wrap">
        <div className="quiz-card">
          <div className="card-head">
            <div ref={navRef} className="nav-scroll">
              <ProgressNav
                items={navItems}
                current={index}
                completedKeys={completedKeys}
                onJump={i => {
                  setIndex(i);
                  if (result) setViewMode("review");
                  else setViewMode("quiz");
                }}
              />
            </div>
          </div>

          <div className="card-body">
            <AnimatePresence mode="wait" initial={false}>
              {viewMode === "result" && result ? (
                <ResultCard
                  key="result"
                  data={result}
                  lang={lang}
                  onRetake={retake}
                  onReview={() => { setIndex(QUESTIONS.length - 1); setViewMode("review"); }}
                />
              ) : viewMode === "loading" ? (
                <motion.div key="loading" className="loading-state"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="spinner" />
                  <p>{loadTxt.p}</p>
                  <span>{loadTxt.s}</span>
                </motion.div>
              ) : (
                <QuestionCard
                  key={QUESTIONS[index]?.id}
                  q={getQ(QUESTIONS[index], lang)}
                  value={answers[QUESTIONS[index]?.id] || ""}
                  onSelect={opt => selectOption(QUESTIONS[index].id, opt)}
                  index={index}
                  total={QUESTIONS.length}
                  disabled={viewMode === "review" || locked}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="card-foot">
            <div className="foot-left">
              {viewMode === "result" ? (
                <button className="btn-flat" onClick={() => { setIndex(QUESTIONS.length - 1); setViewMode("review"); }}>
                  {btn.review}
                </button>
              ) : showPrev ? (
                <button className="btn-flat" onClick={goPrev} disabled={locked}>{btn.prev}</button>
              ) : (
                <div className="foot-info">
                  {viewMode !== "result" && (
                    <span className="answer-count">{answeredCount}/{QUESTIONS.length} {btn.answered}</span>
                  )}
                </div>
              )}
            </div>

            <div className="foot-right">
              {result && viewMode !== "result" && viewMode !== "loading" && (
                <button className="btn-flat" onClick={() => setViewMode("result")}>{btn.viewResult}</button>
              )}
              {showNext && (
                <button className="btn-primary" onClick={goNext} disabled={locked}>{btn.next}</button>
              )}
              {showPredict && (
                <button className="btn-primary" onClick={submitAll} disabled={locked}>
                  {viewMode === "loading" ? btn.analyzing : btn.predict}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}