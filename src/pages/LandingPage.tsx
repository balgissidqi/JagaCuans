import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Trophy,
  DollarSign,
  PiggyBank,
  ChartBar,
  Star,
  Check,
  ArrowRight,
  Users,
  Shield,
  Smartphone
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Pengaturan Budget",
      description: "Bantu atur pemasukan & pengeluaran bulanan dengan mudah dan terstruktur",
      color: "budgeting"
    },
    {
      icon: <PiggyBank className="h-8 w-8" />,
      title: "Pencatatan Tabungan",
      description: "Pantau progress menabung dengan target yang jelas dan motivasi harian",
      color: "savings"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Tracking Keuangan",
      description: "Catat transaksi harian secara praktis dengan kategori yang lengkap",
      color: "spending"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Challenge Seru",
      description: "Tantangan yang seru dan memotivasi untuk mencapai tujuan finansial",
      color: "challenges"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Edukasi Finansial",
      description: "Kuis interaktif dan tips singkat agar lebih melek finansial",
      color: "education"
    }
  ];

  const problems = [
    {
      icon: <DollarSign className="h-6 w-6 text-expense" />,
      title: "Sulit menabung konsisten",
      description: "Uang selalu habis tanpa tahu kemana perginya"
    },
    {
      icon: <ChartBar className="h-6 w-6 text-warning" />,
      title: "Tidak paham budgeting",
      description: "Bingung cara membagi uang untuk kebutuhan dan keinginan"
    },
    {
      icon: <Target className="h-6 w-6 text-destructive" />,
      title: "Gampang boros",
      description: "Tidak ada kontrol keuangan yang jelas dan terarah"
    }
  ];

  const testimonials = [
    {
      name: "Sarah, 17 tahun",
      text: "Akhirnya bisa nabung tanpa bingung! JagaCuan bikin aku paham cara atur uang.",
      rating: 5
    },
    {
      name: "Deni, 19 tahun", 
      text: "Challenge-nya seru banget, jadi termotivasi buat capai target finansial.",
      rating: 5
    },
    {
      name: "Maya, 16 tahun",
      text: "Bikin aku lebih sadar pentingnya atur uang dari sekarang. Recommended!",
      rating: 5
    }
  ];

  const achievements = [
    { type: "Gold", title: "Master Saver", description: "Selesaikan 10 tantangan tabungan", icon: "🏆" },
    { type: "Silver", title: "Budget Pro", description: "Konsisten budgeting 3 bulan", icon: "🥈" },
    { type: "Bronze", title: "Quiz Master", description: "Selesaikan 20 kuis finansial", icon: "🥉" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-income/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              💰 Aplikasi Edukasi Keuangan #1 untuk Remaja
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              <span className="text-primary">JagaCuan</span><br />
              Belajar Kelola Uang Sejak Dini
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Aplikasi edukasi dan manajemen keuangan yang membantu remaja 
              agar lebih bijak mengatur uang dengan cara yang fun dan mudah dipahami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
                <Link to="/register">
                  Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                <Link to="/login">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hero Icons */}
        <div className="absolute top-20 left-10 text-primary/20 animate-bounce">
          <PiggyBank className="h-12 w-12" />
        </div>
        <div className="absolute top-32 right-16 text-income/20 animate-bounce" style={{ animationDelay: "1s" }}>
          <Target className="h-10 w-10" />
        </div>
        <div className="absolute bottom-20 left-20 text-warning/20 animate-bounce" style={{ animationDelay: "2s" }}>
          <Trophy className="h-8 w-8" />
        </div>
      </header>

      {/* Problems Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Masalah yang Sering Dialami Remaja
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              JagaCuan hadir untuk menyelesaikan tantangan keuangan yang sering dihadapi anak muda
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {problems.map((problem, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {problem.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fitur Unggulan JagaCuan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Solusi lengkap untuk belajar dan mengelola keuangan dengan mudah dan menyenangkan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg mb-4 bg-${feature.color}-bg text-${feature.color}-color group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-income/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Harga Paket Berlangganan
            </h2>
            <p className="text-lg text-muted-foreground">
              Pilih paket yang sesuai dengan kebutuhanmu
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <CardContent className="text-center p-0">
                <h3 className="text-2xl font-bold mb-2">Paket Bulanan</h3>
                <div className="text-4xl font-bold text-primary mb-4">
                  Rp 25.000<span className="text-lg text-muted-foreground">/bulan</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-income" />
                    <span>Akses semua fitur</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-income" />
                    <span>Challenge unlimited</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-income" />
                    <span>Edukasi finansial</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/register">Langganan Sekarang</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="p-6 border-2 border-primary shadow-xl relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                💰 Lebih Hemat
              </Badge>
              <CardContent className="text-center p-0">
                <h3 className="text-2xl font-bold mb-2">Paket Tahunan</h3>
                <div className="text-4xl font-bold text-primary mb-4">
                  Rp 299.900<span className="text-lg text-muted-foreground">/tahun</span>
                </div>
                <p className="text-sm text-income font-medium mb-4">Hemat Rp 80.000!</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-income" />
                    <span>Akses semua fitur</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-income" />
                    <span>Challenge unlimited</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-income" />
                    <span>Edukasi finansial</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-income" />
                    <span>Premium support</span>
                  </li>
                </ul>
                <Button asChild className="w-full" size="lg">
                  <Link to="/register">Langganan Sekarang</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Raih Achievement Keren!
            </h2>
            <p className="text-lg text-muted-foreground">
              Kumpulkan badge dan penghargaan dengan menyelesaikan berbagai tantangan
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <Badge variant="secondary" className="mb-2">{achievement.type}</Badge>
                  <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                  <p className="text-muted-foreground text-sm">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Kata Mereka tentang JagaCuan
            </h2>
            <p className="text-lg text-muted-foreground">
              Dengar pengalaman pengguna yang sudah merasakan manfaatnya
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{testimonial.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-income">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Mulai Perjalanan Finansialmu?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan remaja yang sudah bijak mengelola keuangan bersama JagaCuan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              <Link to="/register">Coba Gratis Sekarang</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-white text-white hover:bg-white hover:text-primary">
              <Link to="/login">Masuk ke Akun</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-primary">JagaCuan</h3>
              <p className="text-muted mb-4 max-w-md">
                Aplikasi edukasi keuangan terdepan yang membantu remaja mengelola uang dengan bijak dan menyenangkan.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Navigasi</h4>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-background transition-colors">Tentang</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Fitur</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Harga</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-background transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Tutorial</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted/20 mt-8 pt-8 text-center">
            <p className="text-muted">© 2025 JagaCuan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}