import React from 'react';
import { motion } from 'framer-motion';
import { PageProps } from '../../types';

interface PageContainerProps extends PageProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function PageContainer({ 
  children, 
  title,
  description,
  maxWidth = 'full',
  padding = 'md',
  className = ''
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-8xl',
    full: 'max-w-none'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} mx-auto ${className}`}
    >
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold mb-2"
            >
              {title}
            </motion.h1>
          )}
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              {description}
            </motion.p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}