import Modal from "@/components/elements/modal/Modal";
import Cookies from "@/components/sections/Cookies";

async function CookieModal({
  params: { lang },
}: {
  params: { lang: string };
}) {

  return (
    <Modal dismissBack={true}
      className="max-w-screen-lg"
    >
      <Cookies lang={lang} />
    </Modal>
  )
}

export default CookieModal;