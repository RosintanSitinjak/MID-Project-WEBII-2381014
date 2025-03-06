const API_link = "https://dummyjson.com";
// const API_link = "https://dummyjson.com/docs";

// cath/fetch the data
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_link}/${endpoint}`);
  if (!response.ok) throw new Error("Failed to Fetch the Data");
  return response.json();
};

// for creating new data
export const createData = async <T>(
  endpoint: string,
  data: object
): Promise<T> => {
  const response = await fetch(`${API_link}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log("API Responses:", result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to Create the Data");
  }
  return result;
};

// to update the data
export const updateData = async <T>(
  endpoint: string,
  id: number,
  data: object
): Promise<T> => {
  const response = await fetch(`${API_link}/${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to Update the Data");
  return response.json();
};

// delete the data
export const deleteData = async (
  endpoint: string,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_link}/${endpoint}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to Delete the Data");
};
