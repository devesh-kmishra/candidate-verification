export async function sendWhatsApp(input: { to: string; message: string }) {
  console.log("WhatsApp message");
  console.log("To:", input.to);
  console.log("Message", input.message);

  return { success: true };
}
