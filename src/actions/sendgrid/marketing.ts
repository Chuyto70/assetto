'use server';

export const addContact = async (email: string) => {
  try {
    await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${global.process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        contacts: [
          {
            email,
          },
        ],
      }),
    });
  } catch (error) {
    throw new Error(
      'Oups, there was a problem with your subscription, please try again later or contact us'
    );
  }
};
