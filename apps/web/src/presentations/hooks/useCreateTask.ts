import { useMutation } from "@tanstack/react-query";
import { kineRepository } from "../../infrastructure/KineRepository";
import { queryClient } from "../../lib/react-query";
import { TaskCreate } from "@/domain/types/Task.type";

const useCreateTask = () => {
  return useMutation({
    mutationKey: ["create-task"],
    mutationFn: async (data: TaskCreate) =>
      await kineRepository.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export { useCreateTask };
