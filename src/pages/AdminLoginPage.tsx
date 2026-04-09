import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { z } from "zod"

const adminLoginSchema = z.object({
  username: z.string().trim().min(3, "Username minimal 3 karakter").max(50, "Username maksimal 50 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter")
})

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = adminLoginSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      // Login menggunakan email pattern: username@admin.jagacuan.app
      const email = `${formData.username}@admin.jagacuan.app`
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password
      })

      if (error) {
        toast.error("Username atau password salah")
        setLoading(false)
        return
      }

      // Verifikasi bahwa user memiliki role admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .single()

      if (roleError || !roleData) {
        await supabase.auth.signOut()
        toast.error("Akses ditolak. Anda bukan admin.")
        setLoading(false)
        return
      }

      toast.success("Login berhasil!")
      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error("Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Masuk dengan username dan password admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin_username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={loading}
                className={errors.username ? "border-destructive" : ""}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </Button>

            <div className="text-center text-sm space-y-2">
              <p>
                Belum punya akun?{" "}
                <a href="/admin/register" className="text-primary hover:underline">
                  Daftar Admin
                </a>
              </p>
              <a href="/login" className="text-muted-foreground hover:underline block">
                Login sebagai user biasa
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
