"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion"
import { Badge } from "@repo/ui/components/ui/badge"

const faqs = [
  {
    question: "Can I use Rackrage before paying?",
    answer:
      "Yes. The free plan covers up to 20 members with attendance and notifications included, so you can run a smaller gym without paying anything. Move up to a paid plan when you outgrow it.",
  },
  {
    question: "How are SMS, email and WhatsApp charged?",
    answer:
      "Messages run on credits rather than a fixed monthly fee. You top up a balance, and each message you send draws from it.",
  },
  {
    question: "Do I need new hardware?",
    answer:
      "No. Rackrage runs in the browser on the computer or tablet you already have at the front desk. Door access hardware is optional and costs NPR 13,999 to install.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes. You can move between plans as your member list grows, and switch between monthly and yearly billing at any time.",
  },
  {
    question: "Can my staff have their own logins?",
    answer:
      "On plans that include staff accounts, you can invite trainers and front desk staff, then control what each role is allowed to see and do.",
  },
  {
    question: "What happens to my data if I leave?",
    answer:
      "Your member, attendance and payment records stay yours. You can export what you need before closing your account.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-b border-border">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <Badge variant="outline" className="h-7 px-3 text-xs">
            FAQ
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            Questions, answered
          </h2>
        </div>

        <Accordion className="mt-10 rounded-2xl border border-border bg-background px-5">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="cursor-pointer py-4 text-sm font-medium text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm text-pretty text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
