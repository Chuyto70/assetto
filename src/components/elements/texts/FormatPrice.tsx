import { ProductPrice } from "@/lib/interfaces";

import Currency from "@/components/elements/texts/Currency";
import Price from "@/components/elements/texts/Price";

const FormatPrice = ({ text, prices }: { text: string; prices: ProductPrice[] }) => {

  return text?.split(/\${([^}]*)}/).map((item, index) => {
    if (index % 2 === 0) return <span key={index}>{item}</span>;
    else if (item === 'price') {
      return <Price key={index} prices={prices} />;
    } else if (item === 'currency_symbol') {
      return <Currency key={index} prices={prices} />
    } else return null;
  });

}

export default FormatPrice;