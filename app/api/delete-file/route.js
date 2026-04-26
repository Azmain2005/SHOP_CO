import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    // The endpoint matches your Singapore region from previous screenshots
    const response = await fetch(
      `${process.env.BUNNY_UPLOAD_URL}/${fileName}`,
      {
        method: "DELETE",
        headers: {
          "AccessKey": process.env.BUNNY_ACCESS_KEY, // Stays safe on server
        },
      }
    );

    if (response.ok) {
      return NextResponse.json({ success: true, message: "File deleted from CDN" });
    }

    return NextResponse.json({ error: "Failed to delete from Bunny" }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}