const questions = [
  { question: "Como funciona o test ride?", answer: "Você escolhe um modelo, uma loja e uma data de preferência. O horário e a disponibilidade da bike precisam ser confirmados pela equipe antes da visita." },
  { question: "Onde posso conhecer as bikes?", answer: "As unidades ficam em Icaraí, Niterói, e em Ipanema, Rio de Janeiro. Veja os endereços e os links para traçar sua rota na seção Lojas." },
  { question: "Qual é a autonomia de uma bike elétrica?", answer: "A autonomia estimada aparece na ficha de cada modelo. O resultado real varia com o peso transportado, o percurso, as subidas, o modo de assistência e as condições de uso." },
  { question: "Quanto tempo leva para recarregar a bateria?", answer: "O tempo depende do modelo, da bateria e do carregador. Confira a ficha técnica e confirme com a equipe as orientações de recarga da bike escolhida." },
  { question: "Posso comprar e pagar pelo site?", answer: "O site apresenta os modelos e ajuda a iniciar o atendimento. Não há pagamento online. Preços, disponibilidade, cores e condições de compra são confirmados diretamente com a loja." },
  { question: "Como consulto garantia e assistência?", answer: "A equipe informa as condições de garantia, manutenção e assistência aplicáveis a cada modelo. Confirme cobertura, prazos e orientações antes de concluir a compra." },
];

export default function Faq() {
  return <section className="faq section" id="faq"><div><p className="eyebrow eyebrow--dark"><span /> Antes de escolher</p><h2>Dúvidas?<br /><i>Vamos por partes.</i></h2><p>O essencial para dar o próximo passo.</p></div><div className="faq-list">{questions.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>;
}
