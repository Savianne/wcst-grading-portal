import type { NextApiRequest, NextApiResponse } from "next";

// Your external image server
const IMAGE_SERVER = "http://localhost:3005"; // Change to your actual IP

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imagePath = req.query.path as string; // Get the image path from the query

  if (!imagePath) {
    return res.status(400).json({ error: "Missing image path" });
  }

  // res.status(200).json({path: `${IMAGE_SERVER}${imagePath}`})

  try {
    // Fetch the image from your Express server
    const imageResponse = await fetch(`${process.env.IMAGE_SERVER_URL}${imagePath}`);

    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({ error: "Image not found" });
    }

    // Convert the image response into a buffer
    const imageBuffer = await imageResponse.arrayBuffer();

    // Set correct content type
    res.setHeader("Content-Type", imageResponse.headers.get("Content-Type") || "image/jpeg");

    return res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).json({ error: "Failed to fetch image" });
  }
}