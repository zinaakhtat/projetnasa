"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getUser } from "@/lib/auth"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatbotPage() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const user = getUser()

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: t("chatbotWelcome"),
        timestamp: new Date(),
      },
    ])
  }, [language, t])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Health conditions responses
    if (lowerMessage.includes("asthme") || lowerMessage.includes("asthma") || lowerMessage.includes("الربو")) {
      if (language === "fr") {
        return "L'asthme est une maladie respiratoire chronique qui peut être aggravée par la pollution de l'air, en particulier les particules fines (PM2.5) et l'ozone (O3). Recommandations : Évitez les activités extérieures lorsque l'AQI dépasse 100, portez un masque N95 lors des pics de pollution, gardez vos fenêtres fermées et utilisez un purificateur d'air à la maison."
      } else if (language === "ar") {
        return "الربو هو مرض تنفسي مزمن يمكن أن يتفاقم بسبب تلوث الهواء، وخاصة الجسيمات الدقيقة (PM2.5) والأوزون (O3). التوصيات: تجنب الأنشطة الخارجية عندما يتجاوز مؤشر جودة الهواء 100، ارتدي قناع N95 أثناء ذروة التلوث، أغلق النوافذ واستخدم منقي الهواء في المنزل."
      } else {
        return "Asthma is a chronic respiratory disease that can be aggravated by air pollution, particularly fine particles (PM2.5) and ozone (O3). Recommendations: Avoid outdoor activities when AQI exceeds 100, wear an N95 mask during pollution peaks, keep windows closed, and use an air purifier at home."
      }
    }

    if (lowerMessage.includes("bpco") || lowerMessage.includes("copd") || lowerMessage.includes("الانسداد الرئوي")) {
      if (language === "fr") {
        return "La BPCO (Bronchopneumopathie Chronique Obstructive) est très sensible à la pollution de l'air. Les polluants comme le NO2 et les particules peuvent déclencher des exacerbations. Conseils : Restez à l'intérieur lors des journées de forte pollution, utilisez votre inhalateur préventif régulièrement, consultez votre médecin si vous ressentez une aggravation des symptômes."
      } else if (language === "ar") {
        return "مرض الانسداد الرئوي المزمن حساس جدًا لتلوث الهواء. يمكن للملوثات مثل NO2 والجسيمات أن تؤدي إلى تفاقم الحالة. النصائح: ابق في الداخل خلال أيام التلوث الشديد، استخدم جهاز الاستنشاق الوقائي بانتظام، استشر طبيبك إذا شعرت بتفاقم الأعراض."
      } else {
        return "COPD (Chronic Obstructive Pulmonary Disease) is very sensitive to air pollution. Pollutants like NO2 and particles can trigger exacerbations. Advice: Stay indoors on high pollution days, use your preventive inhaler regularly, consult your doctor if symptoms worsen."
      }
    }

    if (
      lowerMessage.includes("cardiovasculaire") ||
      lowerMessage.includes("cardiovascular") ||
      lowerMessage.includes("القلب")
    ) {
      if (language === "fr") {
        return "Les maladies cardiovasculaires sont affectées par la pollution de l'air, notamment les particules fines qui peuvent pénétrer dans la circulation sanguine. Protection : Limitez l'exercice intense à l'extérieur lors des pics de pollution, prenez vos médicaments régulièrement, surveillez votre tension artérielle, et consultez immédiatement en cas de douleur thoracique."
      } else if (language === "ar") {
        return "تتأثر أمراض القلب والأوعية الدموية بتلوث الهواء، خاصة الجسيمات الدقيقة التي يمكن أن تدخل مجرى الدم. الحماية: حد من التمارين الشاقة في الهواء الطلق أثناء ذروة التلوث، تناول أدويتك بانتظام، راقب ضغط دمك، واستشر الطبيب فورًا في حالة ألم الصدر."
      } else {
        return "Cardiovascular diseases are affected by air pollution, especially fine particles that can enter the bloodstream. Protection: Limit intense outdoor exercise during pollution peaks, take your medications regularly, monitor your blood pressure, and consult immediately if you experience chest pain."
      }
    }

    // General pollution questions
    if (lowerMessage.includes("pm2.5") || lowerMessage.includes("particules")) {
      if (language === "fr") {
        return "Les PM2.5 sont des particules fines de moins de 2,5 micromètres qui peuvent pénétrer profondément dans les poumons et même dans le sang. Sources principales : véhicules diesel, industries, combustion de biomasse. Limite recommandée : 25 µg/m³ (moyenne 24h). Protection : masques N95/FFP2, purificateurs d'air HEPA."
      } else if (language === "ar") {
        return "PM2.5 هي جسيمات دقيقة أقل من 2.5 ميكرومتر يمكن أن تخترق عميقًا في الرئتين وحتى في الدم. المصادر الرئيسية: مركبات الديزل، الصناعات، حرق الكتلة الحيوية. الحد الموصى به: 25 ميكروغرام/م³ (متوسط 24 ساعة). الحماية: أقنعة N95/FFP2، منقيات الهواء HEPA."
      } else {
        return "PM2.5 are fine particles less than 2.5 micrometers that can penetrate deep into the lungs and even into the blood. Main sources: diesel vehicles, industries, biomass burning. Recommended limit: 25 µg/m³ (24h average). Protection: N95/FFP2 masks, HEPA air purifiers."
      }
    }

    // Default response
    if (language === "fr") {
      return "Je suis là pour vous aider avec des questions sur les maladies respiratoires et cardiovasculaires, les risques de pollution de l'air, et comment vous protéger. Posez-moi des questions sur l'asthme, la BPCO, les maladies cardiovasculaires, ou les polluants comme PM2.5, O3, NO2."
    } else if (language === "ar") {
      return "أنا هنا لمساعدتك في الأسئلة المتعلقة بأمراض الجهاز التنفسي والقلب والأوعية الدموية، ومخاطر تلوث الهواء، وكيفية حماية نفسك. اسألني عن الربو، مرض الانسداد الرئوي المزمن، أمراض القلب والأوعية الدموية، أو الملوثات مثل PM2.5، O3، NO2."
    } else {
      return "I'm here to help you with questions about respiratory and cardiovascular diseases, air pollution risks, and how to protect yourself. Ask me about asthma, COPD, cardiovascular diseases, or pollutants like PM2.5, O3, NO2."
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const exampleQuestions = [
    language === "fr"
      ? "Comment l'asthme est-il affecté par la pollution ?"
      : language === "ar"
        ? "كيف يتأثر الربو بالتلوث؟"
        : "How is asthma affected by pollution?",
    language === "fr"
      ? "Quels sont les dangers des PM2.5 ?"
      : language === "ar"
        ? "ما هي مخاطر PM2.5؟"
        : "What are the dangers of PM2.5?",
    language === "fr"
      ? "Comment protéger mon cœur de la pollution ?"
      : language === "ar"
        ? "كيف أحمي قلبي من التلوث؟"
        : "How to protect my heart from pollution?",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("chatbotTitle")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("chatbotDescription")}</p>
        </div>

        {/* Chat Container */}
        <Card className="border-2 shadow-xl">
          <div className="flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Example Questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">{t("exampleQuestions")}</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => setInput(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("typeMessage")}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Health Profile Alert */}
        {user?.healthConditions && Object.values(user.healthConditions).some((v) => v) && (
          <Card className="border-chart-4 bg-chart-4/5 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-chart-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">
                  {language === "fr"
                    ? "Conseils personnalisés disponibles"
                    : language === "ar"
                      ? "نصائح مخصصة متاحة"
                      : "Personalized advice available"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "fr"
                    ? "Basé sur votre profil de santé, je peux vous donner des conseils spécifiques pour vos conditions."
                    : language === "ar"
                      ? "بناءً على ملفك الصحي، يمكنني تقديم نصائح محددة لحالاتك."
                      : "Based on your health profile, I can provide specific advice for your conditions."}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
