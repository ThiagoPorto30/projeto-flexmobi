import Link from "next/link";
import SiteFooter from "../components/site-footer";
import { business, whatsappUrl } from "../data/business";
import { pageMetadata } from "../lib/seo";

export const metadata = pageMetadata("Privacidade e cookies · flexmobi.rj", "Saiba como os dados preenchidos no pedido de test ride são utilizados e como funciona o contato com a flexmobi.rj.", "/privacidade");

export default function PrivacyPage() {
  const contact = whatsappUrl();
  return <main><article className="privacy-page"><Link href="/">← Voltar ao início</Link><p className="eyebrow eyebrow--dark">Transparência</p><h1>Privacidade<br /><i>e cookies.</i></h1>
    <p>Esta página descreve o funcionamento desta versão do site flexmobi.rj.</p>
    <h2>Dados do pedido de test ride</h2><p>O formulário utiliza nome, telefone, modelo, loja e data de preferência para preparar seu pedido. Enquanto você preenche e revisa, os dados ficam na memória desta página, sem gravação em um banco de dados pelo formulário. Ao recarregar a página, esse preenchimento é descartado.</p>
    {contact ? <p>Ao escolher “Continuar no WhatsApp”, os dados do resumo são incluídos na mensagem aberta no WhatsApp. A transmissão para esse serviço ocorre ao abrir o link; o envio à loja depende de você confirmar a mensagem no aplicativo. O atendimento também está sujeito à política de privacidade do WhatsApp. A loja usa o pedido para conversar com você e combinar a visita.</p> : <p>O formulário está em modo demonstrativo: não envia solicitações à loja. Não é necessário informar dados reais para experimentar o protótipo.</p>}
    <h2>Cookies e medição de visitas</h2><p>Esta versão não integra Google Analytics nem pixels de publicidade. O formulário não grava seus dados em cookies ou no armazenamento persistente do navegador. Se ferramentas de medição forem adicionadas, esta página e as opções de privacidade deverão acompanhar essa mudança.</p>
    <h2>Serviços externos</h2><p>Os links para mapas e, quando disponível, WhatsApp levam a serviços externos, que possuem suas próprias práticas de privacidade. As fontes visuais são carregadas do Google Fonts, o que envolve uma conexão com esse serviço. A infraestrutura que entrega o site pode processar informações técnicas da conexão, como endereço IP e registros de acesso, para operar o serviço.</p>
    <h2>Contato sobre privacidade</h2>{business.legalName ? <p>{business.legalName}{business.cnpj ? ` · CNPJ ${business.cnpj}` : ""}</p> : null}<p>Para dúvidas sobre o uso de seus dados ou pedidos relacionados ao atendimento, {contact ? <a href={contact} target="_blank" rel="noopener noreferrer">fale com a equipe pelo WhatsApp</a> : <Link href="/#lojas">procure a equipe em uma das lojas</Link>}.</p>
  </article><SiteFooter /></main>;
}
