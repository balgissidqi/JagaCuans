import { Target } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Goals() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-background">
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
              Financial Goals
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 break-words">
              Set and track your financial objectives
            </p>
          </div>
        </header>

        {/* Card */}
        <div className="w-full max-w-md mx-auto">
          <Card className="rounded-2xl shadow-soft p-5 sm:p-8 md:p-10 text-center">
            <div className="text-muted-foreground">
              <Target className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50 shrink-0" />
              <h3 className="text-base sm:text-lg font-medium mb-2 break-words">
                Goals Coming Soon
              </h3>
              <p className="text-xs sm:text-sm break-words">
                This feature is under development and will be available soon.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  )
}
