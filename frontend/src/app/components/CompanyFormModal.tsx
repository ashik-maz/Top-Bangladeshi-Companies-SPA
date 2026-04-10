import { useEffect, useState } from 'react';
import { Company } from '../types/company';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface CompanyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (company: Omit<Company, 'id'>) => void;
  company?: Company;
  loading: boolean;
}

export function CompanyFormModal({ 
  open, 
  onClose, 
  onSubmit, 
  company, 
  loading 
}: CompanyFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    logo: '',
    headquarter: '',
    founded: new Date().getFullYear(),
    revenue: '',
    employees: 0,
    description: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        sector: company.sector,
        logo: company.logo,
        headquarter: company.headquarter,
        founded: company.founded,
        revenue: company.revenue,
        employees: company.employees,
        description: company.description,
      });
    } else {
      setFormData({
        name: '',
        sector: '',
        logo: '',
        headquarter: '',
        founded: new Date().getFullYear(),
        revenue: '',
        employees: 0,
        description: '',
      });
    }
  }, [company, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'founded' || name === 'employees') ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? 'Edit Company' : 'Add New Company'}
          </DialogTitle>
          <DialogDescription>
            {company
              ? 'Update the company information below.'
              : 'Fill in the details to add a new company.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Grameenphone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector *</Label>
              <Input
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                required
                placeholder="e.g., Telecommunications"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headquarter">Headquarter *</Label>
              <Input
                id="headquarter"
                name="headquarter"
                value={formData.headquarter}
                onChange={handleChange}
                required
                placeholder="e.g., Dhaka"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="founded">Founded Year *</Label>
              <Input
                id="founded"
                name="founded"
                type="number"
                value={formData.founded}
                onChange={handleChange}
                required
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue *</Label>
              <Input
                id="revenue"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                required
                placeholder="e.g., ৳ 150 billion"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employees">Employees * (number only)</Label>
              <Input
                id="employees"
                name="employees"
                type="number"
                value={formData.employees}
                onChange={handleChange}
                required
                min="0"
                step="1"
                placeholder="e.g., 5000"
              />
              <p className="text-xs text-gray-500">Enter a number (e.g., 5000), not 5,000+ or 5000+</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL *</Label>
            <Input
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              required
              placeholder="https://example.com/logo.jpg"
            />
            {formData.logo && (
              <div className="mt-2">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="h-20 w-20 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/80?text=Invalid+URL';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief description of the company..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
