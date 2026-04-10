import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Building2, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { Company } from '../types/company';
import { API } from '../../services/api';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function PublicView() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [sectors, setSectors] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    loadCompanies();
    loadSectors();
  }, []);

  const loadSectors = async () => {
    try {
      const sectorsData = await API.getSectors();
      setSectors(sectorsData);
    } catch (error) {
      // If sectors fail to load, show error but continue
      console.error('Error loading sectors:', error);
      setSectors([]);
    }
  };

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await API.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await API.searchCompanies(searchQuery, selectedSector);
      setCompanies(data);
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedSector]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Top Bangladeshi Companies</h1>
              <p className="text-gray-600 mt-1">Real-time ranking of leading businesses</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(isLoggedIn ? '/admin/panel' : '/admin/login')}
            >
              {isLoggedIn ? 'Admin Panel' : 'Admin Login'}
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by company name or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Companies List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing {companies.length} {companies.length === 1 ? 'company' : 'companies'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company, index) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{company.name}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {company.sector}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div 
                      className="w-full h-32 rounded-lg mb-4 bg-cover bg-center"
                      style={{ backgroundImage: `url(${company.logo})` }}
                    />

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{company.headquarter}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Founded {company.founded}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{company.revenue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{company.employees} employees</span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                      {company.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2026 Top Bangladeshi Companies. Data updated in real-time.
          </p>
        </div>
      </footer>
    </div>
  );
}
