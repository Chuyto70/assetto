import { AiOutlineDelete, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

import IconButton from '@/components/elements/buttons/IconButton';

type props = {
  onIncrease: () => void;
  onDecrease: () => void;
  qty: number;
};

export const QtyBtn = (props: props) => {
  return (
    <>
      <IconButton
        icon={props.qty <= 1 ? AiOutlineDelete : AiOutlineMinus}
        variant='outline'
        onClick={props.onDecrease}
      />
      <span>{props.qty}</span>
      <IconButton
        icon={AiOutlinePlus}
        variant='outline'
        onClick={props.onIncrease}
      />
    </>
  );
};
