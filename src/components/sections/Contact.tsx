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
  page: {
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
};

const Contact = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsContact, 'sectionsContact');
  const { title, description, field_email, field_message, field_name, field_subject, field_submit, field_email_placeholder, field_message_placeholder, field_name_placeholder, field_subject_placeholder } = content[props.index];

  return (
    <section className="w-full max-w-screen-md px-3 md:px-6 lg:px-12">
      <div className="relative w-full bg-white dark:bg-carbon-900 overflow-hidden">
        <span className='absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-secondary-600 w-60 h-60'></span>
        <div className="w-full flex flex-col items-center justify-center gap-3 md:gap-6 p-3 md:p-6 rounded-3xl border-2 border-carbon-900 dark:border-carbon-200 bg-carbon-200/40 dark:bg-carbon-600/40 backdrop-blur-200">
          {title && <h2 className="italic uppercase">{title}</h2>}
          {description && <p className="text-center">{description}</p>}
          <ContactForm
            labels={{
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
          />
        </div>
      </div>
    </section>
  )
}

export default Contact;