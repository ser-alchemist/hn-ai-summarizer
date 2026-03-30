import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { Bookmark, DiscussionSummary, HNComment, HNStory } from "../types";

const STORY_FEED = ["top", "new", "best"] as const;
export type StoryFeedType = (typeof STORY_FEED)[number];

export const useStories = (feed: StoryFeedType) =>
    useQuery<HNStory[]>({
        queryKey: ["stories", feed],
        queryFn: async () => {
            const res = await api.get(`/stories`, { params: { type: feed } });
            return res.data;
        }
    });

export const useStory = (id: number | undefined) =>
    useQuery<HNStory | null>({
        enabled: Boolean(id),
        queryKey: ["story", id],
        queryFn: async () => {
            const res = await api.get(`/stories/${id}`);
            return res.data;
        }
    });

export const useComments = (storyId: number | undefined) =>
    useQuery<HNComment[]>({
        enabled: Boolean(storyId),
        queryKey: ["comments", storyId],
        queryFn: async () => {
            const res = await api.get(`/comments/${storyId}`);
            return res.data;
        }
    });

export const useSummarize = (storyId: number | undefined) =>
    useMutation<DiscussionSummary>({
        mutationKey: ["summarize", storyId],
        mutationFn: async () => {
            const res = await api.post(`/stories/${storyId}/summarize`);
            return res.data;
        }
    });

export const useBookmarks = () =>
    useQuery<Bookmark[]>({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            const res = await api.get(`/bookmarks`);
            return res.data;
        }
    });

export const useAddBookmark = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ storyId, title }: { storyId: number; title: string }) => {
            const res = await api.post(`/bookmarks`, { storyId, title });
            return res.data as Bookmark;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["bookmarks"] });
        }
    });
};

export const useDeleteBookmark = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/bookmarks/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["bookmarks"] });
        }
    });
};
