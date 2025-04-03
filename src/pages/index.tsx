import React from 'react';
import Image from 'next/image';

const HomePage: React.FC = () => {
  return (
    <div 
      style={{ 
        fontFamily: 'Roboto, sans-serif', 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#F5F5DC', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <header 
        style={{ 
          backgroundColor: '#001F3F', 
          color: '#F5F5DC', 
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/logo.png" 
            alt="PersonalizedU Logo" 
            width={40}
            height={40}
            style={{ marginRight: '1rem' }}
            priority
          />
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>PersonalizedU</h1>
        </div>
        <nav>
          <ul style={{ 
            display: 'flex', 
            listStyle: 'none', 
            margin: 0, 
            padding: 0,
            gap: '1.5rem'
          }}>
            <li><a href="#features" style={{ color: '#F5F5DC', textDecoration: 'none', fontWeight: 500 }}>Features</a></li>
            <li><a href="#about" style={{ color: '#F5F5DC', textDecoration: 'none', fontWeight: 500 }}>About</a></li>
            <li><a href="#contact" style={{ color: '#F5F5DC', textDecoration: 'none', fontWeight: 500 }}>Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '4rem 2rem',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '2rem',
          background: 'linear-gradient(135deg, #001F3F 0%, #002F5F 100%)',
          color: '#F5F5DC'
        }}
      >
        <div style={{ flex: '1 1 40%', minWidth: '300px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: 700, 
            color: '#FFD700', 
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            AI-Powered Learning Companion
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: '#F5F5DC', 
            marginBottom: '1.5rem',
            lineHeight: 1.6
          }}>
            Discover a personalized learning experience tailored to your unique needs. 
            Explore our innovative platform and unlock your full potential.
          </p>
          <a 
            href="https://t.me/PersonalisedU_Bot" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-block', 
              backgroundColor: '#FFD700', 
              color: '#001F3F', 
              textDecoration: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '4px', 
              fontSize: '1rem', 
              fontWeight: 500, 
              transition: 'background-color 0.3s ease',
              marginTop: '1rem'
            }}
          >
            Get Started
          </a>
        </div>
        <div style={{ flex: '1 1 40%', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
          <Image 
            src="/brand_logo.png" 
            alt="PersonalizedU Brand" 
            width={400}
            height={300}
            style={{ 
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px'
            }}
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        style={{ 
          padding: '4rem 2rem', 
          backgroundColor: '#F5F5DC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
          color: '#001F3F', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Key Features
        </h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: '2rem',
          maxWidth: '1200px',
          width: '100%'
        }}>
          {[
            { title: 'Personalized Learning', description: 'Our AI-driven system analyzes your learning style, interests, and goals to provide personalized learning paths.' },
            { title: 'AI-Powered Insights', description: 'Advanced algorithms provides actionable recommendations to help you achieve your learning objectives more effectively.' },
            { title: 'Multi-Agent Technology', description: 'Leveraging the power of multiple AI agents to provide comprehensive support.' },
            { title: 'Decentralized and Secure', description: 'Leveraging blockchain technology, your learning data is stored securely and transparently, ensuring your total privacy and control over your information.' },
            { title: 'Integrated Calendar Sync', description: 'Receive personalized reminders and seamlessly sync your learning plan to all your calendars, ensuring you stay on track and never miss a milestone.' }
          ].map((feature, index) => (
            <div 
              key={index}
              style={{ 
                flex: '1 1 250px',
                maxWidth: '300px',
                padding: '1.5rem',
                backgroundColor: '#B2C9B2',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ color: '#001F3F', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ color: '#333', lineHeight: 1.6 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about"
        style={{ 
          padding: '4rem 2rem', 
          backgroundColor: '#F5F5DC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
          color: '#001F3F', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          About PersonalizedU
        </h2>
        <div style={{ 
          maxWidth: '800px',
          textAlign: 'center',
          lineHeight: 1.8
        }}>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.1rem)', 
            color: '#333', 
            marginBottom: '1.5rem'
          }}>
            PersonalizedU utilizes the AIxBlock MultiAgent Platform to provide a decentralized, AI-powered learning companion that adapts to your individual needs. By leveraging the power of multi-agent systems and blockchain technology, we offer a secure, transparent, and personalized learning experience that empowers you to achieve your educational goals.
          </p>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.1rem)', 
            color: '#333'
          }}>
            Our platform is designed to be intuitive, accessible, and effective for all backgrounds and experience levels. Whether you&apos;re a student looking to enhance your studies, a professional seeking to upskill, or a lifelong learner pursuing new knowledge, PersonalizedU is here to support your journey.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact"
        style={{ 
          padding: '4rem 2rem', 
          backgroundColor: '#001F3F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#F5F5DC'
        }}
      >
        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
          color: '#FFD700', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Get in Touch
        </h2>
        <div style={{ 
          maxWidth: '600px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.1rem)', 
            color: '#F5F5DC', 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Have questions or feedback? We&apos;d love to hear from you!
          </p>
          <a 
            href="https://t.me/the_rex09" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-block', 
              backgroundColor: '#FFD700', 
              color: '#001F3F', 
              textDecoration: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '4px', 
              fontSize: '1rem', 
              fontWeight: 500, 
              transition: 'background-color 0.3s ease'
            }}
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer 
        style={{ 
          backgroundColor: '#001F3F', 
          color: '#F5F5DC', 
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <p style={{ margin: '0 0 1rem 0' }}>© {new Date().getFullYear()} PersonalizedU. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a href="#" style={{ color: '#F5F5DC', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#F5F5DC', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 