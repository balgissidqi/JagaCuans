import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function VerifiedPage() {
  const navigate = useNavigate()

  // ⏳ Auto redirect ke /login setelah 5 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login")
    }, 5000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="text-center shadow-2xl border-0 rounded-2xl p-6">
          <CardHeader className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="rounded-full bg-green-100 p-4"
            >
              <CheckCircle2 size={64} className="text-green-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Akun Berhasil Diverifikasi 🎉
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-base">
              Terima kasih! Akun kamu sekarang sudah aktif dan siap digunakan.
              Kamu akan diarahkan ke halaman login secara otomatis.
            </p>

            <div className="flex justify-center">
              <Button asChild className="rounded-xl px-6 py-3 text-base font-semibold">
                <Link to="/login">Kembali ke Halaman Login</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Jika tidak diarahkan otomatis, klik tombol di atas.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
