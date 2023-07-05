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
        icon={props.qty <= 1 ? 'ph:trash' : 'ph:minus-bold'}
        variant='outline'
        onClick={props.onDecrease}
      />
      <span>{props.qty}</span>
      <IconButton
        icon='ic:round-close'
        variant='outline'
        onClick={props.onIncrease}
      />
    </>
  );
};
