'use client';

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import Modal from "@/components/elements/modal/Modal";

const ModalWrapper = (props: {
  children?: ReactNode;
  className?: string;
  routerRoute?: string;
}) => {
  const router = useRouter();
  return (
    <Modal dismissAction={() => router.replace(props.routerRoute ?? '/')} className={props.className}>
      {props.children}
    </Modal>
  )
}

export default ModalWrapper;
