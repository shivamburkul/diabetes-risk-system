import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ProgressNav from "./components/ProgressNav";
import QuestionCard from "./components/QuestionCard";
import ResultCard from "./components/ResultCard";


/* ─── BASE QUESTIONS — ML Engine (BRFSS 2015) ──────────────── */
const QUESTIONS = [
  {
    id: "GenHlth", short: "Gen. Health",
    title: "Overall General Health",
    desc: "How would you rate the patient's general health? This is the strongest single predictor in population studies.",
    sticker: "/stickers/health.png",
    options: [
      { label: "Excellent / Very Good", value: 2 },
      { label: "Good",                  value: 3 },
      { label: "Fair",                  value: 4 },
      { label: "Poor",                  value: 5 },
    ],
  },
  {
    id: "HighBP", short: "Blood Pressure",
    title: "High Blood Pressure Diagnosis",
    desc: "Has a doctor ever told the patient they have high blood pressure?",
    sticker: "/stickers/bp.png",
    options: [
      { label: "No — Blood pressure is normal",  value: 0 },
      { label: "Yes — Diagnosed with high BP",   value: 1 },
    ],
  },
  {
    id: "BMI", short: "BMI",
    title: "Body Mass Index (BMI)",
    desc: "Select the range that best describes the patient's BMI. Obesity is the strongest predictor of Type 2 diabetes.",
    sticker: "/stickers/bmi.png",
    options: [
      { label: "Normal (Below 25)",         value: 22 },
      { label: "Overweight (25–29.9)",      value: 27 },
      { label: "Obese (30–39.9)",           value: 35 },
      { label: "Severely Obese (40+)",      value: 45 },
    ],
  },
  {
    id: "Age", short: "Age",
    title: "Patient's Age Group",
    desc: "Select the patient's age group. Diabetes risk increases significantly after age 45.",
    sticker: "/stickers/age.png",
    options: [
      { label: "18–34 years",          value: 2  },
      { label: "35–49 years",          value: 5  },
      { label: "50–64 years",          value: 9  },
      { label: "65 years and above",   value: 12 },
    ],
  },
  {
    id: "HighChol", short: "Cholesterol",
    title: "High Cholesterol Diagnosis",
    desc: "Has a doctor ever told the patient their blood cholesterol is high?",
    sticker: "/stickers/chol.png",
    options: [
      { label: "No — Cholesterol is normal",         value: 0 },
      { label: "Yes — Diagnosed high cholesterol",   value: 1 },
    ],
  },
  {
    id: "CholCheck", short: "Chol. Check",
    title: "Cholesterol Check in Past 5 Years",
    desc: "Has the patient had their blood cholesterol checked within the past 5 years?",
    sticker: "/stickers/cholcheck.png",
    options: [
      { label: "No — Not checked in 5 years", value: 0 },
      { label: "Yes — Recently checked",      value: 1 },
    ],
  },
  {
    id: "Income", short: "Income",
    title: "Annual Household Income",
    desc: "Income affects access to healthy food and healthcare quality.",
    sticker: "/stickers/income.png",
    options: [
      { label: "Less than $20,000",    value: 2 },
      { label: "$20,000–$34,999",      value: 4 },
      { label: "$35,000–$74,999",      value: 6 },
      { label: "$75,000 or more",      value: 8 },
    ],
  },
  {
    id: "PhysHlth", short: "Phys. Health",
    title: "Days of Poor Physical Health (Past 30 Days)",
    desc: "How many days in the past 30 days was physical health NOT good?",
    sticker: "/stickers/physhlth.png",
    options: [
      { label: "0 days — Perfectly healthy", value: 0  },
      { label: "1–9 days",                   value: 5  },
      { label: "10–19 days",                 value: 14 },
      { label: "20–30 days",                 value: 25 },
    ],
  },
  {
    id: "DiffWalk", short: "Mobility",
    title: "Difficulty Walking or Climbing Stairs",
    desc: "Does the patient have serious difficulty walking or climbing stairs?",
    sticker: "/stickers/walk.png",
    options: [
      { label: "No — Walks without difficulty", value: 0 },
      { label: "Yes — Has mobility issues",     value: 1 },
    ],
  },
  {
    id: "HeartDiseaseorAttack", short: "Heart",
    title: "Heart Disease or Heart Attack",
    desc: "Has the patient ever been diagnosed with coronary heart disease or had a heart attack?",
    sticker: "/stickers/heart.png",
    options: [
      { label: "No — No heart condition",     value: 0 },
      { label: "Yes — Has a heart condition", value: 1 },
    ],
  },
  {
    id: "PhysActivity", short: "Activity",
    title: "Physical Activity in Past 30 Days",
    desc: "Has the patient done any physical activity in the past 30 days (outside regular job)?",
    sticker: "/stickers/activity.png",
    options: [
      { label: "No — Not active this month",     value: 0 },
      { label: "Yes — Active in past 30 days",   value: 1 },
    ],
  },
  {
    id: "Stroke", short: "Stroke",
    title: "History of Stroke",
    desc: "Has the patient ever been told by a doctor that they had a stroke?",
    sticker: "/stickers/stroke.png",
    options: [
      { label: "No — Never had a stroke",     value: 0 },
      { label: "Yes — Had a stroke before",   value: 1 },
    ],
  },
  {
    id: "MentHlth", short: "Mental Health",
    title: "Days of Poor Mental Health (Past 30 Days)",
    desc: "How many days was mental health NOT good? Includes stress, depression, anxiety.",
    sticker: "/stickers/mental.png",
    options: [
      { label: "0 days — Good all month", value: 0  },
      { label: "1–9 days",                value: 5  },
      { label: "10–19 days",              value: 14 },
      { label: "20–30 days",              value: 25 },
    ],
  },
  {
    id: "Veggies", short: "Vegetables",
    title: "Daily Vegetable Consumption",
    desc: "Does the patient consume vegetables one or more times per day?",
    sticker: "/stickers/veggies.png",
    options: [
      { label: "No — Rarely eats vegetables",    value: 0 },
      { label: "Yes — Eats veggies every day",   value: 1 },
    ],
  },
  {
    id: "HvyAlcoholConsump", short: "Alcohol",
    title: "Heavy Alcohol Consumption",
    desc: "Men >14 drinks/week. Women >7 drinks/week.",
    sticker: "/stickers/alcohol.png",
    options: [
      { label: "No — Within healthy limits", value: 0 },
      { label: "Yes — Drinks heavily",       value: 1 },
    ],
  },
  {
    id: "Fruits", short: "Fruits",
    title: "Daily Fruit Consumption",
    desc: "Does the patient consume fruit one or more times per day?",
    sticker: "/stickers/fruits.png",
    options: [
      { label: "No — Rarely eats fruit",      value: 0 },
      { label: "Yes — Eats fruit every day",  value: 1 },
    ],
  },
  {
    id: "Smoker", short: "Smoker",
    title: "Lifetime Smoking History",
    desc: "Has the patient smoked at least 100 cigarettes (about 5 packs) in their entire lifetime?",
    sticker: "/stickers/smoker.png",
    options: [
      { label: "No — Fewer than 100 cigarettes",  value: 0 },
      { label: "Yes — 100+ cigarettes lifetime",  value: 1 },
    ],
  },
  {
    id: "AnyHealthcare", short: "Healthcare",
    title: "Health Insurance or Coverage",
    desc: "Does the patient have any health care coverage?",
    sticker: "/stickers/healthcare.png",
    options: [
      { label: "No — No health coverage",     value: 0 },
      { label: "Yes — Has health coverage",   value: 1 },
    ],
  },
  {
    id: "NoDocbcCost", short: "Doc Cost",
    title: "Couldn't See Doctor Due to Cost",
    desc: "Was there a time in the past 12 months when a doctor couldn't be seen because of cost?",
    sticker: "/stickers/nodoccost.png",
    options: [
      { label: "No — Could afford the doctor",  value: 0 },
      { label: "Yes — Cost was a barrier",      value: 1 },
    ],
  },
  {
    id: "Education", short: "Education",
    title: "Highest Education Level",
    desc: "What is the highest grade or year of school completed?",
    sticker: "/stickers/education.png",
    options: [
      { label: "Never attended / Elementary", value: 1 },
      { label: "Some High School",            value: 3 },
      { label: "High School Graduate",        value: 4 },
      { label: "College Graduate",            value: 6 },
    ],
  },
  {
    id: "Sex", short: "Sex",
    title: "Biological Sex",
    desc: "Please select the patient's biological sex as recorded in health records.",
    sticker: "/stickers/gender.png",
    options: [
      { label: "Female", value: 0 },
      { label: "Male",   value: 1 },
    ],
  },
];

/* ─── TRANSLATIONS (hi = Hindi, mr = Marathi) ───────────────────
   Options use {label, value} so backend always receives the
   original numeric value regardless of displayed language.
─────────────────────────────────────────────────────────────────*/
const Q_TRANS = {
  hi: {
    GenHlth:              { short:"सामान्य स्वास्थ्य", title:"समग्र सामान्य स्वास्थ्य",               desc:"रोगी के सामान्य स्वास्थ्य को कैसे आंकते हैं? यह जनसंख्या अध्ययनों में सबसे मजबूत एकल भविष्यवक्ता है।",
                            options:[{label:"उत्कृष्ट / बहुत अच्छा",value:2},{label:"अच्छा",value:3},{label:"उचित",value:4},{label:"खराब",value:5}] },
    HighBP:               { short:"रक्तचाप",           title:"उच्च रक्तचाप निदान",                     desc:"क्या किसी डॉक्टर ने कभी रोगी को उच्च रक्तचाप होने की बात कही है?",
                            options:[{label:"नहीं — रक्तचाप सामान्य है",value:0},{label:"हाँ — उच्च BP का निदान हुआ है",value:1}] },
    BMI:                  { short:"BMI",               title:"बॉडी मास इंडेक्स (BMI)",                 desc:"रोगी के BMI का सबसे अच्छा वर्णन करने वाली श्रेणी चुनें। मोटापा टाइप 2 मधुमेह का सबसे मजबूत भविष्यवक्ता है।",
                            options:[{label:"सामान्य (25 से नीचे)",value:22},{label:"अधिक वजन (25–29.9)",value:27},{label:"मोटापा (30–39.9)",value:35},{label:"गंभीर मोटापा (40+)",value:45}] },
    Age:                  { short:"आयु",               title:"रोगी का आयु वर्ग",                       desc:"रोगी का आयु वर्ग चुनें। 45 वर्ष की आयु के बाद मधुमेह का जोखिम काफी बढ़ जाता है।",
                            options:[{label:"18–34 वर्ष",value:2},{label:"35–49 वर्ष",value:5},{label:"50–64 वर्ष",value:9},{label:"65 वर्ष और अधिक",value:12}] },
    HighChol:             { short:"कोलेस्ट्रॉल",      title:"उच्च कोलेस्ट्रॉल निदान",                 desc:"क्या किसी डॉक्टर ने कभी रोगी के रक्त कोलेस्ट्रॉल को उच्च बताया है?",
                            options:[{label:"नहीं — कोलेस्ट्रॉल सामान्य है",value:0},{label:"हाँ — उच्च कोलेस्ट्रॉल का निदान हुआ",value:1}] },
    CholCheck:            { short:"कोलेस्ट्रॉल जांच",title:"पिछले 5 वर्षों में कोलेस्ट्रॉल जांच",    desc:"क्या रोगी ने पिछले 5 वर्षों में रक्त कोलेस्ट्रॉल की जांच करवाई है?",
                            options:[{label:"नहीं — 5 वर्षों में जांच नहीं हुई",value:0},{label:"हाँ — हाल ही में जांच हुई",value:1}] },
    Income:               { short:"आय",               title:"वार्षिक घरेलू आय",                        desc:"आय का स्वस्थ भोजन और स्वास्थ्य देखभाल की गुणवत्ता तक पहुंच पर प्रभाव पड़ता है।",
                            options:[{label:"$20,000 से कम",value:2},{label:"$20,000–$34,999",value:4},{label:"$35,000–$74,999",value:6},{label:"$75,000 या अधिक",value:8}] },
    PhysHlth:             { short:"शारीरिक स्वास्थ्य",title:"खराब शारीरिक स्वास्थ्य के दिन (पिछले 30 दिन)", desc:"पिछले 30 दिनों में कितने दिन शारीरिक स्वास्थ्य अच्छा नहीं था?",
                            options:[{label:"0 दिन — पूरी तरह स्वस्थ",value:0},{label:"1–9 दिन",value:5},{label:"10–19 दिन",value:14},{label:"20–30 दिन",value:25}] },
    DiffWalk:             { short:"गतिशीलता",         title:"चलने या सीढ़ी चढ़ने में कठिनाई",         desc:"क्या रोगी को चलने या सीढ़ी चढ़ने में गंभीर कठिनाई है?",
                            options:[{label:"नहीं — बिना कठिनाई के चलता है",value:0},{label:"हाँ — गतिशीलता की समस्याएं हैं",value:1}] },
    HeartDiseaseorAttack: { short:"हृदय",             title:"हृदय रोग या दिल का दौरा",                desc:"क्या रोगी को कभी कोरोनरी हृदय रोग का निदान हुआ है या दिल का दौरा पड़ा है?",
                            options:[{label:"नहीं — कोई हृदय स्थिति नहीं",value:0},{label:"हाँ — हृदय की स्थिति है",value:1}] },
    PhysActivity:         { short:"गतिविधि",          title:"पिछले 30 दिनों में शारीरिक गतिविधि",     desc:"क्या रोगी ने पिछले 30 दिनों में (नियमित काम के अलावा) कोई शारीरिक गतिविधि की है?",
                            options:[{label:"नहीं — इस महीने सक्रिय नहीं",value:0},{label:"हाँ — पिछले 30 दिनों में सक्रिय रहा",value:1}] },
    Stroke:               { short:"स्ट्रोक",          title:"स्ट्रोक का इतिहास",                      desc:"क्या किसी डॉक्टर ने कभी रोगी को बताया है कि उन्हें स्ट्रोक हुआ था?",
                            options:[{label:"नहीं — कभी स्ट्रोक नहीं हुआ",value:0},{label:"हाँ — पहले स्ट्रोक हुआ था",value:1}] },
    MentHlth:             { short:"मानसिक स्वास्थ्य", title:"खराब मानसिक स्वास्थ्य के दिन (पिछले 30 दिन)", desc:"कितने दिन मानसिक स्वास्थ्य अच्छा नहीं था? तनाव, अवसाद, चिंता सहित।",
                            options:[{label:"0 दिन — पूरे महीने अच्छा",value:0},{label:"1–9 दिन",value:5},{label:"10–19 दिन",value:14},{label:"20–30 दिन",value:25}] },
    Veggies:              { short:"सब्जियां",         title:"दैनिक सब्जी सेवन",                       desc:"क्या रोगी प्रतिदिन एक या अधिक बार सब्जियां खाता है?",
                            options:[{label:"नहीं — कम ही सब्जियां खाता है",value:0},{label:"हाँ — हर दिन सब्जियां खाता है",value:1}] },
    HvyAlcoholConsump:    { short:"शराब",             title:"अत्यधिक शराब सेवन",                      desc:"पुरुष >14 पेय/सप्ताह। महिलाएं >7 पेय/सप्ताह।",
                            options:[{label:"नहीं — स्वस्थ सीमा के भीतर",value:0},{label:"हाँ — अत्यधिक पीता है",value:1}] },
    Fruits:               { short:"फल",              title:"दैनिक फल सेवन",                          desc:"क्या रोगी प्रतिदिन एक या अधिक बार फल खाता है?",
                            options:[{label:"नहीं — कम ही फल खाता है",value:0},{label:"हाँ — हर दिन फल खाता है",value:1}] },
    Smoker:               { short:"धूम्रपान",        title:"जीवनकाल धूम्रपान इतिहास",               desc:"क्या रोगी ने अपने पूरे जीवन में कम से कम 100 सिगरेट पी हैं?",
                            options:[{label:"नहीं — 100 से कम सिगरेट",value:0},{label:"हाँ — जीवनकाल में 100+ सिगरेट",value:1}] },
    AnyHealthcare:        { short:"स्वास्थ्य बीमा",  title:"स्वास्थ्य बीमा या कवरेज",               desc:"क्या रोगी के पास कोई स्वास्थ्य देखभाल कवरेज है?",
                            options:[{label:"नहीं — कोई स्वास्थ्य कवरेज नहीं",value:0},{label:"हाँ — स्वास्थ्य कवरेज है",value:1}] },
    NoDocbcCost:          { short:"डॉक्टर लागत",    title:"लागत के कारण डॉक्टर नहीं देख सका",      desc:"क्या पिछले 12 महीनों में ऐसा कोई समय था जब लागत के कारण डॉक्टर के पास नहीं जा सका?",
                            options:[{label:"नहीं — डॉक्टर का खर्च उठा सका",value:0},{label:"हाँ — लागत एक बाधा थी",value:1}] },
    Education:            { short:"शिक्षा",          title:"उच्चतम शिक्षा स्तर",                     desc:"स्कूल में पूरी की गई उच्चतम कक्षा या वर्ष क्या है?",
                            options:[{label:"कभी नहीं गया / प्राथमिक",value:1},{label:"कुछ हाई स्कूल",value:3},{label:"हाई स्कूल स्नातक",value:4},{label:"कॉलेज स्नातक",value:6}] },
    Sex:                  { short:"लिंग",            title:"जैविक लिंग",                              desc:"कृपया स्वास्थ्य रिकॉर्ड में दर्ज रोगी का जैविक लिंग चुनें।",
                            options:[{label:"महिला",value:0},{label:"पुरुष",value:1}] },
  },
  mr: {
    GenHlth:              { short:"सामान्य आरोग्य", title:"एकूण सामान्य आरोग्य",                    desc:"रुग्णाच्या सामान्य आरोग्याचे मूल्यांकन कसे कराल? हे लोकसंख्या अभ्यासातील सर्वात मजबूत एकल भविष्यवक्ता आहे.",
                            options:[{label:"उत्कृष्ट / खूप चांगले",value:2},{label:"चांगले",value:3},{label:"बरे",value:4},{label:"वाईट",value:5}] },
    HighBP:               { short:"रक्तदाब",        title:"उच्च रक्तदाब निदान",                     desc:"डॉक्टरांनी कधी रुग्णाला उच्च रक्तदाब असल्याचे सांगितले आहे का?",
                            options:[{label:"नाही — रक्तदाब सामान्य आहे",value:0},{label:"होय — उच्च BP चे निदान झाले आहे",value:1}] },
    BMI:                  { short:"BMI",            title:"बॉडी मास इंडेक्स (BMI)",                 desc:"रुग्णाच्या BMI चे सर्वोत्तम वर्णन करणारी श्रेणी निवडा. लठ्ठपणा हा टाइप 2 मधुमेहाचा सर्वात मजबूत भविष्यवक्ता आहे.",
                            options:[{label:"सामान्य (25 च्या खाली)",value:22},{label:"जास्त वजन (25–29.9)",value:27},{label:"लठ्ठ (30–39.9)",value:35},{label:"तीव्र लठ्ठ (40+)",value:45}] },
    Age:                  { short:"वय",             title:"रुग्णाचा वयोगट",                         desc:"रुग्णाचा वयोगट निवडा. 45 वर्षांनंतर मधुमेहाचा धोका लक्षणीयरीत्या वाढतो.",
                            options:[{label:"18–34 वर्षे",value:2},{label:"35–49 वर्षे",value:5},{label:"50–64 वर्षे",value:9},{label:"65 वर्षे आणि त्यावरील",value:12}] },
    HighChol:             { short:"कोलेस्टेरॉल",   title:"उच्च कोलेस्टेरॉल निदान",                 desc:"डॉक्टरांनी कधी रुग्णाचे रक्त कोलेस्टेरॉल जास्त असल्याचे सांगितले आहे का?",
                            options:[{label:"नाही — कोलेस्टेरॉल सामान्य आहे",value:0},{label:"होय — उच्च कोलेस्टेरॉलचे निदान झाले",value:1}] },
    CholCheck:            { short:"कोलेस्टेरॉल तपासणी", title:"गेल्या 5 वर्षांत कोलेस्टेरॉल तपासणी", desc:"रुग्णाने गेल्या 5 वर्षांत रक्त कोलेस्टेरॉल तपासले आहे का?",
                            options:[{label:"नाही — 5 वर्षांत तपासणी नाही",value:0},{label:"होय — अलीकडे तपासणी केली",value:1}] },
    Income:               { short:"उत्पन्न",        title:"वार्षिक कौटुंबिक उत्पन्न",              desc:"उत्पन्न निरोगी अन्न आणि आरोग्यसेवेच्या गुणवत्तेवर परिणाम करते.",
                            options:[{label:"$20,000 पेक्षा कमी",value:2},{label:"$20,000–$34,999",value:4},{label:"$35,000–$74,999",value:6},{label:"$75,000 किंवा जास्त",value:8}] },
    PhysHlth:             { short:"शारीरिक आरोग्य", title:"खराब शारीरिक आरोग्याचे दिवस (गेले 30 दिवस)", desc:"गेल्या 30 दिवसांत किती दिवस शारीरिक आरोग्य चांगले नव्हते?",
                            options:[{label:"0 दिवस — पूर्णपणे निरोगी",value:0},{label:"1–9 दिवस",value:5},{label:"10–19 दिवस",value:14},{label:"20–30 दिवस",value:25}] },
    DiffWalk:             { short:"हालचाल",         title:"चालण्यात किंवा पायऱ्या चढण्यात अडचण",  desc:"रुग्णाला चालण्यात किंवा पायऱ्या चढण्यात गंभीर अडचण आहे का?",
                            options:[{label:"नाही — अडचणीशिवाय चालतो",value:0},{label:"होय — हालचालींच्या समस्या आहेत",value:1}] },
    HeartDiseaseorAttack: { short:"हृदय",           title:"हृदयरोग किंवा हृदयविकाराचा झटका",       desc:"रुग्णाला कधी कोरोनरी हृदयरोगाचे निदान झाले आहे किंवा हृदयविकाराचा झटका आला आहे का?",
                            options:[{label:"नाही — हृदयाची कोणतीही स्थिती नाही",value:0},{label:"होय — हृदयाची स्थिती आहे",value:1}] },
    PhysActivity:         { short:"हालचाल",         title:"गेल्या 30 दिवसांत शारीरिक हालचाल",      desc:"रुग्णाने गेल्या 30 दिवसांत (नियमित कामाव्यतिरिक्त) कोणतीही शारीरिक हालचाल केली आहे का?",
                            options:[{label:"नाही — या महिन्यात सक्रिय नाही",value:0},{label:"होय — गेल्या 30 दिवसांत सक्रिय",value:1}] },
    Stroke:               { short:"स्ट्रोक",        title:"स्ट्रोकचा इतिहास",                      desc:"डॉक्टरांनी कधी रुग्णाला सांगितले आहे का की त्यांना स्ट्रोक झाला होता?",
                            options:[{label:"नाही — कधी स्ट्रोक झाला नाही",value:0},{label:"होय — आधी स्ट्रोक झाला होता",value:1}] },
    MentHlth:             { short:"मानसिक आरोग्य",  title:"खराब मानसिक आरोग्याचे दिवस (गेले 30 दिवस)", desc:"किती दिवस मानसिक आरोग्य चांगले नव्हते? ताण, नैराश्य, चिंता यांचा समावेश.",
                            options:[{label:"0 दिवस — संपूर्ण महिना चांगले",value:0},{label:"1–9 दिवस",value:5},{label:"10–19 दिवस",value:14},{label:"20–30 दिवस",value:25}] },
    Veggies:              { short:"भाज्या",         title:"दैनंदिन भाजी सेवन",                      desc:"रुग्ण दररोज एक किंवा अधिक वेळा भाज्या खातो का?",
                            options:[{label:"नाही — क्वचितच भाज्या खातो",value:0},{label:"होय — दररोज भाज्या खातो",value:1}] },
    HvyAlcoholConsump:    { short:"मद्यपान",        title:"जास्त मद्यपान",                          desc:"पुरुष >14 पेये/आठवडा. महिला >7 पेये/आठवडा.",
                            options:[{label:"नाही — निरोगी मर्यादेत",value:0},{label:"होय — जास्त प्रमाणात पितो",value:1}] },
    Fruits:               { short:"फळे",            title:"दैनंदिन फळ सेवन",                        desc:"रुग्ण दररोज एक किंवा अधिक वेळा फळे खातो का?",
                            options:[{label:"नाही — क्वचितच फळे खातो",value:0},{label:"होय — दररोज फळे खातो",value:1}] },
    Smoker:               { short:"धूम्रपान",       title:"आयुष्यभर धूम्रपानाचा इतिहास",           desc:"रुग्णाने आयुष्यात किमान 100 सिगारेट ओढल्या आहेत का (सुमारे 5 पाकिटे)?",
                            options:[{label:"नाही — 100 पेक्षा कमी सिगारेट",value:0},{label:"होय — आयुष्यात 100+ सिगारेट",value:1}] },
    AnyHealthcare:        { short:"आरोग्य विमा",    title:"आरोग्य विमा किंवा कव्हरेज",              desc:"रुग्णाकडे कोणतेही आरोग्यसेवा कव्हरेज आहे का?",
                            options:[{label:"नाही — आरोग्य कव्हरेज नाही",value:0},{label:"होय — आरोग्य कव्हरेज आहे",value:1}] },
    NoDocbcCost:          { short:"डॉक्टर खर्च",   title:"खर्चामुळे डॉक्टरांकडे जाता आले नाही",    desc:"गेल्या 12 महिन्यांत असा कोणताही वेळ होता का जेव्हा खर्चामुळे डॉक्टरांकडे जाता आले नाही?",
                            options:[{label:"नाही — डॉक्टरांचा खर्च परवडला",value:0},{label:"होय — खर्च अडथळा होता",value:1}] },
    Education:            { short:"शिक्षण",         title:"सर्वोच्च शिक्षण पातळी",                  desc:"शाळेत पूर्ण केलेली सर्वोच्च श्रेणी किंवा वर्ष कोणते?",
                            options:[{label:"कधीच गेलो नाही / प्राथमिक",value:1},{label:"काही हायस्कूल",value:3},{label:"हायस्कूल पदवीधर",value:4},{label:"महाविद्यालय पदवीधर",value:6}] },
    Sex:                  { short:"लिंग",            title:"जैविक लिंग",                              desc:"कृपया आरोग्य नोंदींमध्ये नोंदवलेले रुग्णाचे जैविक लिंग निवडा.",
                            options:[{label:"स्त्री",value:0},{label:"पुरुष",value:1}] },
  },
};

/* ─── Navigation button labels ───────────────────────────────── */
const BTNS = {
  en: { prev:"← Previous", next:"Next →", predict:"Run AI Model →", analyzing:"Analysing…", review:"← Review Answers", viewResult:"View Result →", answered:"answered" },
  hi: { prev:"← पिछला",   next:"अगला →", predict:"AI मॉडल चलाएं →", analyzing:"विश्लेषण…",  review:"← उत्तर देखें",  viewResult:"परिणाम देखें →", answered:"उत्तर दिए" },
  mr: { prev:"← मागील",   next:"पुढे →",  predict:"AI मॉडल चालवा →", analyzing:"विश्लेषण…",  review:"← उत्तरे पाहा",  viewResult:"निकाल पाहा →",  answered:"उत्तरे दिली" },
};

/* ─── Loading text ───────────────────────────────────────────── */
const LOADING_TEXT = {
  en: { p:"Running AI Model…",                      s:"XGBoost · BRFSS 2015 · 21 features" },
  hi: { p:"AI मॉडल चल रहा है…",                    s:"XGBoost · BRFSS 2015 · 21 विशेषताएं" },
  mr: { p:"AI मॉडल चालू आहे…",                     s:"XGBoost · BRFSS 2015 · 21 वैशिष्ट्ये" },
};

/* ─── RISK TEXT MAPPER ──────────────────────────────────────── */
function getRiskText(id, value) {
  const n = Number(value);
  const MAP = {
    GenHlth:              n >= 4  ? "General health rated Fair/Poor — strongest diabetes predictor."               : null,
    HighBP:               n === 1 ? "High blood pressure — primary diabetes risk factor."                          : null,
    BMI:                  n >= 35 ? "BMI in Obese range — strongest predictor of Type 2 diabetes."                 : null,
    Age:                  n >= 9  ? "Age 50+ — risk rises significantly with age."                                 : null,
    HighChol:             n === 1 ? "High cholesterol — linked to insulin resistance."                             : null,
    CholCheck:            n === 0 ? "No cholesterol check in 5 years — delayed screening raises risk."             : null,
    Income:               n <= 3  ? "Lower income — limits healthy food access and healthcare."                    : null,
    PhysHlth:             n >= 14 ? "Frequent poor physical health — indicates chronic illness burden."            : null,
    DiffWalk:             n === 1 ? "Difficulty walking — linked to inactivity and metabolic risk."                : null,
    HeartDiseaseorAttack: n === 1 ? "Heart disease history — shares the same risk pathway as diabetes."            : null,
    PhysActivity:         n === 0 ? "No physical activity — sedentary lifestyle raises risk."                      : null,
    Stroke:               n === 1 ? "History of stroke — overlapping risk factors with diabetes."                  : null,
    MentHlth:             n >= 14 ? "Frequent poor mental health — stress raises blood glucose chronically."       : null,
    Veggies:              n === 0 ? "No daily vegetables — poor diet linked to insulin resistance."                : null,
    HvyAlcoholConsump:    n === 1 ? "Heavy alcohol use — impairs liver and insulin function."                      : null,
    Fruits:               n === 0 ? "No daily fruit — lower fibre intake linked to metabolic risk."                : null,
    Smoker:               n === 1 ? "Lifetime smoker — causes inflammation, impairs glucose metabolism."           : null,
    AnyHealthcare:        n === 0 ? "No health coverage — delays diagnosis and management."                        : null,
    NoDocbcCost:          n === 1 ? "Cost blocked doctor visit — unmanaged conditions increase risk."              : null,
    Education:            n <= 3  ? "Lower education level — correlates with higher diabetes risk."                : null,
  };
  return MAP[id] || null;
}

/* ─── API ─────────────────────────────────────────────────────── */
async function fetchPrediction(answers) {
  const payload = {};
  QUESTIONS.forEach((q) => {
    const v = answers[q.id];
    if (v !== undefined && v !== "") payload[q.id] = Number(v);
  });

  try {
    const res = await fetch("https://risk-ml-backend.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    return {
      percent: 0,
      result: "Connection Error",
      explanation: `Cannot reach backend at localhost:5001. Ensure risk-ml-engine/backend/app.py is running. (${e.message})`,
      reasons: ["Backend server not responding — please start app.py"],
    };
  }
}

/* ─── APP ─────────────────────────────────────────────────────── */
export default function App() {
  const [index, setIndex]       = useState(0);
  const [answers, setAnswers]   = useState({});
  const [result, setResult]     = useState(null);
  const [locked, setLocked]     = useState(false);
  const [viewMode, setViewMode] = useState("quiz");
  const [theme, setTheme]       = useState(() => localStorage.getItem("diq-theme") || "dark");
  const [lang, setLang]         = useState(() => localStorage.getItem("diq-lang")  || "en");
  const navRef = useRef(null);
  const advRef = useRef(null);

  // derive translated questions based on current language
  const currentQuestions = QUESTIONS.map((q) => {
    if (lang === "en") return q;
    const t = Q_TRANS[lang]?.[q.id];
    if (!t) return q;
    return { ...q, ...t };
  });

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

  const selectOption = useCallback(
    (qid, val) => {
      if (locked) return;
      setAnswers((prev) => ({ ...prev, [qid]: val }));
      if (advRef.current) clearTimeout(advRef.current);
      if (index < currentQuestions.length - 1) {
        advRef.current = setTimeout(() => setIndex((i) => i + 1), 380);
      }
    },
    [locked, index, currentQuestions.length]
  );

  function goPrev() {
    if (locked || viewMode === "loading") return;
    if (index > 0) setIndex((i) => i - 1);
  }

  function goNext() {
    if (index < currentQuestions.length - 1) setIndex((i) => i + 1);
    else submitAll();
  }

  async function submitAll() {
    if (locked && viewMode === "loading") return;
    setLocked(true);
    setViewMode("loading");

    const raw = await fetchPrediction(answers);

    // Build human reasons from answers
    const reasons = [];
    QUESTIONS.forEach((q) => {
      const v = answers[q.id];
      if (v !== undefined && v !== "") {
        const t = getRiskText(q.id, v);
        if (t) reasons.push(t);
      }
    });

    setResult({ ...raw, reasons: reasons.length ? reasons : raw.reasons || [] });
    setLocked(false);
    setViewMode("result");
  }

  function retake() {
    setAnswers({});
    setResult(null);
    setLocked(false);
    setViewMode("quiz");
    setIndex(0);
  }

  const btn           = BTNS[lang] || BTNS.en;
  const loadTxt       = LOADING_TEXT[lang] || LOADING_TEXT.en;
  const navItems      = currentQuestions.map((q) => ({ key: q.id, label: q.short, title: q.title }));
  const completedKeys = Object.keys(answers).filter((k) => answers[k] !== "");
  const answeredCount = completedKeys.length;
  const showPrev      = index > 0 && viewMode !== "loading" && viewMode !== "result";
  const showNext      = index < currentQuestions.length - 1 && viewMode !== "result" && viewMode !== "loading";
  const showPredict   = index === currentQuestions.length - 1 && viewMode !== "result" && viewMode !== "loading";

  return (
    <div className="app-root">
      <div className="bg-scene">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-lines" />
      </div>

      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        lang={lang}
        onChangeLang={(l) => {
          setLang(l);
          localStorage.setItem("diq-lang", l);
        }}
        appName="AI Clinical Assessment"
      />

      <main className="main-wrap">
        <div className="quiz-card">
          <div className="card-head">
            <div ref={navRef} className="nav-scroll">
              <ProgressNav
                items={navItems}
                current={index}
                completedKeys={completedKeys}
                onJump={(i) => {
                  setIndex(i);
                  setViewMode(result ? "review" : "quiz");
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
                  onRetake={retake}
                  onReview={() => {
                    setIndex(currentQuestions.length - 1);
                    setViewMode("review");
                  }}
                  lang={lang}
                />
              ) : viewMode === "loading" ? (
                <motion.div
                  key="loading"
                  className="loading-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="spinner" />
                  <p>{loadTxt.p}</p>
                  <span>{loadTxt.s}</span>
                </motion.div>
              ) : (
                <QuestionCard
                  key={currentQuestions[index]?.id}
                  q={currentQuestions[index]}
                  value={
                    answers[currentQuestions[index]?.id] !== undefined
                      ? String(answers[currentQuestions[index]?.id])
                      : ""
                  }
                  onSelect={(v) => selectOption(currentQuestions[index].id, v)}
                  index={index}
                  total={currentQuestions.length}
                  disabled={viewMode === "review" || locked}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="card-foot">
            <div className="foot-left">
              {viewMode === "result" ? (
                <button
                  className="btn-flat"
                  onClick={() => {
                    setIndex(currentQuestions.length - 1);
                    setViewMode("review");
                  }}
                >
                  {btn.review}
                </button>
              ) : showPrev ? (
                <button className="btn-flat" onClick={goPrev} disabled={locked}>
                  {btn.prev}
                </button>
              ) : (
                <div className="foot-info">
                  {viewMode !== "result" && (
                    <span className="answer-count">
                      {answeredCount}/{currentQuestions.length} {btn.answered}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="foot-right">
              {result && viewMode !== "result" && viewMode !== "loading" && (
                <button className="btn-flat" onClick={() => setViewMode("result")}>
                  {btn.viewResult}
                </button>
              )}

              {showNext && (
                <button className="btn-primary" onClick={goNext} disabled={locked}>
                  {btn.next}
                </button>
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