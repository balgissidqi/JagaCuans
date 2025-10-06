import { Target } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Goals() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-background">
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap overflow-x-hidden">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Financial Goals
            </h1>
            <p className="text-muted-foreground mt-1">
              Set and track your financial objectives
            </p>
          </div>
        </header>

        <div className="flex justify-center">
          <Card className="w-full sm:w-auto max-w-md rounded-2xl shadow-soft p-8 text-center bg-card overflow-hidden">
            <div className="text-muted-foreground">
              {/* 🔹 Hapus shrink-0 biar ikon bisa mengecil di layar kecil */}
              <Target className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Goals Coming Soon</h3>
              <p className="text-sm">
                This feature is under development and will be available soon.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  )
}
