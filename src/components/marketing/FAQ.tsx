import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is Keys Pay available in my country?',
    answer: 'We are rolling out region by region. Stay tuned for updates on availability in your area.',
  },
  {
    question: 'Can I link multiple cards?',
    answer: 'Yes, you can link and manage multiple cards within the app for seamless payments.',
  },
  {
    question: 'What are the membership benefits?',
    answer: 'Silver, Gold, and Platinum memberships offer progressively higher spending limits, better rewards, and exclusive perks.',
  },
  {
    question: 'How does AI budgeting work?',
    answer: 'Our AI analyzes your spending patterns and provides personalized insights and recommendations to help you manage your finances better.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use enterprise-grade encryption and security measures to protect your data. All transactions are monitored for fraud.',
  },
  {
    question: 'Can I upgrade my membership later?',
    answer: 'Absolutely! You can upgrade or downgrade your membership at any time from your account settings.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Keys Pay.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
