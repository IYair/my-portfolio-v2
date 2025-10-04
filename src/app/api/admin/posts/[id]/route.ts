import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Schema de validación para actualización
const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(300).optional(),
  slug: z.string().min(1, "Slug is required").max(300).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  contentJson: z.string().optional(),
  contentType: z.enum(["markdown", "editorjs", "notion", "tiptap"]).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

// GET - Obtener post por ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    console.log("Received ID parameter:", id);

    const postId = parseInt(id, 10);
    console.log("Parsed ID:", postId, "isNaN:", isNaN(postId));

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    console.log("Searching for post with ID:", postId);
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: true,
      },
    });

    console.log("Post found:", post ? "Yes" : "No");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// PUT - Actualizar post por ID
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const postId = parseInt(id, 10);

    console.log("🔄 PUT request received for post ID:", postId);

    if (isNaN(postId)) {
      console.error("❌ Invalid post ID:", id);
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();
    console.log("📥 Request body:", JSON.stringify(body, null, 2));

    const validatedData = updatePostSchema.parse(body);
    console.log("✅ Data validated successfully");

    // Verificar que el post existe
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { tags: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Si se actualiza el slug, verificar que sea único
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists && slugExists.id !== postId) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Procesar tags si se proporcionan
    let tagConnections = undefined;
    if (validatedData.tags) {
      tagConnections = [];
      for (const tagName of validatedData.tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        tagConnections.push({ id: tag.id });
      }
    }

    // Actualizar post
    console.log("💾 Updating post in database...");
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.slug && { slug: validatedData.slug }),
        ...(validatedData.excerpt !== undefined && { excerpt: validatedData.excerpt }),
        ...(validatedData.content !== undefined && { content: validatedData.content }),
        ...(validatedData.contentJson !== undefined && { contentJson: validatedData.contentJson }),
        ...(validatedData.contentType && { contentType: validatedData.contentType }),
        ...(validatedData.published !== undefined && { published: validatedData.published }),
        ...(validatedData.featured !== undefined && { featured: validatedData.featured }),
        ...(validatedData.coverImage !== undefined && { coverImage: validatedData.coverImage }),
        ...(tagConnections && {
          tags: {
            set: tagConnections,
          },
        }),
      },
      include: {
        tags: true,
      },
    });

    console.log("✅ Post updated successfully:", updatedPost.id);

    return NextResponse.json(
      {
        message: "Post updated successfully",
        post: updatedPost,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE - Eliminar post por ID
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // Verificar que el post existe
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Eliminar post
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
