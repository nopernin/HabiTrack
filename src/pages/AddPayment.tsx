
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { mockProperties, mockTenants } from '@/utils/mockData';
import { v4 as uuidv4 } from 'uuid';
import { PaymentStatus, PaymentType } from '@/utils/types';

const AddPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    propertyId: '',
    tenantId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: PaymentType.RENT,
    status: PaymentStatus.COMPLETED,
    reference: `PAY-${Math.floor(Math.random() * 10000)}`,
    description: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.propertyId || !formData.amount) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    // Dans une application réelle, nous enverrions ces données à une API
    console.log('Paiement enregistré:', {
      id: uuidv4(),
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
    });
    
    toast({
      title: "Paiement enregistré",
      description: `Le paiement de ${formData.amount}€ a été enregistré avec succès.`,
    });
    
    navigate('/finance');
  };

  const handleCancel = () => {
    navigate('/finance');
  };

  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container pb-16">
          <div className="mb-8">
            <h1 className="page-title">Enregistrer un paiement</h1>
            <p className="text-muted-foreground">Complétez le formulaire pour ajouter un nouveau paiement</p>
          </div>

          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyId">Bien immobilier<span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.propertyId} 
                    onValueChange={(value) => handleSelectChange('propertyId', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un bien" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name} - {property.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Locataire</Label>
                  <Select 
                    value={formData.tenantId} 
                    onValueChange={(value) => handleSelectChange('tenantId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un locataire (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.firstName} {tenant.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant (€)<span className="text-destructive">*</span></Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date<span className="text-destructive">*</span></Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de paiement<span className="text-destructive">*</span></Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PaymentType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut<span className="text-destructive">*</span></Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PaymentStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="PAY-1234"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Loyer du mois de juin 2023..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer le paiement
                </Button>
              </div>
            </form>
          </div>
        </main>
      </PageTransition>
    </>
  );
};

export default AddPayment;
