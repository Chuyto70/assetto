'use client';

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import Modal from "@/components/elements/modal/Modal";

const ModalWrapper = (props: {
  children?: ReactNode;
  routerRoute?: string;
}) => {
  const router = useRouter();
  return (
    <Modal dismissAction={() => router.replace(props.routerRoute ?? '/')}>
      {props.children}
    </Modal>
  )
}

export default ModalWrapper;
