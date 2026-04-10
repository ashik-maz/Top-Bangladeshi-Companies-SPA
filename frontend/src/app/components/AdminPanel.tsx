import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus,
  LogOut,
  Edit,
  Trash2,
  Search,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Company } from '../types/company';
import { API } from '../../services/api';
import { CompanyFormModal } from './CompanyFormModal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function AdminPanel() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [sectors, setSectors] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token || !API.verifyToken(token)) {
      navigate('/admin/login');
      return;
    }

    loadCompanies();
    loadSectors();
  }, [navigate]);

  const loadSectors = async () => {
    try {
      const sectorsData = await API.getSectors();
      setSectors(sectorsData);
    } catch (error) {
      // If sectors fail to load, show error but continue
      toast.error('Failed to load sectors');
      setSectors([]);
    }
  };

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await API.getCompanies();
      setCompanies(data);
    } catch (error) {
      toast.error('Error loading companies');
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
      toast.error('Error searching companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedSector]);

  const handleAddCompany = async (companyData: Omit<Company, 'id'>) => {
    setFormLoading(true);
    try {
      await API.addCompany(companyData);
      toast.success('Company added successfully!');
      setModalOpen(false);
      loadCompanies();
    } catch (error) {
      toast.error('Error adding company');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCompany = async (companyData: Omit<Company, 'id'>) => {
    if (!editingCompany) return;
    
    setFormLoading(true);
    try {
      await API.updateCompany(editingCompany.id, companyData);
      toast.success('Company updated successfully!');
      setModalOpen(false);
      setEditingCompany(undefined);
      loadCompanies();
    } catch (error) {
      toast.error('Error updating company');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingCompanyId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCompanyId) return;

    try {
      await API.deleteCompany(deletingCompanyId);
      toast.success('Company deleted successfully!');
      setDeleteDialogOpen(false);
      setDeletingCompanyId(null);
      loadCompanies();
    } catch (error) {
      toast.error('Error deleting company');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCompany(undefined);
  };

  const username = localStorage.getItem('adminUsername');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, <strong>{username}</strong>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                Public View
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Actions Bar */}
      <div className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search companies..."
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
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Company
            </Button>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading companies...</p>
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new company.
            </p>
            <Button onClick={() => setModalOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add New Company
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {companies.length} {companies.length === 1 ? 'company' : 'companies'}
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Founded</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company, index) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-gray-500">
                            {company.employees} employees
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{company.sector}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {company.headquarter}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {company.founded}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{company.revenue}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(company)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(company.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <CompanyFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={editingCompany ? handleEditCompany : handleAddCompany}
        company={editingCompany}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company
              from the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
