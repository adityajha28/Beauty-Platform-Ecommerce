import API from "./api";

export const createReview = (data) =>
API.post("/reviews",data);

export const getProductReviews = (id) =>
API.get(`/reviews/product/${id}`);