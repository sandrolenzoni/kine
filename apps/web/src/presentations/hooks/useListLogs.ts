import { useQuery } from "@tanstack/react-query";
import { kineRepository } from "../../infrastructure/KineRepository";

const useListLogs = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: async () => await kineRepository.listLogs(),
  });
};

export { useListLogs };
