import { useState, useEffect } from "react";
import {
  fetchData,
  createData,
  updateData,
  deleteData,
} from "../services/apiService";

type Comment = {
  id: number;
  body: string;
  postId: number;
};

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  // const [newComments, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setTheError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchData<{ comments: Comment[] }>("comments")
      .then((data) => setComments(data.comments))
      .catch(() => setTheError("Failed to Catch the Data of Comments"))
      .finally(() => setLoading(false));
  }, []);

  const addComment = async () => {
    setLoading(true);
    setTheError("");
    try {
      const randomId = Math.floor(Math.random() * 30) + 1;
      const dummyComment = await fetchData<Comment>(`comments/${randomId}`);

      const localId = new Date().getTime();
      const newComment = { id: localId, body: dummyComment.body, postId: 1 };

      setComments((prev) => [newComment, ...prev]);
      const commentFromAPI = await createData<Comment>("comments/add", {
        body: dummyComment.body,
        postId: 1,
        userId: 1,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === localId
            ? { ...comment, id: commentFromAPI.id }
            : comment
        )
      );
    } catch (error) {
      console.error("Failed to Add Comment to API:", error);
      setTheError("Failed to Add Comment");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (id: number, body: string) => {
    if (id > 30) {
      alert(
        "This data is only stored on the frontend and cannot be updated in the API"
      );
      return;
    }

    const updatedBody = prompt("Edit comment:", body);
    if (!updatedBody) return;

    setLoading(true);
    try {
      const updatedComment = await updateData<Comment>("comments", id, {
        body: updatedBody,
      });
      setComments((prev) =>
        prev.map((comment) => (comment.id === id ? updatedComment : comment))
      );
    } catch (error) {
      console.error("Failed to Update Comment:", error);
      setTheError("Failed to Update Comment");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const removeComment = async (id: number) => {
    if (id > 30) {
      setComments((prev) => prev.filter((comment) => comment.id !== id));
      return;
    }

    setLoading(true);
    try {
      await deleteData("comments", id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
    } catch (error) {
      console.error("Failed to Delete Comments:", error);
      setTheError("Failed to Delete Comments");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Comments</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-green-700">Loading...</p>}
      <div className="mb-4">
        <button
          onClick={addComment}
          className="w-full bg-green-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Comment"}
        </button>
      </div>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex flex-col bg-white p-3 rounded shadow"
          >
            <p className="text-gray-700">{comment.body}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => updateComment(comment.id, comment.body)}
                className="text-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => removeComment(comment.id)}
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

export default Comments;
