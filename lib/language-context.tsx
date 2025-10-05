"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "fr" | "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  fr: {
    // Navigation
    dashboard: "Dashboard",
    forecasts: "Prévisions",
    safeTrajectory: "Trajet Sûr",
    complaint: "Réclamation",
    profile: "Profil",
    logout: "Déconnexion",
    chatbot: "Assistant Santé",

    // Common
    loading: "Chargement...",
    submit: "Soumettre",
    cancel: "Annuler",
    save: "Enregistrer",
    close: "Fermer",
    back: "Retour",
    next: "Suivant",
    search: "Rechercher",
    notifications: "Notifications",
    noNotifications: "Aucune notification",
    alert: "Alerte",

    // Dashboard
    airQualityIndex: "Indice de Qualité de l'Air",
    recommendations: "Recommandations",
    atmosphericPollutants: "Polluants atmosphériques",
    healthAlert: "Alerte santé",
    location: "Localisation",
    trend: "Tendance",
    good: "Bon",
    moderate: "Modéré",
    unhealthySensitive: "Mauvais pour groupes sensibles",
    unhealthy: "Mauvais",
    veryUnhealthy: "Très mauvais",
    hazardous: "Dangereux",
    pollutantsOverview: "Vue d'ensemble de tous les paramètres de qualité de l'air",
    limit: "Limite",

    // Forecasts
    forecastsTitle: "Prévisions de Qualité de l'Air",
    cityOrDestination: "Ville ou destination",
    date: "Date",
    getForecast: "Obtenir la prévision",
    hourlyForecasts: "Prévisions horaires",
    selectOnMap: "Sélectionner sur la carte",
    clickCity: "Cliquez sur une ville pour la sélectionner",
    forecastFor: "Prévision pour",
    showParameters: "Voir les paramètres",
    hideParameters: "Masquer les paramètres",
    basedOnParameters: "Basé sur les paramètres suivants",

    // Safe Trajectory
    safeTrajectoryTitle: "Trajet Sûr",
    analyzeRoute: "Analysez la qualité de l'air sur votre itinéraire",
    planYourRoute: "Planifier votre trajet",
    startPoint: "Point de départ",
    destination: "Destination",
    analyzeTrajectory: "Analyser le trajet",
    analyzing: "Analyse en cours...",
    safePath: "Trajet Sûr",
    riskyPath: "Trajet à Risque",
    completeAnalysis: "Analyse complète du parcours",
    recommendation: "Recommandation",
    distance: "Distance",
    estimatedTime: "Durée estimée",
    alternativeRoute: "Itinéraire Alternatif Recommandé",
    showDetails: "Voir les détails du parcours",
    hideDetails: "Masquer les détails du parcours",
    checkpoints: "Points de contrôle du trajet",
    routeVisualization: "Visualisation du trajet",
    interactiveFlow: "Flux interactif de votre itinéraire avec les niveaux de qualité de l'air",
    personalizedHealthAlert: "Alerte Santé Personnalisée",

    // Complaint
    complaintTitle: "Réclamation",
    reportPollution: "Signaler une pollution non détectée",
    submitComplaint: "Soumettre une réclamation",
    exactLocation: "Lieu exact",
    exactDate: "Date exacte",
    exactTime: "Horaire exact",
    description: "Description (optionnel)",
    describeIssue: "Décrivez le problème de pollution observé",
    complaintSubmitted: "Réclamation soumise avec succès",
    complaintNumber: "Numéro de réclamation",
    nextSteps: "Prochaines étapes",

    // Profile
    profileTitle: "Profil Utilisateur",
    personalInfo: "Informations personnelles",
    name: "Nom",
    age: "Âge",
    healthProfile: "Profil de santé",
    healthConditions: "Conditions médicales",
    asthma: "Asthme",
    copd: "BPCO",
    cardiovascular: "Maladie cardiovasculaire/AVC",
    lungCancer: "Cancer du poumon",
    updateProfile: "Mettre à jour le profil",
    profileUpdated: "Profil mis à jour avec succès",

    // Chatbot
    chatbotTitle: "Assistant Santé IA",
    chatbotDescription: "Posez vos questions sur les maladies et les risques de pollution de l'air",
    typeMessage: "Tapez votre message...",
    send: "Envoyer",
    exampleQuestions: "Questions fréquentes",
    chatbotWelcome: "Bonjour ! Je suis votre assistant santé. Comment puis-je vous aider aujourd'hui ?",

    // Advice
    wearMask: "Porter un masque",
    avoidExercise: "Éviter l'exercice",
    closeWindows: "Fermer les fenêtres",
    stayIndoors: "Rester à l'intérieur",
    limitOutdoor: "Limiter les activités extérieures",
    useAirPurifier: "Utiliser un purificateur d'air",

    // Landing Page
    welcomeTitle: "Surveillance de la Qualité de l'Air",
    welcomeSubtitle: "Protégeons la santé des citoyens marocains",
    getStarted: "Commencer",
    signIn: "Se connecter",
    signUp: "S'inscrire",
    features: "Fonctionnalités",
    realTimeMonitoring: "Surveillance en temps réel",
    healthAlerts: "Alertes santé personnalisées",
    routePlanning: "Planification de trajets sûrs",
  },
  ar: {
    // Navigation
    dashboard: "لوحة القيادة",
    forecasts: "التوقعات",
    safeTrajectory: "مسار آمن",
    complaint: "شكوى",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    chatbot: "مساعد الصحة",

    // Common
    loading: "جاري التحميل...",
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    close: "إغلاق",
    back: "رجوع",
    next: "التالي",
    search: "بحث",
    notifications: "الإشعارات",
    noNotifications: "لا توجد إشعارات",
    alert: "تنبيه",

    // Dashboard
    airQualityIndex: "مؤشر جودة الهواء",
    recommendations: "التوصيات",
    atmosphericPollutants: "ملوثات الغلاف الجوي",
    healthAlert: "تنبيه صحي",
    location: "الموقع",
    trend: "الاتجاه",
    good: "جيد",
    moderate: "معتدل",
    unhealthySensitive: "غير صحي للمجموعات الحساسة",
    unhealthy: "غير صحي",
    veryUnhealthy: "غير صحي جدا",
    hazardous: "خطير",
    pollutantsOverview: "نظرة عامة على جميع معايير جودة الهواء",
    limit: "الحد",

    // Forecasts
    forecastsTitle: "توقعات جودة الهواء",
    cityOrDestination: "المدينة أو الوجهة",
    date: "التاريخ",
    getForecast: "احصل على التوقعات",
    hourlyForecasts: "التوقعات بالساعة",
    selectOnMap: "اختر على الخريطة",
    clickCity: "انقر على مدينة لاختيارها",
    forecastFor: "توقعات ل",
    showParameters: "عرض المعايير",
    hideParameters: "إخفاء المعايير",
    basedOnParameters: "بناءً على المعايير التالية",

    // Safe Trajectory
    safeTrajectoryTitle: "مسار آمن",
    analyzeRoute: "تحليل جودة الهواء على مسارك",
    planYourRoute: "خطط لمسارك",
    startPoint: "نقطة البداية",
    destination: "الوجهة",
    analyzeTrajectory: "تحليل المسار",
    analyzing: "جاري التحليل...",
    safePath: "مسار آمن",
    riskyPath: "مسار محفوف بالمخاطر",
    completeAnalysis: "تحليل كامل للمسار",
    recommendation: "التوصية",
    distance: "المسافة",
    estimatedTime: "الوقت المقدر",
    alternativeRoute: "مسار بديل موصى به",
    showDetails: "عرض تفاصيل المسار",
    hideDetails: "إخفاء تفاصيل المسار",
    checkpoints: "نقاط التفتيش على المسار",
    routeVisualization: "تصور المسار",
    interactiveFlow: "تدفق تفاعلي لمسارك مع مستويات جودة الهواء",
    personalizedHealthAlert: "تنبيه صحي شخصي",

    // Complaint
    complaintTitle: "شكوى",
    reportPollution: "الإبلاغ عن تلوث غير مكتشف",
    submitComplaint: "تقديم شكوى",
    exactLocation: "الموقع الدقيق",
    exactDate: "التاريخ الدقيق",
    exactTime: "الوقت الدقيق",
    description: "الوصف (اختياري)",
    describeIssue: "صف مشكلة التلوث الملاحظة",
    complaintSubmitted: "تم تقديم الشكوى بنجاح",
    complaintNumber: "رقم الشكوى",
    nextSteps: "الخطوات التالية",

    // Profile
    profileTitle: "الملف الشخصي للمستخدم",
    personalInfo: "المعلومات الشخصية",
    name: "الاسم",
    age: "العمر",
    healthProfile: "الملف الصحي",
    healthConditions: "الحالات الطبية",
    asthma: "الربو",
    copd: "مرض الانسداد الرئوي المزمن",
    cardiovascular: "أمراض القلب والأوعية الدموية/السكتة الدماغية",
    lungCancer: "سرطان الرئة",
    updateProfile: "تحديث الملف الشخصي",
    profileUpdated: "تم تحديث الملف الشخصي بنجاح",

    // Chatbot
    chatbotTitle: "مساعد الصحة بالذكاء الاصطناعي",
    chatbotDescription: "اطرح أسئلتك حول الأمراض ومخاطر تلوث الهواء",
    typeMessage: "اكتب رسالتك...",
    send: "إرسال",
    exampleQuestions: "أسئلة شائعة",
    chatbotWelcome: "مرحبا! أنا مساعدك الصحي. كيف يمكنني مساعدتك اليوم؟",

    // Advice
    wearMask: "ارتدي قناع",
    avoidExercise: "تجنب التمارين",
    closeWindows: "أغلق النوافذ",
    stayIndoors: "ابق في الداخل",
    limitOutdoor: "حد من الأنشطة الخارجية",
    useAirPurifier: "استخدم منقي الهواء",

    // Landing Page
    welcomeTitle: "مراقبة جودة الهواء",
    welcomeSubtitle: "لنحمي صحة المواطنين المغاربة",
    getStarted: "ابدأ",
    signIn: "تسجيل الدخول",
    signUp: "التسجيل",
    features: "الميزات",
    realTimeMonitoring: "المراقبة في الوقت الفعلي",
    healthAlerts: "تنبيهات صحية مخصصة",
    routePlanning: "تخطيط مسارات آمنة",
  },
  en: {
    // Navigation
    dashboard: "Dashboard",
    forecasts: "Forecasts",
    safeTrajectory: "Safe Route",
    complaint: "Complaint",
    profile: "Profile",
    logout: "Logout",
    chatbot: "Health Assistant",

    // Common
    loading: "Loading...",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    back: "Back",
    next: "Next",
    search: "Search",
    notifications: "Notifications",
    noNotifications: "No notifications",
    alert: "Alert",

    // Dashboard
    airQualityIndex: "Air Quality Index",
    recommendations: "Recommendations",
    atmosphericPollutants: "Atmospheric Pollutants",
    healthAlert: "Health Alert",
    location: "Location",
    trend: "Trend",
    good: "Good",
    moderate: "Moderate",
    unhealthySensitive: "Unhealthy for Sensitive Groups",
    unhealthy: "Unhealthy",
    veryUnhealthy: "Very Unhealthy",
    hazardous: "Hazardous",
    pollutantsOverview: "Overview of all air quality parameters",
    limit: "Limit",

    // Forecasts
    forecastsTitle: "Air Quality Forecasts",
    cityOrDestination: "City or destination",
    date: "Date",
    getForecast: "Get forecast",
    hourlyForecasts: "Hourly forecasts",
    selectOnMap: "Select on map",
    clickCity: "Click on a city to select it",
    forecastFor: "Forecast for",
    showParameters: "Show parameters",
    hideParameters: "Hide parameters",
    basedOnParameters: "Based on the following parameters",

    // Safe Trajectory
    safeTrajectoryTitle: "Safe Route",
    analyzeRoute: "Analyze air quality on your route",
    planYourRoute: "Plan your route",
    startPoint: "Starting point",
    destination: "Destination",
    analyzeTrajectory: "Analyze route",
    analyzing: "Analyzing...",
    safePath: "Safe Route",
    riskyPath: "Risky Route",
    completeAnalysis: "Complete route analysis",
    recommendation: "Recommendation",
    distance: "Distance",
    estimatedTime: "Estimated time",
    alternativeRoute: "Recommended Alternative Route",
    showDetails: "Show route details",
    hideDetails: "Hide route details",
    checkpoints: "Route checkpoints",
    routeVisualization: "Route visualization",
    interactiveFlow: "Interactive flow of your route with air quality levels",
    personalizedHealthAlert: "Personalized Health Alert",

    // Complaint
    complaintTitle: "Complaint",
    reportPollution: "Report undetected pollution",
    submitComplaint: "Submit complaint",
    exactLocation: "Exact location",
    exactDate: "Exact date",
    exactTime: "Exact time",
    description: "Description (optional)",
    describeIssue: "Describe the pollution issue observed",
    complaintSubmitted: "Complaint submitted successfully",
    complaintNumber: "Complaint number",
    nextSteps: "Next steps",

    // Profile
    profileTitle: "User Profile",
    personalInfo: "Personal information",
    name: "Name",
    age: "Age",
    healthProfile: "Health profile",
    healthConditions: "Medical conditions",
    asthma: "Asthma",
    copd: "COPD",
    cardiovascular: "Cardiovascular disease/Stroke",
    lungCancer: "Lung cancer",
    updateProfile: "Update profile",
    profileUpdated: "Profile updated successfully",

    // Chatbot
    chatbotTitle: "AI Health Assistant",
    chatbotDescription: "Ask your questions about diseases and air pollution risks",
    typeMessage: "Type your message...",
    send: "Send",
    exampleQuestions: "Frequently asked questions",
    chatbotWelcome: "Hello! I'm your health assistant. How can I help you today?",

    // Advice
    wearMask: "Wear a mask",
    avoidExercise: "Avoid exercise",
    closeWindows: "Close windows",
    stayIndoors: "Stay indoors",
    limitOutdoor: "Limit outdoor activities",
    useAirPurifier: "Use air purifier",

    // Landing Page
    welcomeTitle: "Air Quality Monitoring",
    welcomeSubtitle: "Protecting the health of Moroccan citizens",
    getStarted: "Get Started",
    signIn: "Sign In",
    signUp: "Sign Up",
    features: "Features",
    realTimeMonitoring: "Real-time monitoring",
    healthAlerts: "Personalized health alerts",
    routePlanning: "Safe route planning",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && ["fr", "ar", "en"].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
