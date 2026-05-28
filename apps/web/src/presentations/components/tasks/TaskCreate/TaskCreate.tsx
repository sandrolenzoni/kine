import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "../../../hooks/useCreateTask";
import { TaskCreate as TaskCreateType } from "@/domain/types/Task.type";
import { TaskCreateSchema } from "@/domain/schemas/Task.schema";
import { LoaderCircle } from "lucide-react";

interface TaskCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TypeMap: Record<string, string> = {
  email: "E-mail",
  report: "Relatório",
  push: "Notificação",
};

const PriorityMap: Record<string, string> = {
  high: "Alta",
  default: "Padrão",
};

const TaskCreate = ({ open, onOpenChange: onOpenChangeExternal }: TaskCreateProps) => {
  const { mutate, isPending } = useCreateTask();

  const form = useForm<TaskCreateType>({
    resolver: zodResolver(TaskCreateSchema),
    defaultValues: {
      name: "",
      type: "email",
      priority: "default",
      payload: "{}",
    },
  });

  const onOpenChange = (open: boolean) => {
    if (isPending) return;

    if (!open) form.reset();

    onOpenChangeExternal(open)
  }

  const onSubmit = (values: TaskCreateType) => {
    let payload = values.payload;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = values.payload;
      }
    }

    mutate(
      { ...values, payload },
      {
        onSuccess: () => {
          toast.success("Tarefa criada com sucesso");
          form.reset();
          onOpenChange(false);
        },
        onError: (error) => {
          console.log(error);
          toast.error("Erro ao criar tarefa");
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-3xl bg-neutral-900/80 p-8 gap-6 border-neutral-800/35 shadow-xl shadow-neutral-950/35">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold tracking-tight">
            Nova Tarefa
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            Preencha os dados abaixo para criar uma nova tarefa
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-neutral-900/50 border-neutral-800 h-11"
                      placeholder="Ex: Integração de API..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Tipo
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-neutral-900/50 border-neutral-800 h-10">
                        <SelectValue placeholder="Selecione">
                          {(value: string) => TypeMap[value] || value}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(TypeMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Prioridade
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-neutral-900/50 border-neutral-800 h-10">
                        <SelectValue placeholder="Selecione a prioridade">
                          {(value: string) => PriorityMap[value] || value}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-60">
                      {Object.entries(PriorityMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payload"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Payload
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-neutral-900/50 border-neutral-800 font-mono text-xs min-h-[160px] p-4 resize-none leading-relaxed"
                      placeholder='{ "action": "execute", "retry": true }'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="pt-2 flex gap-5">
              <AlertDialogCancel size='sm' type="button" variant="ghost-destructive">
                Cancelar
              </AlertDialogCancel>
              <Button type="submit" size='sm' disabled={isPending}>
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Tarefa"
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { TaskCreate };
