import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export const useProducts = () => {

  return useQuery({

    queryKey:["products"],

    queryFn: async () => {
      const res = await API.get("/products");
      return res.data;
    }

  });

};