
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PromotionCard = () => {
  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 mb-8 border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex-1 z-10">
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">
            Gérez vos biens en toute simplicité
          </h2>
          <p className="text-indigo-700 mb-6 max-w-lg">
            Découvrez comment Renter Ranger peut vous aider à optimiser la gestion de votre portefeuille immobilier et augmenter vos revenus.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/properties/new">
              Ajouter un bien maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex-shrink-0 mt-6 md:mt-0 md:ml-6 z-10">
          <motion.img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" 
            alt="Immeuble moderne" 
            className="w-56 h-56 object-cover rounded-lg shadow-xl" 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-200 rounded-full opacity-50"></div>
        <div className="absolute top-4 right-1/4 w-6 h-6 bg-yellow-300 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 left-1/3 w-4 h-4 bg-green-300 rounded-full opacity-60"></div>
      </div>
    </motion.div>
  );
};

export default PromotionCard;
