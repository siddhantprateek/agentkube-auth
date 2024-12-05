import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { IMG1, IMG2, IMG3 } from '@/assets';
import LOGO from '@/assets/logo.png';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/authContext';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
  acceptTerms: boolean;
}

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL;

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    acceptTerms: false
  });
  const [error, setError] = useState<string>('');
  
  const { signInWithGoogle, signInWithGithub, user } = useAuth();
  const navigate = useNavigate();

  const images = [IMG1, IMG2, IMG3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      window.location.href = DASHBOARD_URL;
    }
  }, [user, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const formVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        mass: 0.6
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    // Add your email/password signup logic here
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during Google sign up');
    }
  };

  const handleGithubSignUp = async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during GitHub sign up');
    }
  };

  return (
    <motion.div 
      className="flex min-h-screen bg-gray-200"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left side - Image Carousel */}
  
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-r-3xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-gray-900/80 z-10" />
        {images.map((img, index) => (
          <motion.img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ scale: 1.1 }}
            animate={{ scale: currentImageIndex === index ? 1 : 1.1 }}
            transition={{ duration: 5 }}
          />
        ))}
        <motion.div 
          className="absolute bottom-20 left-10 text-white z-20"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-2">
            Few things make me feel more powerful than
          </motion.h2>
          <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-2">
            setting up automations in Untitled to make
          </motion.h2>
          <motion.h2 variants={itemVariants} className="text-4xl font-bold">
            my life easier and more efficient.
          </motion.h2>
          <motion.div 
            className="flex gap-2 mt-6"
            variants={itemVariants}
          >
            {images.map((_, index) => (
              <motion.div
                key={index}
                className={`w-8 h-2 rounded-full ${
                  currentImageIndex === index ? 'bg-white' : 'bg-gray-500'
                }`}
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>


      {/* Right side - Sign up form */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-20">
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <img src={LOGO} className="h-10" alt="" />
            <span className="font-bold text-xl">Agentkube</span>
          </motion.div>
          <motion.a 
            href='https://agentkube.com' 
            className="bg-gray-900/20 text-black px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to website
          </motion.a>
        </motion.div>

        <motion.div 
          className="max-w-md mx-auto"
          variants={formVariants}
        >
          <motion.h1 
            className="text-4xl font-bold text-black mb-2"
            variants={itemVariants}
          >
            Create an account
          </motion.h1>
          <motion.p 
            className="text-gray-500 mb-8"
            variants={itemVariants}
          >
            Already have an account?{' '}
            <a href="/login" className="text-gray-900 hover:text-emerald-800">
              Log in
            </a>
          </motion.p>

          {error && (
            <motion.div 
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form 
            className="space-y-4"
            variants={containerVariants}
            onSubmit={handleSubmit}
          >
            <motion.input
              variants={itemVariants}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-transparent text-black border border-gray-700 focus:border-green-500 focus:outline-none"
            />

            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-transparent text-black border border-gray-700 focus:border-green-500 focus:outline-none"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </motion.div>

            <motion.div 
              className="flex items-center mb-4"
              variants={itemVariants}
            >
              <input
                type="checkbox"
                id="terms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-700 bg-transparent text-green-500 focus:ring-green-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-800 font-medium hover:text-green-400">
                  Terms & Conditions
                </a>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create account
            </motion.button>

            <motion.div 
              className="relative my-8"
              variants={itemVariants}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-200 text-gray-900">Or register with</span>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 gap-4"
              variants={containerVariants}
            >
              <motion.button
                type="button"
                onClick={handleGoogleSignUp}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-black hover:bg-gray-300 transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google logo" className="w-5 h-5" />
                Google
              </motion.button>
              <motion.button
                type="button"
                onClick={handleGithubSignUp}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-black hover:bg-gray-300 transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src="https://img.icons8.com/ios-filled/50/github.png" alt="Github logo" className="w-5 h-5" />
                Github
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUpPage;