import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Create a fresh Prisma instance for this route
const prisma = new PrismaClient();

console.log("🔍 Debug info:");
console.log("- prisma instance:", !!prisma);
console.log("- prisma.aboutProfile:", !!prisma?.aboutProfile);
console.log("- Available models:", Object.keys(prisma || {}));

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.aboutProfile.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Starting POST request to /api/admin/about/profile");

    const session = await getServerSession();
    console.log("📋 Session check result:", session ? "Session found" : "No session");

    if (!session) {
      console.log("❌ Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📝 Parsing request body...");
    const { name, title, subtitle, bio, profileImage } = await request.json();
    console.log("📋 Received data:", { name, title, subtitle, bio, profileImage });

    console.log("🗑️ Deleting existing profiles...");
    const deleteResult = await prisma.aboutProfile.deleteMany();
    console.log("✅ Deleted profiles:", deleteResult.count);

    console.log("➕ Creating new profile...");
    const profile = await prisma.aboutProfile.create({
      data: {
        name,
        title,
        subtitle,
        bio,
        profileImage,
      },
    });
    console.log("✅ Profile created successfully:", profile);

    // Revalidate the about page cache
    console.log("🔄 Revalidating /about page cache...");
    revalidatePath("/about");
    console.log("✅ Cache revalidated");

    return NextResponse.json(profile);
  } catch (error) {
    console.error("❌ Error creating/updating profile:", error);
    console.error("📊 Error stack:", (error as Error)?.stack);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error)?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
