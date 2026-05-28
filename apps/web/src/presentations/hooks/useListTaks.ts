import { kineRepository } from "../../infrastructure/KineRepository";
import { useQuery } from "@tanstack/react-query";

const useListTaks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => await kineRepository.listTasks(),
  });
};

export { useListTaks };
