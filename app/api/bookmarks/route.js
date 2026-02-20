import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongoose";
import { Bookmark } from "@/lib/models/Bookmark";


// GET all bookmarks
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        await connectDB();
        const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json(bookmarks);
    } catch (error) {
        console.error("[BOOKMARKS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST create bookmark
export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        await connectDB();
        const { title, url } = await req.json();
        if (!title || !url) return new NextResponse("Missing fields", { status: 400 });

        const bookmark = await Bookmark.create({ userId, title, url });
        return NextResponse.json(bookmark, { status: 201 });
    } catch (error) {
        console.error("[BOOKMARKS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}