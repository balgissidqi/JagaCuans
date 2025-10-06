import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Wallet, PiggyBank, TrendingDown } from "lucide-react"

interface OnboardingGuideProps {
  open: boolean
  onClose: () => void
}

export function OnboardingGuide({ open, onClose }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Selamat Datang! 👋",
      description: "Mari kita kenali aplikasi pengelolaan keuangan Anda",
      icon: <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />,
      content: "Aplikasi ini membantu Anda mengelola keuangan dengan mudah. Mari kita mulai dengan panduan singkat!"
    },
    {
      title: "Dashboard Anda",
      description: "Pusat informasi keuangan",
      icon: <PiggyBank className="h-12 w-12 text-primary mx-auto mb-4" />,
      content: "Di dashboard, Anda dapat melihat ringkasan pengeluaran bulanan, progress tabungan, dan akses cepat ke fitur-fitur penting."
    },
    {
      title: "Langkah 1: Buat Anggaran",
      description: "Atur kategori budget Anda",
      icon: <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />,
      content: "Sebelum mencatat pengeluaran, Anda perlu membuat kategori anggaran terlebih dahulu. Klik 'Budgeting' di menu, lalu tambahkan kategori seperti Makanan, Transport, Hiburan, dll."
    },
    {
      title: "Langkah 2: Catat Pengeluaran",
      description: "Mulai tracking keuangan Anda",
      icon: <TrendingDown className="h-12 w-12 text-primary mx-auto mb-4" />,
      content: "Setelah membuat anggaran, klik 'Spending Tracker' untuk mencatat setiap pengeluaran. Pilih kategori yang sudah Anda buat dan catat pengeluaran Anda dengan mudah!"
    },
    {
      title: "Siap Memulai! 🎉",
      description: "Anda sudah siap menggunakan aplikasi",
      icon: <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />,
      content: "Sekarang Anda siap mengelola keuangan dengan lebih baik. Mulai dengan membuat kategori budget Anda sekarang!"
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {steps[currentStep].icon}
          <h3 className="text-lg font-semibold text-center mb-3">
            {steps[currentStep].description}
          </h3>
          <p className="text-center text-muted-foreground">
            {steps[currentStep].content}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Lewati
          </Button>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Mulai" : "Lanjut"}
              {currentStep !== steps.length - 1 && (
                <ChevronRight className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
