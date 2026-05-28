import { useMutation } from "@tanstack/react-query";
import { kineRepository } from "../../infrastructure/KineRepository";
import { queryClient } from "../../lib/react-query";

const useRetryTask = () => {
  return useMutation({
    mutationKey: ["retry-task"],
    mutationFn: async (id: number) => await kineRepository.retryTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export { useRetryTask };
