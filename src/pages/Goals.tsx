import { Target } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Goals() {
  return (
    <main className="min-h-screen w-full bg-background overflow-x-hidden">
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
              Financial Goals
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Set and track your financial objectives
            </p>
          </div>
        </header>

        {/* Card */}
        <div className="flex justify-center w-full overflow-x-hidden">
          <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-soft p-6 sm:p-10 md:p-12 text-center bg-card overflow-hidden">
            <div className="text-muted-foreground">
              <Target className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-base sm:text-lg font-medium mb-2">
                Goals Coming Soon
              </h3>
              <p className="text-xs sm:text-sm">
                This feature is under development and will be available soon.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  )
}
