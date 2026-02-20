"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; 
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Trash2, Edit2, Loader2, LayoutGrid, Globe, PlusCircle } from "lucide-react";

export default function DashboardPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { userId } = useAuth();
    const router = useRouter();

    // useStates
    const [bookmarks, setBookmarks] = useState([]);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editBookmark, setEditBookmark] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editUrl, setEditUrl] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // if not logged in redirect to home page
    useEffect(() => {
        if (isLoaded && !userId) {
            router.push("/"); 
        }
    }, [isLoaded, userId, router]);

    const fetchBookmarks = async () => {
        try {
            const res = await fetch("/api/bookmarks");
            if (res.ok) {
                const data = await res.json();
                setBookmarks(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isSignedIn) fetchBookmarks();
    }, [isSignedIn]);

    const handleAddBookmark = async (e) => {
        e.preventDefault();
        if (!title || !url) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, url }),
            });
            if (res.ok) {
                setTitle("");
                setUrl("");
                fetchBookmarks();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEdit = (bookmark) => {
        setEditBookmark(bookmark);
        setEditTitle(bookmark.title);
        setEditUrl(bookmark.url);
        setEditOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsEditing(true);
        try {
            const res = await fetch(`/api/bookmarks/${editBookmark.id || editBookmark._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: editTitle, url: editUrl }),
            });
            if (res.ok) {
                setEditOpen(false);
                fetchBookmarks();
            }
        } finally {
            setIsEditing(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleteId(id);
        try {
            const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
            if (res.ok) fetchBookmarks();
        } finally {
            setDeleteId(null);
        }
    };

    // Show spinner while checking auth status
    if (!isLoaded || !userId) return (
        <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm font-medium animate-pulse">Checking credentials...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative">
            <Navbar />
            {/* Background Texture */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Creation Form */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <PlusCircle className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold tracking-tight">Create New</h2>
                            </div>
                            <Card className="border-border/50 shadow-xl shadow-blue-500/5 bg-card/50 backdrop-blur-md">
                                <CardContent className="p-6">
                                    <form onSubmit={handleAddBookmark} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bookmark Title</label>
                                            <Input
                                                placeholder="Enter title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                                className="bg-background/50 border-border/50 focus:ring-blue-500 h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Website URL</label>
                                            <Input
                                                placeholder="Enter url "
                                                type="url"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                required
                                                className="bg-background/50 border-border/50 focus:ring-blue-500 h-11"
                                            />
                                        </div>
                                        <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 transition-all active:scale-95">
                                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save to Collection"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </aside>

                    {/* Main Collection Grid */}
                    <main className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <LayoutGrid className="h-6 w-6 text-blue-600" />
                                <h1 className="text-3xl font-black tracking-tight">Collection</h1>
                                <Badge className="bg-blue-600/10 text-blue-600 border-none px-3 py-1 font-bold">
                                    {bookmarks.length} Total
                                </Badge>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                                <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading your links...</p>
                            </div>
                        ) : bookmarks.length === 0 ? (
                            <div className="h-100 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
                                <Globe className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                                <p className="font-bold text-muted-foreground">Your link vault is empty.</p>
                                <p className="text-sm text-muted-foreground/60">Start by adding a link on the left.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bookmarks.map((bookmark) => (
                                    <Card key={bookmark._id} className="group border-border/40 bg-card/40 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 shadow-none hover:shadow-xl hover:shadow-blue-500/5">
                                        <CardHeader className="p-5 pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg font-bold tracking-tight leading-tight truncate mr-4">
                                                    {bookmark.title}
                                                </CardTitle>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(bookmark)} className="h-8 w-8 text-muted-foreground hover:text-blue-600">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(bookmark.id || bookmark._id)} disabled={deleteId === (bookmark.id || bookmark._id)} className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                                        {deleteId === (bookmark.id || bookmark._id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-5 pb-5">
                                            <a
                                                href={bookmark.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 font-medium truncate"
                                            >
                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{bookmark.url}</span>
                                            </a>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* EDIT DIALOG */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-106.25 rounded-3xl p-0 overflow-hidden border-border/50">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-black">Edit Bookmark</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">URL</label>
                            <Input value={editUrl} type="url" onChange={(e) => setEditUrl(e.target.value)} required />
                        </div>
                        <DialogFooter className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="w-full sm:w-auto font-bold rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={isEditing} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-blue-500/20">
                                {isEditing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Link"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}