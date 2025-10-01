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
  PiggyBank,
  Check,
  ArrowRight,
  Menu,
  Sparkles,
  BarChart3,
  Award,
  Lightbulb
} from "lucide-react";
import heroImage from "@/assets/hero-finance-learning.jpg";

export default function LandingPage() {
  const problems = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Bingung Atur Uang Jajan",
      description: "Uang saku sering habis di tengah bulan tanpa tahu kemana perginya"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Sulit Menabung",
      description: "Niat menabung ada, tapi selalu gagal karena tidak ada target yang jelas"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Kurang Paham Finansial",
      description: "Belum pernah belajar cara mengelola keuangan dengan baik dan benar"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Gak Ada Motivasi",
      description: "Malas catat pengeluaran karena ribet dan tidak ada feedback yang jelas"
    }
  ];

  const features = [
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Pengaturan Budget",
      description: "Bantu atur pemasukan & pengeluaran bulanan dengan mudah dan terstruktur",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <PiggyBank className="h-8 w-8" />,
      title: "Pencatatan Tabungan",
      description: "Pantau progress menabung dengan target yang jelas dan motivasi harian",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Tracking Keuangan",
      description: "Catat transaksi harian secara praktis dengan kategori yang lengkap",
      gradient: "from-blue-600 to-purple-500"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Challenge Seru",
      description: "Tantangan yang seru dan memotivasi untuk mencapai tujuan finansial",
      gradient: "from-purple-600 to-pink-500"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Edukasi Finansial",
      description: "Kuis interaktif dan tips singkat agar lebih melek finansial",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analisis Pengeluaran",
      description: "Visualisasi data keuangan yang mudah dipahami dan actionable",
      gradient: "from-purple-500 to-blue-500"
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

  const pricingPlans = [
    {
      name: "Gratis",
      price: "Rp 0",
      period: "/bulan",
      description: "Cocok untuk mulai belajar mengelola keuangan",
      features: [
        "Budget bulanan unlimited",
        "Tracking pengeluaran harian",
        "1 target tabungan aktif",
        "Akses edukasi dasar",
        "Challenge bulanan"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "Rp 29.000",
      period: "/bulan",
      description: "Untuk yang serius mengelola keuangan",
      features: [
        "Semua fitur Gratis",
        "Target tabungan unlimited",
        "Analisis pengeluaran detail",
        "Edukasi premium + sertifikat",
        "Challenge eksklusif",
        "Konsultasi finansial",
        "Export laporan keuangan"
      ],
      popular: true
    },
    {
      name: "Tahunan",
      price: "Rp 290.000",
      period: "/tahun",
      description: "Hemat 2 bulan dengan paket tahunan",
      features: [
        "Semua fitur Premium",
        "Hemat Rp 58.000",
        "Prioritas support",
        "Early access fitur baru",
        "Badge eksklusif"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar - Semi-transparent */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(258,90%,66%)] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">JC</span>
              </div>
              <span className="font-bold text-xl text-foreground">JagaCuan</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#problems" className="text-foreground hover:text-primary transition-colors font-medium">Masalah</a>
              <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">Fitur</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">Testimoni</a>
              <a href="#pricing" className="text-foreground hover:text-primary transition-colors font-medium">Harga</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/login">Masuk</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-[hsl(258,90%,66%)] hover:opacity-90">
                <Link to="/register">Daftar Gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section 
        className="relative pt-32 pb-20 px-4 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.6)), url(${heroImage})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-[hsl(258,90%,-66%)]/90"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 text-base px-4 py-2">
              💡 Platform Edukasi Keuangan #1 untuk Remaja
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Belajar Kelola Uang<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                Lebih Mudah & Menyenangkan
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Platform edukasi finansial modern yang membantu remaja mengelola uang dengan bijak, 
              mencapai tujuan finansial, dan membangun kebiasaan keuangan yang sehat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-7 h-auto font-semibold shadow-xl">
                <Link to="/register">
                  Mulai Sekarang Gratis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-7 h-auto font-semibold">
                <Link to="#features">Pelajari Fitur</Link>
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-white/80 text-sm">Pengguna Aktif</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-white/80 text-sm">Tingkat Kepuasan</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9</div>
                <div className="text-white/80 text-sm">Rating Pengguna</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">😥 Masalah yang Sering Dihadapi</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Masalah Finansial Remaja
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              JagaCuan hadir untuk membantu mengatasi kesulitan keuangan yang sering dialami remaja
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {problems.map((problem, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-white to-red-500/5">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-2xl mb-4 bg-gradient-to-br from-red-500 to-orange-500 text-white group-hover:scale-110 transition-transform shadow-lg">
                    {problem.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-3">{problem.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">🚀 Fitur Unggulan</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fitur lengkap dan mudah digunakan untuk mengelola keuangan dengan maksimal
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                <CardContent className="p-8">
                  <div className={`inline-flex p-4 rounded-2xl mb-4 bg-gradient-to-br ${feature.gradient} text-white group-hover:scale-110 transition-transform shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">💬 Testimoni</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Kata Mereka yang Sudah Bergabung
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ribuan remaja telah merasakan manfaat JagaCuan dalam mengelola keuangan mereka
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-white to-primary/5">
                <CardContent className="p-0">
                  <div className="flex mb-4 gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[hsl(258,90%,66%)] flex items-center justify-center text-white font-bold shadow-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">Pengguna JagaCuan</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-0">💰 Harga</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mulai gratis dan upgrade kapan saja untuk fitur lebih lengkap
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-2xl transition-all duration-300 ${plan.popular ? 'border-primary border-2 shadow-xl scale-105' : 'border-2'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-[hsl(258,90%,66%)] text-white border-0 px-4 py-1">
                      ⭐ Paling Populer
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="font-bold text-2xl mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <Button asChild className={`w-full mb-6 ${plan.popular ? 'bg-gradient-to-r from-primary to-[hsl(258,90%,66%)]' : ''}`}>
                    <Link to="/register">Pilih Paket</Link>
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-[hsl(258,90%,66%)] to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Siap Mulai Perjalanan Finansialmu?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Bergabung dengan ribuan remaja yang sudah bijak mengelola keuangan. Gratis untuk memulai!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-10 py-7 h-auto font-bold shadow-2xl">
              <Link to="/register">
                Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm text-lg px-10 py-7 h-auto font-bold">
              <Link to="/login">Sudah Punya Akun?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(258,90%,66%)] flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">JC</span>
                </div>
                <span className="text-2xl font-bold">JagaCuan</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
                Platform edukasi keuangan modern yang membantu remaja mengelola uang dengan bijak dan menyenangkan.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Navigasi</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#problems" className="hover:text-white transition-colors">Masalah</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimoni</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Harga</a></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Daftar</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Dukungan</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorial</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2025 JagaCuan. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
