import Modal from "@/components/elements/modal/Modal";

async function CookieModal({
  params: { lang },
}: {
  params: { lang: string };
}) {

  return (
    <Modal dismissBack={true}
      className="max-w-screen-2xl"
    >
      <div
        className="text-carbon-900 dark:text-white bg-carbon-200 dark:bg-carbon-900 shadow-xl dark:shadow-carbon-500/10 dark:border-2 rounded-3xl pb-3 md:pb-6 overflow-hidden flex flex-col gap-3 md:gap-6"
      >
        cookies modal with url {lang}
      </div>
    </Modal>
  )
}

export default CookieModal;