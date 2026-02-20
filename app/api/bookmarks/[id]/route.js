import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongoose";
import { Bookmark } from "@/lib/models/Bookmark";

export async function DELETE(req, { params }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        const { id } = await params;
        await connectDB();
        await Bookmark.deleteOne({ _id: id, userId });
        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[BOOKMARK_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        const { id } = await params;
        await connectDB();
        const { title, url } = await req.json();
        if (!title || !url) return new NextResponse("Missing fields", { status: 400 });
        await Bookmark.updateOne({ _id: id, userId }, { title, url });
        return new NextResponse("Updated", { status: 200 });
    } catch (error) {
        console.error("[BOOKMARK_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}