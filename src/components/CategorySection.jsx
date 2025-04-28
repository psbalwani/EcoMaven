import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const CategorySection = () => {
  const categories = [
    
    {
      id: 'electronics',
      name: 'Electronics',
      image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      link: '/products?category=electronics'
    },
    {
      id: 'clothing',
      name: 'Clothing',
      image: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      link: '/products?category=clothing'
    },
    {
      id: 'home',
      name: 'Home & Kitchen',
      image: 'https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      link: '/products?category=home'
    },
    {
      id: 'books',
      name: 'Books',
      image: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      link: '/products?category=books'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Link 
            to={category.link}
            className="block group relative overflow-hidden rounded-lg shadow-md h-64"
          >
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 w-full">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
                <div className="mt-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Browse Collection
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default CategorySection