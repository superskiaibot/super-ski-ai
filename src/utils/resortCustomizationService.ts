import { projectId, publicAnonKey } from '../../utils/supabase/info';

export interface ResortCustomizationData {
  id: string;
  name: string;
  location: string;
  region: string;
  image: string;
  description: string;
  temperature: number;
  snowDepth: number;
  operatingStatus: string;
  customization: {
    heroImage: string;
    overlayGradient: string;
    textColor: string;
    badgeStyle: string;
  };
  isCustomized: boolean;
  lastUpdated: string;
  updatedBy?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ResortCustomizationService {
  private baseUrl: string;
  private authToken: string;

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-7c3f937b`;
    this.authToken = publicAnonKey;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error(`API Error (${response.status}):`, data);
        return { success: false, error: data.error || 'API request failed' };
      }

      return data;
    } catch (error) {
      console.error('Resort Customization Service Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  // Get resort data by ID
  async getResortData(resortId: string): Promise<ApiResponse<ResortCustomizationData>> {
    const response = await this.makeRequest<ResortCustomizationData>(`/resort/${resortId}`);
    
    // Ensure response data has proper customization structure
    if (response.success && response.data) {
      response.data = {
        ...response.data,
        customization: {
          heroImage: response.data.customization?.heroImage || response.data.image || 'https://images.unsplash.com/photo-1551524164-6cf2ac135c1f?w=800&h=600&fit=crop',
          overlayGradient: response.data.customization?.overlayGradient || 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
          textColor: response.data.customization?.textColor || 'text-white',
          badgeStyle: response.data.customization?.badgeStyle || 'default'
        }
      };
    }
    
    return response;
  }

  // Update resort data
  async updateResortData(
    resortId: string, 
    data: Partial<ResortCustomizationData>
  ): Promise<ApiResponse<ResortCustomizationData>> {
    return this.makeRequest<ResortCustomizationData>(`/resort/${resortId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Get all customized resorts
  async getAllResorts(): Promise<ApiResponse<ResortCustomizationData[]>> {
    return this.makeRequest<ResortCustomizationData[]>('/resorts');
  }

  // Reset resort to default
  async resetResortData(resortId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/resort/${resortId}`, {
      method: 'DELETE',
    });
  }

  // Convert ResortCustomizationData to Resort format for the modal
  convertToResortModalFormat(data: ResortCustomizationData) {
    return {
      id: data.id,
      name: data.name,
      location: data.location,
      region: data.region,
      image: data.image,
      description: data.description,
      lifts: 6, // Default values - these could be made customizable too
      runs: 28,
      vertical: 481,
      price: 89,
      difficulty: {
        beginner: 25,
        intermediate: 45,
        advanced: 25,
        expert: 5
      },
      amenities: [
        'Ski Rental & Tuning',
        'Ski School',
        'Mountain Restaurant',
        'Free WiFi',
        'Parking'
      ],
      rating: 4.5,
      reviews: 247,
      season: 'June - October',
      snowDepth: data.snowDepth,
      operatingHours: {
        weekdays: '9:00 AM - 4:00 PM',
        weekends: '8:30 AM - 4:30 PM'
      },
      contactInfo: {
        phone: '+64 3 442 4620',
        website: 'https://www.resort.co.nz',
        address: `${data.location}, New Zealand`
      }
    };
  }
}

export const resortCustomizationService = new ResortCustomizationService();