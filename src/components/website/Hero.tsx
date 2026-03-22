import { ArrowRight, Play } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
          alt="Công trường xây dựng của Ắc quy Trung Nguyên - Thi công chuyên nghiệp"
          width="1920"
          height="1080"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary/80 to-primary/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <article className="max-w-3xl">
          <div className="animate-on-scroll fade-in-up inline-block mb-6">
            <span className="px-4 py-2 bg-accent/20 backdrop-blur-sm text-background rounded-full text-sm font-semibold border border-accent/30">
              🏗️ Xây Dựng Chất Lượng Từ 2005
            </span>
          </div>
          
          <h1 className="animate-on-scroll fade-in-up stagger-1 text-5xl md:text-7xl font-bold text-background mb-6 leading-tight">
            Xây Dựng
            <span className="block text-accent">Uy Tín & Chất Lượng</span>
          </h1>
          
          <p className="animate-on-scroll fade-in-up stagger-2 text-xl text-background/90 mb-8 leading-relaxed">
            Ắc quy Trung Nguyên - Đối tác tin cậy cho các dự án xây dựng 
            dân dụng, thương mại và công nghiệp tại TP.HCM.
          </p>
          
          <div className="animate-on-scroll fade-in-up stagger-3 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 h-10 rounded-md text-sm font-medium bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors group"
            >
              Bắt Đầu Dự Án
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-8 h-10 rounded-md text-sm font-medium border-2 border-background text-background shadow-lg hover:bg-background/10 transition-colors"
            >
              <Play className="h-5 w-5" />
              Xem Công Trình
            </a>
          </div>

          {/* Stats */}
          <div className="animate-on-scroll fade-in-up stagger-4 grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-background/20">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">100+</div>
              <div className="text-background/80 text-sm">Dự Án Hoàn Thành</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">10+</div>
              <div className="text-background/80 text-sm">Năm Kinh Nghiệm</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-background/80 text-sm">Hài Lòng Khách Hàng</div>
            </div>
          </div>
        </article>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-background/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-background/70 rounded-full" />
        </div>
      </div>
    </section>
  );
};
