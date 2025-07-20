export async function POST({ request }) {
  const data = await request.formData();
  const name = data.get('files') ;


  

  return new Response(`Hello ${name}!`);
}