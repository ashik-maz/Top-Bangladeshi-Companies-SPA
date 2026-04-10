// Backend API Client Service
// All data is fetched from MongoDB backend
const API_BASE_URL = (() => {
  // In development, use the backend URL
  // In production, use relative /api path
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000/api';
  }
  return '/api';
})();

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  username?: string;
  admin?: {
    username: string;
    role: string;
  };
}

interface Company {
  _id?: string;
  id?: string;
  name: string;
  sector: string;
  logo: string;
  headquarter: string;
  founded: number;
  foundedDate?: string;
  revenue: string;
  employees: number;
  description: string;
  website?: string;
  ceo?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface VerifyTokenResponse {
  success: boolean;
  admin?: {
    username: string;
    role: string;
  };
  message?: string;
}

export class API {
  // Authentication methods
  static async login(username: string, password: string): Promise<{ token: string; username: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      return {
        token: data.token || '',
        username: data.admin?.username || username,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: VerifyTokenResponse = await response.json();
      return data.success;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  // Company methods - Get all companies
  static async getCompanies(page: number = 1, limit: number = 10): Promise<Company[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/companies?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch companies');
      }

      // Map MongoDB _id to id for frontend compatibility
      return data.data.map((company: Company) => ({
        ...company,
        id: company._id || company.id,
      }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  // Search companies by query and sector
  static async searchCompanies(search: string = '', sector: string = ''): Promise<Company[]> {
    try {
      let url = `${API_BASE_URL}/companies?`;
      
      if (search) {
        url += `search=${encodeURIComponent(search)}&`;
      }
      
      if (sector && sector !== 'all') {
        url += `sector=${encodeURIComponent(sector)}&`;
      }

      url += 'limit=100'; // Get all results for search

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Search failed');
      }

      // Map MongoDB _id to id for frontend compatibility
      return data.data.map((company: Company) => ({
        ...company,
        id: company._id || company.id,
      }));
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  // Get single company by ID
  static async getCompanyById(id: string): Promise<Company> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch company');
      }

      return {
        ...data.data,
        id: data.data._id || data.data.id,
      };
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  // Get all sectors from backend
  static async getSectors(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/sectors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch sectors');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw error;
    }
  }

  // Create new company (Admin only) - Alias for compatibility
  static async addCompany(companyData: Omit<Company, 'id' | '_id'>, token?: string): Promise<Company> {
    const authToken = token || localStorage.getItem('adminToken');
    if (!authToken) {
      throw new Error('Authentication token required');
    }
    return this.createCompany(companyData, authToken);
  }

  // Create new company (Admin only)
  static async createCompany(companyData: Omit<Company, 'id' | '_id'>, token: string): Promise<Company> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create company');
      }

      return {
        ...data.data,
        id: data.data._id || data.data.id,
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  // Update company (Admin only)
  static async updateCompany(id: string, companyData: Partial<Company>, token?: string): Promise<Company> {
    const authToken = token || localStorage.getItem('adminToken');
    if (!authToken) {
      throw new Error('Authentication token required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update company');
      }

      return {
        ...data.data,
        id: data.data._id || data.data.id,
      };
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  // Delete company (Admin only)
  static async deleteCompany(id: string, token?: string): Promise<boolean> {
    const authToken = token || localStorage.getItem('adminToken');
    if (!authToken) {
      throw new Error('Authentication token required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete company');
      }

      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Health check error:', error);
      return false;
    }
  }
}
