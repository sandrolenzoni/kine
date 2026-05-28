import { Header } from "@/components/header";
import { TaskList } from "../components/tasks/TaskList";

const IndexPage = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col">
      <Header />
      <main className="flex-1 flex gap-4 px-4 py-4">
        <TaskList />
      </main>
    </div>
  );
};

export { IndexPage };
