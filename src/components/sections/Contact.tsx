import { gql, QueryContentComponent } from "@/lib/graphql";

import ContactForm from "@/components/elements/forms/ContactForm";

import { useServer } from "@/store/serverStore";

const ComponentSectionsContact = gql`
  fragment sectionsContact on ComponentSectionsContact {
    title
    description
    field_name
    field_name_placeholder
    field_email
    field_email_placeholder
    field_subject
    field_subject_placeholder
    field_message
    field_message_placeholder
    field_submit
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        title?: string;
        description?: string;
        field_name: string;
        field_name_placeholder?: string;
        field_email: string;
        field_email_placeholder?: string;
        field_subject: string;
        field_subject_placeholder?: string;
        field_message: string;
        field_message_placeholder?: string;
        field_submit: string;
      }[];
    };
  };
};

const Contact = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsContact, 'sectionsContact');
  const { title, description, field_email, field_message, field_name, field_subject, field_submit, field_email_placeholder, field_message_placeholder, field_name_placeholder, field_subject_placeholder } = content[props.index];

  return (
    <section className="w-full max-w-screen-xl px-3 md:px-6 lg:px-12">
      <div className="relative w-full bg-white dark:bg-carbon-900 overflow-hidden rounded-3xl">
        <span className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1024px] h-[1024px] bg-no-repeat bg-center bg-contain' style={{ backgroundImage: "url(/images/rond-violet.avif)" }}></span>
        <div className="relative w-full flex flex-col items-center justify-center gap-3 md:gap-6 p-3 md:p-6 rounded-3xl border-2 border-carbon-900 dark:border-carbon-200 bg-carbon-200/40 dark:bg-carbon-600/40">
          {title && <h2 className="max-w-screen-md italic">{title}</h2>}
          {description && <p className="max-w-screen-md text-carbon-700 dark:text-carbon-400 text-center">{description}</p>}
          <ContactForm
            label={{
              name: field_name,
              email: field_email,
              subject: field_subject,
              message: field_message
            }}
            placeholder={{
              name: field_name_placeholder,
              email: field_email_placeholder,
              subject: field_subject_placeholder,
              message: field_message_placeholder
            }}
            submitText={field_submit}
            className="max-w-screen-md w-full flex flex-col items-center gap-3"
          />
        </div>
      </div>
    </section>
  )
}

export default Contact;