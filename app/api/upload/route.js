import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    // Get the file binary data from the request
    const blob = await request.blob();

    // Upload to Bunny.net from the Server (No CORS issues here!)
    const response = await fetch(
      `https://sg.storage.bunnycdn.com/instyle-shop/brands/${fileName}`,
      {
        method: "PUT",
        headers: {
          "AccessKey": process.env.BUNNY_ACCESS_KEY, // Set this in your .env
          "Content-Type": "application/octet-stream",
        },
        body: blob,
      }
    );

    if (response.ok) {
      return NextResponse.json({ 
        url: `https://instyle-shop.b-cdn.net/brands/${fileName}` 
      });
    }
    
    return NextResponse.json({ error: "Bunny upload failed" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}