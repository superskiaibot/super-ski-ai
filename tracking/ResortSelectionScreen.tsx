import React from 'react';
import { motion } from 'motion/react';
import { Mountain, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ResortSelectionScreenProps {
  onShowResortSelector: () => void;
}

export function ResortSelectionScreen({ onShowResortSelector }: ResortSelectionScreenProps) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-snowline-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-blue-200/30 to-indigo-200/20 flex items-center justify-center shadow-inner">
                <Mountain className="w-12 h-12 text-primary/60" />
              </div>
              <div className="absolute -top-1 -right-1 w-9 h-9 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-2xl mb-3 text-center tracking-tight">Choose Your Mountain</h3>
            <p className="text-muted-foreground text-center mb-6 leading-relaxed text-base px-2">
              Select your ski resort to unlock GPS tracking with real-time mountain data, weather conditions, and terrain analysis.
            </p>
            <Button 
              onClick={() => {
                console.log('🏔️ Explore Resorts button clicked');
                onShowResortSelector();
              }}
              size="lg"
              className="snowline-button-primary px-8 py-3 text-base rounded-2xl shadow-lg hover:shadow-xl transition-all w-full"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explore Resorts
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}