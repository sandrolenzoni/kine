import { useQuery } from "@tanstack/react-query";
import { kineRepository } from "../../infrastructure/KineRepository";

const useGetTask = (id: number | null) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => await kineRepository.getTask(id!),
    enabled: id !== null,
  });
};

export { useGetTask };
