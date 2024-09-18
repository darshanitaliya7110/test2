export async function GET(req) {
  console.log(":::::::::::::::::");
  return new Response(JSON.stringify({ name: "John Doe" }), {
    status: 200,
  });
}
