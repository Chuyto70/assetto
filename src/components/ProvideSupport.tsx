import Script from "next/script";

const ProvideSupport = (props: { script: string }) => {
  return (
    <>
      <Script id="providesupport">
        {props.script}
      </Script>
    </>
  );
}

export default ProvideSupport;