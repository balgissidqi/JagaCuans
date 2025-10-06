import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showVerifyMessage, setShowVerifyMessage] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Email dan password wajib diisi")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setShowVerifyMessage(false)

    try {
      // Cek apakah email terdaftar
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("email, email_confirmed_at")
        .eq("email", formData.email)
        .maybeSingle()

      if (userError) {
        console.error("Supabase user check error:", userError)
      }

      if (!userData) {
        toast.error("Email belum terdaftar. Silakan buat akun terlebih dahulu.")
        setLoading(false)
        return
      }

      // Coba login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        // 🔹 Password salah
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email atau password salah.")
        } else {
          toast.error("Terjadi kesalahan, silakan coba lagi.")
        }
        setLoading(false)
        return
      }

      const user = data.user

      // 🔹 Belum verifikasi email
      if (!user?.email_confirmed_at) {
        await supabase.auth.signOut()
        setShowVerifyMessage(true)
        toast.warning("Email kamu belum diverifikasi. Silakan cek inbox untuk verifikasi.")
        setLoading(false)
        return
      }

      // 🔹 Login berhasil
      toast.success("Login berhasil!")
      navigate("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      toast.error("Terjadi kesalahan saat login.")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fungsi kirim ulang email verifikasi
  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: formData.email,
      })

      if (error) throw error
      toast.success("Email verifikasi telah dikirim ulang! Periksa inbox kamu.")
    } catch (err) {
      console.error("Resend verification error:", err)
      toast.error("Gagal mengirim ulang email verifikasi.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--income) / 0.1))",
          }}
        >
          <div className="text-center p-12">
            <div className="text-8xl mb-8">🐷💰</div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Smart Financial Tracking
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Take control of your finances with intelligent budgeting and insights
            </p>
            <div className="flex justify-center space-x-4 text-6xl">
              <span>📊</span>
              <span>💸</span>
              <span>🌳</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card
            className="shadow-2xl border-0"
            style={{
              boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.15)",
            }}
          >
            <CardHeader className="text-center pb-8">
              <div className="mb-6">
                <p className="text-muted-foreground text-base mb-2">
                  Welcome back! Ready to grow your savings?
                </p>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-income bg-clip-text text-transparent">
                Sign In
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-2 border-border/50 focus:border-primary transition-colors"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-2 border-border/50 focus:border-primary transition-colors"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
                    boxShadow: "0 8px 16px -4px hsl(var(--primary) / 0.3)",
                  }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              {/* ⚠️ Pesan verifikasi muncul hanya jika belum verifikasi */}
              {showVerifyMessage && (
                <div className="mt-6 p-4 border border-yellow-400 bg-yellow-50 rounded-xl text-center">
                  <p className="text-sm text-yellow-700 mb-2">
                    Email kamu belum diverifikasi. Silakan cek inbox untuk verifikasi akun.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResendVerification}
                    className="text-yellow-700 border-yellow-400 hover:bg-yellow-100"
                  >
                    Kirim Ulang Email Verifikasi
                  </Button>
                </div>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    Create one here
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground/80">Your money, your future</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
