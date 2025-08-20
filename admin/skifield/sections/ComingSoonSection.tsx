import React from 'react';
import { Card, CardContent } from '../../../ui/card';

interface ComingSoonSectionProps {
  title: string;
  description: string;
}

export function ComingSoonSection({ title, description }: ComingSoonSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card className="snowline-card">
        <CardContent className="p-6">
          <p className="text-muted-foreground">{title} interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}