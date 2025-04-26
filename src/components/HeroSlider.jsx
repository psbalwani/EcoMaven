import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)
  
  const slides = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Smart Shopping with AI Price Prediction',
      description: 'Get insights into future prices and make smarter purchasing decisions',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      align: 'left',
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/4482936/pexels-photo-4482936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'New Electronics Collection',
      description: 'Discover the latest gadgets and tech accessories at competitive prices',
      buttonText: 'Explore',
      buttonLink: '/products?category=electronics',
      align: 'right',
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/6347892/pexels-photo-6347892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Trendy Summer Collection',
      description: 'Stay cool and stylish with our curated summer essentials',
      buttonText: 'View Collection',
      buttonLink: '/products?category=clothing',
      align: 'center',
    },
  ]

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(current => (current + 1) % slides.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrent(current => (current + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrent(current => (current - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center">
            <div className={`container-custom text-white ${
              slides[current].align === 'left' ? 'text-left' :
              slides[current].align === 'right' ? 'text-right' : 'text-center mx-auto'
            }`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`max-w-lg ${
                  slides[current].align === 'right' ? 'ml-auto' :
                  slides[current].align === 'center' ? 'mx-auto' : ''
                }`}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {slides[current].title}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-200">
                  {slides[current].description}
                </p>
                <Link to={slides[current].buttonLink} className="btn-primary">
                  {slides[current].buttonText}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors z-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors z-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <FiChevronRight size={24} />
      </button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === current ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider