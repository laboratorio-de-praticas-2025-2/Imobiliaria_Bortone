import QuestionAccordion from "./QuestionAccordion";

export default function FaqContent({ faqData }) {
  return (
    <div className="md:px-24 md:py-24 px-6 py-9 flex flex-col gap-10">
      <p className="md:text-3xl text-xl font-black md:ps-5 ps-7 md:text-shadow-none text-shadow-lg">
        Perguntas Frequentes
      </p>
      <QuestionAccordion faqData={faqData}/>
    </div>
  );
}