import axios from "axios";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export const getTopStories = async () => {
    const res = await axios.get(`${BASE_URL}/topstories.json`);
    return res.data.slice(0, 20);
};

export const getItem = async (id: number) => {
    const res = await axios.get(`${BASE_URL}/item/${id}.json`);
    return res.data;
};

export const getCommentsTree = async (ids: number[]): Promise<any[]> => {
    return Promise.all(
        ids.map(async (id) => {
            const item = await getItem(id);

            if (!item) return null;

            return {
                id: item.id,
                by: item.by,
                text: item.text,
                kids: item.kids
                    ? await getCommentsTree(item.kids)
                    : []
            };
        })
    );
};