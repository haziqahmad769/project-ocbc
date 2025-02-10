import fetch from "node-fetch";
import "dotenv/config";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER; // Example: us10

const subscribeToNewsletter = async (email, businessType) => {
  const tags = [{ name: businessType, status: "active" }]; // Add Business Type as a tag

  try {
    const response = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed", // "subscribed" or "pending" for double opt-in
          tags: tags.map((tag) => tag.name), // Assign tags
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data);
    }
  } catch (error) {
    console.error("Failed to subscribe to Mailchimp:", error);
  }
};

export default subscribeToNewsletter;
