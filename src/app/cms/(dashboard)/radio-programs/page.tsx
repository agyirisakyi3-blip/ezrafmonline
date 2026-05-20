import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RadioProgramManager from "./radio-program-manager";

export const dynamic = "force-dynamic";

export default async function RadioProgramsPage() {
  const session = await auth();
  if (!session?.user) redirect("/cms/login");

  const programs = await prisma.radioProgram.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Radio Schedule</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your radio program lineup</p>
        </div>
      </div>

      <RadioProgramManager
        programs={programs.map((p) => ({
          id: p.id,
          title: p.title,
          host: p.host,
          startTime: p.startTime,
          endTime: p.endTime,
          days: p.days,
          description: p.description,
          active: p.active,
          sortOrder: p.sortOrder,
        }))}
      />
    </div>
  );
}
