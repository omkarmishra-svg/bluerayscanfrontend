import { Shield, Zap, Lock, Globe, Users, Award, TrendingUp, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function About() {
  const features = [
    {
      icon: Shield,
      title: 'Multi-Platform OSINT',
      description: 'Track digital footprints across social media, forums, repositories, and the dark web with comprehensive monitoring.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning models detect deepfakes and verify multimedia authenticity with 95%+ accuracy.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: '256-bit encryption, multi-factor authentication, and device fingerprinting protect your data.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Globe,
      title: 'Real-Time Monitoring',
      description: 'Continuous scanning with instant alerts for new threats, mentions, and exposure risks.',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    }
  ];

  const stats = [
    { label: 'Active Scans', value: '1,247', icon: TrendingUp },
    { label: 'Profiles Analyzed', value: '50,000+', icon: Users },
    { label: 'Threats Detected', value: '3,891', icon: Shield },
    { label: 'Accuracy Rate', value: '96%', icon: Award }
  ];

  const team = [
    {
      role: 'Lead Developer',
      expertise: 'Full-Stack Development, Security Architecture',
      focus: 'Authentication System, Core Platform'
    },
    {
      role: 'ML Engineer',
      expertise: 'Deep Learning, Computer Vision',
      focus: 'Deepfake Detection Models'
    },
    {
      role: 'OSINT Specialist',
      expertise: 'Intelligence Analysis, Data Mining',
      focus: 'Monitoring Algorithms'
    },
    {
      role: 'UX Designer',
      expertise: 'Interface Design, User Research',
      focus: 'Cybersecurity Aesthetic'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 border border-blue-500/30 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">Digital Shadow Mapper</h1>
              <p className="text-blue-300">OSINT Intelligence System v1.0.0</p>
            </div>
          </div>
          <p className="text-slate-300 text-lg max-w-3xl">
            An elite Autonomous OSINT & Deepfake Intelligence System for digital footprint monitoring, 
            threat detection, and multimedia authenticity verification using advanced Machine Learning.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Production Ready</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Enterprise Grade</Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">AI-Powered</Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Privacy-First</Badge>
          </div>
        </div>
        
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                  <Icon className="w-8 h-8 text-blue-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Core Capabilities</CardTitle>
          <CardDescription>Enterprise-grade features for comprehensive digital intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} border border-slate-700 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">
              To provide ethical, privacy-respecting OSINT tools that empower individuals and organizations 
              to protect their digital identities, detect threats, and verify the authenticity of online content.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">
              To become the leading platform for digital intelligence, setting the standard for ethical OSINT 
              practices while pioneering advanced AI techniques for deepfake detection and threat analysis.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>Built with cutting-edge technologies for performance and security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-2">Frontend</p>
              <div className="space-y-1">
                <Badge variant="outline">React 18</Badge>
                <Badge variant="outline">TypeScript 5</Badge>
                <Badge variant="outline">Tailwind CSS v4</Badge>
                <Badge variant="outline">Shadcn/ui</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Backend (Ready)</p>
              <div className="space-y-1">
                <Badge variant="outline">Node.js</Badge>
                <Badge variant="outline">Supabase</Badge>
                <Badge variant="outline">PostgreSQL</Badge>
                <Badge variant="outline">Redis</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">AI/ML</p>
              <div className="space-y-1">
                <Badge variant="outline">TensorFlow</Badge>
                <Badge variant="outline">PyTorch</Badge>
                <Badge variant="outline">XceptionNet</Badge>
                <Badge variant="outline">EfficientNet</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Security</p>
              <div className="space-y-1">
                <Badge variant="outline">JWT Auth</Badge>
                <Badge variant="outline">MFA/2FA</Badge>
                <Badge variant="outline">AES-256</Badge>
                <Badge variant="outline">HTTPS</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>The Team</CardTitle>
          <CardDescription>Expert professionals dedicated to digital security and intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member, index) => (
              <div key={index} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <h4 className="text-white mb-2">{member.role}</h4>
                <p className="text-sm text-slate-400 mb-2">{member.expertise}</p>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <p className="text-xs text-slate-500">{member.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ethics & Privacy */}
      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Ethical Commitment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-white mb-2">Privacy-First Design</h4>
            <p className="text-sm text-slate-300">
              We collect only publicly available data and never store personally identifiable information (PII). 
              Our platform is designed for ethical OSINT research, not surveillance.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-2">Compliance & Transparency</h4>
            <p className="text-sm text-slate-300">
              Built with GDPR and CCPA considerations. We maintain transparency in our data handling practices 
              and provide users with full control over their information.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-2">Responsible AI</h4>
            <p className="text-sm text-slate-300">
              Our AI models are developed responsibly, with ongoing testing for bias and fairness. 
              We advocate for regulation and ethical use of deepfake detection technology.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Awards */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Awards & Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-400">🥇</span>
              </div>
              <div>
                <p className="text-white">Best Overall Project</p>
                <p className="text-sm text-slate-400">TechCrunch Disrupt 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-400">🥇</span>
              </div>
              <div>
                <p className="text-white">Best Cybersecurity Innovation</p>
                <p className="text-sm text-slate-400">CyberSec Hackathon 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-400">🥇</span>
              </div>
              <div>
                <p className="text-white">People's Choice Award</p>
                <p className="text-sm text-slate-400">DevFest 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>We'd love to hear from you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-white mb-2 text-sm">General Inquiries</h4>
              <a href="mailto:info@osint.com" className="text-blue-400 hover:text-blue-300 text-sm">
                info@osint.com
              </a>
            </div>
            <div>
              <h4 className="text-white mb-2 text-sm">Support</h4>
              <a href="mailto:support@osint.com" className="text-blue-400 hover:text-blue-300 text-sm">
                support@osint.com
              </a>
            </div>
            <div>
              <h4 className="text-white mb-2 text-sm">Security Issues</h4>
              <a href="mailto:security@osint.com" className="text-blue-400 hover:text-blue-300 text-sm">
                security@osint.com
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-6 border-t border-slate-800">
        <p className="text-slate-400 text-sm mb-2">
          Built with ❤️ by the Digital Shadow Mapper Team
        </p>
        <p className="text-slate-500 text-xs">
          Making the digital world safer, one footprint at a time.
        </p>
        <p className="text-slate-600 text-xs mt-4">
          Version 1.0.0 • Last Updated: December 19, 2024
        </p>
      </div>
    </div>
  );
}
