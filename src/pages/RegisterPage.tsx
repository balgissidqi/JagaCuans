/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.username) {
      toast.error("Username wajib diisi")
      return false
    }
    if (!formData.email) {
      toast.error("Email wajib diisi")
      return false
    }
    if (!formData.password) {
      toast.error("Password wajib diisi")
      return false
    }
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { 
          data: { username: formData.username },
          emailRedirectTo: `${window.location.origin}/verified`
        },
      })

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Email sudah terdaftar. Silakan login atau gunakan email lain.")
        } else {
          toast.error(error.message)
        }
        throw error
      }

      // Simpan ke tabel users (opsional)
      if (data.user) {
        const { error: userError } = await supabase
          .from("users")
          .insert({
            user_id: data.user.id,
            username: formData.username,
            email: formData.email,
            password: formData.password // ⚠️ hanya untuk testing
          })

        if (userError) {
          console.error("User table insert error:", userError)
        }
      }

      toast.success("Registrasi berhasil! Silakan cek emailmu untuk verifikasi sebelum login.")
      navigate("/login")
    } catch (error: any) {
      console.error("Registration error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--income) / 0.1), hsl(var(--primary) / 0.1))'
          }}
        >
          <div className="text-center p-12">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-income to-primary rounded-3xl flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,6H10V4H14M15,8V16H13V10H9V16H7V8H15M16,2H8A2,2 0 0,0 6,4V20A2,2 0 0,0 8,22H16A2,2 0 0,0 18,20V4A2,2 0 0,0 16,2Z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-income mb-4">
              Grow Your Wealth
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Start your journey to financial freedom with smart budgeting and goal tracking
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card 
            className="shadow-2xl border-0"
            style={{
              boxShadow: '0 20px 40px -12px hsl(var(--income) / 0.15)'
            }}
          >
            <CardHeader className="text-center pb-8">
              <div className="mb-6">
                <p className="text-muted-foreground text-base mb-2">
                  Start your financial journey today
                </p>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-income to-primary bg-clip-text text-transparent">
                Create Account
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-foreground">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-2 border-border/50 focus:border-income transition-colors"
                    placeholder="Masukkan username kamu"
                    disabled={loading}
                  />
                </div>

                {/* Email */}
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
                    className="h-12 rounded-xl border-2 border-border/50 focus:border-income transition-colors"
                    placeholder="Masukkan email aktif (gunakan email yang bisa diverifikasi)"
                    disabled={loading}
                  />
                </div>
                
                {/* Password */}
                <div className="space-y-2 relative">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-2 border-border/50 focus:border-income transition-colors pr-10"
                      placeholder="Minimal 6 karakter"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-income transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--income)), hsl(var(--income) / 0.8))',
                    boxShadow: '0 8px 16px -4px hsl(var(--income) / 0.3)'
                  }}
                >
                  {loading ? "Creating Account..." : "Get Started"}
                </Button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-income hover:text-income/80 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground/80">
                  Your money, your future
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}