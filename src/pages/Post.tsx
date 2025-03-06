import { useState, useEffect } from "react";
import {
  fetchData,
  createData,
  updateData,
  deleteData,
} from "../services/apiService";

interface Post {
  id: number;
  title: string;
  body: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setTheError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchData<{ posts: Post[] }>("posts")
      .then((data) => setPosts(data.posts))
      .catch(() => setTheError("Failed to Catch the Data"))
      .finally(() => setLoading(false));
  }, []);

  const addPost = async () => {
    setLoading(true);
    setTheError("");
    try {
      const randomId = Math.floor(Math.random() * 30) + 1;
      const dummyPost = await fetchData<Post>(`posts/${randomId}`);
      const localId = new Date().getTime();
      const newPost = {
        id: localId,
        title: dummyPost.title,
        body: dummyPost.body,
      };

      setPosts((prev) => [newPost, ...prev]);

      const postFromAPI = await createData<Post>("posts/add", {
        title: dummyPost.title,
        body: dummyPost.body,
        userId: 1,
      });

      setPosts((prev) =>
        prev.map((post) =>
          post.id === localId ? { ...post, id: postFromAPI.id } : post
        )
      );
    } catch (error) {
      console.error("Failed to Add Post to API:", error);
      setTheError("Failed to Add Post");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: number, title: string, body: string) => {
    if (id > 30) {
      alert(
        "This data is only stored on the frontend and cannot be updated in the API."
      );
      return;
    }

    const updatedTitle = prompt("Edit Title:", title);
    const updatedBody = prompt("Edit Body:", body);
    if (!updatedTitle || !updatedBody) return;

    setLoading(true);
    try {
      const updatedPost = await updateData<Post>("posts", id, {
        title: updatedTitle,
        body: updatedBody,
      });
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? updatedPost : post))
      );
    } catch (error) {
      console.error("Failed to Update Post:", error);
      setTheError("Failed to Update Post");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const removePost = async (id: number) => {
    if (id > 30) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
      return;
    }

    setLoading(true);
    try {
      await deleteData("posts", id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Failed to Remove Post:", error);
      setTheError("Failed to Remove Post");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Posts</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-green-700">Loading...</p>}
      <div className="mb-4">
        <button
          onClick={addPost}
          className="w-full bg-green-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Post"}
        </button>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col bg-white p-3 rounded shadow"
          >
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-700">{post.body}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => updatePost(post.id, post.title, post.body)}
                className="text-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => removePost(post.id)}
                className="text-stone-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
